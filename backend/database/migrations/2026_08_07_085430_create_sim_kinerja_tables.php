<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Divisions
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Employees
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('division_id')->constrained('divisions');
            $table->string('nik')->unique();
            $table->string('full_name');
            $table->string('phone')->nullable();
            $table->string('position');
            $table->timestamps();
        });

        // 3. KPI Criteria
        Schema::create('kpi_criteria', function (Blueprint $table) {
            $table->id();
            $table->string('criteria_name');
            $table->decimal('weight_percentage', 5, 2);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Tasks
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by_manager_id')->constrained('employees');
            $table->foreignId('assigned_employee_id')->constrained('employees');
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('deadline');
            $table->integer('weight');
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'WAITING_VERIFICATION', 'COMPLETED', 'REVISION'])->default('PENDING');
            $table->timestamps();
        });

        // 5. Task Submissions
        Schema::create('task_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees');
            $table->string('file_path');
            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        // 6. Performance Evaluations
        Schema::create('performance_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks');
            $table->foreignId('employee_id')->constrained('employees');
            $table->foreignId('evaluator_manager_id')->constrained('employees');
            $table->foreignId('kpi_criteria_id')->constrained('kpi_criteria');
            $table->decimal('score', 5, 2);
            $table->text('feedback_notes')->nullable();
            $table->timestamp('evaluated_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_evaluations');
        Schema::dropIfExists('task_submissions');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('kpi_criteria');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('divisions');
    }
};