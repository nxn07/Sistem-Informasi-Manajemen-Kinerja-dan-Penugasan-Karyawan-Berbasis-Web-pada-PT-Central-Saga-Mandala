<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'division_id',
        'nik',
        'full_name',
        'position',
        'phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_employee_id');
    }

    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by_manager_id');
    }

    public function evaluations()
    {
        return $this->hasMany(PerformanceEvaluation::class);
    }
}