<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach ([
            ['nombre' => 'administrador', 'descripcion' => 'Gestión completa del sistema'],
            ['nombre' => 'organizador', 'descripcion' => 'Crea y gestiona charlas'],
            ['nombre' => 'personal', 'descripcion' => 'Valida la entrada mediante QR'],
            ['nombre' => 'asistente', 'descripcion' => 'Usuario que reserva plaza en charlas'],
        ] as $role) {
            Role::query()->firstOrCreate(['nombre' => $role['nombre']], ['descripcion' => $role['descripcion']]);
        }
    }
}
