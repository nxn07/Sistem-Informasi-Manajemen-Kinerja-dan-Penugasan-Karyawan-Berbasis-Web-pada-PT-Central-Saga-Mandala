<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeePolicy
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
        return $user->hasPermissionTo('employees.view');
    }

    public function view(User $user, Employee $employee): bool
    {
        if ($user->hasRole('manager')) {
            return $user->employee && $user->employee->division_id === $employee->division_id;
        }

        return $user->employee && $user->employee->id === $employee->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('employees.create');
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('employees.update');
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->hasPermissionTo('employees.delete');
    }
}
