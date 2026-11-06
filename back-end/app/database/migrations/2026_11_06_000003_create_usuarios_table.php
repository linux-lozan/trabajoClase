<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('usuarios')) {
            return;
        }

        Schema::create('usuarios', function (Blueprint $table) {
            $table->unsignedInteger('id_usuario')->primary()->autoIncrement();
            $table->unsignedInteger('id_rol');
            $table->string('nombre', 100);
            $table->string('apellidos', 150);
            $table->string('email', 150)->unique();
            $table->string('password_hash', 255);
            $table->dateTime('fecha_registro')->useCurrent();
            $table->boolean('activo')->default(true);

            $table->foreign('id_rol')->references('id_rol')->on('roles')->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
