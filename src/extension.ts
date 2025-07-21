import * as vscode from "vscode";
import { js as beautify } from "js-beautify";
import * as crudApiCommands from "./commands/crudApiCommands";
import * as contentGenerationCommands from "./commands/contentGenerationCommands";

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

let validacionActiva: boolean;
let trailingSpacesActivos: boolean;

const diagnosticos = vscode.languages.createDiagnosticCollection(
  "lineamientosDeCodigo"
);

const TrailingSpacesDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255, 0, 0, 0.3)",
  borderRadius: "3px",
});

export function activate(context: vscode.ExtensionContext) {
  console.log('¡La extensión "lineamientos-de-codigo" ya está activa!');

  // Validaciones de código
  validacionActiva =
    context.globalState.get<boolean>("validacionActiva") ?? true;

  // Trailing spaces
  trailingSpacesActivos =
    context.globalState.get<boolean>("trailingSpacesActivos") ?? true;

  // Configuración del decorador para espacios finales
  const helpProvider = new HelpAndFeedbackProvider();
  vscode.window.registerTreeDataProvider("lineamientosHelpView", helpProvider);

  const formatJsWholeFile = vscode.commands.registerCommand(
    "lineamientos-de-codigo.formatJsCode",
    async () => {
      // Verificar si hay un editor activo
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay un editor activo.");
        return;
      }

      const document = editor.document;

      // Verificar si el documento es un archivo JavaScript
      if (document.languageId !== "javascript") {
        vscode.window.showErrorMessage(
          "Este formateador solo funciona con archivos JavaScript (.js)."
        );
        return;
      }

      const originalCode = document.getText();

      try {
        let formattedCode = beautify(originalCode, beautifyOptions);

        // Separar métodos y funciones con una línea en blanco
        formattedCode = formattedCode.replace(
          /^(\s*)},\s*\n(\s*)([\w$]+:\s*(async\s+)?function(\s+\w+)?\s*\(|(async\s+)?[\w$]+\s*\()/gm,
          "$1},\n\n$2$3"
        );

        // Separar métodos de objeto (versión simplificada)
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*function\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Separar métodos async también
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*(?:async\s+)?function(?:\s+\w+)?\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Detecta notación abreviada con o sin async
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Detecta también forma `nombre: async function()`
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*async\s+function\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Separar la creación de Vue con línea extra
        formattedCode = formattedCode.replace(
          /([^\n])\n(\s*(var|let|const)\s+\w+\s*=\s*new\s+Vue\s*\()/g,
          "$1\n\n$2"
        );

        // Separar la creación Vue con línea extra
        formattedCode = formattedCode.replace(
          /([^\n])(\s*Vue\.(directive|filter|mixin|use|component)\s*\()/g,
          "$1\n$2"
        );

        // Compactar objetos o arrays vacíos en una sola línea
        formattedCode = formattedCode.replace(
          /(\w+):\s*\n\s*(\{\}|\[\]|\[\{\},?\])(\s*,?)/g,
          (match, key, estructura, coma) =>
            `${key}: ${estructura}${coma || ","}`
        );

        // Compactar condiciones if multilinea if(a && b && c)
        formattedCode = formattedCode.replace(
          /if\s*\(\s*\n([\s\S]*?)\n\s*\)/gm,
          (match, condiciones) => {
            const oneLiner = condiciones
              .split("\n")
              .map((line: string) => line.trim())
              .join(" ")
              .replace(/\s+/g, " ");
            return `if(${oneLiner})`;
          }
        );

        // Compactar argumentos de funciones multilinea
        formattedCode = formattedCode.replace(
          /(:\s*(?:async\s+)?function\s*)\(\s*\n([\s\S]*?)\n\s*\)/gm,
          (match, funcPrefix, argsBloque) => {
            const argumentos = argsBloque
              .split("\n")
              .map((line: string) => line.trim().replace(/,$/, ""))
              .filter((line: string) => line.length > 0)
              .join(", ");
            return `${funcPrefix}(${argumentos})`;
          }
        );

        // Compactar asignaciones multilinea const miValor = obtenerValorLargo().config().final();
        formattedCode = formattedCode.replace(
          /\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\n\s*([\s\S]*?);/gm,
          (match, tipo, nombre, expresion) => {
            const unaLinea = expresion
              .split("\n")
              .map((line: string) => line.trim())
              .join(" ")
              .replace(/\s+/g, " ");
            return `${tipo} ${nombre} = ${unaLinea};`;
          }
        );

        // Compactar ternarios multilinea resultado = condicion ? valorSiVerdadero : valorSiFalso;
        formattedCode = formattedCode.replace(
          /^(\s*)([^\n;]+=\s*[^\n?:]+)\?\s*\n\s*([^\n]+)\s*:\s*\n\s*([^\n;]+);/gm,
          (match, indent, condicion, valorTrue, valorFalse) => {
            const compactado = `${condicion.trim()} ? ${valorTrue.trim()} : ${valorFalse.trim()};`;
            return `${indent}${compactado}`;
          }
        );

        // Compactar peticiones axios mal formateadas
        const axiosPattern =
          /(await\s+)?axios\s*\.\s*(get|post|put|delete)\s*\(\s*([\s\S]*?)\s*\)/gm;

        formattedCode = formattedCode.replace(
          axiosPattern,
          (match, awaitKeyword, method, insideParens) => {
            const compressed = insideParens.replace(/\s+/g, " ").trim();
            return `${awaitKeyword || ""}axios.${method}(${compressed})`;
          }
        );

        formattedCode = formattedCode.trimEnd() + "\n";

        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(originalCode.length)
        );

        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, formattedCode);
        });

        // Actualizar la configuración del editor a 4 tabulaciones
        await vscode.workspace
          .getConfiguration("editor", document.uri)
          .update("tabSize", 4, vscode.ConfigurationTarget.Workspace);

        await vscode.workspace
          .getConfiguration("editor", document.uri)
          .update("insertSpaces", true, vscode.ConfigurationTarget.Workspace);

        vscode.window.showInformationMessage(
          "JavaScript formateado correctamente."
        );

        // Actualizar el formato del archivo a 4 tabulaciones
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          activeEditor.options.tabSize = 4;
          activeEditor.options.insertSpaces = true;
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Error al formatear el código: " + error + "."
        );
      }
    }
  );

  const formatJsSelection = vscode.commands.registerCommand(
    "lineamientos-de-codigo.formatJsSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay un editor activo.");
        return;
      }

      const document = editor.document;
      if (document.languageId !== "javascript") {
        vscode.window.showErrorMessage(
          "Este formateador solo funciona con archivos JavaScript (.js)."
        );
        return;
      }

      const selection = editor.selection;
      const selectedText = document.getText(selection);

      if (!selectedText.trim()) {
        vscode.window.showWarningMessage("No hay código seleccionado.");
        return;
      }

      try {
        let formattedCode = beautify(selectedText, beautifyOptions);

        formattedCode = formattedCode.replace(
          /^(\s*)},\s*\n(\s*)([\w$]+:\s*(async\s+)?function(\s+\w+)?\s*\(|(async\s+)?[\w$]+\s*\()/gm,
          "$1},\n\n$2$3"
        );

        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*function\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*(?:async\s+)?function(?:\s+\w+)?\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        formattedCode = formattedCode.replace(
          /([^\n])\n(\s*(var|let|const)\s+\w+\s*=\s*new\s+Vue\s*\()/g,
          "$1\n\n$2"
        );

        // Detecta notación abreviada con o sin async
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Detecta también forma `nombre: async function()`
        formattedCode = formattedCode.replace(
          /^(\s*[\w$]+:\s*async\s+function\s*\([\s\S]*?\}\s*),\s*\n(\s*[\w$]+:)/gm,
          "$1,\n\n$2"
        );

        // Separar la creación Vue con línea extra
        formattedCode = formattedCode.replace(
          /([^\n])(\s*Vue\.(directive|filter|mixin|use|component)\s*\()/g,
          "$1\n$2"
        );

        // Compactar objetos o arrays vacíos en una sola línea
        formattedCode = formattedCode.replace(
          /(\w+):\s*\n\s*(\{\}|\[\]|\[\{\},?\])(\s*,?)/g,
          (match, key, estructura, coma) =>
            `${key}: ${estructura}${coma || ","}`
        );

        formattedCode = formattedCode.replace(
          /if\s*\(\s*\n([\s\S]*?)\n\s*\)/gm,
          (match, condiciones) => {
            const oneLiner = condiciones
              .split("\n")
              .map((line: string) => line.trim())
              .join(" ")
              .replace(/\s+/g, " ");
            return `if(${oneLiner})`;
          }
        );

        formattedCode = formattedCode.replace(
          /(:\s*(?:async\s+)?function\s*)\(\s*\n([\s\S]*?)\n\s*\)/gm,
          (match, funcPrefix, argsBloque) => {
            const argumentos = argsBloque
              .split("\n")
              .map((line: string) => line.trim().replace(/,$/, ""))
              .filter((line: string) => line.length > 0)
              .join(", ");
            return `${funcPrefix}(${argumentos})`;
          }
        );

        formattedCode = formattedCode.replace(
          /\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\n\s*([\s\S]*?);/gm,
          (match, tipo, nombre, expresion) => {
            const unaLinea = expresion
              .split("\n")
              .map((line: string) => line.trim())
              .join(" ")
              .replace(/\s+/g, " ");
            return `${tipo} ${nombre} = ${unaLinea};`;
          }
        );

        formattedCode = formattedCode.replace(
          /^(\s*)([^\n;]+=\s*[^\n?:]+)\?\s*\n\s*([^\n]+)\s*:\s*\n\s*([^\n;]+);/gm,
          (match, indent, condicion, valorTrue, valorFalse) => {
            const compactado = `${condicion.trim()} ? ${valorTrue.trim()} : ${valorFalse.trim()};`;
            return `${indent}${compactado}`;
          }
        );

        formattedCode = formattedCode.replace(
          /(await\s+)?axios\s*\.\s*(get|post|put|delete)\s*\(\s*([\s\S]*?)\s*\)/gm,
          (match, awaitKeyword, method, insideParens) => {
            const compressed = insideParens.replace(/\s+/g, " ").trim();
            return `${awaitKeyword || ""}axios.${method}(${compressed})`;
          }
        );

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, formattedCode.trimEnd());
        });

        vscode.window.showInformationMessage(
          "Selección JavaScript formateada correctamente."
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Error al formatear la selección: " + error
        );
      }
    }
  );

  const toggleValidacion = vscode.commands.registerCommand(
    "lineamientos-de-codigo.toggleValidacion",
    () => {
      validacionActiva = !validacionActiva;
      context.globalState.update("validacionActiva", validacionActiva);

      if (!validacionActiva) {
        diagnosticos.clear();
      } else {
        vscode.workspace.textDocuments.forEach(verificarLineamientosJs);
      }

      const estado = validacionActiva ? "activada" : "desactivada";
      vscode.window.showInformationMessage(
        `Validación de lineamientos ${estado}.`
      );
    }
  );

  const toggleTrailingSpaces = vscode.commands.registerCommand(
    "lineamientos-de-codigo.toggleTrailingSpaces",
    () => {
      trailingSpacesActivos = !trailingSpacesActivos;
      context.globalState.update(
        "trailingSpacesActivos",
        trailingSpacesActivos
      );

      if (!trailingSpacesActivos) {
        vscode.window.visibleTextEditors.forEach((editor) => {
          editor.setDecorations(TrailingSpacesDecoration, []);
        });
      } else {
        vscode.window.visibleTextEditors.forEach((editor) => {
          TrailingSpaces(editor);
        });
      }

      const estado = trailingSpacesActivos ? "activado" : "desactivado";
      vscode.window.showInformationMessage(`Resaltado de espacios ${estado}.`);
    }
  );

  crudApiCommands.registerGetApiCommand(context);
  crudApiCommands.registerPostApiCommand(context);
  crudApiCommands.registerPutApiCommand(context);
  crudApiCommands.registerDeleteApiCommand(context);

  contentGenerationCommands.registerMinutePromptCommand(context);
  contentGenerationCommands.registerChangelogCommand(context);

  let debounceTimer: NodeJS.Timeout | undefined;

  context.subscriptions.push(
    formatJsWholeFile,
    formatJsSelection,
    toggleValidacion,
    toggleTrailingSpaces,

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        verificarLineamientosJs(event.document);

        const editor = vscode.window.visibleTextEditors.find(
          (e) => e.document === event.document
        );
        if (editor && trailingSpacesActivos) {
          TrailingSpaces(editor);
        }
      }, 200);
    }),

    vscode.workspace.onDidSaveTextDocument((document) => {
      verificarLineamientosJs(document);
      const editor = vscode.window.visibleTextEditors.find(
        (e) => e.document === document
      );
      if (editor && trailingSpacesActivos) {
        TrailingSpaces(editor);
      }
    }),

    vscode.workspace.onDidOpenTextDocument((document) => {
      verificarLineamientosJs(document);
      const editor = vscode.window.visibleTextEditors.find(
        (e) => e.document === document
      );
      if (editor && trailingSpacesActivos) {
        TrailingSpaces(editor);
      }
    }),

    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && trailingSpacesActivos) {
        TrailingSpaces(editor);
      }
    })
  );

  vscode.workspace.textDocuments.forEach(verificarLineamientosJs);
  vscode.window.visibleTextEditors.forEach((editor) => {
    if (trailingSpacesActivos) {
      TrailingSpaces(editor);
    }
  });
}

function verificarLineamientosJs(document: vscode.TextDocument) {
  if (!validacionActiva) {
    return;
  }

  if (
    document.languageId !== "javascript" &&
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
          "❌ Recuerda eliminar los 'console.log' antes de subir el código.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    // Regla 3: alert
    const alertRegex = /\balert\s*\(/g;
    let match_3;
    while ((match_3 = alertRegex.exec(text)) !== null) {
      const alertIndex = match_3.index;
      const start = new vscode.Position(i, alertIndex);
      const end = new vscode.Position(i, alertIndex + "alert".length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "❌ No uses alert() para mensajes. Usa un 'toastr' en su lugar.",
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

    // Regla 5: Variables en snake_case, omitir camelCase que comiencen con "app"
    const variableRegex = /\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = variableRegex.exec(text)) !== null) {
      const variableName = match[2];

      const isException = /^app[A-Z]/i.test(variableName);

      if (!isException) {
        const isSnakeCase = /^([a-z]+|[A-Z]+)(_([a-z0-9]+|[A-Z0-9]+))*$/.test(
          variableName
        );
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
              `❌ La variable '${variableName}' debe estar en snake_case.`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
      }
    }

    // Regla 6: Nombres de funciones en snake_case
    const objectMethodRegex =
      /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(?:async\s*)?function\s*\(/g;
    let functionMatch;
    while ((functionMatch = objectMethodRegex.exec(text)) !== null) {
      const functionName = functionMatch[1];

      const isSnakeCase = /^[a-z]+(_[a-z0-9]+)*$/.test(functionName);

      if (!isSnakeCase) {
        const start = new vscode.Position(i, functionMatch.index!);
        const end = new vscode.Position(
          i,
          start.character + functionName.length
        );
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            `❌ El nombre de la función '${functionName}' debe estar en snake_case.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }
  }

  diagnosticos.set(document.uri, diagnostics);
}

function TrailingSpaces(editor: vscode.TextEditor) {
  const decoraciones: vscode.DecorationOptions[] = [];

  for (let i = 0; i < editor.document.lineCount; i++) {
    const linea = editor.document.lineAt(i);
    const texto = linea.text;
    const match = texto.match(/\s+$/);

    if (match) {
      const startPos = new vscode.Position(i, texto.length - match[0].length);
      const endPos = new vscode.Position(i, texto.length);

      decoraciones.push({
        range: new vscode.Range(startPos, endPos),
      });
    }
  }

  editor.setDecorations(TrailingSpacesDecoration, decoraciones);
}

class HelpAndFeedbackProvider implements vscode.TreeDataProvider<HelpItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HelpItem | undefined> =
    new vscode.EventEmitter<HelpItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<HelpItem | undefined> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: HelpItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<HelpItem[]> {
    return Promise.resolve([
      new HelpItem(
        "Get Started",
        "https://github.com/marcosd59/vscode-lineamientos-de-codigo/blob/master/README.md",
        "star"
      ),
      new HelpItem(
        "Report a Bug",
        "https://github.com/marcosd59/vscode-lineamientos-de-codigo/issues/new/choose",
        "bug"
      ),
      new HelpItem(
        "Send Feedback",
        "mailto:damian.marcospool@gmail.com",
        "comment"
      ),
      new HelpItem(
        "View Open Issues",
        "https://github.com/marcosd59/vscode-lineamientos-de-codigo/issues",
        "issues"
      ),
      new HelpItem(
        "Made with ❤️ by Marcos Pool",
        "https://www.linkedin.com/in/marcosd59/",
        "account"
      ),
    ]);
  }
}
class HelpItem extends vscode.TreeItem {
  constructor(label: string, url: string, codicon: string) {
    super(label);
    this.command = {
      command: "vscode.open",
      title: label,
      arguments: [vscode.Uri.parse(url)],
    };
    this.iconPath = new vscode.ThemeIcon(codicon);
  }
}
