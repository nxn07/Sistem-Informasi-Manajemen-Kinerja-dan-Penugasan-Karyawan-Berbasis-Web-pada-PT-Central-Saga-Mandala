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
        \Illuminate\Support\Facades\Cache::forget('all_kpi_criterias');

        $kpiRepositoryMock = Mockery::mock(KpiRepositoryInterface::class);

        $k1 = new KpiCriteria();
        $k1->setAttribute('criteria_name', 'Kedisiplinan');
        $k1->setAttribute('weight_percentage', 25.0);

        $k2 = new KpiCriteria();
        $k2->setAttribute('criteria_name', 'Kualitas Kerja');
        $k2->setAttribute('weight_percentage', 30.0);

        $kpiRepositoryMock->shouldReceive('getAll')
            ->once()
            ->andReturn(new \Illuminate\Database\Eloquent\Collection([$k1, $k2]));

        $kpiService = new KpiService($kpiRepositoryMock);

        $result = $kpiService->getAllKpis();

        $this->assertCount(2, $result);
        $this->assertEquals('Kedisiplinan', $result->first()->criteria_name);
        $this->assertEquals(25.0, $result->first()->weight_percentage);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
