<p align="center">
  <a title="Más sobre Lineamientos de Código" href="https://github.com/marcosd59/lineamientos-de-codigo">
    <img src="https://raw.githubusercontent.com/marcosd59/lineamientos-de-codigo/master/assets/icon.png" alt="Lineamientos Logo" width="15%" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/marcosd59/lineamientos-de-codigo/releases" target="_blank">
    <img src="https://img.shields.io/github/v/release/marcosd59/lineamientos-de-codigo.svg?style=flat-square&label=Release&logo=github&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=marcosd59.lineamientos-de-codigo" target="_blank">
    <img src="https://img.shields.io/visual-studio-marketplace/i/marcosd59.lineamientos-de-codigo?style=flat-square&label=Installations&logo=visualstudiocode&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://github.com/marcosd59/lineamientos-de-codigo/actions" target="_blank">
    <img src="https://img.shields.io/github/checks-status/marcosd59/lineamientos-de-codigo/main.svg?style=flat-square&label=CI&logo=github&logoColor=cacde2&labelColor=2c2c32&color=006daf" />
  </a>
  <a href="https://code.visualstudio.com/updates/v1_39" target="_blank">
    <img src="https://img.shields.io/static/v1.svg?style=flat-square&label=Visual+Studio+Code&message=%3E=v1.39.0&logo=visualstudiocode&labelColor=2c2c32&color=006daf" />
  </a>
</p>

# Lineamientos de Código

**Lineamientos de Código** es una extensión para Visual Studio Code que permite formatear y validar código JavaScript con base en reglas de estilo predefinidas. Está pensada para desarrolladores y equipos que buscan mantener un código limpio, entendible y estandarizado de forma automática.

---

## Novedades

- Validación de buenas prácticas en tiempo real
- Formateo automático por archivo o por selección
- Decoración visual de espacios innecesarios
- Vista lateral de ayuda integrada
- Comandos rápidos desde el menú contextual

---

## Funcionalidades

### Formateo automático

- Aplicación inmediata de estilo con indentación de 4 espacios
- Separación de funciones y métodos para mejorar la legibilidad
- Compactación de estructuras como objetos, arrays y condicionales para evitar exceso de líneas

### Validación de estilo

Detecta y marca automáticamente:

- Uso de `console.log` en entornos productivos
- Llamadas a `alert()` en lugar de notificaciones menos invasivas
- Uso de `fetch` en lugar de bibliotecas como `axios`
- Variables o funciones que no siguen la convención `snake_case`
- Estructuras condicionales `if/else` mal implementadas
- Espacios en blanco innecesarios al final de línea

### Decoración visual

Resalta con color de fondo los espacios al final de cada línea para facilitar su eliminación antes de confirmar cambios en control de versiones.

---

## Comandos disponibles

| Comando                                       | Descripción                                                  |
| --------------------------------------------- | ------------------------------------------------------------ |
| `lineamientos-de-codigo.formatJsCode`         | Formatea todo el archivo actual.                             |
| `lineamientos-de-codigo.formatJsSelection`    | Formatea solo el bloque de código seleccionado.              |
| `lineamientos-de-codigo.toggleValidacion`     | Activa o desactiva la validación automática.                 |
| `lineamientos-de-codigo.toggleTrailingSpaces` | Muestra u oculta el resaltado de espacios al final de línea. |

---

## Instalación

1. Clona o descarga este repositorio.
2. Copia la carpeta en el directorio de extensiones de Visual Studio Code:
   - Windows: `%USERPROFILE%\.vscode\extensions`
   - macOS: `~/.vscode/extensions`
   - Linux: `~/.vscode/extensions`
3. Reinicia Visual Studio Code.
4. La extensión estará activa automáticamente.

---

## Configuración

Puedes modificar las reglas directamente en el archivo principal editando el objeto `beautifyOptions`:

```json
"beautifyOptions": {
  "indent_size": 4,
  "space_in_paren": false,
  "brace_style": "collapse"
}
```

---

## Recomendaciones de uso

- Activa la validación en tiempo real mientras trabajas en el código.
- Utiliza el comando de formateo completo antes de realizar un commit.
- Evita `console.log` en producción.
- Prefiere `axios` para peticiones HTTP más limpias y manejables.

---

## Ayuda

La extensión incluye una vista lateral con enlaces rápidos a:

- [Guía de inicio](https://github.com/marcosd59/lineamientos-de-codigo/blob/master/README.md)
- [Reportar errores](https://github.com/marcosd59/lineamientos-de-codigo/issues/new/choose)
- [Enviar comentarios](mailto:damian.marcospool@gmail.com)
- [Ver issues abiertos](https://github.com/marcosd59/lineamientos-de-codigo/issues)

---

## Contribuciones

Las contribuciones, mejoras y sugerencias son bienvenidas.  
Puedes abrir un [Issue](https://github.com/marcosd59/lineamientos-de-codigo/issues) o enviar un Pull Request directamente en el repositorio.

---

## Licencia

Este proyecto está disponible bajo la licencia [MIT](LICENSE).  
Puedes usarlo, modificarlo y redistribuirlo libremente.
