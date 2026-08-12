<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\DivisionController;
use App\Http\Controllers\Api\V1\KpiController;
use App\Http\Controllers\Api\V1\EvaluationController;

Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Tasks
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::post('/tasks/{id}/review', [TaskController::class, 'review']);
        Route::post('/tasks/{id}/submit', [TaskController::class, 'submit']);

        // Users (users.manage)
        Route::middleware('can:users.manage')->group(function () {
            Route::apiResource('users', UserController::class);
        });

        // Divisions (divisions.manage)
        Route::middleware('can:divisions.manage')->group(function () {
            Route::apiResource('divisions', DivisionController::class);
        });

        // KPI (kpi.manage)
        Route::middleware('can:kpi.manage')->group(function () {
            Route::apiResource('kpis', KpiController::class);
        });

        // Evaluations (evaluations.*)
        Route::get('/evaluations/me', [EvaluationController::class, 'myEvaluation'])->middleware('can:evaluations.view_own');
        Route::middleware('can:evaluations.create')->group(function () {
            Route::apiResource('evaluations', EvaluationController::class)->except(['show']);
        });
    });
});