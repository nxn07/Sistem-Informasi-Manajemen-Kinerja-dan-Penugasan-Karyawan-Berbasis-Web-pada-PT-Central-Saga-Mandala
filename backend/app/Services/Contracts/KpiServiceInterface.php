<?php

namespace App\Services\Contracts;

use App\Models\KpiCriteria;

interface KpiServiceInterface
{
    public function getAllKpis();
    public function getKpiById(int $id): KpiCriteria;
    public function createKpi(array $data): KpiCriteria;
    public function updateKpi(int $id, array $data): KpiCriteria;
    public function deleteKpi(int $id): bool;
}
