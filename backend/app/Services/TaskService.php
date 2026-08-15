<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Notifications\TaskAssignedNotification;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\Contracts\TaskServiceInterface;
use Illuminate\Support\Facades\Cache;

class TaskService implements TaskServiceInterface
{
    const CACHE_KEY_ALL = 'tasks_all';
    const CACHE_TTL = 3600;

    protected TaskRepositoryInterface $taskRepository;
    protected TaskSubmissionService $submissionService;

    public function __construct(
        TaskRepositoryInterface $taskRepository,
        TaskSubmissionService $submissionService
    ) {
        $this->taskRepository = $taskRepository;
        $this->submissionService = $submissionService;
    }

    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("tasks_{$id}");
        }
    }

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

    public function assignTask(array $data, int $assignedByUserId): Task
    {
        $data['created_by_manager_id'] = $assignedByUserId;
        $data['assigned_employee_id'] = $data['assigned_employee_id'] ?? $data['employee_id'] ?? null;
        $data['deadline'] = $data['deadline'] ?? $data['due_date'] ?? null;
        $data['weight'] = $data['weight'] ?? $data['weight_score'] ?? null;
        $data['status'] = 'PENDING';

        $task = $this->taskRepository->create($data);
        $this->clearCache();

        if (!empty($data['assigned_employee_id'])) {
            $employee = Employee::find($data['assigned_employee_id']);
            if ($employee && $employee->user) {
                $employee->user->notify(new TaskAssignedNotification($task));
            }
        }

        return $task;
    }

    public function submitTask(Task $task, array $submissionData): TaskSubmission
    {
        return $this->submissionService->submitTask($task, $submissionData);
    }

    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool
    {
        return $this->submissionService->reviewTask($task, $status, $reviewNotes, $reviewerId);
    }
}
