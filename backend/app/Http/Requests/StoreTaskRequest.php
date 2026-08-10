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
            'employee_id'  => 'required|exists:employees,id',
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'due_date'     => 'required|date|after:now',
            'priority'     => 'required|in:Low,Medium,High,Urgent',
            'weight_score' => 'required|integer|min:1|max:100',
        ];
    }
}