export async function obtenerCharlas() {
    const respuesta = await fetch('/api/charlas')

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las charlas')
    }

    return await respuesta.json()
}