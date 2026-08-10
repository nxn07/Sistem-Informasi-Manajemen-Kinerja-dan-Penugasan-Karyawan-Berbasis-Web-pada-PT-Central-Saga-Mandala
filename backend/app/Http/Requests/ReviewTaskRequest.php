<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('tasks.review');
    }

    public function rules(): array
    {
        return [
            'status'       => 'required|in:Approved,Rejected',
            'review_notes' => 'nullable|string',
        ];
    }
}