<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Task extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'weight',
        'weight_score',
        'status',
        'start_date',
        'deadline',
        'due_date',
        'created_by_manager_id',
        'assigned_employee_id',
        'employee_id',
        'division_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'assigned_employee_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'created_by_manager_id');
    }
}
