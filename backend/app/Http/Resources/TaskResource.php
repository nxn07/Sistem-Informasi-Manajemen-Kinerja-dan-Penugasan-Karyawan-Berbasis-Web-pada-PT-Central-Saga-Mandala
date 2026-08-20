<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'description'  => $this->description,
            'due_date'     => $this->deadline ?? $this->due_date,
            'priority'     => $this->priority ?? 'High',
            'weight_score' => $this->weight ?? $this->weight_score,
            'status'       => $this->status,
            'assigned_by'           => $this->created_by_manager_id ?? $this->assigned_by,
            'assigned_employee_id'  => $this->assigned_employee_id ?? $this->employee_id,
            'employee'              => $this->employee ? [
                'id'        => $this->employee->id,
                'name'      => $this->employee->full_name ?? $this->employee->name ?? 'Pegawai',
                'full_name' => $this->employee->full_name ?? $this->employee->name ?? 'Pegawai',
                'position'  => $this->employee->position,
            ] : null,
            'submissions'           => $this->submissions,
            'created_at'            => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}