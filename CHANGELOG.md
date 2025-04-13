# Changelog

All notable changes to the **lineamientos-de-codigo** extension will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/).

## [1.0.0] – 2025-04-12

### Added

- Primera versión estable de la extensión.
- Comando para formatear archivos `.js` con `js-beautify` y reglas personalizadas.
- Reglas de validación activa en archivos JavaScript y TypeScript:
- Autoformateo de:
  - Asignaciones, condiciones ternarias y llamadas `axios` multilínea.
  - Argumentos de funciones y bloques `if` largos a una sola línea.
  - Separación de métodos consecutivos con una línea en blanco.
- Comando para activar o desactivar la validación desde la paleta de comandos de VSCode.

## [Unreleased]

- Trabajando en una opción para activar o desactivar la validación de archivos de forma global desde la configuración.
