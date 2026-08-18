<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Throwable;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = (int) $request->input('limit', 15);
            $logs = Activity::with('causer')->latest()->paginate($limit);

            return response()->json([
                'success' => true,
                'message' => 'Daftar audit log aktivitas berhasil diambil.',
                'data'    => $logs,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data audit log: ' . $e->getMessage(),
            ], 500);
        }
    }
}
