<?php

namespace Tests\Feature;

use App\Models\Charla;
use App\Models\Ponente;
use App\Models\Role;
use App\Models\Sala;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_talks_are_available_in_the_catalog(): void
    {
        $talk = $this->createTalk();

        $this->getJson('/api/charlas')
            ->assertOk()
            ->assertJsonPath('data.0.id_charla', $talk->id_charla)
            ->assertJsonPath('data.0.titulo', $talk->titulo)
            ->assertJsonPath('data.0.ponentes.0.nombre', 'Ada');
    }

    public function test_a_user_can_register_and_reserve_a_talk(): void
    {
        $talk = $this->createTalk();

        $this->postJson('/api/register', [
            'nombre' => 'Grace',
            'apellidos' => 'Hopper',
            'email' => 'grace@example.com',
            'password' => 'secure-pass-123',
        ])->assertCreated()
            ->assertJsonPath('data.email', 'grace@example.com');

        $reservation = $this->postJson("/api/charlas/{$talk->id_charla}/reservas")
            ->assertCreated()
            ->assertJsonPath('data.estado', 'confirmada');

        $reservationId = $reservation->json('data.id_reserva');

        $this->getJson('/api/reservas')
            ->assertOk()
            ->assertJsonPath('data.0.id_reserva', $reservationId)
            ->assertJsonPath('data.0.charla.titulo', $talk->titulo);

        $this->deleteJson("/api/reservas/{$reservationId}")
            ->assertOk()
            ->assertJsonPath('data.estado', 'cancelada');

        $this->assertDatabaseHas('reservas', [
            'id_reserva' => $reservationId,
            'estado' => 'cancelada',
        ]);
    }

    public function test_a_user_can_log_in_and_read_the_session_user(): void
    {
        $user = $this->createUser('login@example.com', 'asistente');

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data', null);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secure-pass-123',
        ])->assertOk()
            ->assertJsonPath('data.id_usuario', $user->id_usuario);

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_anonymous_users_cannot_reserve_and_duplicate_reservations_are_rejected(): void
    {
        $talk = $this->createTalk();

        $this->postJson("/api/charlas/{$talk->id_charla}/reservas")
            ->assertUnauthorized();

        $user = $this->createUser('attendee@example.com', 'asistente');
        $this->actingAs($user);

        $this->postJson("/api/charlas/{$talk->id_charla}/reservas")->assertCreated();
        $this->postJson("/api/charlas/{$talk->id_charla}/reservas")
            ->assertStatus(409)
            ->assertJsonPath('message', 'Ya tienes una reserva activa para esta charla.');
    }

    public function test_a_talk_cannot_be_reserved_beyond_its_capacity(): void
    {
        $talk = $this->createTalk(1);
        $this->actingAs($this->createUser('first@example.com', 'asistente'));
        $this->postJson("/api/charlas/{$talk->id_charla}/reservas")->assertCreated();

        $this->actingAs($this->createUser('second@example.com', 'asistente'));
        $this->postJson("/api/charlas/{$talk->id_charla}/reservas")
            ->assertStatus(409)
            ->assertJsonPath('message', 'La charla está completa.');
    }

    private function createTalk(int $capacity = 10): Charla
    {
        $organizer = $this->createUser('organizer@example.com', 'organizador');
        $room = Sala::query()->create([
            'nombre' => 'Auditorio',
            'ubicacion' => 'Planta 1',
            'capacidad' => $capacity,
        ]);
        $speaker = Ponente::query()->create([
            'nombre' => 'Ada',
            'apellidos' => 'Lovelace',
            'biografia' => 'Pionera de la informática.',
        ]);
        $talk = Charla::query()->create([
            'id_organizador' => $organizer->id_usuario,
            'id_sala' => $room->id_sala,
            'titulo' => 'Tecnología y futuro',
            'descripcion' => 'Una charla de prueba.',
            'fecha' => '2026-12-01',
            'hora_inicio' => '10:00:00',
            'hora_fin' => '11:00:00',
            'aforo_maximo' => $capacity,
            'estado' => 'publicada',
        ]);
        $talk->ponentes()->attach($speaker->id_ponente);

        return $talk;
    }

    private function createUser(string $email, string $roleName): User
    {
        $role = Role::query()->where('nombre', $roleName)->firstOrFail();

        return User::query()->create([
            'id_rol' => $role->id_rol,
            'nombre' => 'Test',
            'apellidos' => 'User',
            'email' => $email,
            'password_hash' => 'secure-pass-123',
            'fecha_registro' => now(),
            'activo' => true,
        ]);
    }
}
