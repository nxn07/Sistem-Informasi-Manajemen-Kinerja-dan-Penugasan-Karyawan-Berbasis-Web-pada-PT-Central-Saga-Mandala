<?php

namespace Database\Factories;

use App\Models\TaskSubmission;
use App\Models\Task;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskSubmissionFactory extends Factory
{
    protected $model = TaskSubmission::class;

    public function definition(): array
    {
        return [
            'task_id'         => Task::factory(),
            'employee_id'     => Employee::factory(),
            'file_path'       => 'submissions/sample_' . fake()->uuid() . '.pdf',
            'submission_file' => 'submissions/proof_' . fake()->uuid() . '.pdf',
            'submission_link' => fake()->url(),
            'notes'           => fake()->sentence(),
            'submitted_at'    => now(),
        ];
    }
}
