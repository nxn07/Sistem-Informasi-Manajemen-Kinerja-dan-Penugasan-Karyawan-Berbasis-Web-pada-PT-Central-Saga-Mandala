<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Division extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'divisions';

    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code', 'description'])
            ->logOnlyDirty()
            ->useLogName('division');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
