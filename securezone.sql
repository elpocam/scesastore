-- ═══════════════════════════════════════════
--  SecureZone — Base de datos
--  Ejecutar en phpMyAdmin o MySQL CLI
-- ═══════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS securezone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE securezone;

CREATE TABLE IF NOT EXISTS usuarios (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(80)     NOT NULL,
  apellido     VARCHAR(80)     NOT NULL,
  email        VARCHAR(191)    NOT NULL,
  telefono     VARCHAR(20)              DEFAULT '',
  password     VARCHAR(255)    NOT NULL,          -- bcrypt hash
  wants_promo  TINYINT(1)      NOT NULL DEFAULT 0,
  discount     TINYINT         NOT NULL DEFAULT 15, -- % descuento para usuarios registrados
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY  (id),
  UNIQUE KEY   uq_email (email)          -- evita duplicados a nivel DB
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;