<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache permission Spatie
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Buat Daftar Permissions sesuai PRD
        $permissions = [
            'users.manage',
            'divisions.manage',
            'kpi.manage',
            'tasks.create',
            'tasks.view_all',
            'tasks.submit',
            'tasks.review',
            'evaluations.create',
            'evaluations.view_own',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Role & Assign Permission

        // Role Admin (Akses Penuh)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Role Manager / Kadiv
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'tasks.create',
            'tasks.view_all',
            'tasks.review',
            'evaluations.create',
            'evaluations.view_own',
        ]);

        // Role Employee
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        $employeeRole->givePermissionTo([
            'tasks.submit',
            'evaluations.view_own',
        ]);
    }
}