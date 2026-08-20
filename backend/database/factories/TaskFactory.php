<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'created_by_manager_id' => Employee::factory(),
            'assigned_employee_id'  => Employee::factory(),
            'title'                 => fake()->sentence(4),
            'description'           => fake()->paragraph(),
            'deadline'              => fake()->dateTimeBetween('now', '+1 month'),
            'weight'                => fake()->numberBetween(1, 10),
            'status'                => fake()->randomElement(['PENDING', 'SUBMITTED', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED']),
        ];
    }
}
