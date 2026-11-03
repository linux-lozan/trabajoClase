# AdiTech Events (Proyecto SABITECH) — versión React + Vite

Web para gestionar eventos tecnológicos: charlas, ponentes, salas, reservas
y validación de entradas con QR. Es la versión en React de la web HTML/JS del
proyecto SABITECH (2º DAW).

## Cómo abrirla

Sin instalar nada: abre `dist/index.html` con doble clic (el build genera un
script clásico, así que funciona también desde `file://`).

Para desarrollar:

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # genera la versión final en dist/
npm run preview  # sirve dist/ para probarla
```

## Estructura

```
src/
  App.jsx              rutas (HashRouter) y estructura común
  estilos.css          estilos de la web
  datos/
    datos.js           datos iniciales (misma estructura que la BD `sabitech`)
    consultas.js       consultas tipo SELECT/JOIN sobre esos datos
    bd.jsx             contexto: BD en localStorage, sesión, avisos y modal
  componentes/
    Estructura.jsx     cabecera, pie y aviso
    Modal.jsx          acceso/registro y entrada con QR
    Logo3D.jsx         logo 3D del inicio
    efectos.jsx        preloader, cortina entre páginas, titulares, scroll y cursor
    CabPagina.jsx, QR.jsx
  paginas/
    Inicio, Charlas, Ponentes, Planes, Contacto, Panel (según el rol)
```

## Usuarios de prueba

| Rol           | Email                    | Contraseña |
|---------------|--------------------------|------------|
| Asistente     | asistente@aditech.es     | user123    |
| Personal      | personal@aditech.es      | staff123   |
| Organizador   | organizador@aditech.es   | org123     |
| Administrador | admin@aditech.es         | admin123   |

Los datos se guardan en el `localStorage` del navegador; el administrador
puede restablecerlos desde su panel.
