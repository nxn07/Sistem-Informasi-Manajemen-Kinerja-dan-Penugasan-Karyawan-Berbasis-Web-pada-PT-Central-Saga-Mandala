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
            'file'            => 'nullable|file|mimes:pdf,zip,png,jpeg,jpg,webp,docx,doc,xlsx,pptx|max:20480',
            'link'            => 'nullable|string',
            'submission_link' => 'nullable|string',
            'notes'           => 'nullable|string',
            'submission_notes' => 'nullable|string',
        ];
    }
}