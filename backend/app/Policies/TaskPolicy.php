<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Buka akses penuh tanpa batas untuk Role Admin / Super Admin.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Hak akses melihat daftar seluruh tugas.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('tasks.view');
    }

    /**
     * Hak akses melihat detail satu tugas spesifik.
     */
    public function view(User $user, Task $task): bool
    {
        if ($user->hasRole('manager')) {
            return $user->employee && $user->employee->division_id === $task->division_id;
        }

        return $user->employee && $user->employee->id === $task->assigned_employee_id;
    }

    /**
     * Hak akses membuat tugas baru.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('tasks.create');
    }

    /**
     * Hak akses memperbarui detail tugas.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('tasks.edit');
    }

    /**
     * Hak akses mengumpulkan / submit tugas.
     */
    public function submit(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('tasks.submit') &&
            $user->employee &&
            $user->employee->id === $task->assigned_employee_id;
    }

    /**
     * Hak akses meninjau / review tugas.
     */
    public function review(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('tasks.review');
    }

    /**
     * Hak akses menghapus tugas.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('tasks.delete');
    }
}
