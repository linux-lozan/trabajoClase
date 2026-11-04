<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'nombre',
    'apellidos',
    'email',
    'biografia',
    'especialidad',
    'cargo',
    'experiencia',
    'especializacion',
    'temas',
    'tecnologias',
])]
class Ponente extends Model
{
    protected $table = 'ponentes';

    protected $primaryKey = 'id_ponente';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'experiencia' => 'integer',
            'temas' => 'array',
            'tecnologias' => 'array',
        ];
    }

    public function charlas(): BelongsToMany
    {
        return $this->belongsToMany(Charla::class, 'charla_ponente', 'id_ponente', 'id_charla');
    }
}
