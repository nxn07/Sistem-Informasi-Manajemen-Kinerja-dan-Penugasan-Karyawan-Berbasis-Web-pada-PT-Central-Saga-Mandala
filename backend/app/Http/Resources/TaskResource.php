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
            'due_date'     => $this->due_date,
            'priority'     => $this->priority,
            'weight_score' => $this->weight_score,
            'status'       => $this->status,
            'assigned_by'  => $this->assigned_by,
            'employee'     => [
                'id'        => $this->employee->id ?? null,
                'full_name' => $this->employee->full_name ?? null,
                'position'  => $this->employee->position ?? null,
            ],
            'submissions'  => $this->submissions,
            'created_at'   => $this->created_at ? $this->created_at->toDateTimeString() : null,
        ];
    }
}