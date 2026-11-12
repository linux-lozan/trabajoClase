<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            'administrador' => 'Gestión completa del sistema',
            'organizador' => 'Crea y gestiona charlas',
            'personal' => 'Valida la entrada mediante QR',
            'asistente' => 'Usuario que reserva plaza en charlas',
        ];

        foreach ($roles as $nombre => $descripcion) {
            Role::updateOrCreate(
                ['nombre' => $nombre],
                ['descripcion' => $descripcion],
            );
        }

        $role = Role::where('nombre', 'administrador')->firstOrFail();

        User::firstOrCreate(
            ['email' => 'test@gmail.com'],
            [
                'id_rol' => $role->id_rol,
                'nombre' => 'Test',
                'apellidos' => 'User',
                'password_hash' => Hash::make('1234'),
                'fecha_registro' => now(),
                'activo' => true,
            ],
        );

        $this->call(CharlasDemoSeeder::class);
    }
}
