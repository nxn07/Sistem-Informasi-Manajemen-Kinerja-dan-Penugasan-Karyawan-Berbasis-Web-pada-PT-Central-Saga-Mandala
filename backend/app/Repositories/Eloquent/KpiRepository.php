<?php

namespace App\Repositories\Eloquent;

use App\Models\KpiCriteria;
use App\Repositories\Contracts\KpiRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class KpiRepository implements KpiRepositoryInterface
{
    public function getAll(): Collection
    {
        return KpiCriteria::all();
    }

    public function findById(int $id): KpiCriteria
    {
        return KpiCriteria::findOrFail($id);
    }

    public function create(array $data): KpiCriteria
    {
        return KpiCriteria::create($data);
    }

    public function update(int $id, array $data): KpiCriteria
    {
        $kpi = $this->findById($id);
        $kpi->update($data);
        return $kpi;
    }

    public function delete(int $id): bool
    {
        $kpi = $this->findById($id);
        return (bool) $kpi->delete();
    }
}
