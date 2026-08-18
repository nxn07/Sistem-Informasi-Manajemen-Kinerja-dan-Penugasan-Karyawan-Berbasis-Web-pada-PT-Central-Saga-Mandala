<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskSubmission;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\Contracts\TaskSubmissionServiceInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TaskSubmissionService implements TaskSubmissionServiceInterface
{
    protected TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
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

            $user = Auth::user();
            $employeeId = $submissionData['employee_id']
                ?? $task->assigned_employee_id
                ?? $task->employee_id
                ?? ($user && method_exists($user, 'employee') && $user->employee ? $user->employee->id : null)
                ?? Auth::id();

            $filePath = $submissionData['file_path'] ?? $submissionData['submission_file'] ?? $submissionData['file'] ?? null;

            $submission = $task->submissions()->create([
                'employee_id'     => $employeeId,
                'submission_link' => $submissionData['link'] ?? $submissionData['submission_link'] ?? null,
                'notes'           => $submissionData['notes'] ?? null,
                'submitted_at'    => $now,
                'file_path'       => $filePath,
                'submission_file' => $filePath,
                'status'          => 'SUBMITTED',
            ]);

            $this->taskRepository->update($task->id, ['status' => 'SUBMITTED']);

            Cache::forget("tasks_{$task->id}");
            Cache::forget('tasks_all');

            return $submission;
        });
    }

    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool
    {
        return DB::transaction(function () use ($task, $status, $reviewNotes, $reviewerId) {
            $latestSubmission = $task->submissions()->latest()->first();

            if ($latestSubmission) {
                $latestSubmission->update([
                    'reviewed_by_manager_id' => $reviewerId,
                    'review_notes'           => $reviewNotes,
                    'status'                 => strtoupper($status),
                ]);
            }

            $taskStatus = in_array(strtoupper($status), ['APPROVED', 'COMPLETED']) ? 'COMPLETED' : 'REVISION';
            $this->taskRepository->update($task->id, ['status' => $taskStatus]);

            Cache::forget("tasks_{$task->id}");
            Cache::forget('tasks_all');

            return true;
        });
    }
}
