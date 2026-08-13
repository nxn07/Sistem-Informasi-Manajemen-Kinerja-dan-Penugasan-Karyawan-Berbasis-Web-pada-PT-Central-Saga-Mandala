<?php

namespace App\Services;

use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\Contracts\TaskServiceInterface;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\Employee;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TaskService implements TaskServiceInterface
{
    /**
     * @var TaskRepositoryInterface
     */
    protected TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    // ==========================================
    // METHOD STANDAR INTERFACE
    // ==========================================

    public function getAllTasks()
    {
        return $this->taskRepository->getAll();
    }

    public function getTaskById(int $id)
    {
        return $this->taskRepository->findById($id);
    }

    public function createTask(array $data)
    {
        return $this->taskRepository->create($data);
    }

    public function updateTask(int $id, array $data)
    {
        return $this->taskRepository->update($id, $data);
    }

    public function deleteTask(int $id)
    {
        return $this->taskRepository->delete($id);
    }

    // ==========================================
    // BISNIS LOGIKA KHUSUS (TASK MANAGEMENT)
    // ==========================================

    public function assignTask(array $data, int $assignedByUserId): Task
    {
        // 1. Set Manager ID
        $data['created_by_manager_id'] = $assignedByUserId;

        // 2. Pemetaan employee_id -> assigned_employee_id
        if (!isset($data['assigned_employee_id']) && isset($data['employee_id'])) {
            $data['assigned_employee_id'] = $data['employee_id'];
        }

        // 3. Pemetaan due_date -> deadline
        if (!isset($data['deadline']) && isset($data['due_date'])) {
            $data['deadline'] = $data['due_date'];
        }

        // 4. Pemetaan weight_score -> weight
        if (!isset($data['weight']) && isset($data['weight_score'])) {
            $data['weight'] = $data['weight_score'];
        }

        // Status HURUF KAPITAL ('PENDING') sesuai Check Constraint PostgreSQL
        $data['status'] = 'PENDING';

        // Simpan tugas ke database via repository
        $task = $this->taskRepository->create($data);

        // Memicu notifikasi in-app
        $employeeId = $data['assigned_employee_id'] ?? $data['employee_id'] ?? null;
        if ($employeeId) {
            $employee = Employee::find($employeeId);
            if ($employee && $employee->user) {
                $employee->user->notify(new TaskAssignedNotification($task));
            }
        }

        return $task;
    }

    public function submitTask(Task $task, array $submissionData): TaskSubmission
    {
        return DB::transaction(function () use ($task, $submissionData) {
            $now = Carbon::now();
            $dueDate = $task->deadline ?? $task->due_date;
            $isLate = $dueDate ? $now->greaterThan(Carbon::parse($dueDate)) : false;

            // Jika terlambat, potong bobot poin sebesar 10%
            if ($isLate) {
                $currentWeight = $task->weight ?? $task->weight_score ?? 0;
                $penaltyWeight = max(0, $currentWeight * 0.9);

                $updateData = [];
                if (isset($task->weight)) $updateData['weight'] = $penaltyWeight;
                if (isset($task->weight_score)) $updateData['weight_score'] = $penaltyWeight;

                if (!empty($updateData)) {
                    $task->update($updateData);
                }
            }

            // Menggunakan Facade Auth secara eksplisit
            $user = Auth::user();
            $employeeId = $submissionData['employee_id']
                ?? $task->assigned_employee_id
                ?? $task->employee_id
                ?? ($user && method_exists($user, 'employee') && $user->employee ? $user->employee->id : null)
                ?? Auth::id();

            // Tangani lokasi file
            $filePath = $submissionData['file_path'] ?? $submissionData['submission_file'] ?? $submissionData['file'] ?? null;

            // Payload lengkap untuk task_submissions
            $payload = [
                'employee_id'     => $employeeId,
                'submission_link' => $submissionData['link'] ?? $submissionData['submission_link'] ?? null,
                'notes'           => $submissionData['notes'] ?? null,
                'submitted_at'    => $now,
                'file_path'       => $filePath,
                'submission_file' => $filePath,
            ];

            $submission = $task->submissions()->create($payload);

            // Update status task menjadi 'SUBMITTED' (uppercase)
            $this->taskRepository->update($task->id, ['status' => 'SUBMITTED']);

            return $submission;
        });
    }

    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool
    {
        return DB::transaction(function () use ($task, $status, $reviewNotes, $reviewerId) {
            $latestSubmission = $task->submissions()->latest()->first();

            if ($latestSubmission) {
                $latestSubmission->update([
                    'reviewed_by'  => $reviewerId,
                    'review_notes' => $reviewNotes,
                ]);
            }

            // Status dikonversi menjadi UPPERCASE (misal: 'COMPLETED')
            $updatedTask = $this->taskRepository->update($task->id, ['status' => strtoupper($status)]);
            return (bool) $updatedTask;
        });
    }
}
