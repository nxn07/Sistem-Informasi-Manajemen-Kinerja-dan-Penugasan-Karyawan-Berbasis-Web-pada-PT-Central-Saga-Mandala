<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Permission;
use Throwable;

class PermissionController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $permissions = Permission::all(['id', 'name', 'guard_name']);
            return response()->json([
                'success' => true,
                'message' => 'Daftar permissions berhasil diambil.',
                'data'    => $permissions,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data permissions: ' . $e->getMessage(),
            ], 500);
        }
    }
}
