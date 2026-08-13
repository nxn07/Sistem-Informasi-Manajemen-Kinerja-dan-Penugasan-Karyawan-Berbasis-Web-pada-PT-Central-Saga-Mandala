<?php

namespace Database\Factories;

use App\Models\KpiCriteria;
use Illuminate\Database\Eloquent\Factories\Factory;

class KpiCriteriaFactory extends Factory
{
    protected $model = KpiCriteria::class;

    public function definition(): array
    {
        return [
            'criteria_name'     => fake()->words(3, true),
            'weight_percentage' => fake()->randomFloat(2, 5, 25),
            'description'       => fake()->sentence(),
        ];
    }
}
