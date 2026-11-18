import { API_BASE_URL } from '../config.js';
import { ApiError } from './ApiError.js';

const RESERVAS_URL = `${API_BASE_URL}/reservas`;

async function readResponse(response) {
    const json = await response.json();
    if (!response.ok) {
        throw new ApiError(response.status, json.message ?? `Error HTTP ${response.status}`, json);
    }

    return json;
}

function csrfHeaders() {
    const cookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith('XSRF-TOKEN='));

    if (!cookie) {
        throw new Error('No se pudo obtener el token de seguridad. Recarga la página e inténtalo de nuevo.');
    }

    return { 'X-XSRF-TOKEN': decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) };
}

/** GET /reservas/usuario/{id} → user's reservations */
export async function getUserReservations(userId) {
    const response = await fetch(`${RESERVAS_URL}/usuario/${encodeURIComponent(userId)}`, {
        headers: { Accept: 'application/json' },
    });

    return readResponse(response);
}

/** GET /reservas/charla/{id}/count → count reservations for a talk */
export async function getReservationCountForCharla(charlaId) {
    const response = await fetch(`${RESERVAS_URL}/charla/${encodeURIComponent(charlaId)}/count`, {
        headers: { Accept: 'application/json' },
    });

    return readResponse(response);
}

/** POST /reservas → create a new reservation */
export async function createReservation(idUsuario, idCharla) {
    const response = await fetch(RESERVAS_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...csrfHeaders(),
        },
        body: JSON.stringify({
            id_usuario: idUsuario,
            id_charla: idCharla,
            estado: 'confirmada',
        }),
    });

    return readResponse(response);
}

/** DELETE /reservas/{id} → cancel a reservation */
export async function cancelReservation(reservaId) {
    const response = await fetch(`${RESERVAS_URL}/${encodeURIComponent(reservaId)}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            ...csrfHeaders(),
        },
    });

    if (!response.ok) {
        await readResponse(response);
    }

    return true;
}

/** DELETE /reservas/aforo → cancel active reservations for all talks */
export async function resetAforo() {
    const response = await fetch(`${RESERVAS_URL}/aforo`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            ...csrfHeaders(),
        },
    });

    return readResponse(response);
}

