<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\TaskService;
use App\Services\TaskSubmissionService;
use Mockery;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    public function test_get_all_tasks_returns_collection_from_repository()
    {
        $taskRepositoryMock = Mockery::mock(TaskRepositoryInterface::class);
        $submissionServiceMock = Mockery::mock(TaskSubmissionService::class);

        $taskRepositoryMock->shouldReceive('getAll')
            ->once()
            ->andReturn(collect([new Task(['title' => 'Test Task'])]));

        $taskService = new TaskService($taskRepositoryMock, $submissionServiceMock);

        $result = $taskService->getAllTasks();

        $this->assertCount(1, $result);
        $this->assertEquals('Test Task', $result->first()->title);
    }

    public function test_get_task_by_id_returns_task_instance()
    {
        $taskRepositoryMock = Mockery::mock(TaskRepositoryInterface::class);
        $submissionServiceMock = Mockery::mock(TaskSubmissionService::class);

        $task = new Task(['title' => 'Task #1']);
        $task->id = 1;

        $taskRepositoryMock->shouldReceive('findById')
            ->with(1)
            ->once()
            ->andReturn($task);

        $taskService = new TaskService($taskRepositoryMock, $submissionServiceMock);

        $result = $taskService->getTaskById(1);

        $this->assertEquals(1, $result->id);
        $this->assertEquals('Task #1', $result->title);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
