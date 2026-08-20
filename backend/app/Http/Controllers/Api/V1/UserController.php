<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
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
            $this->authorize('viewAny', User::class);

            $users = $this->userService->getAllUsers();
            return response()->json([
                'success' => true,
                'message' => 'Daftar user berhasil diambil.',
                'data'    => UserResource::collection($users),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', User::class);

            $user = $this->userService->createUser($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'User berhasil dibuat.',
                'data'    => new UserResource($user),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $this->authorize('view', $user);

            return response()->json([
                'success' => true,
                'message' => 'Detail user berhasil ditemukan.',
                'data'    => new UserResource($user),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $this->authorize('update', $user);

            $updated = $this->userService->updateUser($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'User berhasil diperbarui.',
                'data'    => new UserResource($updated),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $this->authorize('delete', $user);

            $this->userService->deleteUser($id);
            return response()->json([
                'success' => true,
                'message' => 'User berhasil dihapus.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
