<?php

namespace App\Services\Contracts;

use App\Models\Task;
use App\Models\TaskSubmission;

interface TaskSubmissionServiceInterface
{
    public function submitTask(Task $task, array $submissionData): TaskSubmission;
    public function reviewTask(Task $task, string $status, ?string $reviewNotes, int $reviewerId): bool;
}
