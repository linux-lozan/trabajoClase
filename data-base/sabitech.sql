-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2026 a las 12:01:41
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sabitech`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id_asistencia` int(10) UNSIGNED NOT NULL,
  `id_reserva` int(10) UNSIGNED NOT NULL,
  `id_usuario_validador` int(10) UNSIGNED NOT NULL,
  `fecha_hora_acceso` datetime NOT NULL DEFAULT current_timestamp(),
  `resultado` enum('valida') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'valida',
  `observaciones` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `charlas`
--

CREATE TABLE `charlas` (
  `id_charla` int(10) UNSIGNED NOT NULL,
  `id_organizador` int(10) UNSIGNED NOT NULL,
  `id_sala` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `aforo_maximo` int(10) UNSIGNED NOT NULL,
  `estado` enum('borrador','publicada','cancelada','finalizada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'borrador'
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `charla_ponente`
--

CREATE TABLE `charla_ponente` (
  `id_charla` int(10) UNSIGNED NOT NULL,
  `id_ponente` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_email`
--

CREATE TABLE `notificaciones_email` (
  `id_email` int(10) UNSIGNED NOT NULL,
  `id_reserva` int(10) UNSIGNED NOT NULL,
  `destinatario` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('confirmacion','cancelacion','recordatorio') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `estado_envio` enum('pendiente','enviado','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `error` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ponentes`
--

CREATE TABLE `ponentes` (
  `id_ponente` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id_reserva` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_charla` int(10) UNSIGNED NOT NULL,
  `fecha_reserva` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','confirmada','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `observaciones` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reserva_activa` tinyint(4) GENERATED ALWAYS AS (case when `estado` in ('pendiente','confirmada') then 1 else NULL end) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'administrador', 'Gestión completa del sistema'),
(2, 'organizador', 'Crea y gestiona charlas'),
(3, 'personal', 'Valida la entrada mediante QR'),
(4, 'asistente', 'Usuario que reserva plaza en charlas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id_sala` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacidad` int(10) UNSIGNED NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_rol` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `uq_asistencias_reserva` (`id_reserva`),
  ADD KEY `fk_asistencias_validador` (`id_usuario_validador`);

--
-- Indices de la tabla `charlas`
--
ALTER TABLE `charlas`
  ADD PRIMARY KEY (`id_charla`),
  ADD KEY `idx_charlas_fecha` (`fecha`),
  ADD KEY `fk_charlas_organizador` (`id_organizador`),
  ADD KEY `fk_charlas_sala` (`id_sala`);

--
-- Indices de la tabla `charla_ponente`
--
ALTER TABLE `charla_ponente`
  ADD PRIMARY KEY (`id_charla`,`id_ponente`),
  ADD KEY `fk_cp_ponente` (`id_ponente`);

--
-- Indices de la tabla `notificaciones_email`
--
ALTER TABLE `notificaciones_email`
  ADD PRIMARY KEY (`id_email`),
  ADD KEY `idx_notif_reserva` (`id_reserva`);

--
-- Indices de la tabla `ponentes`
--
ALTER TABLE `ponentes`
  ADD PRIMARY KEY (`id_ponente`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD UNIQUE KEY `uq_reserva_activa` (`id_usuario`,`id_charla`,`reserva_activa`),
  ADD KEY `idx_reservas_charla` (`id_charla`,`estado`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id_sala`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD KEY `fk_usuarios_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `charlas`
--
ALTER TABLE `charlas`
  MODIFY `id_charla` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones_email`
--
ALTER TABLE `notificaciones_email`
  MODIFY `id_email` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ponentes`
--
ALTER TABLE `ponentes`
  MODIFY `id_ponente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reserva` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_asistencias_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asistencias_validador` FOREIGN KEY (`id_usuario_validador`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `charlas`
--
ALTER TABLE `charlas`
  ADD CONSTRAINT `fk_charlas_organizador` FOREIGN KEY (`id_organizador`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_charlas_sala` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `charla_ponente`
--
ALTER TABLE `charla_ponente`
  ADD CONSTRAINT `fk_cp_charla` FOREIGN KEY (`id_charla`) REFERENCES `charlas` (`id_charla`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cp_ponente` FOREIGN KEY (`id_ponente`) REFERENCES `ponentes` (`id_ponente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones_email`
--
ALTER TABLE `notificaciones_email`
  ADD CONSTRAINT `fk_notif_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk_reservas_charla` FOREIGN KEY (`id_charla`) REFERENCES `charlas` (`id_charla`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reservas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
