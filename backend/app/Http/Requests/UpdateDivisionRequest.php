<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('division') ?? $this->route('id');

        return [
            'name'        => ['sometimes', 'required', 'string', 'max:255', Rule::unique('divisions', 'name')->ignore($id)],
            'code'        => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ];
    }
}
