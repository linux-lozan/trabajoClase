<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['id_usuario', 'id_charla', 'fecha_reserva', 'estado', 'observaciones'])]
class Reserva extends Model
{
    protected $table = 'reservas';

    protected $primaryKey = 'id_reserva';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'fecha_reserva' => 'datetime',
            'reserva_activa' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function charla(): BelongsTo
    {
        return $this->belongsTo(Charla::class, 'id_charla', 'id_charla');
    }

    public function asistencia(): HasOne
    {
        return $this->hasOne(Asistencia::class, 'id_reserva', 'id_reserva');
    }

    public function emailNotifications(): HasMany
    {
        return $this->hasMany(NotificacionEmail::class, 'id_reserva', 'id_reserva');
    }
}
