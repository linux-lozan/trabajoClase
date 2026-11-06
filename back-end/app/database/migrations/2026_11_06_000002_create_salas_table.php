<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('salas')) {
            return;
        }

        Schema::create('salas', function (Blueprint $table) {
            $table->unsignedInteger('id_sala')->primary()->autoIncrement();
            $table->string('nombre', 100);
            $table->string('ubicacion', 255)->nullable();
            $table->unsignedInteger('capacidad');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salas');
    }
};
