<?php

namespace App\Repositories\Contracts;

use App\Models\Division;
use Illuminate\Database\Eloquent\Collection;

interface DivisionRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): Division;
    public function create(array $data): Division;
    public function update(int $id, array $data): Division;
    public function delete(int $id): bool;
}
