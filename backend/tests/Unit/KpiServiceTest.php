<?php

namespace Tests\Unit;

use App\Models\KpiCriteria;
use App\Repositories\Contracts\KpiRepositoryInterface;
use App\Services\KpiService;
use Mockery;
use Tests\TestCase;

class KpiServiceTest extends TestCase
{
    public function test_get_all_kpis_returns_criterias_from_repository()
    {
        $kpiRepositoryMock = Mockery::mock(KpiRepositoryInterface::class);

        $kpiRepositoryMock->shouldReceive('getAll')
            ->once()
            ->andReturn(collect([
                new KpiCriteria(['name' => 'Kedisiplinan', 'weight_percentage' => 25.0]),
                new KpiCriteria(['name' => 'Kualitas Kerja', 'weight_percentage' => 30.0]),
            ]));

        $kpiService = new KpiService($kpiRepositoryMock);

        $result = $kpiService->getAllKpis();

        $this->assertCount(2, $result);
        $this->assertEquals('Kedisiplinan', $result->first()->name);
        $this->assertEquals(25.0, $result->first()->weight_percentage);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
