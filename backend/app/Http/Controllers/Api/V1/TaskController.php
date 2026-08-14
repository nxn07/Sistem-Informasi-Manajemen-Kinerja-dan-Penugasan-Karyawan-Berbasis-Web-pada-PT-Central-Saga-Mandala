<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\SubmitTaskRequest;
use App\Http\Requests\ReviewTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskSubmissionResource;
use App\Services\Contracts\TaskServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Throwable;

class TaskController extends Controller implements HasMiddleware
{
    /**
     * @var TaskServiceInterface
     */
    protected TaskServiceInterface $taskService;

    public function __construct(TaskServiceInterface $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Pendaftaran Middleware Standar Laravel 11
     */
    public static function middleware(): array
    {
        return [
            (new Middleware('can:tasks.create'))->only(['store']),
            (new Middleware('can:tasks.submit'))->only(['submit']),
            (new Middleware('can:tasks.review'))->only(['review']),
        ];
    }

    /**
     * Display a listing of the tasks.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user && method_exists($user, 'hasRole') && $user->hasRole('admin')) {
                $tasks = $this->taskService->getAllTasks();
            } else {
                // Diambil via Service Layer untuk menjaga isolasi
                $tasks = $this->taskService->getAllTasks();
            }

            return response()->json([
                'success' => true,
                'message' => 'Daftar tugas berhasil diambil.',
                'data'    => TaskResource::collection($tasks),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data tugas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->assignTask($request->validated(), $request->user()->id);

            return response()->json([
                'success' => true,
                'message' => 'Tugas berhasil diberikan.',
                'data'    => new TaskResource($task),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat tugas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified task.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);

            return response()->json([
                'success' => true,
                'message' => 'Detail tugas berhasil ditemukan.',
                'data'    => new TaskResource($task),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tugas tidak ditemukan.',
            ], 404);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil tugas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit task by employee.
     */
    public function submit(SubmitTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);
            $data = $request->validated();

            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('submissions', 'public');
                $data['file_path'] = $path;
            }

            $submission = $this->taskService->submitTask($task, $data);

            return response()->json([
                'success' => true,
                'message' => 'Tugas berhasil dikumpulkan.',
                'data'    => new TaskSubmissionResource($submission),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tugas tidak ditemukan.',
            ], 404);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengumpulkan tugas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Review task submission by manager/admin.
     */
    public function review(ReviewTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id);

            $this->taskService->reviewTask(
                $task,
                $request->status,
                $request->review_notes,
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Review tugas berhasil disimpan.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tugas tidak ditemukan.',
            ], 404);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses review tugas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
