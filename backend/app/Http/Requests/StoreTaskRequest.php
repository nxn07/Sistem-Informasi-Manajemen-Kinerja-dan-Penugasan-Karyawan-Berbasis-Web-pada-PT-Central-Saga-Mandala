<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('tasks.create');
    }

    public function rules(): array
{
    return [
        'employee_id'          => 'nullable|integer|exists:employees,id',
        'assigned_employee_id' => 'nullable|integer|exists:employees,id',
        'title'                => 'required|string|max:255',
        'description'          => 'required|string',
        'due_date'             => 'required|date',
        'priority'             => 'required|in:Low,Medium,High',
        'weight_score'         => 'required|integer',
    ];
}
}