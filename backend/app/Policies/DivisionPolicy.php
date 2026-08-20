<?php

namespace App\Policies;

use App\Models\Division;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DivisionPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return true; // Semua user terautentikasi bisa melihat daftar divisi
    }

    public function view(User $user, Division $division): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('divisions.create');
    }

    public function update(User $user, Division $division): bool
    {
        return $user->hasPermissionTo('divisions.update');
    }

    public function delete(User $user, Division $division): bool
    {
        return $user->hasPermissionTo('divisions.delete');
    }
}
