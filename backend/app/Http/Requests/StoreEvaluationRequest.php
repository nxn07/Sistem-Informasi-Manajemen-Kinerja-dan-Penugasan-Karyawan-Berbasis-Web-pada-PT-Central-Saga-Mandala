<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id'              => 'required|exists:tasks,id',
            'employee_id'          => 'required|exists:employees,id',
            'kpi_criteria_id'      => 'required|exists:kpi_criterias,id',
            'score'                => 'required|numeric|min:0|max:100',
            'feedback_notes'       => 'nullable|string',
            'evaluator_manager_id' => 'nullable|exists:users,id',
        ];
    }
}
