<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\User;
use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'division_id' => Division::factory(),
            'nik'         => fake()->unique()->numerify('199######202608#'),
            'full_name'   => fake()->name(),
            'phone'       => fake()->phoneNumber(),
            'position'    => fake()->randomElement(['Staff', 'Senior Staff', 'Team Lead', 'Manager']),
        ];
    }
}
