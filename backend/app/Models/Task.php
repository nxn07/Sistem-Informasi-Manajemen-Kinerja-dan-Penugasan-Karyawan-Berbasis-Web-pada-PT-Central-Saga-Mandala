<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'deadline'   => 'date',
            'due_date'   => 'date',
            'weight'     => 'float',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'assigned_employee_id');
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'created_by_manager_id');
    }
}
