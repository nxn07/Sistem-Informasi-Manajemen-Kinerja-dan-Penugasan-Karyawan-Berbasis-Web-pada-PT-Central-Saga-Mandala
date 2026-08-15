<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assigned_employee_id' => 'required|integer|exists:employees,id',
            'employee_id'          => 'nullable|integer|exists:employees,id',
            'title'                => 'required|string|max:255',
            'description'          => 'required|string',
            'due_date'             => 'required|date',
            'priority'             => 'required|in:Low,Medium,High,LOW,MEDIUM,HIGH',
            'weight_score'         => 'required|integer|min:1|max:100',
        ];
    }
}
