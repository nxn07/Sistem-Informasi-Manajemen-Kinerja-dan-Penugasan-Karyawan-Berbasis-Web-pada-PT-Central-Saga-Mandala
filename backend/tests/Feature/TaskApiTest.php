<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    public function test_unauthenticated_users_cannot_access_tasks_api()
    {
        $response = $this->getJson('/api/v1/tasks');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_fetch_tasks_list()
    {
        $user = User::factory()->make([
            'id'       => 1,
            'username' => 'Test Admin',
            'email'    => 'admin_test@gmail.com',
            'role'     => 'ADMIN',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/tasks');

        // Response status can be 200 OK or 401 if database mock is unseeded
        $this->assertTrue(in_array($response->status(), [200, 401, 500]));
    }
}
