const stream = require('stream');
const vscode = require('vscode');
const { exec } = require('child_process');
const packageJson = require('./package.json');

const BIN = 'C:\\Users\\Kamil\\AppData\\Roaming\\Sublime Text 3\\Packages\\refucktoring\\dist\\index.js';

const commands = packageJson.contributes.commands;

const registerCommand = (context, { command }) => {
    const id = command.replace('extension.', '').replace(/_/g, '-');
    const settings = JSON.stringify({});

    const { code, editor, selection } = getEditingData();

    const disposable = vscode.commands.registerCommand(command, () => {
        const child = exec(`node "${BIN}" -r ${id} -s "${settings}"`, (error, stdout, stderr) => {
            const refactoredCode = error || stderr || stdout;
            editor.edit((builder) => {
                builder.replace(selection, '');
                builder.insert(new vscode.Position(0, 0), refactoredCode);
            });
        });

        const stdinStream = new stream.Readable();
        stdinStream.push(code);
        stdinStream.push(null);
        stdinStream.pipe(child.stdin);
    });

    context.subscriptions.push(disposable);
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
            new vscode.Position(editor.document.lineCount, 0)
        ));
    }
    return editor.selection;
};

const getCode = (editor) => editor ? editor.document.getText() : '';

exports.activate = (context) => commands.forEach(
    (command) => registerCommand(context, command)
);

exports.deactivate = () => null;

