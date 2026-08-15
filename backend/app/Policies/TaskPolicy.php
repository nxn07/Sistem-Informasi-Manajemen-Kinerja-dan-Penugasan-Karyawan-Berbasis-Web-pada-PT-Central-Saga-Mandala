<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Buka akses penuh tanpa batas untuk Role Admin.
     */
    public function before(User $user, string $ability): ?bool
    {
        // Mendukung ADMIN / admin maupun field $user->role
        if ($user->hasRole(['ADMIN', 'admin']) || strtoupper($user->role ?? '') === 'ADMIN') {
            return true;
        }

        return null;
    }

    /**
     * Hak akses melihat daftar seluruh tugas.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'MANAGER', 'KARYAWAN', 'admin', 'manager', 'karyawan']);
    }

    /**
     * Hak akses melihat detail satu tugas spesifik.
     */
    public function view(User $user, Task $task): bool
    {
        if ($user->hasRole(['MANAGER', 'manager']) || strtoupper($user->role ?? '') === 'MANAGER') {
            return true;
        }

        return $user->employee && $user->employee->id === $task->assigned_employee_id;
    }

    /**
     * Hak akses membuat tugas baru (Admin & Manager).
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'MANAGER', 'admin', 'manager'])
            || in_array(strtoupper($user->role ?? ''), ['ADMIN', 'MANAGER']);
    }

    /**
     * Hak akses memperbarui detail tugas.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->hasRole(['ADMIN', 'MANAGER', 'admin', 'manager'])
            || in_array(strtoupper($user->role ?? ''), ['ADMIN', 'MANAGER']);
    }

    /**
     * Hak akses mengumpulkan / submit tugas.
     */
    public function submit(User $user, Task $task): bool
    {
        return $user->employee && $user->employee->id === $task->assigned_employee_id;
    }

    /**
     * Hak akses meninjau / review tugas.
     */
    public function review(User $user, Task $task): bool
    {
        return $user->hasRole(['ADMIN', 'MANAGER', 'admin', 'manager'])
            || in_array(strtoupper($user->role ?? ''), ['ADMIN', 'MANAGER']);
    }

    /**
     * Hak akses menghapus tugas.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->hasRole(['ADMIN', 'MANAGER', 'admin', 'manager'])
            || in_array(strtoupper($user->role ?? ''), ['ADMIN', 'MANAGER']);
    }
}
