<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDivisionRequest;
use App\Http\Requests\UpdateDivisionRequest;
use App\Http\Resources\DivisionResource;
use App\Models\Division;
use App\Services\Contracts\DivisionServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Throwable;

class DivisionController extends Controller
{
    protected DivisionServiceInterface $divisionService;

    public function __construct(DivisionServiceInterface $divisionService)
    {
        $this->divisionService = $divisionService;
    }

    public function index(): JsonResponse
    {
        try {
            $divisions = $this->divisionService->getAllDivisions();
            return response()->json([
                'success' => true,
                'message' => 'Daftar divisi berhasil diambil.',
                'data'    => DivisionResource::collection($divisions),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreDivisionRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Division::class);
            $division = $this->divisionService->createDivision($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil dibuat.',
                'data'    => new DivisionResource($division),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $division = $this->divisionService->getDivisionById($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail divisi berhasil ditemukan.',
                'data'    => new DivisionResource($division),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Divisi tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateDivisionRequest $request, int $id): JsonResponse
    {
        try {
            $division = $this->divisionService->getDivisionById($id);
            $this->authorize('update', $division);

            $updated = $this->divisionService->updateDivision($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil diperbarui.',
                'data'    => new DivisionResource($updated),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Divisi tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $division = $this->divisionService->getDivisionById($id);
            $this->authorize('delete', $division);

            $this->divisionService->deleteDivision($id);

            return response()->json([
                'success' => true,
                'message' => 'Divisi berhasil dihapus.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Divisi tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
