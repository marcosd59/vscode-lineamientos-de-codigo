import * as vscode from "vscode";
import { js as beautify } from "js-beautify";

const beautifyOptions = {
  indent_size: 4,
  indent_char: " ",
  max_preserve_newlines: 1,
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: "keep",
  brace_style: "expand" as "expand",
  space_before_conditional: false,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: 0,
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
};

const diagnosticos = vscode.languages.createDiagnosticCollection(
  "lineamientosDeCodigo"
);

export function activate(context: vscode.ExtensionContext) {
  console.log('¡La extensión "lineamientos-de-codigo" ya está activa!');

  const formatJsWholeFile = vscode.commands.registerCommand(
    "lineamientos-de-codigo.formatJsCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay un editor activo.");
        return;
      }

      const document = editor.document;
      const originalCode = document.getText();

      try {
        let formattedCode = beautify(originalCode, beautifyOptions);

        const axiosPattern = /axios\.(get|post|put|delete)\([\s\S]*?\);/gm;
        formattedCode = formattedCode.replace(axiosPattern, (match) => {
          return match
            .replace(/\s+/g, " ")
            .replace(/\(\s+/g, "(")
            .replace(/\s+\)/g, ")");
        });

        formattedCode = formattedCode.trimEnd() + "\n";

        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(originalCode.length)
        );

        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, formattedCode);
        });

        vscode.window.showInformationMessage(
          "JavaScript formateado correctamente."
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Error al formatear el código: " + error
        );
      }
    }
  );

  vscode.workspace.onDidOpenTextDocument(verificarLineamientosJs);
  vscode.workspace.onDidChangeTextDocument((e) =>
    verificarLineamientosJs(e.document)
  );

  vscode.workspace.onDidOpenTextDocument(verificarLineamientosHTML);
  vscode.workspace.onDidChangeTextDocument((e) =>
    verificarLineamientosHTML(e.document)
  );

  vscode.workspace.textDocuments.forEach(verificarLineamientosHTML);
  vscode.workspace.textDocuments.forEach(verificarLineamientosJs);

  context.subscriptions.push(formatJsWholeFile);
}

function verificarLineamientosJs(document: vscode.TextDocument) {
  if ( document.languageId !== "javascript" &&
    document.languageId !== "typescript"
  ) {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    const text = line.text;

    // Regla 1: if con espacio o llave en la misma línea
    const regexIfMal = /if\s+\((.*?)\)\s*\{/;
    if (regexIfMal.test(text)) {
      const start = new vscode.Position(i, text.indexOf("if"));
      const end = new vscode.Position(i, text.length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "❌ El 'if' no debe tener espacio y las llaves deben ir en otro salto de línea.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    // Regla 1.5: else incorrecto
    const regexElseIncorrecto = /(\}?\s*)?else\s*\{/;
    if (regexElseIncorrecto.test(text)) {
      const match = text.match(regexElseIncorrecto);
      if (match) {
        const start = new vscode.Position(i, match.index ?? 0);
        const end = new vscode.Position(i, text.length);
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            "❌ El 'else' debe ir en una línea separada y la llave '{' debe abrirse en otra línea.",
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }

    // Regla 2: console.log
    const consoleLogIndex = text.indexOf("console.log");
    if (consoleLogIndex !== -1) {
      const start = new vscode.Position(i, consoleLogIndex);
      const end = new vscode.Position(
        i,
        consoleLogIndex + "console.log".length
      );
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "❌ Recuerda eliminar los 'console.log' antes de subir el código a producción.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    // Regla 3: alert
    const alertIndex = text.indexOf("alert(");
    if (alertIndex !== -1) {
      const start = new vscode.Position(i, alertIndex);
      const end = new vscode.Position(i, alertIndex + "alert".length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "❌ No utilizar 'alert()' para mostrar mensajes al usuario. Usa un toast en su lugar.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    // Regla 4: fetch
    const fetchIndex = text.indexOf("fetch(");
    if (fetchIndex !== -1) {
      const start = new vscode.Position(i, fetchIndex);
      const end = new vscode.Position(i, fetchIndex + "fetch".length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "❌ Evita usar 'fetch' para peticiones. Usa 'axios' en su lugar.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    // Regla 5: Variables en snake_case
    const variableRegex = /\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = variableRegex.exec(text)) !== null) {
      const variableName = match[2];
      const isSnakeCase = /^[a-z]+(_[a-z0-9]+)*$/.test(variableName);
      if (!isSnakeCase) {
        const start = new vscode.Position(
          i,
          match.index! + match[1].length + 1
        );
        const end = new vscode.Position(
          i,
          start.character + variableName.length
        );
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            `❌ El nombre de la variable '${variableName}' debe estar en snake_case.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }
  }

  diagnosticos.set(document.uri, diagnostics);
}

function verificarLineamientosHTML(document: vscode.TextDocument) {
  if (document.languageId !== "html") {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];

  for (let i = 0; i < document.lineCount - 1; i++) {
    const line = document.lineAt(i);
    const nextLine = document.lineAt(i + 1);

    const reglasEtiquetas = [
      { apertura: /<span\b[^>]*>/, cierre: /<\/span>/, nombre: "span" },
      { apertura: /<button\b[^>]*>/, cierre: /<\/button>/, nombre: "button" },
    ];

    for (const regla of reglasEtiquetas) {
      const aperturaMatch = line.text.match(regla.apertura);
      const cierreMatch = nextLine.text.match(regla.cierre);

      if (aperturaMatch && cierreMatch) {
        const start = new vscode.Position(
          i,
          line.text.indexOf("<" + regla.nombre)
        );
        const end = new vscode.Position(
          i + 1,
          nextLine.text.indexOf(`</${regla.nombre}>`) + regla.nombre.length + 3
        );
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            `❌ La etiqueta <${regla.nombre}> debe estar en una sola línea.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }
  }

  diagnosticos.set(document.uri, diagnostics);
}

export function deactivate() {
  diagnosticos.clear();
  diagnosticos.dispose();
}
