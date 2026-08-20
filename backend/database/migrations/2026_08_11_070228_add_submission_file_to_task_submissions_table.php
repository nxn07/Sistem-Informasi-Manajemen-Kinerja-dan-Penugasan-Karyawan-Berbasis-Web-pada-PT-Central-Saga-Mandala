<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('task_submissions', function (Blueprint $table) {
            // Ubah file_path agar boleh NULL jika sudah ada
            if (Schema::hasColumn('task_submissions', 'file_path')) {
                $table->string('file_path')->nullable()->change();
            }
            
            // Tambahkan submission_file dan submission_link jika belum ada
            if (!Schema::hasColumn('task_submissions', 'submission_file')) {
                $table->string('submission_file')->nullable();
            }
            if (!Schema::hasColumn('task_submissions', 'submission_link')) {
                $table->string('submission_link')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('task_submissions', function (Blueprint $table) {
            // Revert jika diperlukan
        });
    }
};