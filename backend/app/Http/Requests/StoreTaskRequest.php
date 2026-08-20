<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'due_date'     => $this->due_date ?? $this->deadline ?? now()->addDays(7)->toDateString(),
            'priority'     => $this->priority ?? 'Medium',
            'weight_score' => $this->weight_score ?? $this->weight ?? 5,
        ]);
    }

    public function rules(): array
    {
        return [
            'assigned_employee_id' => 'required|integer|exists:employees,id',
            'employee_id'          => 'nullable|integer|exists:employees,id',
            'title'                => 'required|string|max:255',
            'description'          => 'required|string',
            'due_date'             => 'required|date',
            'deadline'             => 'nullable|date',
            'priority'             => 'required|string',
            'weight_score'         => 'required|integer|min:1|max:100',
            'weight'               => 'nullable|integer',
        ];
    }
}
