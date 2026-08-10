<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes - SIM Kinerja (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Authentication Endpoints (Public)
    Route::post('/auth/login', [AuthController::class, 'login']);

    // 2. Protected Endpoints (Perlu Token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {

        // Auth User Info & Logout
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Task Management Endpoints
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::post('/tasks/{id}/submit', [TaskController::class, 'submit']);
        Route::post('/tasks/{id}/review', [TaskController::class, 'review']);

    });

});