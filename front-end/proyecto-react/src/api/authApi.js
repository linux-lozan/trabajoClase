import { API_BASE_URL } from '../config.js';
import { ApiError } from './ApiError.js';

async function readResponse(response) {
    if (response.status === 204) {
        return null;
    }

    const body = await response.json();
    if (!response.ok) {
        throw new ApiError(response.status, body.message ?? `Error HTTP ${response.status}`, body);
    }

    return body;
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

async function prepareCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/csrf-cookie`, {
        headers: { Accept: 'application/json' },
    });

    await readResponse(response);
}

export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
        headers: { Accept: 'application/json' },
    });

    return readResponse(response);
}

export async function login(email, password) {
    await prepareCsrfToken();

    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...csrfHeaders(),
        },
        body: JSON.stringify({ email, password }),
    });

    return readResponse(response);
}

export async function logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            ...csrfHeaders(),
        },
    });

    return readResponse(response);
}
