<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiCriteria extends Model
{
    protected $table = 'kpi_criteria';
    protected $fillable = ['criteria_name', 'weight_percentage', 'description'];
}