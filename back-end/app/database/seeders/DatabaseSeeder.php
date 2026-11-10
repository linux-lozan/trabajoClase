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
        $role = Role::firstOrCreate(
            ['nombre' => 'administrador'],
            ['descripcion' => 'Gestión completa del sistema'],
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'id_rol' => $role->id_rol,
                'nombre' => 'Test',
                'apellidos' => 'User',
                'password_hash' => Hash::make('password'),
                'fecha_registro' => now(),
                'activo' => true,
            ],
        );

        $this->call(CharlasDemoSeeder::class);
    }
}
