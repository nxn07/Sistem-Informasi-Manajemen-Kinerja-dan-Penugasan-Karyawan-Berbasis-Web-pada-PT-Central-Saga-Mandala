<?php

namespace App\Policies;

use App\Models\PerformanceEvaluation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EvaluationPolicy
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
        return $user->hasPermissionTo('evaluations.view');
    }

    public function view(User $user, PerformanceEvaluation $evaluation): bool
    {
        if ($user->hasRole('manager')) {
            return $user->employee && $user->employee->division_id === $evaluation->employee->division_id;
        }

        return $user->employee && $user->employee->id === $evaluation->employee_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('evaluations.create');
    }

    public function update(User $user, PerformanceEvaluation $evaluation): bool
    {
        return $user->hasPermissionTo('evaluations.update');
    }

    public function delete(User $user, PerformanceEvaluation $evaluation): bool
    {
        return $user->hasPermissionTo('evaluations.delete');
    }
}
