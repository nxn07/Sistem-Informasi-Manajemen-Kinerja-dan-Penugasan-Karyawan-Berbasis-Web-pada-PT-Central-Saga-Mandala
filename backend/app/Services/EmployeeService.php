<?php

namespace App\Services;

use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Services\Contracts\EmployeeServiceInterface;

class EmployeeService implements EmployeeServiceInterface
{
    protected $employeeRepository;

    public function __construct(EmployeeRepositoryInterface $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    public function getAllEmployees()
    {
        return $this->employeeRepository->getAll();
    }

    public function getEmployeeById(int $id)
    {
        return $this->employeeRepository->findById($id);
    }

    public function createEmployee(array $data)
    {
        return $this->employeeRepository->create($data);
    }

    public function updateEmployee(int $id, array $data)
    {
        return $this->employeeRepository->update($id, $data);
    }

    public function deleteEmployee(int $id)
    {
        return $this->employeeRepository->delete($id);
    }
}
