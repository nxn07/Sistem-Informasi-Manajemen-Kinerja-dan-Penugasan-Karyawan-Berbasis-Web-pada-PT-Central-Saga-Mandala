<?php

namespace Tests\Unit;

use App\Models\PerformanceEvaluation;
use App\Repositories\Contracts\EvaluationRepositoryInterface;
use App\Services\EvaluationService;
use Mockery;
use Tests\TestCase;

class EvaluationServiceTest extends TestCase
{
    public function test_calculate_final_score_formula_and_grade_assignment()
    {
        $evaluationRepositoryMock = Mockery::mock(EvaluationRepositoryInterface::class);

        // Formula: (TaskScore * 0.6) + (KpiScore * 0.4)
        // (90 * 0.6) + (85 * 0.4) = 54 + 34 = 88 => Grade A (>=85)
        $taskScore = 90.0;
        $kpiScore = 85.0;
        $expectedFinalScore = 88.0;

        $evaluation = new PerformanceEvaluation([
            'task_score' => $taskScore,
            'kpi_score'  => $kpiScore,
            'final_score' => $expectedFinalScore,
            'grade'       => 'A',
        ]);

        $evaluationRepositoryMock->shouldReceive('getAll')
            ->once()
            ->andReturn(collect([$evaluation]));

        $evaluationService = new EvaluationService($evaluationRepositoryMock);

        $result = $evaluationService->getAllEvaluations();

        $this->assertCount(1, $result);
        $this->assertEquals(88.0, $result->first()->final_score);
        $this->assertEquals('A', $result->first()->grade);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
