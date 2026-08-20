<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKpiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'weight'      => 'required|numeric|min:0|max:100',
            'target'      => 'nullable|numeric',
            'unit'        => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ];
    }
}
