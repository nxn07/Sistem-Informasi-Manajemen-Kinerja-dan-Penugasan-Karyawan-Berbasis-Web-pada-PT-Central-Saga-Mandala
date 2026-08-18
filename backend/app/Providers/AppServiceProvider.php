<?php

namespace App\Providers;

use App\Repositories\Contracts\DivisionRepositoryInterface;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\Contracts\EvaluationRepositoryInterface;
use App\Repositories\Contracts\KpiRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\DivisionRepository;
use App\Repositories\Eloquent\EmployeeRepository;
use App\Repositories\Eloquent\EvaluationRepository;
use App\Repositories\Eloquent\KpiRepository;
use App\Repositories\Eloquent\RoleRepository;
use App\Repositories\Eloquent\TaskRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Services\Contracts\DivisionServiceInterface;
use App\Services\Contracts\EmployeeServiceInterface;
use App\Services\Contracts\EvaluationServiceInterface;
use App\Services\Contracts\KpiServiceInterface;
use App\Services\Contracts\RoleServiceInterface;
use App\Services\Contracts\TaskServiceInterface;
use App\Services\Contracts\TaskSubmissionServiceInterface;
use App\Services\Contracts\UserServiceInterface;
use App\Services\DivisionService;
use App\Services\EmployeeService;
use App\Services\EvaluationService;
use App\Services\KpiService;
use App\Services\RoleService;
use App\Services\TaskService;
use App\Services\TaskSubmissionService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(EvaluationRepositoryInterface::class, EvaluationRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(DivisionRepositoryInterface::class, DivisionRepository::class);
        $this->app->bind(KpiRepositoryInterface::class, KpiRepository::class);

        // Services
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(EmployeeServiceInterface::class, EmployeeService::class);
        $this->app->bind(TaskServiceInterface::class, TaskService::class);
        $this->app->bind(TaskSubmissionServiceInterface::class, TaskSubmissionService::class);
        $this->app->bind(EvaluationServiceInterface::class, EvaluationService::class);
        $this->app->bind(RoleServiceInterface::class, RoleService::class);
        $this->app->bind(DivisionServiceInterface::class, DivisionService::class);
        $this->app->bind(KpiServiceInterface::class, KpiService::class);
    }

    public function boot(): void
    {
        //
    }
}
