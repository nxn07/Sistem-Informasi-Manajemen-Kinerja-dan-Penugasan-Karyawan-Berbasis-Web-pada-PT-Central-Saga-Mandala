<?php

namespace App\Repositories\Eloquent;

use App\Models\Division;
use App\Repositories\Contracts\DivisionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class DivisionRepository implements DivisionRepositoryInterface
{
    public function getAll(): Collection
    {
        return Division::all();
    }

    public function findById(int $id): Division
    {
        return Division::findOrFail($id);
    }

    public function create(array $data): Division
    {
        return Division::create($data);
    }

    public function update(int $id, array $data): Division
    {
        $division = $this->findById($id);
        $division->update($data);
        return $division;
    }

    public function delete(int $id): bool
    {
        $division = $this->findById($id);
        return (bool) $division->delete();
    }
}
