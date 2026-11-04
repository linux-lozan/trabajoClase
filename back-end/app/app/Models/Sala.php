<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'ubicacion', 'capacidad'])]
class Sala extends Model
{
    protected $table = 'salas';

    protected $primaryKey = 'id_sala';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'capacidad' => 'integer',
        ];
    }

    public function talks(): HasMany
    {
        return $this->hasMany(Charla::class, 'id_sala', 'id_sala');
    }
}
