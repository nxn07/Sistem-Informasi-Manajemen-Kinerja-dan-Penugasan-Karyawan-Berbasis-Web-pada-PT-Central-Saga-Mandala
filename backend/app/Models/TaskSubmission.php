<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    use HasFactory;

    protected $table = 'task_submissions';

    protected $fillable = [
        'task_id',
        'employee_id',
        'file_path',
        'submission_file', // <-- Menampung path berkas upload dari Factory/Service
        'submission_link',
        'notes',
        'submitted_at',
        'reviewed_by_manager_id',
        'review_notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by_manager_id');
    }
}
