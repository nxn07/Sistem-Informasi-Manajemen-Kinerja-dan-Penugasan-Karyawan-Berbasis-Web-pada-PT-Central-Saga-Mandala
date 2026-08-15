<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\DivisionController;
use App\Http\Controllers\Api\V1\KpiController;
use App\Http\Controllers\Api\V1\EvaluationController;
use Spatie\Activitylog\Models\Activity;

Route::prefix('v1')->group(function () {

    // Auth Routes (Public)
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes (Harus Login / Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Tasks
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::post('/tasks/{id}/review', [TaskController::class, 'review']);
        Route::post('/tasks/{id}/submit', [TaskController::class, 'submit']);

        // Users
        Route::apiResource('users', UserController::class);

        // Divisions
        Route::apiResource('divisions', DivisionController::class);

        // KPIs (CRUD Kriteria KPI)
        Route::apiResource('kpis', KpiController::class);

        // Evaluations
        Route::get('/evaluations/me', [EvaluationController::class, 'myEvaluation']);
        Route::apiResource('evaluations', EvaluationController::class)->except(['show']);

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
