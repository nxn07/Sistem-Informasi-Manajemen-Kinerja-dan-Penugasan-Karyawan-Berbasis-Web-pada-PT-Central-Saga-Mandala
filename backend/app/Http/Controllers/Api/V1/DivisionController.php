<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DivisionResource;
use App\Models\Division;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class DivisionController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $divisions = Division::all();
            return response()->json([
                'success' => true,
                'message' => 'Daftar divisi berhasil diambil.',
                'data'    => DivisionResource::collection($divisions),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data divisi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $division = Division::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil dibuat.',
                'data'    => new DivisionResource($division),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat divisi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $division = Division::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail divisi berhasil ditemukan.',
                'data'    => new DivisionResource($division),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Divisi tidak ditemukan.'], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $division = Division::findOrFail($id);
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $division->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil diperbarui.',
                'data'    => new DivisionResource($division),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $division = Division::findOrFail($id);
            $division->delete();

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil dihapus.',
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
