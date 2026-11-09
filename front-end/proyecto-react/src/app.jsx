import { Listadocharlas } from './componentes/Listadocharlas.jsx';

export default function App() {
    function listarCharlas() {
        console.log('Listar charlas');
    }

    return <Listadocharlas onListar={listarCharlas} />;
}