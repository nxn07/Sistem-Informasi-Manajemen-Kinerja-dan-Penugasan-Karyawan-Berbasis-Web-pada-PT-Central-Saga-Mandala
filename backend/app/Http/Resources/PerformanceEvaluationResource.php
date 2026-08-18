<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerformanceEvaluationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'task_id'        => $this->task_id,
            'employee_id'    => $this->employee_id,
            'kpi_criteria_id' => $this->kpi_criteria_id,
            'score'          => $this->score,
            'feedback_notes' => $this->feedback_notes ?? $this->notes,
            'created_at'     => $this->created_at,
        ];
    }
}
