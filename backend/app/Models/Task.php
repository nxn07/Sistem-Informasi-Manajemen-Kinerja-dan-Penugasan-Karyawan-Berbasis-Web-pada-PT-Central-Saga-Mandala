<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

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

    /**
     * Konfigurasi Spatie Activitylog (Audit Trail)
     */
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

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function evaluations()
    {
        return $this->hasMany(PerformanceEvaluation::class);
    }
}
