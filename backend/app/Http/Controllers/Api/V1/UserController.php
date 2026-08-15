<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class UserController extends Controller
{
    protected UserServiceInterface $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        try {
            $users = $this->userService->getAllUsers();
            return response()->json([
                'success' => true,
                'message' => 'Daftar pengguna berhasil diambil.',
                'data'    => UserResource::collection($users),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengguna: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'username'              => 'required_without:name|string|max:255',
                'name'                  => 'nullable|string|max:255',
                'email'                 => 'required|string|email|max:255|unique:users,email',
                'password'              => 'required|string|min:6|confirmed',
                'role'                  => 'nullable|string',
                'division_id'           => 'nullable|integer|exists:divisions,id',
            ]);

            // Dukung input 'username' maupun 'name'
            $data = $request->all();
            if (!isset($data['username']) && isset($data['name'])) {
                $data['username'] = $data['name'];
            }

            $user = $this->userService->createUser($data);

            return response()->json([
                'success' => true,
                'message' => 'Pengguna berhasil dibuat.',
                'data'    => new UserResource($user),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pengguna: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            return response()->json([
                'success' => true,
                'message' => 'Detail pengguna berhasil ditemukan.',
                'data'    => new UserResource($user),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'username'    => 'nullable|string|max:255',
                'name'        => 'nullable|string|max:255',
                'email'       => 'nullable|string|email|max:255|unique:users,email,' . $id,
                'password'    => 'nullable|string|min:6|confirmed',
                'role'        => 'nullable|string',
                'division_id' => 'nullable|integer|exists:divisions,id',
            ]);

            $data = $request->all();
            if (!isset($data['username']) && isset($data['name'])) {
                $data['username'] = $data['name'];
            }

            $user = $this->userService->updateUser($id, $data);

            return response()->json([
                'success' => true,
                'message' => 'Pengguna berhasil diperbarui.',
                'data'    => new UserResource($user),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json([
                'success' => true,
                'message' => 'Pengguna berhasil dihapus.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
