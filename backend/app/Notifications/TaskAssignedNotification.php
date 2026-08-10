<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification
{
    use Queueable;

    protected Task $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // In-App Notification
    }

    public function toArray(object $notifiable): array
    {
        return [
            'task_id'    => $this->task->id,
            'title'      => $this->task->title,
            'due_date'   => $this->task->due_date,
            'message'    => "Tugas baru '{$this->task->title}' telah diberikan. Deadline: {$this->task->due_date}.",
        ];
    }
}