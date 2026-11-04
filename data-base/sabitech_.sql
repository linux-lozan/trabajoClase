-- Esquema de sabitech basado en el SQL proporcionado.
-- Se han eliminado ponentes y charla_ponente, junto con sus índices y FK.
-- Ejecutar sobre la base de datos sabitech.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `uq_roles_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `salas` (
  `id_sala` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `ubicacion` VARCHAR(255) DEFAULT NULL,
  `capacidad` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_sala`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_rol` INT UNSIGNED NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  KEY `fk_usuarios_rol` (`id_rol`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `charlas` (
  `id_charla` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_organizador` INT UNSIGNED NOT NULL,
  `id_sala` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `fecha` DATE NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `aforo_maximo` INT UNSIGNED NOT NULL,
  `estado` ENUM('borrador','publicada','cancelada','finalizada') NOT NULL DEFAULT 'borrador',
  PRIMARY KEY (`id_charla`),
  KEY `idx_charlas_fecha` (`fecha`),
  KEY `fk_charlas_organizador` (`id_organizador`),
  KEY `fk_charlas_sala` (`id_sala`),
  CONSTRAINT `fk_charlas_organizador` FOREIGN KEY (`id_organizador`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  CONSTRAINT `fk_charlas_sala` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reservas` (
  `id_reserva` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT UNSIGNED NOT NULL,
  `id_charla` INT UNSIGNED NOT NULL,
  `fecha_reserva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente',
  `observaciones` VARCHAR(255) DEFAULT NULL,
  `reserva_activa` TINYINT GENERATED ALWAYS AS (CASE WHEN `estado` IN ('pendiente','confirmada') THEN 1 ELSE NULL END) STORED,
  PRIMARY KEY (`id_reserva`),
  UNIQUE KEY `uq_reserva_activa` (`id_usuario`,`id_charla`,`reserva_activa`),
  KEY `idx_reservas_charla` (`id_charla`,`estado`),
  CONSTRAINT `fk_reservas_charla` FOREIGN KEY (`id_charla`) REFERENCES `charlas` (`id_charla`) ON UPDATE CASCADE,
  CONSTRAINT `fk_reservas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `asistencias` (
  `id_asistencia` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_reserva` INT UNSIGNED NOT NULL,
  `id_usuario_validador` INT UNSIGNED NOT NULL,
  `fecha_hora_acceso` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resultado` ENUM('valida') NOT NULL DEFAULT 'valida',
  `observaciones` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  UNIQUE KEY `uq_asistencias_reserva` (`id_reserva`),
  KEY `fk_asistencias_validador` (`id_usuario_validador`),
  CONSTRAINT `fk_asistencias_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencias_validador` FOREIGN KEY (`id_usuario_validador`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notificaciones_email` (
  `id_email` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_reserva` INT UNSIGNED NOT NULL,
  `destinatario` VARCHAR(150) NOT NULL,
  `tipo` ENUM('confirmacion','cancelacion','recordatorio') NOT NULL,
  `fecha_envio` DATETIME DEFAULT NULL,
  `estado_envio` ENUM('pendiente','enviado','error') NOT NULL DEFAULT 'pendiente',
  `error` TEXT DEFAULT NULL,
  PRIMARY KEY (`id_email`),
  KEY `idx_notif_reserva` (`id_reserva`),
  CONSTRAINT `fk_notif_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
  (1, 'administrador', 'Gestión completa del sistema'),
  (2, 'organizador', 'Crea y gestiona charlas'),
  (3, 'personal', 'Valida la entrada mediante QR'),
  (4, 'asistente', 'Usuario que reserva plaza en charlas')
ON DUPLICATE KEY UPDATE
  `descripcion` = VALUES(`descripcion`);

SET FOREIGN_KEY_CHECKS = 1;
