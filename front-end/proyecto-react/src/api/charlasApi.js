import { charla } from '../modelos/charlas.js';
import { ApiError } from './ApiError.js';

const API_BASE_URL = 'http://localhost:8080/api';
const CHARLAS_URL = `${API_BASE_URL}/charlas`;

async function readResponse(response) {
    const json = await response.json();
    if (!response.ok) {
        throw new ApiError(response.status, json.message ?? `Error HTTP ${response.status}`, json);
    }

    return json;
}

/** GET /charlas → list of talks */
export async function list() {
    const response = await fetch(CHARLAS_URL, {
        headers: { Accept: 'application/json' },
    });

    return (await readResponse(response)).map((item) => charla.fromJSON(item));
}

/** GET /charlas/{id} → a talk */
export async function getById(id) {
    const response = await fetch(`${CHARLAS_URL}/${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
    });

    return charla.fromJSON(await readResponse(response));
}

/** POST /charlas → the created talk */
export async function add(talk) {
    const response = await fetch(CHARLAS_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(talk),
    });

    return charla.fromJSON(await readResponse(response));
}

/** PATCH /charlas/{id} → the updated talk */
export async function update(talk) {
    const response = await fetch(`${CHARLAS_URL}/${encodeURIComponent(talk.id)}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(talk),
    });

    return charla.fromJSON(await readResponse(response));
}

/** DELETE /charlas/{id} → true when the talk was deleted */
export async function remove(id) {
    const response = await fetch(`${CHARLAS_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
        await readResponse(response);
    }

    return true;
}
