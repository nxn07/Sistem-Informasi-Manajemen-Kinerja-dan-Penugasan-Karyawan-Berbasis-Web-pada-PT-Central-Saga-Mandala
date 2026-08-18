<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'task_id'         => $this->task_id,
            'employee_id'     => $this->employee_id,
            'file_path'       => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'submission_file' => $this->submission_file ? asset('storage/' . $this->submission_file) : null,
            'submission_link' => $this->submission_link,
            'notes'           => $this->notes,
            'submitted_at'    => $this->submitted_at,
            'reviewed_by'     => $this->reviewed_by_manager_id,
            'review_notes'    => $this->review_notes,
            'status'          => $this->status,
            'created_at'      => $this->created_at,
        ];
    }
}
