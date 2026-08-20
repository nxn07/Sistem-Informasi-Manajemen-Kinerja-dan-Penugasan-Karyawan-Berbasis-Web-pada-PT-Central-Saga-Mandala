<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Services\Contracts\EmployeeServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EmployeeController extends Controller
{
    protected EmployeeServiceInterface $employeeService;

    public function __construct(EmployeeServiceInterface $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(): JsonResponse
    {
        try {
            $employees = $this->employeeService->getAllEmployees();
            return response()->json([
                'success' => true,
                'message' => 'Daftar karyawan berhasil diambil.',
                'data'    => EmployeeResource::collection($employees),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data karyawan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id'     => 'required|exists:users,id',
                'division_id' => 'required|exists:divisions,id',
                'position'    => 'required|string|max:255',
                'phone'       => 'nullable|string',
            ]);

            $employee = $this->employeeService->createEmployee($validated);

            return response()->json([
                'success' => true,
                'message' => 'Karyawan berhasil ditambahkan.',
                'data'    => new EmployeeResource($employee),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan karyawan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->getEmployeeById($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail karyawan berhasil ditemukan.',
                'data'    => new EmployeeResource($employee),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Karyawan tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->updateEmployee($id, $request->all());
            return response()->json([
                'success' => true,
                'message' => 'Data karyawan berhasil diperbarui.',
                'data'    => new EmployeeResource($employee),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Karyawan tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->employeeService->deleteEmployee($id);
            return response()->json([
                'success' => true,
                'message' => 'Karyawan berhasil dihapus.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Karyawan tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
