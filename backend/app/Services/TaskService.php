<?php

namespace App\Services;

use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\Contracts\TaskServiceInterface;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\Employee;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class TaskService implements TaskServiceInterface
{
    const CACHE_KEY_ALL = 'tasks_all';
    const CACHE_TTL = 3600; // 1 Jam

    /**
     * @var TaskRepositoryInterface
     */
    protected TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    // ==========================================
    // HELPER UNTUK CLEAR / FLUSH CACHE
    // ==========================================
    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("tasks_{$id}");
        }
    }

    // ==========================================
    // METHOD STANDAR INTERFACE (DENGAN CACHING)
    // ==========================================

    public function getAllTasks()
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return $this->taskRepository->getAll();
        });
    }

    public function getTaskById(int $id)
    {
        return Cache::remember("tasks_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->taskRepository->findById($id);
        });
    }

    public function createTask(array $data)
    {
        $task = $this->taskRepository->create($data);
        $this->clearCache();
        return $task;
    }

    public function updateTask(int $id, array $data)
    {
        $task = $this->taskRepository->update($id, $data);
        $this->clearCache($id);
        return $task;
    }

    public function deleteTask(int $id)
    {
        $deleted = $this->taskRepository->delete($id);
        $this->clearCache($id);
        return $deleted;
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

        // Clear cache list tugas
        $this->clearCache();

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

            // Clear cache agar status baru terefleksi saat GET
            $this->clearCache($task->id);

            return $submission;
        });
    }

    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool
    {
        return DB::transaction(function () use ($task, $status, $reviewNotes, $reviewerId) {
            $latestSubmission = $task->submissions()->latest()->first();

            if ($latestSubmission) {
                $updateData = [];

                if (isset($reviewNotes)) {
                    if (Schema::hasColumn('task_submissions', 'review_notes')) {
                        $updateData['review_notes'] = $reviewNotes;
                    } elseif (Schema::hasColumn('task_submissions', 'feedback')) {
                        $updateData['feedback'] = $reviewNotes;
                    }
                }

                // Deteksi dinamis kolom reviewer pada tabel task_submissions
                if (Schema::hasColumn('task_submissions', 'reviewed_by_manager_id')) {
                    $updateData['reviewed_by_manager_id'] = $reviewerId;
                } elseif (Schema::hasColumn('task_submissions', 'reviewer_id')) {
                    $updateData['reviewer_id'] = $reviewerId;
                } elseif (Schema::hasColumn('task_submissions', 'reviewed_by')) {
                    $updateData['reviewed_by'] = $reviewerId;
                }

                if (Schema::hasColumn('task_submissions', 'status')) {
                    $updateData['status'] = strtoupper($status);
                }

                if (!empty($updateData)) {
                    $latestSubmission->update($updateData);
                }
            }

            // Normalisasi status task: jika status review 'Approved'/'APPROVED', ubah status task jadi 'COMPLETED'
            $taskStatus = in_array(strtoupper($status), ['APPROVED', 'COMPLETED']) ? 'COMPLETED' : 'REVISION';

            $updatedTask = $this->taskRepository->update($task->id, ['status' => $taskStatus]);

            // Clear cache task setelah di-review
            $this->clearCache($task->id);

            return (bool) $updatedTask;
        });
    }
}
