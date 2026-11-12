<?php

namespace Database\Seeders;

use App\Models\Charla;
use App\Models\Role;
use App\Models\Sala;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Datos de demostración compartidos por todo el equipo.
 *
 * Se puede ejecutar tantas veces como haga falta: busca cada registro por un
 * campo identificativo y solo lo crea si no existe, así que no duplica filas.
 */
class CharlasDemoSeeder extends Seeder
{
    public function run(): void
    {
        $rolOrganizador = Role::firstOrCreate(
            ['nombre' => 'organizador'],
            ['descripcion' => 'Crea y gestiona charlas'],
        );

        $organizador = User::firstOrCreate(
            ['email' => 'organizador@gmail.com'],
            [
                'id_rol' => $rolOrganizador->id_rol,
                'nombre' => 'AdiTech',
                'apellidos' => 'AdiTech',
                'password_hash' => '1234',
                'fecha_registro' => now(),
                'activo' => true,
            ],
        );

        $salas = [];
        foreach (
            [
                ['nombre' => 'Auditorio principal', 'ubicacion' => 'Planta baja', 'capacidad' => 150],
                ['nombre' => 'Sala Turing', 'ubicacion' => 'Primera planta, aula 1.2', 'capacidad' => 40],
                ['nombre' => 'Sala Lovelace', 'ubicacion' => 'Primera planta, aula 1.5', 'capacidad' => 30],
            ] as $datos
        ) {
            $salas[$datos['nombre']] = Sala::firstOrCreate(
                ['nombre' => $datos['nombre']],
                $datos,
            );
        }

        $charlas = [
            [
                'titulo' => 'Introducción a Laravel',
                'descripcion' => 'Rutas, controladores y Eloquent desde cero.',
                'sala' => 'Auditorio principal',
                'fecha' => '2026-12-01',
                'hora_inicio' => '10:00:00',
                'hora_fin' => '11:30:00',
                'aforo_maximo' => 120,
                'estado' => 'publicada',
            ],
            [
                'titulo' => 'React para principiantes',
                'descripcion' => 'Componentes, estado y consumo de una API REST.',
                'sala' => 'Sala Turing',
                'fecha' => '2026-12-01',
                'hora_inicio' => '12:00:00',
                'hora_fin' => '13:30:00',
                'aforo_maximo' => 40,
                'estado' => 'publicada',
            ],
            [
                'titulo' => 'Docker en el día a día',
                'descripcion' => 'Contenedores, volúmenes y Compose para desarrollo web.',
                'sala' => 'Sala Lovelace',
                'fecha' => '2026-12-02',
                'hora_inicio' => '10:00:00',
                'hora_fin' => '11:00:00',
                'aforo_maximo' => 30,
                'estado' => 'publicada',
            ],
            [
                'titulo' => 'Seguridad en aplicaciones web',
                'descripcion' => 'OWASP Top 10, cabeceras HTTP y buenas prácticas.',
                'sala' => 'Auditorio principal',
                'fecha' => '2026-12-02',
                'hora_inicio' => '12:00:00',
                'hora_fin' => '13:30:00',
                'aforo_maximo' => 150,
                'estado' => 'publicada',
            ],
            [
                'titulo' => 'Taller de Git en equipo',
                'descripcion' => 'Ramas, pull requests y resolución de conflictos.',
                'sala' => 'Sala Turing',
                'fecha' => '2026-12-03',
                'hora_inicio' => '16:00:00',
                'hora_fin' => '18:00:00',
                'aforo_maximo' => 35,
                'estado' => 'borrador',
            ],
        ];

        foreach ($charlas as $datos) {
            $sala = $salas[$datos['sala']];
            unset($datos['sala']);

            Charla::firstOrCreate(
                ['titulo' => $datos['titulo']],
                $datos + [
                    'id_organizador' => $organizador->id_usuario,
                    'id_sala' => $sala->id_sala,
                ],
            );
        }
    }
}
