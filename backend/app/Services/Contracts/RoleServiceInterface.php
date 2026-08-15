<?php

namespace App\Services\Contracts;

use Spatie\Permission\Models\Role;

interface RoleServiceInterface
{
    public function getAllRoles();
    public function getRoleById(int $id): Role;
    public function createRole(array $data): Role;
    public function updateRole(int $id, array $data): Role;
    public function deleteRole(int $id): bool;
}
