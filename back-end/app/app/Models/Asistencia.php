<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_reserva', 'id_usuario_validador', 'fecha_hora_acceso', 'resultado', 'observaciones'])]
class Asistencia extends Model
{
    protected $table = 'asistencias';

    protected $primaryKey = 'id_asistencia';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'fecha_hora_acceso' => 'datetime',
        ];
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario_validador', 'id_usuario');
    }
}
