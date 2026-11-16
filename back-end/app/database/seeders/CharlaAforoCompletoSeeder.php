<?php

namespace Database\Seeders;

use App\Models\Charla;
use App\Models\Reserva;
use App\Models\Role;
use App\Models\Sala;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Charla de prueba con el aforo lleno, para comprobar que no se puede reservar
 * plaza cuando ya no quedan.
 *
 * Crea una charla publicada con aforo 2 y dos asistentes de prueba que ocupan
 * esas dos plazas. Se puede ejecutar varias veces sin duplicar nada:
 *   php artisan db:seed --class=CharlaAforoCompletoSeeder
 */
class CharlaAforoCompletoSeeder extends Seeder
{
    public function run(): void
    {
        $rolAsistente = Role::firstOrCreate(
            ['nombre' => 'asistente'],
            ['descripcion' => 'Usuario que reserva plaza en charlas'],
        );

        $organizador = User::whereHas('role', fn ($q) => $q->where('nombre', 'organizador'))->first()
            ?? User::query()->orderBy('id_usuario')->firstOrFail();

        $sala = Sala::firstOrCreate(
            ['nombre' => 'Sala Lovelace'],
            ['ubicacion' => 'Primera planta, aula 1.5', 'capacidad' => 30],
        );

        $charla = Charla::firstOrCreate(
            ['titulo' => 'Charla de prueba: aforo completo'],
            [
                'descripcion' => 'Charla con todas las plazas ocupadas para probar que no se puede reservar.',
                'id_organizador' => $organizador->id_usuario,
                'id_sala' => $sala->id_sala,
                'fecha' => '2026-12-03',
                'hora_inicio' => '10:00:00',
                'hora_fin' => '11:00:00',
                'aforo_maximo' => 2,
                'estado' => 'publicada',
            ],
        );

        foreach (
            [
                ['email' => 'asistente1@aditech.test', 'nombre' => 'Asistente', 'apellidos' => 'Prueba Uno'],
                ['email' => 'asistente2@aditech.test', 'nombre' => 'Asistente', 'apellidos' => 'Prueba Dos'],
            ] as $datos
        ) {
            $asistente = User::firstOrCreate(
                ['email' => $datos['email']],
                $datos + [
                    'id_rol' => $rolAsistente->id_rol,
                    'password_hash' => Hash::make('1234'),
                    'fecha_registro' => now(),
                    'activo' => true,
                ],
            );

            Reserva::firstOrCreate(
                ['id_usuario' => $asistente->id_usuario, 'id_charla' => $charla->id_charla, 'estado' => 'confirmada'],
            );
        }
    }
}
