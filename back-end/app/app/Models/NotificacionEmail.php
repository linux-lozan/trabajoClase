<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_reserva', 'destinatario', 'tipo', 'fecha_envio', 'estado_envio', 'error'])]
class NotificacionEmail extends Model
{
    protected $table = 'notificaciones_email';

    protected $primaryKey = 'id_email';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'fecha_envio' => 'datetime',
        ];
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }
}
