<?php

namespace App\Http\Controllers;

use App\Models\NotificacionEmail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NotificacionEmailController extends Controller
{
    public function index()
    {
        return NotificacionEmail::query()->with('reserva')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_reserva' => ['required', 'integer', Rule::exists('reservas', 'id_reserva')],
            'destinatario' => ['required', 'email', 'max:150'],
            'tipo' => ['required', Rule::in(['confirmacion', 'cancelacion', 'recordatorio'])],
            'fecha_envio' => ['nullable', 'date'],
            'estado_envio' => ['sometimes', Rule::in(['pendiente', 'enviado', 'error'])],
            'error' => ['nullable', 'string'],
        ]);

        return response()->json(NotificacionEmail::create($validated), 201);
    }

    public function show(NotificacionEmail $notificacionEmail)
    {
        return $notificacionEmail->load('reserva');
    }

    public function update(Request $request, NotificacionEmail $notificacionEmail)
    {
        $validated = $request->validate([
            'id_reserva' => ['sometimes', 'integer', Rule::exists('reservas', 'id_reserva')],
            'destinatario' => ['sometimes', 'email', 'max:150'],
            'tipo' => ['sometimes', Rule::in(['confirmacion', 'cancelacion', 'recordatorio'])],
            'fecha_envio' => ['nullable', 'date'],
            'estado_envio' => ['sometimes', Rule::in(['pendiente', 'enviado', 'error'])],
            'error' => ['nullable', 'string'],
        ]);

        $notificacionEmail->fill($validated);
        $notificacionEmail->save();

        return $notificacionEmail;
    }

    public function destroy(NotificacionEmail $notificacionEmail)
    {
        $notificacionEmail->delete();

        return response()->noContent();
    }
}
