<p align="center">
  <a title="Más sobre Lineamientos de Código" href="https://github.com/marcosd59/vscode-lineamientos-de-codigo">
    <img src="https://raw.githubusercontent.com/marcosd59/vscode-lineamientos-de-codigo/master/assets/icon.png" alt="Lineamientos Logo" width="120" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/marcosd59/vscode-lineamientos-de-codigo/releases" target="_blank">
    <img src="https://img.shields.io/github/v/release/marcosd59/vscode-lineamientos-de-codigo.svg?style=flat-square&label=Release&logo=github&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=marcosd59.lineamientos-de-codigo" target="_blank">
    <img src="https://img.shields.io/visual-studio-marketplace/i/marcosd59.lineamientos-de-codigo?style=flat-square&label=Installations&logo=visualstudiocode&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://github.com/marcosd59/vscode-lineamientos-de-codigo/actions" target="_blank">
    <img src="https://img.shields.io/github/checks-status/marcosd59/lineamientos-de-codigo/main.svg?style=flat-square&label=CI&logo=github&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://code.visualstudio.com/updates/v1_39" target="_blank">
    <img src="https://img.shields.io/static/v1.svg?style=flat-square&label=Visual+Studio+Code&message=%3E=v1.39.0&logo=visualstudiocode&labelColor=2c2c32&color=006daf" />
  </a>
</p>

# Lineamientos de Código

**Lineamientos de Código** es una extensión para Visual Studio Code que formatea y valida automáticamente código JavaScript (y PHP con snippets), basado en reglas de estilo predefinidas.

Ideal para equipos que desean mantener un código limpio, consistente y fácil de mantener sin esfuerzo manual.

---

## Funcionalidades principales

- Formateo automático con indentación personalizada.
- Validación de buenas prácticas y errores comunes en tiempo real.
- Decoración visual para espacios innecesarios.
- Snippets para plantillas de APIs REST en PHP.
- Vista lateral con ayuda integrada y accesos rápidos.
- Comandos directos desde el menú contextual.

---

## Demostraciones en acción

<p align="center">
  <strong>Formateo automático de código</strong><br />
  <img src="https://raw.githubusercontent.com/marcosd59/vscode-lineamientos-de-codigo/master/assets/images/formatter.gif" width="80%" />
</p>

<p align="center">
  <strong>Activar/Desactivar validación automática</strong><br />
  <img src="https://raw.githubusercontent.com/marcosd59/vscode-lineamientos-de-codigo/master/assets/images/on-off-validation.gif" width="80%" />
</p>

<p align="center">
  <strong>Activar/Desactivar espacios al final de línea</strong><br />
  <img src="https://raw.githubusercontent.com/marcosd59/vscode-lineamientos-de-codigo/master/assets/images/on-off-trailing-spaces.gif" width="80%" />
</p>

<p align="center">
  <strong>Insertar plantilla GET de API</strong><br />
  <img src="https://raw.githubusercontent.com/marcosd59/vscode-lineamientos-de-codigo/master/assets/images/insert-get-api-template.gif" width="80%" />
</p>
---

## ¿Qué valida y corrige?

- Uso de `console.log` en producción.
- Llamadas innecesarias a `alert()`.
- Reemplazo de `axios` por `fetch`.
- Estilo incorrecto en nombres (`snake_case`).
- `if/else` mal estructurados.
- Espacios en blanco al final de línea.

---

## Snippets incluidos (PHP)

Ahorra tiempo generando endpoints REST estándar:

| Endpoint              | Prefijo     |
| --------------------- | ----------- |
| `GET API Template`    | `getApi`    |
| `POST API Template`   | `postApi`   |
| `PUT API Template`    | `putApi`    |
| `DELETE API Template` | `deleteApi` |

Puedes insertarlos manualmente o desde el panel lateral.

---

## Comandos disponibles

| Comando                   | Descripción                                    |
| ------------------------- | ---------------------------------------------- |
| `formatJsCode`            | Formatea todo el archivo.                      |
| `formatJsSelection`       | Formatea solo el código seleccionado.          |
| `toggleValidacion`        | Activa/Desactiva la validación.                |
| `toggleTrailingSpaces`    | Muestra/Oculta los espacios al final de línea. |
| `insertGetApiTemplate`    | Inserta plantilla GET (PHP).                   |
| `insertPostApiTemplate`   | Inserta plantilla POST (PHP).                  |
| `insertPutApiTemplate`    | Inserta plantilla PUT (PHP).                   |
| `insertDeleteApiTemplate` | Inserta plantilla DELETE (PHP).                |

---

## Recursos de ayuda

- [Guía de inicio](https://github.com/marcosd59/vscode-lineamientos-de-codigo/blob/master/README.md)
- [Reportar errores](https://github.com/marcosd59/vscode-lineamientos-de-codigo/issues/new/choose)
- [Enviar comentarios](mailto:damian.marcospool@gmail.com)
- [Ver issues abiertos](https://github.com/marcosd59/vscode-lineamientos-de-codigo/issues)

---

## Contribuciones

¡Toda contribución es bienvenida!
Puedes abrir un [Issue](https://github.com/marcosd59/vscode-lineamientos-de-codigo/issues) o enviar un Pull Request.

---

## Licencia

Este proyecto está disponible bajo la licencia [MIT](LICENSE).
Puedes usarlo, modificarlo y redistribuirlo libremente.
