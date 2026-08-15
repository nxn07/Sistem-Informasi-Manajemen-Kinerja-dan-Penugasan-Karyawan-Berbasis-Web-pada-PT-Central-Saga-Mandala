<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\SubmitTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\Contracts\TaskServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class TaskController extends Controller
{
    protected TaskServiceInterface $taskService;

    public function __construct(TaskServiceInterface $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Task::class);

            $tasks = $this->taskService->getAllTasks();
            return response()->json([
                'success' => true,
                'message' => 'Daftar tugas berhasil diambil.',
                'data'    => TaskResource::collection($tasks),
            ], 200);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Task::class);

            $task = $this->taskService->assignTask($request->validated(), $request->user()->id);

            return response()->json([
                'success' => true,
                'message' => 'Tugas berhasil dibuat dan ditugaskan.',
                'data'    => new TaskResource($task),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);
            $this->authorize('view', $task);

            return response()->json([
                'success' => true,
                'message' => 'Detail tugas berhasil ditemukan.',
                'data'    => new TaskResource($task),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function submit(SubmitTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);
            $this->authorize('submit', $task);

            $submissionData = $request->validated();

            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('submissions', 'public');
                $submissionData['file_path'] = $path;
                $submissionData['submission_file'] = $path;
            }

            $submission = $this->taskService->submitTask($task, $submissionData);

            return response()->json([
                'success' => true,
                'message' => 'Tugas berhasil dikumpulkan.',
                'data'    => $submission,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function review(ReviewTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);
            $this->authorize('review', $task);

            $data = $request->validated();
            $this->taskService->reviewTask(
                $task,
                $data['status'],
                $data['notes'] ?? $data['review_notes'] ?? null,
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Status tugas berhasil diperbarui.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
