<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id_rol');
            $table->string('nombre', 50)->unique();
            $table->string('descripcion')->nullable();
        });

        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->unsignedInteger('id_rol');
            $table->string('nombre', 100);
            $table->string('apellidos', 150);
            $table->string('email', 150)->unique();
            $table->string('password_hash');
            $table->boolean('activo')->default(true);
            $table->dateTime('fecha_registro')->nullable();
        });
    }

    public function test_user_can_log_in_and_read_their_account(): void
    {
        $user = $this->createUser();

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('email', $user->email);

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('nombre', $user->nombre);
    }

    public function test_csrf_cookie_endpoint_returns_a_token(): void
    {
        $this->get('/api/csrf-cookie')->assertNoContent()->assertCookie('XSRF-TOKEN');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $user = $this->createUser();

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'incorrecta',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_inactive_users_cannot_log_in(): void
    {
        $user = $this->createUser(['activo' => false]);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertUnprocessable();
    }

    public function test_user_can_log_out(): void
    {
        $user = $this->createUser();
        $this->actingAs($user);

        $this->postJson('/api/logout')->assertNoContent();
        $this->getJson('/api/user')->assertUnauthorized();
    }

    private function createUser(array $attributes = []): User
    {
        $role = Role::create(['nombre' => 'asistente']);

        return User::create(array_merge([
            'id_rol' => $role->id_rol,
            'nombre' => 'Ada',
            'apellidos' => 'Lovelace',
            'email' => 'ada@example.test',
            'password_hash' => Hash::make('password123'),
            'activo' => true,
        ], $attributes));
    }
}
