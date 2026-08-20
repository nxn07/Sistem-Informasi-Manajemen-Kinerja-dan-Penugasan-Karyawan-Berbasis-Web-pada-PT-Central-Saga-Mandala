<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id'              => 'sometimes|required|exists:tasks,id',
            'employee_id'          => 'sometimes|required|exists:employees,id',
            'kpi_criteria_id'      => 'sometimes|required|exists:kpi_criterias,id',
            'score'                => 'sometimes|required|numeric|min:0|max:100',
            'feedback_notes'       => 'nullable|string',
            'evaluator_manager_id' => 'nullable|exists:users,id',
        ];
    }
}
