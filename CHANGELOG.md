# Changelog

All notable changes to the **lineamientos-de-codigo** extension will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/).

## [1.2.1] – 2025-04-26

### Added

- Nuevas plantillas **prediseñadas** de código (snippets) para proyectos Vue.js + Bootstrap:
  - **Vista completa de objetos** (`basic_view`)
  - **Controlador básico con Axios** (`basic_controller`)
- Automatización del formateo, paginación, filtros y modales en proyectos Vue.js.
- Mejora en la experiencia de desarrollo frontend para CRUDs rápidos.
- Actualización en el `activationEvents` para activar la extensión también en proyectos PHP.
- Corrección de activación automática en archivos `.js`, `.ts` y `.php`.

## [1.1.1] – 2025-04-17

### Changed

- Cambio de nombre del repositorio a `vscode-lineamientos-de-codigo`
- Ajustes menores en mensajes visibles dentro de la extensión para mejorar la claridad

## [1.1.0] – 2025-04-16

### Added

- Plantillas prediseñadas para insertar endpoints básicos en PHP:
  - `GET`, `POST`, `PUT`, `DELETE`
  - Disponibles desde la vista lateral del panel de ayuda
  - Incluyen accesos rápidos con comandos:
    - `lineamientos-de-codigo.insertGetApiTemplate`
    - `lineamientos-de-codigo.insertPostApiTemplate`
    - `lineamientos-de-codigo.insertPutApiTemplate`
    - `lineamientos-de-codigo.insertDeleteApiTemplate`
- Las plantillas se encuentran organizadas en un archivo de snippets reutilizable
- Se activan mediante prefijos como "getApi", "postApi", "putApi", "deleteApi".
- Mejora la velocidad de desarrollo de APIs siguiendo los lineamientos estándar de Clever

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
