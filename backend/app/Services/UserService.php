<?php

namespace App\Services;

use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService implements UserServiceInterface
{
    public function getAllUsers(): Collection
    {
        return User::with('employee.division')->get();
    }

    public function getUserById(int $id): User
    {
        return User::with('employee.division')->findOrFail($id);
    }

    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $userData = [
                'username' => $data['username'] ?? $data['name'] ?? null,
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => $data['role'] ?? 'KARYAWAN',
            ];

            $user = User::create($userData);

            if (!empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            if (!empty($data['division_id'])) {
                $nik = $data['nik'] ?? ('EMP-' . date('Ymd') . '-' . str_pad($user->id, 4, '0', STR_PAD_LEFT));
                $fullName = $data['full_name'] ?? $data['name'] ?? $data['username'] ?? 'Pegawai Baru';

                $user->employee()->create([
                    'division_id' => $data['division_id'],
                    'nik'         => $nik,
                    'full_name'   => $fullName, // <-- Kolom yang benar
                    'position'    => $data['position'] ?? 'Staff',
                ]);
            }

            return $user->load('employee.division');
        });
    }

    public function updateUser(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);

            $updateData = [];
            if (isset($data['username']) || isset($data['name'])) {
                $updateData['username'] = $data['username'] ?? $data['name'];
            }
            if (isset($data['email'])) {
                $updateData['email'] = $data['email'];
            }
            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }
            if (isset($data['role'])) {
                $updateData['role'] = $data['role'];
                $user->syncRoles([$data['role']]);
            }

            $user->update($updateData);

            if (isset($data['division_id']) || isset($data['nik']) || isset($data['position']) || isset($data['full_name']) || isset($data['name'])) {
                $employeeData = [];
                if (isset($data['division_id'])) $employeeData['division_id'] = $data['division_id'];
                if (isset($data['nik'])) $employeeData['nik'] = $data['nik'];
                if (isset($data['position'])) $employeeData['position'] = $data['position'];
                if (isset($data['full_name']) || isset($data['name'])) {
                    $employeeData['full_name'] = $data['full_name'] ?? $data['name'];
                }

                $user->employee()->updateOrCreate(['user_id' => $user->id], $employeeData);
            }

            return $user->load('employee.division');
        });
    }

    public function deleteUser(int $id): bool
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }
}
