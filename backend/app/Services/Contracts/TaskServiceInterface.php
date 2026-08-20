<?php

namespace App\Services\Contracts;

use App\Models\Task;
use App\Models\TaskSubmission;

interface TaskServiceInterface
{
    // Method CRUD Standar
    public function getAllTasks();
    public function getTaskById(int $id);
    public function createTask(array $data);
    public function updateTask(int $id, array $data);
    public function deleteTask(int $id);

    // Bisnis Logika Khusus Task Management
    public function assignTask(array $data, int $assignedByUserId): Task;
    public function submitTask(Task $task, array $submissionData): TaskSubmission;
    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool;
}
