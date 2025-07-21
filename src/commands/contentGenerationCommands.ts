import * as vscode from "vscode";

export function registerMinutePromptCommand(context: vscode.ExtensionContext) {
  const generateMinutePrompt = vscode.commands.registerCommand(
    "lineamientos-de-codigo.generateMinutePrompt",
    async () => {
      const transcripcion = await vscode.window.showInputBox({
        prompt:
          "Pega aquí la transcripción de la reunión (puede contener timestamps)...",
        placeHolder: "1:23 Hola, bienvenidos a la reunión...",
        ignoreFocusOut: true,
        validateInput: (text) => {
          if (!text || text.trim().length === 0) {
            return "La transcripción no puede estar vacía";
          }
          return null;
        },
      });

      if (!transcripcion) {
        return;
      }

      try {
        const prompt = generarPromptMinuta(transcripcion);

        await vscode.env.clipboard.writeText(prompt);

        vscode.window.showInformationMessage(
          "Prompt de minuta generado y copiado al portapapeles correctamente!"
        );

        const document = await vscode.workspace.openTextDocument({
          content: prompt,
          language: "markdown",
        });

        await vscode.window.showTextDocument(document);
      } catch (error) {
        vscode.window.showErrorMessage(`Error al generar el prompt: ${error}`);
      }
    }
  );

  context.subscriptions.push(generateMinutePrompt);
}

export function registerChangelogCommand(context: vscode.ExtensionContext) {
  const generateChangelog = vscode.commands.registerCommand(
    "lineamientos-de-codigo.generateChangelog",
    async () => {
      const transcripcion = await vscode.window.showInputBox({
        prompt:
          "Pega aquí la transcripción completa (puede tener timestamps como 0:00)...",
        placeHolder: "0:00 Hola, en este video mostramos...",
        ignoreFocusOut: true,
        validateInput: (text) => {
          if (!text || text.trim().length === 0) {
            return "La transcripción no puede estar vacía";
          }
          return null;
        },
      });

      if (!transcripcion) {
        return;
      }

      const nombreProyecto = await vscode.window.showInputBox({
        prompt: "Nombre del proyecto:",
        placeHolder: "Ej: MI PROYECTO",
        ignoreFocusOut: true,
        validateInput: (text) => {
          if (!text || text.trim().length === 0) {
            return "El nombre del proyecto no puede estar vacío";
          }
          return null;
        },
      });

      if (!nombreProyecto) {
        return;
      }

      const rama = await vscode.window.showInputBox({
        prompt: "Rama (opcional):",
        placeHolder: "Ej: redteam/ffl/integracion-paypal",
        ignoreFocusOut: true,
      });

      const loomLink = await vscode.window.showInputBox({
        prompt: "Link de Loom (opcional):",
        placeHolder: "Ej: https://www.loom.com/share/...",
        ignoreFocusOut: true,
        validateInput: (text) => {
          if (text && text.trim().length > 0) {
            const loomPattern = /^https:\/\/www\.loom\.com\/share\/.+/;
            if (!loomPattern.test(text.trim())) {
              return "Por favor ingresa un link válido de Loom";
            }
          }
          return null;
        },
      });

      try {
        const changelog = generarPromptChangelog(
          transcripcion,
          nombreProyecto,
          rama || "",
          loomLink || ""
        );

        await vscode.env.clipboard.writeText(changelog);

        vscode.window.showInformationMessage(
          "Prompt de changelog generado y copiado al portapapeles correctamente!"
        );

        const document = await vscode.workspace.openTextDocument({
          content: changelog,
          language: "markdown",
        });

        await vscode.window.showTextDocument(document);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error al generar el changelog: ${error}`
        );
      }
    }
  );

  context.subscriptions.push(generateChangelog);
}

function limpiarTextoTranscripcion(texto: string): string {
  const patronTimestamps = /\b\d{1,2}:\d{2}(?::\d{2})?(?:,\d{3})?\b/g;
  return texto
    .replace(patronTimestamps, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function generarPromptMinuta(textoReunion: string): string {
  const textoLimpio = limpiarTextoTranscripcion(textoReunion);

  return `# Eres un asistente especializado en la redacción de minutas de reuniones

A continuación, se te proporciona el texto transcrito de una reunión.
Tu tarea es analizar el contenido y generar una **minuta clara y estructurada** SIN EMOJIS que incluya:

- Objetivo de la reunión
- Temas tratados
- Decisiones tomadas
- Próximos pasos (con responsables y fechas límite)
- Comentarios adicionales o aclaraciones

Usa un formato profesional y directo, evitando redundancias y asegurando que la información sea fácil de seguir.
Usa una fuente grande para los títulos y subtítulos.
NO agregues saludos, frases de cortesía, ni sugerencias adicionales.
NO incluyas introducción ni cierre antes o después del contenido de la minuta.

Texto de la reunión:
"""${textoLimpio}"""

Genera la minuta de manera profesional, directa y bien organizada.
`;
}

function generarPromptChangelog(
  textoReunion: string,
  nombreProyecto: string,
  rama: string = "",
  loomLink: string = ""
): string {
  const textoLimpio = limpiarTextoTranscripcion(textoReunion);

  const encabezado = `##### ${nombreProyecto.toUpperCase()}\n`;
  const encabezadoRama = rama ? `#### ${rama}` : "####\n";

  return `# Eres un asistente especializado en desarrollo de software

Se te proporciona una transcripción hablada con información sobre cambios realizados en un proyecto llamado **${nombreProyecto}**.

Tu tarea es:

- Leer el texto cuidadosamente.
- Identificar todos los cambios, mejoras, correcciones y nuevas funcionalidades mencionadas.
- Generar una lista **directamente en formato Markdown plano**, usando \`-\` al inicio de cada línea para cada punto.
- La lista debe iniciar con el siguiente encabezado exacto (también en formato Markdown plano, sin bloques de código ni texto enriquecido):

\`\`\`md
${encabezado}${encabezadoRama}
\`\`\`
- Después del encabezado, incluye solo los puntos en forma de lista clara y concisa, usando viñetas con \`-\`.
- No expliques nada, no des contexto adicional.
- No generes texto enriquecido ni visualizaciones.
- La salida **debe ser estrictamente en Markdown plano, como si fuera para copiar y pegar en un archivo \`.md\`**.
- No uses cuadros de texto enriquecido ni "Output formatting".
- No encierres el resultado en bloques de código.
- Solo imprime el contenido en formato Markdown plano.
- No uses sublistas ni sangrías adicionales. Todo debe ir al mismo nivel.
- **Incluya el contenido dentro de un bloque de código Markdown (\` \`\`\`markdown ... \`\`\` \`)**
- **No renderice el Markdown como salida enriquecida**
- **Te dé exactamente lo que quieres copiar y pegar en un archivo \`.md\`**${
    loomLink
      ? `
- Al final de la lista de cambios, incluye el enlace de Loom como un elemento más de la lista usando \`-\` al mismo nivel que los otros puntos.`
      : ""
  }

Texto:
"""${textoLimpio}"""${
    loomLink
      ? `

Enlace de Loom a incluir al final de la lista:
${loomLink}`
      : ""
  }

Genera únicamente la lista de cambios en formato Markdown, empezando con el encabezado y usando \`-\` para cada ítem${
    loomLink
      ? `, incluyendo el enlace de Loom al final como otro elemento de la lista.`
      : "."
  }
`;
}
