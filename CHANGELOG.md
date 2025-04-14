# Changelog

All notable changes to the **lineamientos-de-codigo** extension will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/).

## [1.0.0] – 2025-04-13

### Added

- Comando para formatear archivos JavaScript completos (`lineamientos-de-codigo.formatJsCode`)
- Comando para formatear solo la selección de código (`lineamientos-de-codigo.formatJsSelection`)
- Comando para activar o desactivar la validación en tiempo real (`lineamientos-de-codigo.toggleValidacion`)
- Comando para activar o desactivar el resaltado de espacios en blanco al final de línea (`lineamientos-de-codigo.toggleTrailingSpaces`)
- Validación de estilo para:
  - `console.log` en código productivo
  - Uso de `alert()` en lugar de soluciones no intrusivas
  - Uso de `fetch` en lugar de `axios`
  - Variables y funciones que no siguen la convención `snake_case`
  - Estructuras condicionales `if/else` mal formateadas
  - Espacios en blanco innecesarios al final de línea
- Decoración visual en el editor para mostrar errores y advertencias
- Vista lateral de ayuda con accesos directos a documentación y soporte
- Reglas de formateo configurables mediante `beautifyOptions` en el código fuente
- Soporte para instalación manual en entornos Windows, macOS y Linux

## [Unreleased]

- Trabajando en los lineamientos de código para HTML y PHP.
