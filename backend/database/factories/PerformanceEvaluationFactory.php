<?php

namespace Database\Factories;

use App\Models\PerformanceEvaluation;
use App\Models\Task;
use App\Models\Employee;
use App\Models\KpiCriteria;
use Illuminate\Database\Eloquent\Factories\Factory;

class PerformanceEvaluationFactory extends Factory
{
    protected $model = PerformanceEvaluation::class;

    public function definition(): array
    {
        return [
            'task_id'              => Task::factory(),
            'employee_id'          => Employee::factory(),
            'evaluator_manager_id' => Employee::factory(),
            'kpi_criteria_id'      => KpiCriteria::factory(),
            'score'                => fake()->randomFloat(2, 60, 100),
            'feedback_notes'       => fake()->paragraph(),
            'evaluated_at'         => now(),
        ];
    }
}
