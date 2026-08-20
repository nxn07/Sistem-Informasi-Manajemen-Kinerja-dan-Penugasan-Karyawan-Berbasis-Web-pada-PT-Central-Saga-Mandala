<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKpiRequest;
use App\Http\Requests\UpdateKpiRequest;
use App\Http\Resources\KpiResource;
use App\Models\KpiCriteria;
use App\Services\Contracts\KpiServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Throwable;

class KpiController extends Controller
{
    protected KpiServiceInterface $kpiService;

    public function __construct(KpiServiceInterface $kpiService)
    {
        $this->kpiService = $kpiService;
    }

    public function index(): JsonResponse
    {
        try {
            $kpis = $this->kpiService->getAllKpis();
            return response()->json([
                'success' => true,
                'message' => 'Daftar kriteria KPI berhasil diambil.',
                'data'    => KpiResource::collection($kpis),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data KPI: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreKpiRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            // Normalisasi payload toleran nama kolom
            $payload = [
                'criteria_name'     => $data['criteria_name'] ?? $data['name'] ?? null,
                'weight_percentage' => $data['weight_percentage'] ?? $data['weight'] ?? null,
                'description'       => $data['description'] ?? null,
            ];

            $kpi = $this->kpiService->createKpi($payload);

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil dibuat.',
                'data'    => new KpiResource($kpi),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat kriteria KPI: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $kpi = $this->kpiService->getKpiById($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail KPI berhasil ditemukan.',
                'data'    => new KpiResource($kpi),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kriteria KPI tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateKpiRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $payload = [];

            if (isset($data['criteria_name']) || isset($data['name'])) {
                $payload['criteria_name'] = $data['criteria_name'] ?? $data['name'];
            }
            if (isset($data['weight_percentage']) || isset($data['weight'])) {
                $payload['weight_percentage'] = $data['weight_percentage'] ?? $data['weight'];
            }
            if (isset($data['description'])) {
                $payload['description'] = $data['description'];
            }

            $kpi = $this->kpiService->updateKpi($id, $payload);

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil diperbarui.',
                'data'    => new KpiResource($kpi),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kriteria KPI tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->kpiService->deleteKpi($id);

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil dihapus.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kriteria KPI tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
