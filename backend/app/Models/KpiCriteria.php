<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class KpiCriteria extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'kpi_criterias';

    protected $fillable = [
        'name',
        'criteria_name',
        'weight',
        'weight_percentage',
        'target',
        'unit',
        'description',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(PerformanceEvaluation::class);
    }
}
