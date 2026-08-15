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
            $name = $request->input('criteria_name') ?? $request->input('name');
            $weight = $request->input('weight_percentage') ?? $request->input('weight');

            if (!$name || $weight === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kolom criteria_name / name dan weight_percentage / weight wajib diisi.',
                ], 422);
            }

            $payload = [
                'criteria_name'     => $name,
                'weight_percentage' => $weight,
            ];

            if ($request->has('description')) {
                $payload['description'] = $request->input('description');
            }

            $kpi = KpiCriteria::create($payload);

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

            $data = [];
            if ($request->has('criteria_name') || $request->has('name')) {
                $data['criteria_name'] = $request->input('criteria_name') ?? $request->input('name');
            }
            if ($request->has('weight_percentage') || $request->has('weight')) {
                $data['weight_percentage'] = $request->input('weight_percentage') ?? $request->input('weight');
            }
            if ($request->has('description')) {
                $data['description'] = $request->input('description');
            }

            $kpi->update($data);

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
