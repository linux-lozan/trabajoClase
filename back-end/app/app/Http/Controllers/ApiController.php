<?php

namespace App\Http\Controllers;

use App\Models\Charla;
use App\Models\Ponente;
use App\Models\Reserva;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    public function talks(): JsonResponse
    {
        $talks = Charla::query()
            ->where('estado', 'publicada')
            ->with(['sala', 'ponentes'])
            ->withCount([
                'reservations as reservas_activas_count' => fn ($query) => $query->whereIn('estado', ['pendiente', 'confirmada']),
            ])
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->map(fn (Charla $talk): array => $this->talkData($talk));

        return response()->json(['data' => $talks]);
    }

    public function speakers(): JsonResponse
    {
        $speakers = Ponente::query()
            ->with(['charlas' => fn ($query) => $query->where('estado', 'publicada')])
            ->orderBy('apellidos')
            ->orderBy('nombre')
            ->get()
            ->map(fn (Ponente $speaker): array => $this->speakerData($speaker));

        return response()->json(['data' => $speakers]);
    }

    public function rooms(): JsonResponse
    {
        return response()->json([
            'data' => Sala::query()->orderBy('nombre')->get(),
        ]);
    }

    public function currentUser(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'data' => $user ? $this->userData($user->load('role')) : null,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:usuarios,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = DB::transaction(function () use ($validated): User {
            $role = Role::query()->where('nombre', 'asistente')->firstOrFail();

            return User::query()->create([
                'id_rol' => $role->id_rol,
                'nombre' => trim($validated['nombre']),
                'apellidos' => trim($validated['apellidos']),
                'email' => mb_strtolower(trim($validated['email'])),
                'password_hash' => Hash::make($validated['password']),
                'fecha_registro' => now(),
                'activo' => true,
            ]);
        });

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['data' => $this->userData($user->load('role'))], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt([
            'email' => mb_strtolower(trim($credentials['email'])),
            'password' => $credentials['password'],
        ])) {
            return response()->json(['message' => 'Email o contraseña incorrectos.'], 422);
        }

        /** @var User $user */
        $user = Auth::user();

        if (! $user->activo) {
            Auth::logout();

            return response()->json(['message' => 'La cuenta está desactivada.'], 422);
        }

        $request->session()->regenerate();

        return response()->json(['data' => $this->userData($user->load('role'))]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['data' => null]);
    }

    public function reservations(): JsonResponse
    {
        $reservations = Reserva::query()
            ->where('id_usuario', Auth::id())
            ->with(['charla.sala', 'charla.ponentes', 'asistencia'])
            ->orderByDesc('id_reserva')
            ->get()
            ->map(fn (Reserva $reservation): array => $this->reservationData($reservation));

        return response()->json(['data' => $reservations]);
    }

    public function createReservation(int $talkId): JsonResponse
    {
        $reservation = DB::transaction(function () use ($talkId): Reserva|JsonResponse {
            $talk = Charla::query()->whereKey($talkId)->lockForUpdate()->firstOrFail();

            if ($talk->estado !== 'publicada') {
                return response()->json(['message' => 'Esta charla no está disponible para reservar.'], 409);
            }

            $activeReservations = Reserva::query()
                ->where('id_charla', $talk->id_charla)
                ->whereIn('estado', ['pendiente', 'confirmada']);

            if ((clone $activeReservations)->where('id_usuario', Auth::id())->exists()) {
                return response()->json(['message' => 'Ya tienes una reserva activa para esta charla.'], 409);
            }

            if ($activeReservations->count() >= $talk->aforo_maximo) {
                return response()->json(['message' => 'La charla está completa.'], 409);
            }

            return Reserva::query()->create([
                'id_usuario' => Auth::id(),
                'id_charla' => $talk->id_charla,
                'fecha_reserva' => now(),
                'estado' => 'confirmada',
            ]);
        });

        if ($reservation instanceof JsonResponse) {
            return $reservation;
        }

        $reservation->load(['charla.sala', 'charla.ponentes', 'asistencia']);

        return response()->json(['data' => $this->reservationData($reservation)], 201);
    }

    public function cancelReservation(int $reservationId): JsonResponse
    {
        $reservation = DB::transaction(function () use ($reservationId): Reserva|JsonResponse {
            $reservation = Reserva::query()
                ->where('id_usuario', Auth::id())
                ->whereKey($reservationId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($reservation->estado === 'cancelada') {
                return $reservation;
            }

            if ($reservation->asistencia()->exists()) {
                return response()->json(['message' => 'No se puede cancelar una reserva ya validada.'], 409);
            }

            $reservation->update(['estado' => 'cancelada']);

            return $reservation;
        });

        if ($reservation instanceof JsonResponse) {
            return $reservation;
        }

        $reservation->load(['charla.sala', 'charla.ponentes', 'asistencia']);

        return response()->json(['data' => $this->reservationData($reservation)]);
    }

    private function userData(User $user): array
    {
        return [
            'id_usuario' => $user->id_usuario,
            'id_rol' => $user->id_rol,
            'nombre' => $user->nombre,
            'apellidos' => $user->apellidos,
            'email' => $user->email,
            'activo' => (bool) $user->activo,
            'role' => $user->role ? [
                'id_rol' => $user->role->id_rol,
                'nombre' => $user->role->nombre,
            ] : null,
        ];
    }

    private function talkData(Charla $talk): array
    {
        $activeReservations = $talk->getAttribute('reservas_activas_count')
            ?? $talk->reservations()->whereIn('estado', ['pendiente', 'confirmada'])->count();

        return [
            'id_charla' => $talk->id_charla,
            'id_organizador' => $talk->id_organizador,
            'id_sala' => $talk->id_sala,
            'titulo' => $talk->titulo,
            'descripcion' => $talk->descripcion,
            'fecha' => $talk->fecha->toDateString(),
            'hora_inicio' => substr((string) $talk->hora_inicio, 0, 5),
            'hora_fin' => substr((string) $talk->hora_fin, 0, 5),
            'aforo_maximo' => (int) $talk->aforo_maximo,
            'reservas_activas_count' => (int) $activeReservations,
            'estado' => $talk->estado,
            'sala' => $talk->sala ? [
                'id_sala' => $talk->sala->id_sala,
                'nombre' => $talk->sala->nombre,
                'ubicacion' => $talk->sala->ubicacion,
                'capacidad' => (int) $talk->sala->capacidad,
            ] : null,
            'ponentes' => $talk->ponentes->map(fn (Ponente $speaker): array => $this->speakerData($speaker))->all(),
        ];
    }

    private function speakerData(Ponente $speaker): array
    {
        return [
            'id_ponente' => $speaker->id_ponente,
            'nombre' => $speaker->nombre,
            'apellidos' => $speaker->apellidos,
            'email' => $speaker->email,
            'biografia' => $speaker->biografia,
            'especialidad' => $speaker->especialidad,
            'cargo' => $speaker->cargo,
            'experiencia' => $speaker->experiencia,
            'especializacion' => $speaker->especializacion,
            'temas' => $speaker->temas ?? [],
            'tecnologias' => $speaker->tecnologias ?? [],
            'charlas' => $speaker->relationLoaded('charlas')
                ? $speaker->charlas->map(fn (Charla $talk): array => [
                    'id_charla' => $talk->id_charla,
                    'titulo' => $talk->titulo,
                    'fecha' => $talk->fecha->toDateString(),
                    'hora_inicio' => substr((string) $talk->hora_inicio, 0, 5),
                    'estado' => $talk->estado,
                ])->all()
                : [],
        ];
    }

    private function reservationData(Reserva $reservation): array
    {
        return [
            'id_reserva' => $reservation->id_reserva,
            'id_usuario' => $reservation->id_usuario,
            'id_charla' => $reservation->id_charla,
            'fecha_reserva' => $reservation->fecha_reserva?->toDateTimeString(),
            'estado' => $reservation->estado,
            'asistencia' => $reservation->asistencia !== null,
            'charla' => $reservation->charla ? $this->talkData($reservation->charla) : null,
        ];
    }
}
