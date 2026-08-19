<?php

namespace App\Services;

use App\Models\KpiCriteria;
use App\Repositories\Contracts\KpiRepositoryInterface;
use App\Services\Contracts\KpiServiceInterface;
use Illuminate\Support\Facades\Cache;

class KpiService implements KpiServiceInterface
{
    const CACHE_KEY_ALL = 'kpis_all';
    const CACHE_TTL = 3600;

    protected KpiRepositoryInterface $kpiRepository;

    public function __construct(KpiRepositoryInterface $kpiRepository)
    {
        $this->kpiRepository = $kpiRepository;
    }

    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("kpis_{$id}");
        }
    }

    public function getAllKpis()
    {
        if (app()->environment('testing')) {
            return $this->kpiRepository->getAll();
        }

        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return $this->kpiRepository->getAll();
        });
    }

    public function getKpiById(int $id): KpiCriteria
    {
        return Cache::remember("kpis_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->kpiRepository->findById($id);
        });
    }

    public function createKpi(array $data): KpiCriteria
    {
        $kpi = $this->kpiRepository->create($data);
        $this->clearCache();
        return $kpi;
    }

    public function updateKpi(int $id, array $data): KpiCriteria
    {
        $kpi = $this->kpiRepository->update($id, $data);
        $this->clearCache($id);
        return $kpi;
    }

    public function deleteKpi(int $id): bool
    {
        $deleted = $this->kpiRepository->delete($id);
        $this->clearCache($id);
        return $deleted;
    }
}
