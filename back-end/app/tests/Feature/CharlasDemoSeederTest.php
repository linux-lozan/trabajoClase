<?php

namespace Tests\Feature;

use App\Models\Charla;
use Database\Seeders\CharlasDemoSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CharlasDemoSeederTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id_rol');
            $table->string('nombre')->unique();
            $table->string('descripcion')->nullable();
        });

        Schema::create('salas', function (Blueprint $table) {
            $table->increments('id_sala');
            $table->string('nombre')->unique();
            $table->string('ubicacion')->nullable();
            $table->unsignedInteger('capacidad')->nullable();
        });

        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->unsignedInteger('id_rol');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->dateTime('fecha_registro')->nullable();
            $table->boolean('activo')->default(true);
        });

        Schema::create('charlas', function (Blueprint $table) {
            $table->increments('id_charla');
            $table->unsignedInteger('id_organizador');
            $table->unsignedInteger('id_sala');
            $table->string('titulo')->unique();
            $table->text('descripcion')->nullable();
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->unsignedInteger('aforo_maximo');
            $table->string('estado');
        });
    }

    public function test_reseeding_updates_existing_demo_talks_without_duplicates(): void
    {
        $this->seed(CharlasDemoSeeder::class);

        Charla::where('titulo', 'React para principiantes')
            ->update(['aforo_maximo' => 20]);

        $this->seed(CharlasDemoSeeder::class);

        $this->assertDatabaseHas('charlas', [
            'titulo' => 'React para principiantes',
            'aforo_maximo' => 1,
        ]);
        $this->assertSame(
            1,
            Charla::where('titulo', 'React para principiantes')->count(),
        );
    }
}
