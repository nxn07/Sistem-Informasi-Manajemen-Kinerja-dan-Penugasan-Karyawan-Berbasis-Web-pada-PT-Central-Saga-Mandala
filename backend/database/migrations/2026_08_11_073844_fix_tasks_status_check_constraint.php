<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus constraint lama di PostgreSQL
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;");

        // Buat constraint baru yang fleksibel
        DB::statement("
            ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
            CHECK (status IN (
                'PENDING', 'SUBMITTED', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED',
                'pending', 'submitted', 'in_progress', 'approved', 'rejected', 'completed'
            ));
        ");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;");
    }
};