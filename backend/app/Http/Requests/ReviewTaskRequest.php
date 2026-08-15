<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status'       => 'required|in:Approved,Rejected,Completed,APPROVED,REJECTED,COMPLETED',
            'review_notes' => 'nullable|string',
        ];
    }
}
