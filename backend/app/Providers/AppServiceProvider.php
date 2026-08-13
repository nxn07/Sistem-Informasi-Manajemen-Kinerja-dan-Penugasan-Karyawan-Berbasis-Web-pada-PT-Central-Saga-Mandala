<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// User Bindings
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Services\Contracts\UserServiceInterface;
use App\Services\UserService;

// Employee Bindings
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\Eloquent\EmployeeRepository;
use App\Services\Contracts\EmployeeServiceInterface;
use App\Services\EmployeeService;

// Task Bindings
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\Eloquent\TaskRepository;
use App\Services\Contracts\TaskServiceInterface;
use App\Services\TaskService;

// Evaluation Bindings
use App\Repositories\Contracts\EvaluationRepositoryInterface;
use App\Repositories\Eloquent\EvaluationRepository;
use App\Services\Contracts\EvaluationServiceInterface;
use App\Services\EvaluationService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // 1. User Module
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);

        // 2. Employee Module
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
        $this->app->bind(EmployeeServiceInterface::class, EmployeeService::class);

        // 3. Task Module
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(TaskServiceInterface::class, TaskService::class);

        // 4. Evaluation Module
        $this->app->bind(EvaluationRepositoryInterface::class, EvaluationRepository::class);
        $this->app->bind(EvaluationServiceInterface::class, EvaluationService::class);
    }

    public function boot(): void
    {
        //
    }
}
