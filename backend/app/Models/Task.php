<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Spatie Media Library
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

// Spatie Activitylog
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Task extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity;

    protected $fillable = [
        'created_by_manager_id',
        'assigned_employee_id',
        'title',
        'description',
        'deadline',
        'weight',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'weight'   => 'integer',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'status', 'assigned_employee_id', 'deadline', 'weight'])
            ->logOnlyDirty()
            ->useLogName('task_activity');
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'created_by_manager_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'assigned_employee_id');
    }

    // Alias agar kompatibel dengan pemanggilan $task->assignedEmployee
    public function assignedEmployee()
    {
        return $this->belongsTo(Employee::class, 'assigned_employee_id');
    }

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function evaluations()
    {
        return $this->hasMany(PerformanceEvaluation::class);
    }
}
