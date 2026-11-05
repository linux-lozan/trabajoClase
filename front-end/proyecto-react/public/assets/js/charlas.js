const listaCharlas = document.querySelector('#lista-charlas')
const estadoCharlas = document.querySelector('#estado-charlas')
const estadoConexion = document.querySelector('#estado-conexion')

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha por confirmar'

  const fechaCorta = String(fecha).slice(0, 10)
  const parsedDate = new Date(`${fechaCorta}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return String(fecha)

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
  }).format(parsedDate)
}

function crearFila(charla) {
  const fila = document.createElement('article')
  fila.className = 'fila-charla'

  const hora = document.createElement('time')
  hora.className = 'hora-charla'
  hora.textContent = charla.hora_inicio?.slice(0, 5) || '--:--'
  if (charla.hora_inicio) hora.dateTime = charla.hora_inicio

  const detalle = document.createElement('div')
  detalle.className = 'detalle-charla'

  const fecha = document.createElement('span')
  fecha.className = 'categoria'
  fecha.textContent = formatearFecha(charla.fecha)

  const titulo = document.createElement('h3')
  titulo.textContent = charla.titulo || 'Charla sin título'

  const descripcion = document.createElement('p')
  descripcion.textContent = charla.descripcion || 'Sin descripción disponible.'

  const aforo = document.createElement('span')
  aforo.className = 'sala-charla'
  aforo.textContent = charla.aforo_maximo == null
    ? 'Aforo no indicado'
    : `Aforo máximo: ${charla.aforo_maximo}`

  detalle.append(fecha, titulo, descripcion)
  fila.append(hora, detalle, aforo)

  return fila
}

async function cargarCharlas() {
  try {
    const response = await fetch('/api/charlas')
    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`)
    }

    const charlas = await response.json()
    if (!Array.isArray(charlas)) {
      throw new Error('La respuesta de la API no tiene el formato esperado')
    }

    listaCharlas.replaceChildren(...charlas.map(crearFila))
    estadoConexion.textContent = 'Conectado'
    estadoCharlas.textContent = charlas.length
      ? ''
      : 'No hay charlas disponibles.'
    estadoCharlas.hidden = charlas.length > 0
  } catch (error) {
    console.error('No se pudieron cargar las charlas:', error)
    estadoConexion.textContent = 'Sin conexión'
    estadoCharlas.textContent = 'No se pudo cargar la agenda. Comprueba que Laravel y MySQL estén disponibles.'
    estadoCharlas.setAttribute('role', 'alert')
  }
}

cargarCharlas()
