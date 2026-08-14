<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\KpiCriteria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class KpiController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $kpis = KpiCriteria::all();
            return response()->json([
                'success' => true,
                'message' => 'Daftar kriteria KPI berhasil diambil.',
                'data'    => $kpis,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data KPI: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'   => 'required|string|max:255',
                'weight' => 'required|numeric',
            ]);

            $kpi = KpiCriteria::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil dibuat.',
                'data'    => $kpi,
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
            $kpi = KpiCriteria::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail KPI berhasil ditemukan.',
                'data'    => $kpi,
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Kriteria KPI tidak ditemukan.'], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $kpi = KpiCriteria::findOrFail($id);
            $kpi->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil diperbarui.',
                'data'    => $kpi,
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $kpi = KpiCriteria::findOrFail($id);
            $kpi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kriteria KPI berhasil dihapus.',
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
