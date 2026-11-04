<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['id_rol', 'nombre', 'apellidos', 'email', 'password_hash', 'fecha_registro', 'activo'])]
#[Hidden(['password_hash'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $timestamps = false;

    protected $authPasswordName = 'password_hash';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_registro' => 'datetime',
            'activo' => 'boolean',
            'password_hash' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'id_rol', 'id_rol');
    }

    public function organizedTalks(): HasMany
    {
        return $this->hasMany(Charla::class, 'id_organizador', 'id_usuario');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reserva::class, 'id_usuario', 'id_usuario');
    }

    public function validatedAttendances(): HasMany
    {
        return $this->hasMany(Asistencia::class, 'id_usuario_validador', 'id_usuario');
    }
}
