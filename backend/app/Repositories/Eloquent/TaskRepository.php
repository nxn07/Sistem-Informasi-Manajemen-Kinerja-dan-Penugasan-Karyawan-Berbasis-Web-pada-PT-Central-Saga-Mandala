<?php

namespace App\Repositories\Eloquent;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;

class TaskRepository implements TaskRepositoryInterface
{
    public function getAll()
    {
        return Task::with(['manager', 'assignedEmployee'])->get();
    }

    public function findById(int $id)
    {
        return Task::with(['manager', 'assignedEmployee', 'submissions'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Task::create($data);
    }

    public function update(int $id, array $data)
    {
        $task = $this->findById($id);
        $task->update($data);
        return $task;
    }

    public function delete(int $id)
    {
        $task = $this->findById($id);
        return $task->delete();
    }
}
