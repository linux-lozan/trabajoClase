import { useEffect, useState } from 'react'
import { obtenerCharlas } from '../services/api'

export default function Talks() {
  const [charlas, setCharlas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerCharlas()
      .then((datos) => setCharlas(datos))
      .catch((error) => setError(error.message))
  }, [])

  return (
    <main>
      <h1>Charlas</h1>

      {error && <p>{error}</p>}

      {charlas.map((charla) => (
        <article key={charla.id_charla}>
          <h2>{charla.titulo}</h2>
          <p>{charla.descripcion}</p>
          <p>{charla.fecha} · {charla.hora_inicio}</p>
        </article>
      ))}
    </main>
  )
}