/*
 * Datos de ejemplo que replican la estructura de la base de datos `sabitech`
 * (tablas: roles, usuarios, salas, ponentes, charlas, charla_ponente, reservas).
 * Más adelante pueden sustituirse por peticiones fetch() a una API en PHP.
 */
const DB_INICIAL = {
  roles: [
    { id_rol: 1, nombre: "administrador", descripcion: "Gestión completa del sistema" },
    { id_rol: 2, nombre: "organizador", descripcion: "Crea y gestiona charlas" },
    { id_rol: 3, nombre: "personal", descripcion: "Valida la entrada mediante QR" },
    { id_rol: 4, nombre: "asistente", descripcion: "Usuario que reserva plaza en charlas" }
  ],

  // Contraseñas en claro SOLO para la demo; en la BD real se guarda password_hash.
  usuarios: [
    { id_usuario: 1, id_rol: 1, nombre: "Ana", apellidos: "Admin", email: "admin@aditech.es", password: "admin123", activo: 1 },
    { id_usuario: 2, id_rol: 2, nombre: "Óscar", apellidos: "Organiza", email: "organizador@aditech.es", password: "org123", activo: 1 },
    { id_usuario: 3, id_rol: 3, nombre: "Pablo", apellidos: "Puerta", email: "personal@aditech.es", password: "staff123", activo: 1 },
    { id_usuario: 4, id_rol: 4, nombre: "Laura", apellidos: "García", email: "asistente@aditech.es", password: "user123", activo: 1 }
  ],

  salas: [
    { id_sala: 1, nombre: "Auditorio Turing", ubicacion: "Planta 0", capacidad: 200 },
    { id_sala: 2, nombre: "Sala Lovelace", ubicacion: "Planta 1", capacidad: 60 },
    { id_sala: 3, nombre: "Sala Hopper", ubicacion: "Planta 1", capacidad: 40 },
    { id_sala: 4, nombre: "Laboratorio Berners-Lee", ubicacion: "Planta 2", capacidad: 25 }
  ],

  // Campos de la tabla `ponentes` + campos ampliados para la web
  // (especialidad, cargo, experiencia, especializacion, temas, tecnologias).
  ponentes: [
    {
      id_ponente: 1, nombre: "Lucía", apellidos: "Martín Ruiz", email: "lucia@example.com",
      biografia: "Arquitecta cloud y especialista en Kubernetes.",
      especialidad: "Cloud & DevOps", cargo: "Cloud Architect", experiencia: 12,
      especializacion: "Lucía diseña infraestructuras cloud nativas para empresas que necesitan escalar sin perder fiabilidad. Su trabajo se centra en la orquestación de contenedores con Kubernetes, la automatización de despliegues mediante pipelines CI/CD y la infraestructura como código. Ha liderado migraciones de sistemas monolíticos a microservicios y es certificada CKA (Certified Kubernetes Administrator) y AWS Solutions Architect Professional.",
      temas: ["Migración de aplicaciones monolíticas a microservicios", "Estrategias de despliegue blue-green y canary", "Observabilidad: métricas, logs y trazas distribuidas", "Optimización de costes en la nube (FinOps)"],
      tecnologias: ["Kubernetes", "Docker", "Terraform", "AWS", "GitHub Actions", "Prometheus"]
    },
    {
      id_ponente: 2, nombre: "Javier", apellidos: "Sánchez Gil", email: "javier@example.com",
      biografia: "Desarrollador full-stack y divulgador de JavaScript.",
      especialidad: "Desarrollo Full-Stack", cargo: "Senior Full-Stack Developer", experiencia: 9,
      especializacion: "Javier es especialista en el ecosistema JavaScript, tanto en el navegador como en el servidor. Trabaja en el diseño de aplicaciones web de alto rendimiento, APIs REST y GraphQL y arquitecturas basadas en componentes. Además, es formador y creador de contenido técnico, con cursos sobre JavaScript moderno seguidos por miles de estudiantes, y colabora en varios proyectos open source.",
      temas: ["Novedades de ECMAScript y buenas prácticas", "Rendimiento web y Core Web Vitals", "Diseño de APIs REST y GraphQL", "Testing automatizado en frontend y backend"],
      tecnologias: ["JavaScript", "TypeScript", "Node.js", "React", "PHP", "MySQL"]
    },
    {
      id_ponente: 3, nombre: "Marta", apellidos: "López Vega", email: "marta@example.com",
      biografia: "Investigadora en IA aplicada y modelos de lenguaje.",
      especialidad: "Inteligencia Artificial", cargo: "AI Research Engineer", experiencia: 8,
      especializacion: "Marta investiga la aplicación práctica de la inteligencia artificial en productos digitales. Su especialización son los modelos de lenguaje (LLM): cómo integrarlos en aplicaciones web de forma segura, cómo evaluarlos y cómo combinarlos con bases de conocimiento propias mediante técnicas RAG. Es doctora en Informática y ha publicado artículos sobre procesamiento del lenguaje natural y ética en la IA.",
      temas: ["Integración de LLM en aplicaciones web", "Recuperación aumentada (RAG) con datos propios", "Evaluación y sesgos en modelos de IA", "Uso responsable de la IA y normativa europea"],
      tecnologias: ["Python", "PyTorch", "LangChain", "APIs de LLM", "Bases de datos vectoriales"]
    },
    {
      id_ponente: 4, nombre: "Diego", apellidos: "Fernández Sanz", email: "diego@example.com",
      biografia: "Experto en ciberseguridad y hacking ético.",
      especialidad: "Ciberseguridad", cargo: "Pentester & Security Consultant", experiencia: 11,
      especializacion: "Diego se dedica a la auditoría de seguridad de aplicaciones web y redes corporativas. Realiza pruebas de penetración para detectar vulnerabilidades antes que los atacantes y forma a equipos de desarrollo en programación segura. Posee las certificaciones OSCP y CEH, y participa habitualmente en competiciones CTF y programas de bug bounty.",
      temas: ["OWASP Top 10: ataques y defensas", "Inyección SQL, XSS y CSRF en la práctica", "Autenticación segura y gestión de contraseñas", "Respuesta ante incidentes de seguridad"],
      tecnologias: ["Burp Suite", "Kali Linux", "Metasploit", "Nmap", "Wireshark"]
    },
    {
      id_ponente: 5, nombre: "Elena", apellidos: "Romero Díaz", email: "elena@example.com",
      biografia: "UX designer y defensora de la accesibilidad web.",
      especialidad: "UX y Accesibilidad", cargo: "Lead UX/UI Designer", experiencia: 10,
      especializacion: "Elena diseña experiencias digitales centradas en las personas, con especial atención a la accesibilidad. Ayuda a empresas a cumplir las pautas WCAG 2.2 y la normativa europea de accesibilidad, combinando investigación con usuarios, prototipado y diseño de sistemas de componentes. Defiende que una web accesible es una web mejor para todos.",
      temas: ["Pautas WCAG 2.2 explicadas con código", "Diseño inclusivo y lectores de pantalla", "Sistemas de diseño y componentes reutilizables", "Investigación y pruebas con usuarios"],
      tecnologias: ["Figma", "HTML semántico", "CSS", "ARIA", "Lighthouse", "axe DevTools"]
    }
  ],

  charlas: [
    { id_charla: 1, id_organizador: 2, id_sala: 1, titulo: "IA generativa en el desarrollo web", descripcion: "Cómo integrar modelos de lenguaje en aplicaciones web reales.", fecha: "2026-11-20", hora_inicio: "10:00", hora_fin: "11:00", aforo_maximo: 200, estado: "publicada" },
    { id_charla: 2, id_organizador: 2, id_sala: 2, titulo: "Despliegues con Docker y Kubernetes", descripcion: "Del contenedor local al clúster en producción.", fecha: "2026-11-20", hora_inicio: "11:30", hora_fin: "12:30", aforo_maximo: 60, estado: "publicada" },
    { id_charla: 3, id_organizador: 2, id_sala: 3, titulo: "JavaScript moderno: más allá de ES2025", descripcion: "Novedades del lenguaje y buenas prácticas.", fecha: "2026-11-20", hora_inicio: "16:00", hora_fin: "17:00", aforo_maximo: 3, estado: "publicada" },
    { id_charla: 4, id_organizador: 2, id_sala: 4, titulo: "Taller de hacking ético", descripcion: "OWASP Top 10 en la práctica, con laboratorio guiado.", fecha: "2026-11-21", hora_inicio: "10:00", hora_fin: "12:00", aforo_maximo: 25, estado: "publicada" },
    { id_charla: 5, id_organizador: 2, id_sala: 2, titulo: "Accesibilidad web que sí funciona", descripcion: "WCAG explicado con ejemplos de código.", fecha: "2026-11-21", hora_inicio: "12:30", hora_fin: "13:30", aforo_maximo: 60, estado: "publicada" },
    { id_charla: 6, id_organizador: 2, id_sala: 1, titulo: "Mesa redonda: el futuro del desarrollador", descripcion: "Debate con todos los ponentes.", fecha: "2026-11-21", hora_inicio: "17:00", hora_fin: "18:30", aforo_maximo: 200, estado: "publicada" }
  ],

  charla_ponente: [
    { id_charla: 1, id_ponente: 3 }, { id_charla: 2, id_ponente: 1 }, { id_charla: 3, id_ponente: 2 },
    { id_charla: 4, id_ponente: 4 }, { id_charla: 5, id_ponente: 5 },
    { id_charla: 6, id_ponente: 1 }, { id_charla: 6, id_ponente: 2 }, { id_charla: 6, id_ponente: 3 }
  ],

  // estado: pendiente | confirmada | cancelada
  reservas: [
    { id_reserva: 1, id_usuario: 1, id_charla: 3, fecha_reserva: "2026-10-20 09:00", estado: "confirmada" },
    { id_reserva: 2, id_usuario: 2, id_charla: 3, fecha_reserva: "2026-10-21 10:15", estado: "confirmada" },
    { id_reserva: 3, id_usuario: 3, id_charla: 3, fecha_reserva: "2026-10-22 18:40", estado: "confirmada" }
  ],

  asistencias: [],
  notificaciones_email: []
};
