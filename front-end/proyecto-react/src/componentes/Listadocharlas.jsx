import { list } from '../api/charlasApi.js';

export function Listadocharlas() {
    async function listarCharlas() {
        try {
            console.log('Listar charlas');
            const charlas = await list();
            console.log('Charlas listadas:', charlas);
        } catch (error) {
            console.error('No se pudieron listar las charlas:', error);
        }
    }

    return (
        <button type="button" onClick={listarCharlas}>
            Listar charlas
        </button>
    );
}
