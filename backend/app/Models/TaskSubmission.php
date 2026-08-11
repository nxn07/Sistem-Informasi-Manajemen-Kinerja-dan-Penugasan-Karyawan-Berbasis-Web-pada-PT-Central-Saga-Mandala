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
        'submission_file',
        'submission_link',
        'notes',
        'submitted_at',
        'reviewed_by',
        'review_notes',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}