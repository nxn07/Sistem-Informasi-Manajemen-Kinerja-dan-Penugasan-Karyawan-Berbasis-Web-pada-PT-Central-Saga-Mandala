<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Ubah tipe kolom status menjadi VARCHAR
        DB::statement("ALTER TABLE tasks ALTER COLUMN status TYPE VARCHAR(50) USING status::text;");
        DB::statement("ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'PENDING';");

        // 2. Refresh Check Constraint dengan daftar status lengkap
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;");
        DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('PENDING', 'SUBMITTED', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED', 'REVISION'));");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;");
    }
};
