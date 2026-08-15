<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\DivisionController;
use App\Http\Controllers\Api\V1\KpiController;
use App\Http\Controllers\Api\V1\EvaluationController;
use App\Http\Controllers\Api\V1\RoleController;
use Spatie\Activitylog\Models\Activity;

Route::prefix('v1')->group(function () {

    // ==========================================
    // Public Routes (Auth)
    // ==========================================
    Route::post('/auth/login', [AuthController::class, 'login']);

    // ==========================================
    // Protected Routes (Harus Login / Sanctum)
    // ==========================================
    Route::middleware('auth:sanctum')->group(function () {

        // Auth Session & Profile
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Tasks Management
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::post('/tasks/{id}/review', [TaskController::class, 'review']);
        Route::post('/tasks/{id}/submit', [TaskController::class, 'submit']);

        // Users Management
        Route::apiResource('users', UserController::class);

        // Roles & Permissions Management (Issue #10)
        Route::apiResource('roles', RoleController::class);

        // Divisions Management
        Route::apiResource('divisions', DivisionController::class);

        // KPIs Management (Kriteria KPI)
        Route::apiResource('kpis', KpiController::class);

        // Evaluations Management
        Route::get('/evaluations/me', [EvaluationController::class, 'myEvaluation']);
        Route::apiResource('evaluations', EvaluationController::class);

        // Audit Logs (Spatie Activitylog)
        Route::get('/activity-logs', function () {
            $logs = Activity::with('causer')->latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Daftar audit log aktivitas berhasil diambil.',
                'data'    => $logs,
            ], 200);
        });
    });
});
