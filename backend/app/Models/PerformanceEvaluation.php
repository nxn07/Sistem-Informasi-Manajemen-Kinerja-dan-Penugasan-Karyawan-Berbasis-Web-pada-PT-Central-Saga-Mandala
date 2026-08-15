<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceEvaluation extends Model
{
    use HasFactory;

    protected $table = 'performance_evaluations';

    protected $fillable = [
        'task_id',
        'employee_id',
        'evaluator_manager_id',
        'kpi_criteria_id',
        'score',
        'feedback',
        'notes',
        'status',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function evaluatorManager()
    {
        return $this->belongsTo(User::class, 'evaluator_manager_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_manager_id');
    }

    public function kpiCriteria()
    {
        return $this->belongsTo(KpiCriteria::class, 'kpi_criteria_id');
    }
}
