<?php

namespace App\Services;

use App\Models\Division;
use App\Repositories\Contracts\DivisionRepositoryInterface;
use App\Services\Contracts\DivisionServiceInterface;
use Illuminate\Support\Facades\Cache;

class DivisionService implements DivisionServiceInterface
{
    const CACHE_KEY_ALL = 'divisions_all';
    const CACHE_TTL = 3600;

    protected DivisionRepositoryInterface $divisionRepository;

    public function __construct(DivisionRepositoryInterface $divisionRepository)
    {
        $this->divisionRepository = $divisionRepository;
    }

    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("divisions_{$id}");
        }
    }

    public function getAllDivisions()
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return $this->divisionRepository->getAll();
        });
    }

    public function getDivisionById(int $id): Division
    {
        return Cache::remember("divisions_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->divisionRepository->findById($id);
        });
    }

    public function createDivision(array $data): Division
    {
        $division = $this->divisionRepository->create($data);
        $this->clearCache();
        return $division;
    }

    public function updateDivision(int $id, array $data): Division
    {
        $division = $this->divisionRepository->update($id, $data);
        $this->clearCache($id);
        return $division;
    }

    public function deleteDivision(int $id): bool
    {
        $deleted = $this->divisionRepository->delete($id);
        $this->clearCache($id);
        return $deleted;
    }
}
