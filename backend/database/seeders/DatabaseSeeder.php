<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Employee;
use App\Models\KpiCriteria;
use App\Models\PerformanceEvaluation;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Model: Division
        $divisions = Division::factory(5)->create();

        // 2. Model: User & Employee Manager Utama (Admin/Manager Default)
        $adminUser = User::factory()->create([
            'username' => 'Admin System',
            'email'    => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role'     => 'ADMIN',
        ]);

        $managerEmployee = Employee::factory()->create([
            'user_id'     => $adminUser->id,
            'division_id' => $divisions->first()->id,
            'nik'         => '199001012026081001',
            'full_name'   => 'Manager Utama',
            'position'    => 'Manager',
        ]);

        // 3. Model: Employee (10 Karyawan Tambahan)
        $staffEmployees = Employee::factory(10)->recycle($divisions)->create();

        // 4. Model: KpiCriteria
        $kpiCriteriaList = KpiCriteria::factory(5)->create();

        // 5. Model: Task (15 Task dibuat oleh Manager untuk Karyawan)
        $tasks = Task::factory(15)->create([
            'created_by_manager_id' => $managerEmployee->id,
        ])->each(function ($task) use ($staffEmployees) {
            $task->update(['assigned_employee_id' => $staffEmployees->random()->id]);
        });

        // 6. Model: TaskSubmission & PerformanceEvaluation
        foreach ($tasks as $task) {
            // Buat submission untuk tiap task
            TaskSubmission::factory()->create([
                'task_id'     => $task->id,
                'employee_id' => $task->assigned_employee_id,
            ]);

            // Jika status COMPLETED, buatkan evaluasi kinerjanya
            if ($task->status === 'COMPLETED') {
                PerformanceEvaluation::factory()->create([
                    'task_id'              => $task->id,
                    'employee_id'          => $task->assigned_employee_id,
                    'evaluator_manager_id' => $managerEmployee->id,
                    'kpi_criteria_id'      => $kpiCriteriaList->random()->id,
                ]);
            }
        }
    }
}
