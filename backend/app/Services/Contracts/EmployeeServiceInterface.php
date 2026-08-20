<?php

namespace App\Services\Contracts;

interface EmployeeServiceInterface
{
    public function getAllEmployees();
    public function getEmployeeById(int $id);
    public function createEmployee(array $data);
    public function updateEmployee(int $id, array $data);
    public function deleteEmployee(int $id);
}
