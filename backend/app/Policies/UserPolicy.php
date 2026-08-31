<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        // Jangan auto-bypass untuk update & delete agar proteksi model akun primary admin tetap berjalan
        if (in_array($ability, ['update', 'delete'], true)) {
            return null;
        }

        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('users.view');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermissionTo('users.view') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('users.create');
    }

    public function update(User $user, User $model): bool
    {
        // Akun Super Admin Utama tidak boleh diedit oleh siapapun
        if ($model->isPrimaryAdmin()) {
            return false;
        }

        // Manager tidak boleh mengedit akun Admin atau sesama Manager
        if (!$user->hasRole('admin') && ($model->hasRole('admin') || $model->hasRole('manager') || $model->isPrimaryAdmin())) {
            return false;
        }

        return $user->hasRole('admin') || $user->hasPermissionTo('users.update') || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        // Akun Super Admin Utama TIDAK BISA dihapus oleh siapapun
        if ($model->isPrimaryAdmin()) {
            return false;
        }

        // Pengguna tidak dapat menghapus akunnya sendiri
        if ($user->id === $model->id) {
            return false;
        }

        // Manager tidak boleh menonaktifkan/menghapus akun Admin atau sesama Manager
        if (!$user->hasRole('admin') && ($model->hasRole('admin') || $model->hasRole('manager'))) {
            return false;
        }

        return $user->hasRole('admin') || $user->hasPermissionTo('users.delete');
    }
}
