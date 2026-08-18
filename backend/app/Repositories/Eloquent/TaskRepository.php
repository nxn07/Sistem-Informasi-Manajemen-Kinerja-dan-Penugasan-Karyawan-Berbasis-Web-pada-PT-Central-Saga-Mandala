<?php

namespace App\Repositories\Eloquent;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function getAll(): Collection
    {
        return Task::with(['manager', 'employee', 'division', 'submissions'])->latest()->get();
    }

    public function findById(int $id): Task
    {
        return Task::with(['manager', 'employee', 'division', 'submissions'])->findOrFail($id);
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(int $id, array $data): Task
    {
        $task = $this->findById($id);
        $task->update($data);
        return $task;
    }

    public function delete(int $id): bool
    {
        $task = $this->findById($id);
        return (bool) $task->delete();
    }
}
