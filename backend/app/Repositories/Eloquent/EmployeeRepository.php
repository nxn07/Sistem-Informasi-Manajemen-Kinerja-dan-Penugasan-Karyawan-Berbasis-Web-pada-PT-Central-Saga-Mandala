<?php

namespace App\Repositories\Eloquent;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function getAll()
    {
        return Employee::with(['user', 'division'])->get();
    }

    public function findById(int $id)
    {
        return Employee::with(['user', 'division'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Employee::create($data);
    }

    public function update(int $id, array $data)
    {
        $employee = $this->findById($id);
        $employee->update($data);
        return $employee;
    }

    public function delete(int $id)
    {
        $employee = $this->findById($id);
        return $employee->delete();
    }
}
