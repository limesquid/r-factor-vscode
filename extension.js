const stream = require('stream');
const vscode = require('vscode');
const { exec } = require('child_process');
const packageJson = require('./package.json');

const BIN = 'C:\\Users\\Kamil\\AppData\\Roaming\\Sublime Text 3\\Packages\\refucktoring\\dist\\index.js';

const registerCommand = (context, { command }) => {
    const disposable = vscode.commands.registerCommand(command, () => {
        const { code, editor, selection } = getEditingData();
        const executableCommand = getExecutableCommand(command);
        const child = exec(executableCommand, (error, stdout, stderr) => {
            const refactoredCode = error || stderr || stdout;
            editor.edit((builder) => builder.replace(selection, refactoredCode));
        });
        const stdinStream = new stream.Readable();
        stdinStream.push(code);
        stdinStream.push(null);
        stdinStream.pipe(child.stdin);
    });

    context.subscriptions.push(disposable);
};

const getExecutableCommand = (command) => {
    const id = command.replace('extension.', '').replace(/_/g, '-');
    const configuration = getConfiguration();
    const NODE_BIN = configuration['NODE_BIN'];
    const settings = JSON.stringify(configuration);
    return [
        NODE_BIN, `"${BIN}"`,
        '-r', id,
        '-s', settings.replace(/"/g, '\\"')
    ].join(' ');
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
            return {
                ...config,
                [name]: configuration[name]
            };
        },
        {}
    );
};

const getCode = (editor, selection) => editor ? editor.document.getText(selection) : '';

exports.activate = (context) => packageJson.contributes.commands.forEach(
    (command) => registerCommand(context, command)
);

exports.deactivate = () => null;
