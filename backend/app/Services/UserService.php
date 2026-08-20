<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService implements UserServiceInterface
{
    const CACHE_KEY_ALL = 'users_all';
    const CACHE_TTL = 3600;

    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    protected function clearCache(?int $id = null): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        if ($id) {
            Cache::forget("users_{$id}");
        }
    }

    protected function normalizeRoleName(string $role): string
    {
        $role = strtolower(trim($role));
        if ($role === 'karyawan') {
            return 'employee';
        }
        return $role;
    }

    public function getAllUsers()
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return $this->userRepository->getAll();
        });
    }

    public function getUserById(int $id)
    {
        return Cache::remember("users_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->userRepository->findById($id);
        });
    }

    public function createUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            $role = isset($data['role']) ? $this->normalizeRoleName($data['role']) : 'employee';

            $payload = [
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => strtoupper($role),
            ];

            $user = $this->userRepository->create($payload);
            $user->syncRoles([$role]);

            $this->clearCache();
            return $user->load('roles');
        });
    }

    public function updateUser(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $payload = [];
            if (isset($data['name'])) $payload['name'] = $data['name'];
            if (isset($data['email'])) $payload['email'] = $data['email'];
            if (!empty($data['password'])) $payload['password'] = Hash::make($data['password']);

            if (isset($data['role'])) {
                $role = $this->normalizeRoleName($data['role']);
                $payload['role'] = strtoupper($role);
            }

            $user = $this->userRepository->update($id, $payload);

            if (isset($role)) {
                $user->syncRoles([$role]);
            }

            $this->clearCache($id);
            return $user->load('roles');
        });
    }

    public function deleteUser(int $id): bool
    {
        $deleted = $this->userRepository->delete($id);
        $this->clearCache($id);
        return $deleted;
    }
}
