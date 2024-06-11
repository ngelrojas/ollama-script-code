"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocompleteCommand = void 0;
const vscode_1 = __importDefault(require("vscode"));
const config_1 = require("./config");
const ollamaConstant_1 = require("../constants/ollamaConstant");
let { numPredict } = require('./config');
numPredict = parseInt(numPredict);
const axios_1 = __importDefault(require("axios"));
const MessageHeaderSub_1 = require("./MessageHeaderSub");
async function autocompleteCommand(textEditor, cancellationToken) {
    const document = textEditor.document;
    const position = textEditor.selection.active;
    // Get the current prompt from editor
    let prompt = document.getText(new vscode_1.default.Range(document.lineAt(0).range.start, position));
    prompt = prompt.substring(Math.max(0, prompt.length - config_1.promptWindowSize), prompt.length);
    // Show a progress message
    vscode_1.default.window.withProgress({
        location: vscode_1.default.ProgressLocation.Notification,
        title: ollamaConstant_1.OLLAMA_COMMAND.TITLE,
        cancellable: true,
    }, async (progress, progressCancellationToken) => {
        try {
            progress.report({ message: ollamaConstant_1.OLLAMA_COMMAND.PROGRESS });
            let axiosCancelPost;
            const axiosCancelToken = new axios_1.default.CancelToken((c) => {
                const cancelPost = function () {
                    c(ollamaConstant_1.OLLAMA_COMMAND.CANCEL);
                };
                axiosCancelPost = cancelPost;
                if (cancellationToken) {
                    cancellationToken.onCancellationRequested(cancelPost);
                }
                progressCancellationToken.onCancellationRequested(cancelPost);
                vscode_1.default.workspace.onDidCloseTextDocument(cancelPost);
            });
            const response = await axios_1.default.post(config_1.apiEndpoint, {
                model: config_1.apiModel, // Change this to the model you want to use
                prompt: (0, MessageHeaderSub_1.messageHeaderSub)(textEditor.document) + prompt,
                stream: true,
                raw: true,
                options: {
                    num_predict: numPredict,
                    temperature: config_1.apiTemperature,
                    stop: ["```"]
                }
            }, {
                cancelToken: axiosCancelToken,
                responseType: 'stream'
            });
            //tracker
            let currentPosition = position;
            response.data.on('data', async (d) => {
                progress.report({ message: ollamaConstant_1.OLLAMA_COMMAND.GENERATING });
                // Check for user input (cancel)
                if (currentPosition.line !== textEditor.selection.end.line || currentPosition.character !== textEditor.selection.end.character) {
                    axiosCancelPost(); // cancel axios => cancel finished promise => close notification
                    return;
                }
                // Get a completion from the response
                const completion = JSON.parse(d.toString()).response;
                // lastToken = completion;
                if (completion === "") {
                    return;
                }
                //complete edit for token
                const edit = new vscode_1.default.WorkspaceEdit();
                edit.insert(document.uri, currentPosition, completion);
                await vscode_1.default.workspace.applyEdit(edit);
                // Move the cursor to the end of the completion
                const completionLines = completion.split("\n");
                const newPosition = new vscode_1.default.Position(currentPosition.line + completionLines.length - 1, (completionLines.length > 1 ? 0 : currentPosition.character) + completionLines[completionLines.length - 1].length);
                const newSelection = new vscode_1.default.Selection(position, newPosition);
                currentPosition = newPosition;
                // completion bar
                progress.report({ message: ollamaConstant_1.OLLAMA_COMMAND.GENERATING, increment: 1 / (numPredict / 100) });
                // move cursor
                textEditor.selection = newSelection;
            });
            // Keep cancel window available
            const finished = new Promise((resolve) => {
                response.data.on('end', () => {
                    progress.report({ message: ollamaConstant_1.OLLAMA_COMMAND.FINISHED });
                    resolve(true);
                });
                axiosCancelToken.promise.finally(() => {
                    resolve(false);
                });
            });
            await finished;
        }
        catch (err) {
            vscode_1.default.window.showErrorMessage(`${ollamaConstant_1.OLLAMA_COMMAND.ERROR}: ${err.message}`);
        }
    });
}
exports.autocompleteCommand = autocompleteCommand;
//# sourceMappingURL=command.js.map