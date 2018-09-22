const vscode = require('vscode');
const packageJson = require('./package.json');
const { WARMUP_CODE, WARMUP_COUNT, WARMUP_REFACTORING } = require('./warm-up');

const BIN = 'C:\\Users\\Kamil\\AppData\\Roaming\\Sublime Text 3\\Packages\\refucktoring\\dist\\index.js';
const API = require(BIN);
const license = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImthbWlsIGFkYW0gbWllbG5payIsImVtYWlsIjoibGVlMjA3QGdtYWlsLmNvbSIsImtleSI6ImM5NTJmNGU5MWUxMmMwZGE1ODllYmU5YmEwOGNjMTkzMDhlNDBiNmM5NjBlNGFjNDRmNTZjNGRkZGQ1Y2Y0NTMiLCJpYXQiOjE1MzczOTMyNjZ9.mlAotRoyZKq2I4GOUwNoW_o4ajU7Y1mZPZxBi-IW81Cdv1nlVBGnO0EviE9iN_EkOAHUplRsppHiN-1ndGEiNgYwpQLAnmcsZLBCwQSpkvVK5QKPmG7RwQGuXD6xaA4zHJzTjnX5kd3cmbHNV85oeZoowV-Gs2hhmpqZZmaJLaFZUFwgqHzrfWT-l5_PmGQ0E5jaR3P0GvwODhAZRXxL7P9GIqiv5NsZG4IqZlnqYreLm9quejIijYlBiyEZHvqQAUJQzQFWNXi5pkQgNiEbOz8qzxT3wgySYeVjceLyUzhr4mh8jOFgtn8ssRkaBRme2NnYjqv3DxwvLUyBp8aAYA';

const registerCommand = (context, { command }) => {
  const disposable = vscode.commands.registerCommand(command, () => {
    const { code, editor, selection } = getEditingData();
    const refactoring = command.replace('extension.', '').replace(/_/g, '-');
    const refactoredCode = refactor({ code, refactoring });
    editor.edit((builder) => builder.replace(selection, refactoredCode));
  });
  context.subscriptions.push(disposable);
};

const refactor = ({ code, refactoring }) => {
  try {
    return API({
      code,
      license,
      refactoring,
      settings: getConfiguration()
    });
  } catch (error) {
    return String(error);
  }
};

const warmUp = () => {
  for (let i = 0; i < WARMUP_COUNT; ++i) {
    API({
      code: WARMUP_CODE,
      license,
      refactoring: WARMUP_REFACTORING
    });
  }
};

const getEditingData = () => {
  const editor = vscode.window.activeTextEditor;
  let selection = getSelection(editor);
  let code = getCode(editor, selection);
  return { code, editor, selection };
};

const getSelection = (editor) => {
  if (editor.selection.isEmpty) {
    return new editor.document.validateRange(new vscode.Range(
      new vscode.Position(0, 0),
      new vscode.Position(editor.document.lineCount + 100, 0)
    ));
  }
  return editor.selection;
};

const getConfiguration = () => {
  const configuration = vscode.workspace.getConfiguration('r-factor');
  return Object.keys(packageJson.contributes.configuration.properties).reduce(
    (config, key) => {
      const name = key.split('.')[1];
      return Object.assign({}, config, {
        [name]: configuration[name]
      });
    },
    {}
  );
};

const getCode = (editor, selection) => editor ? editor.document.getText(selection) : '';

exports.activate = (context) => {
  warmUp();
  packageJson.contributes.commands.forEach(
    (command) => registerCommand(context, command)
  );
};

exports.deactivate = () => null;
