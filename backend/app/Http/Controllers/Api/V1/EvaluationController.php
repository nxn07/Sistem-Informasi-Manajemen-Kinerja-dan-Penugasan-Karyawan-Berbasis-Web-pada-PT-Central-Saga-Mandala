<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PerformanceEvaluationResource;
use App\Services\Contracts\EvaluationServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EvaluationController extends Controller
{
    protected EvaluationServiceInterface $evaluationService;

    public function __construct(EvaluationServiceInterface $evaluationService)
    {
        $this->evaluationService = $evaluationService;
    }

    public function index(): JsonResponse
    {
        try {
            $evaluations = $this->evaluationService->getAllEvaluations();
            return response()->json([
                'success' => true,
                'message' => 'Daftar evaluasi berhasil diambil.',
                'data'    => PerformanceEvaluationResource::collection($evaluations),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil evaluasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $evaluation = $this->evaluationService->createEvaluation($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Evaluasi berhasil dibuat.',
                'data'    => new PerformanceEvaluationResource($evaluation),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat evaluasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $evaluation = $this->evaluationService->getEvaluationById($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail evaluasi berhasil ditemukan.',
                'data'    => new PerformanceEvaluationResource($evaluation),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Evaluasi tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $evaluation = $this->evaluationService->updateEvaluation($id, $request->all());
            return response()->json([
                'success' => true,
                'message' => 'Evaluasi berhasil diperbarui.',
                'data'    => new PerformanceEvaluationResource($evaluation),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->evaluationService->deleteEvaluation($id);
            return response()->json([
                'success' => true,
                'message' => 'Evaluasi berhasil dihapus.',
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
