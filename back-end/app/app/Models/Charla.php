<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'id_organizador',
    'id_sala',
    'titulo',
    'descripcion',
    'fecha',
    'hora_inicio',
    'hora_fin',
    'aforo_maximo',
    'estado',
])]
class Charla extends Model
{
    protected $table = 'charlas';

    protected $primaryKey = 'id_charla';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'aforo_maximo' => 'integer',
        ];
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_organizador', 'id_usuario');
    }

    public function sala(): BelongsTo
    {
        return $this->belongsTo(Sala::class, 'id_sala', 'id_sala');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reserva::class, 'id_charla', 'id_charla');
    }

    public function ponentes(): BelongsToMany
    {
        return $this->belongsToMany(Ponente::class, 'charla_ponente', 'id_charla', 'id_ponente');
    }
}
