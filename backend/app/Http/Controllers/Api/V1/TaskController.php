<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\SubmitTaskRequest;
use App\Http\Requests\ReviewTaskRequest;
use App\Http\Resources\TaskResource;
use App\Repositories\TaskRepository;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected TaskRepository $taskRepository;
    protected TaskService $taskService;

    public function __construct(TaskRepository $taskRepository, TaskService $taskService)
    {
        $this->taskRepository = $taskRepository;
        $this->taskService = $taskService;

        // Proteksi Otorisasi Permission (Hapus 'index' dari can:tasks.view_all)
        $this->middleware('can:tasks.create')->only(['store']);
        $this->middleware('can:tasks.submit')->only(['submit']);
        $this->middleware('can:tasks.review')->only(['review']);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $tasks = \App\Models\Task::with(['employee', 'submissions'])->latest()->get();
        } elseif ($user->hasRole('manager')) {
            $divisionId = $user->employee->division_id ?? 0;
            $tasks = $this->taskRepository->getAllByDivision($divisionId);
        } else {
            // Employee dapat melihat tugas yang di-assign ke dirinya sendiri
            $employeeId = $user->employee->id ?? 0;
            $tasks = $this->taskRepository->getByEmployeeId($employeeId);
        }

        return response()->json([
            'success' => true,
            'data'    => TaskResource::collection($tasks),
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->assignTask($request->validated(), $request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Tugas berhasil diberikan.',
            'data'    => new TaskResource($task),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $task = $this->taskRepository->findById($id);

        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new TaskResource($task),
        ]);
    }

    public function submit(SubmitTaskRequest $request, $id): JsonResponse
    {
        $task = $this->taskRepository->findById($id);

        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        }

        $data = $request->validated();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            $data['file_path'] = $path;
        }

        $submission = $this->taskService->submitTask($task, $data);

        return response()->json([
            'success' => true,
            'message' => 'Tugas berhasil dikumpulkan.',
            'data'    => $submission,
        ]);
    }

    public function review(ReviewTaskRequest $request, $id): JsonResponse
    {
        $task = $this->taskRepository->findById($id);

        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        }

        $this->taskService->reviewTask(
            $task,
            $request->status,
            $request->review_notes,
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Review tugas berhasil disimpan.',
        ]);
    }
}