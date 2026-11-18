<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ResetAforoTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id_rol');
            $table->string('nombre')->unique();
        });

        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->unsignedInteger('id_rol');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->boolean('activo')->default(true);
            $table->dateTime('fecha_registro')->nullable();
        });

        Schema::create('charlas', function (Blueprint $table) {
            $table->increments('id_charla');
            $table->unsignedInteger('id_organizador');
            $table->unsignedInteger('id_sala');
        });

        Schema::create('reservas', function (Blueprint $table) {
            $table->increments('id_reserva');
            $table->unsignedInteger('id_usuario');
            $table->unsignedInteger('id_charla');
            $table->string('estado');
        });
    }

    public function test_only_managers_can_cancel_active_reservations_for_all_talks(): void
    {
        $organizadorRole = Role::create(['nombre' => 'organizador']);
        $asistenteRole = Role::create(['nombre' => 'asistente']);
        $organizador = $this->createUser($organizadorRole->id_rol, 'organizador@example.test');
        $asistente = $this->createUser($asistenteRole->id_rol, 'asistente@example.test');

        DB::table('charlas')->insert([
            'id_charla' => 1,
            'id_organizador' => $organizador->id_usuario,
            'id_sala' => 1,
        ]);
        DB::table('reservas')->insert([
            ['id_reserva' => 1, 'id_usuario' => $asistente->id_usuario, 'id_charla' => 1, 'estado' => 'confirmada'],
            ['id_reserva' => 2, 'id_usuario' => $asistente->id_usuario, 'id_charla' => 1, 'estado' => 'cancelada'],
        ]);

        $this->actingAs($asistente)
            ->deleteJson('/api/reservas/aforo')
            ->assertForbidden();

        $this->actingAs($organizador)
            ->deleteJson('/api/reservas/aforo')
            ->assertOk()
            ->assertJsonPath('reservas_canceladas', 1);

        $this->assertDatabaseHas('reservas', ['id_reserva' => 1, 'estado' => 'cancelada']);
        $this->assertDatabaseHas('reservas', ['id_reserva' => 2, 'estado' => 'cancelada']);
    }

    private function createUser(int $roleId, string $email): User
    {
        return User::create([
            'id_rol' => $roleId,
            'nombre' => 'Usuario',
            'apellidos' => 'Demo',
            'email' => $email,
            'password_hash' => Hash::make('password'),
            'activo' => true,
        ]);
    }
}
