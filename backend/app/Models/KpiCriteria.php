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

    protected $table = 'kpi_criteria';

    protected $fillable = [
        'criteria_name',
        'weight_percentage',
        'description',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['criteria_name', 'weight_percentage', 'description'])
            ->logOnlyDirty()
            ->useLogName('kpi_criteria');
    }
}
