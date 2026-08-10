<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('tasks.submit');
    }

    public function rules(): array
    {
        return [
            'file'  => 'nullable|file|mimes:pdf,zip,png,jpeg|max:10240', // Max 10MB
            'link'  => 'nullable|url',
            'notes' => 'nullable|string',
        ];
    }
}