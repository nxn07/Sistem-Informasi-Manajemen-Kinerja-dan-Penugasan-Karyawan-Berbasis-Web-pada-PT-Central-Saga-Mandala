<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('task_submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('task_submissions', 'reviewed_by_manager_id')) {
                $table->foreignId('reviewed_by_manager_id')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('task_submissions', 'review_notes')) {
                $table->text('review_notes')->nullable();
            }
            if (!Schema::hasColumn('task_submissions', 'status')) {
                $table->string('status')->default('PENDING');
            }
        });
    }

    public function down(): void
    {
        Schema::table('task_submissions', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by_manager_id']);
            $table->dropColumn(['reviewed_by_manager_id', 'review_notes', 'status']);
        });
    }
};
