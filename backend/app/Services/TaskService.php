<?php

namespace App\Services;

use App\Repositories\TaskRepository;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\Employee;
use App\Notifications\TaskAssignedNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TaskService
{
    protected TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function assignTask(array $data, int $assignedByUserId): Task
    {
        $data['assigned_by'] = $assignedByUserId;
        $data['status'] = 'Pending';

        $task = $this->taskRepository->create($data);

        // Memicu notifikasi in-app ke pegawai yang diberi tugas
        $employee = Employee::find($data['employee_id']);
        if ($employee && $employee->user) {
            $employee->user->notify(new TaskAssignedNotification($task));
        }

        return $task;
    }

    public function submitTask(Task $task, array $submissionData): TaskSubmission
    {
        return DB::transaction(function () use ($task, $submissionData) {
            $now = Carbon::now();
            $isLate = $now->greaterThan(Carbon::parse($task->due_date));

            // Jika terlambat, potong bobot poin sebesar 10%
            if ($isLate) {
                $penaltyWeight = max(0, $task->weight_score * 0.9);
                $task->update(['weight_score' => $penaltyWeight]);
            }

            $submission = $task->submissions()->create([
                'submission_file' => $submissionData['file_path'] ?? null,
                'submission_link' => $submissionData['link'] ?? null,
                'notes'           => $submissionData['notes'] ?? null,
                'submitted_at'    => $now,
            ]);

            $this->taskRepository->updateStatus($task, 'Submitted');

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

            return $this->taskRepository->updateStatus($task, $status);
        });
    }
}