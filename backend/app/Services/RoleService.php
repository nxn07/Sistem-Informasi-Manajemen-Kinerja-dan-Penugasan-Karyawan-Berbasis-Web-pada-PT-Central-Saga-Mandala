<?php

namespace App\Services;

use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Services\Contracts\RoleServiceInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleService implements RoleServiceInterface
{
    const CACHE_KEY_ALL = 'roles_all';
    const CACHE_TTL = 3600;

    protected RoleRepositoryInterface $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("roles_{$id}");
        }
    }

    public function getAllRoles()
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return $this->roleRepository->getAll();
        });
    }

    public function getRoleById(int $id): Role
    {
        return Cache::remember("roles_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->roleRepository->findById($id);
        });
    }

    public function createRole(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = $this->roleRepository->create([
                'name'       => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
            ]);

            if (!empty($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            $this->clearCache();
            return $role->load('permissions');
        });
    }

    public function updateRole(int $id, array $data): Role
    {
        return DB::transaction(function () use ($id, $data) {
            $role = $this->roleRepository->update($id, [
                'name' => $data['name'] ?? $this->roleRepository->findById($id)->name,
            ]);

            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            $this->clearCache($id);
            return $role->load('permissions');
        });
    }

    public function deleteRole(int $id): bool
    {
        $deleted = $this->roleRepository->delete($id);
        $this->clearCache($id);
        return $deleted;
    }
}
