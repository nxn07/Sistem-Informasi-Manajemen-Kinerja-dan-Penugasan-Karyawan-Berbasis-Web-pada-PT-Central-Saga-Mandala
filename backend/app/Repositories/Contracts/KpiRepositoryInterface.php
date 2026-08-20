<?php

namespace App\Repositories\Contracts;

use App\Models\KpiCriteria;
use Illuminate\Database\Eloquent\Collection;

interface KpiRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): KpiCriteria;
    public function create(array $data): KpiCriteria;
    public function update(int $id, array $data): KpiCriteria;
    public function delete(int $id): bool;
}
