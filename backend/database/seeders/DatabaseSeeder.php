<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Division;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Jalankan Role & Permission Seeder First
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        // 2. Divisi Contoh
        $itDiv = Division::create(['name' => 'IT & Engineering', 'description' => 'Departemen Teknologi Informasi']);
        $hrDiv = Division::create(['name' => 'Human Resources', 'description' => 'Departemen SDM']);

        // 3. User & Employee ADMIN
        $adminUser = User::create([
            'username' => 'admin',
            'email' => 'admin@sim.com',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
        ]);
        $adminUser->assignRole('admin'); // Assign Spatie Role

        Employee::create([
            'user_id' => $adminUser->id,
            'division_id' => $hrDiv->id,
            'nik' => 'ADM001',
            'full_name' => 'Administrator System',
            'phone' => '081234567890',
            'position' => 'HR Specialist & Admin',
        ]);

        // 4. User & Employee MANAGER
        $managerUser = User::create([
            'username' => 'manager_it',
            'email' => 'manager@sim.com',
            'password' => Hash::make('password123'),
            'role' => 'MANAGER',
        ]);
        $managerUser->assignRole('manager'); // Assign Spatie Role

        Employee::create([
            'user_id' => $managerUser->id,
            'division_id' => $itDiv->id,
            'nik' => 'MGR001',
            'full_name' => 'Manajer IT',
            'phone' => '081234567891',
            'position' => 'IT Lead Manager',
        ]);

        // 5. User & Employee KARYAWAN
        $karyawanUser = User::create([
            'username' => 'karyawan1',
            'email' => 'karyawan@sim.com',
            'password' => Hash::make('password123'),
            'role' => 'KARYAWAN',
        ]);
        $karyawanUser->assignRole('employee'); // Assign Spatie Role

        Employee::create([
            'user_id' => $karyawanUser->id,
            'division_id' => $itDiv->id,
            'nik' => 'EMP001',
            'full_name' => 'Budi Santoso',
            'phone' => '081234567892',
            'position' => 'Software Engineer',
        ]);
    }
}