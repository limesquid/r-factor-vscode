const vscode = require('vscode');
const packageJson = require('./package.json');
const { WARMUP_CODE, WARMUP_COUNT, WARMUP_REFACTORING } = require('./warm-up');
const rFactor = require('./r-factor');
const { readLicense, writeLicense } = require('./license-utils');

const refactoringCommands = [
  'add_classname',
  'connect',
  'connect_map_dispatch_to_props',
  'connect_map_state_to_props',
  'connect_merge_props',
  'convert_svg_to_component',
  'convert_to_arrow_component',
  'convert_to_class_component',
  'convert_to_function_component',
  'disconnect',
  'disconnect_map_dispatch_to_props',
  'disconnect_map_state_to_props',
  'disconnect_merge_props',
  'generate_prop_types',
  'move_default_props_and_prop_types_out_of_class',
  'move_default_props_and_prop_types_to_class',
  'sort_attributes',
  'sort_imports',
  'toggle_component_type',
  'toggle_with_router_hoc'
];

const registerRefactoringCommand = (context, command) => {
  const disposable = vscode.commands.registerCommand(`extension.${command}`, () => {
    const { code, editor, selection } = getEditingData();
    const refactoring = command.replace(/_/g, '-');
    const refactoredCode = refactor({ code, refactoring });
    editor.edit((builder) => builder.replace(selection, refactoredCode));
  });
  context.subscriptions.push(disposable);
};

const refactor = ({ code, refactoring }) => {
  try {
    return rFactor({
      code,
      license: readLicense(),
      refactoring,
      settings: getConfiguration()
    });
  } catch (error) {
    return String(error);
  }
};

const warmUp = () => {
  const license = readLicense();
  if (license) {
    for (let i = 0; i < WARMUP_COUNT; ++i) {
      rFactor({
        code: WARMUP_CODE,
        license,
        refactoring: WARMUP_REFACTORING
      });
    }
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

  const disposable = vscode.commands.registerCommand('extension.enter_license_key', () => {
    vscode.window.showInputBox({ prompt: 'Enter your R-Factor license key' })
      .then(writeLicense)
      .then(() => {
        warmUp();
        vscode.window.showInformationMessage('Your R-Factor license key has been successfully added.');
      });
  });
  context.subscriptions.push(disposable);

  refactoringCommands.forEach((command) => registerRefactoringCommand(context, command));
};

exports.deactivate = () => null;
