<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name ?? $this->username,
            'email'       => $this->email,
            'roles'            => method_exists($this->resource, 'getRoleNames') ? $this->getRoleNames() : [],
            'permissions'      => method_exists($this->resource, 'getAllPermissions') ? $this->getAllPermissions()->pluck('name') : [],
            'is_primary_admin' => method_exists($this->resource, 'isPrimaryAdmin') ? $this->isPrimaryAdmin() : (strtolower(trim($this->email ?? '')) === 'admin@gmail.com'),
            'created_at'       => $this->created_at,
        ];
    }
}
