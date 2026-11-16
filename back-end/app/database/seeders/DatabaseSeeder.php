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

        $adminRole = Role::where('nombre', 'administrador')->firstOrFail();
        $admin = User::firstOrNew(['email' => 'admin@gmail.com']);
        if (! $admin->exists) {
            $admin = User::firstOrNew(['email' => 'test@gmail.com']);
        }

        if (! $admin->exists) {
            $admin->password_hash = Hash::make('1234');
            $admin->fecha_registro = now();
        }

        $admin->fill([
            'id_rol' => $adminRole->id_rol,
            'nombre' => 'Admin',
            'apellidos' => 'User',
            'email' => 'admin@gmail.com',
            'activo' => true,
        ]);
        $admin->save();

        $userRole = Role::where('nombre', 'asistente')->firstOrFail();
        User::firstOrCreate(
            ['email' => 'usuario@gmail.com'],
            [
                'id_rol' => $userRole->id_rol,
                'nombre' => 'Usuario',
                'apellidos' => '',
                'password_hash' => Hash::make('1234'),
                'fecha_registro' => now(),
                'activo' => true,
            ],
        );

        $this->call(CharlasDemoSeeder::class);
        $this->call(CharlaAforoCompletoSeeder::class);
    }
}
