<?php

use App\Models\Charla;
use Illuminate\Support\Facades\Route;

Route::get('/charlas', function () {
    return Charla::query()->get([
        'id_charla',
        'titulo',
        'descripcion',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'aforo_maximo',
    ]);
});
