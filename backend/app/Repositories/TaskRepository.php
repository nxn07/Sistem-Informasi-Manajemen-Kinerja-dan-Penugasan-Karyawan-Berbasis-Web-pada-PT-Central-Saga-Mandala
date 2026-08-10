<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository
{
    public function getAllByDivision(int $divisionId): Collection
    {
        return Task::whereHas('employee', function ($query) use ($divisionId) {
            $query->where('division_id', $divisionId);
        })->with(['employee.user', 'submissions'])->latest()->get();
    }

    public function getByEmployeeId(int $employeeId): Collection
    {
        return Task::where('employee_id', $employeeId)
            ->with(['submissions'])
            ->latest()
            ->get();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function findById(int $id): ?Task
    {
        return Task::with(['employee', 'submissions'])->find($id);
    }

    public function updateStatus(Task $task, string $status): bool
    {
        return $task->update(['status' => $status]);
    }
}