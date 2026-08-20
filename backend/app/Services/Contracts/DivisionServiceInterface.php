<?php

namespace App\Services\Contracts;

use App\Models\Division;

interface DivisionServiceInterface
{
    public function getAllDivisions();
    public function getDivisionById(int $id): Division;
    public function createDivision(array $data): Division;
    public function updateDivision(int $id, array $data): Division;
    public function deleteDivision(int $id): bool;
}
