"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletionItems = void 0;
const vscode_1 = __importDefault(require("vscode"));
const config_1 = require("./config");
let { responsePreviewMaxTokens } = require('./config');
responsePreviewMaxTokens = parseInt(responsePreviewMaxTokens);
const axios_1 = __importDefault(require("axios"));
const ollamaConstant_1 = require("../constants/ollamaConstant");
const MessageHeaderSub_1 = require("./MessageHeaderSub");
async function provideCompletionItems(document, position, cancellationToken) {
    // Create a completion item
    const item = new vscode_1.default.CompletionItem(ollamaConstant_1.OLLAMA_COMMAND.COMPLETE);
    // Set the insert text to a placeholder
    item.insertText = new vscode_1.default.SnippetString('${1:}');
    // Wait before initializing Ollama to reduce compute usage
    if (config_1.responsePreview)
        await new Promise(resolve => setTimeout(resolve, config_1.responsePreviewDelay * 1000));
    if (cancellationToken.isCancellationRequested) {
        return [item];
    }
    // Set the label & inset text to a shortened, non-stream response
    if (config_1.responsePreview) {
        let prompt = document.getText(new vscode_1.default.Range(document.lineAt(0).range.start, position));
        prompt = prompt.substring(Math.max(0, prompt.length - config_1.promptWindowSize), prompt.length);
        const response_preview = await axios_1.default.post(config_1.apiEndpoint, {
            model: config_1.apiModel, // Change this to the model you want to use
            prompt: (0, MessageHeaderSub_1.messageHeaderSub)(document) + prompt,
            stream: false,
            raw: true,
            options: {
                num_predict: responsePreviewMaxTokens, // reduced compute max
                temperature: config_1.apiTemperature,
                stop: ['\n', '```']
            }
        }, {
            cancelToken: new axios_1.default.CancelToken((c) => {
                const cancelPost = function () {
                    c(ollamaConstant_1.OLLAMA_COMMAND.CANCEL);
                };
                cancellationToken.onCancellationRequested(cancelPost);
            })
        });
        if (response_preview.data.response.trim() !== "") { // default if empty
            item.label = response_preview.data.response.trimStart(); // tended to add whitespace at the beginning
            item.insertText = response_preview.data.response.trimStart();
        }
    }
    // Set the documentation to a message
    item.documentation = new vscode_1.default.MarkdownString(ollamaConstant_1.OLLAMA_COMMAND.PRESS);
    // Set the command to trigger the completion
    if (config_1.continueInline || !config_1.responsePreview) {
        item.command = {
            command: 'mylocal-autocoder.autocomplete',
            title: ollamaConstant_1.OLLAMA_COMMAND.TITLE,
            arguments: [cancellationToken]
        };
    }
    // Return the completion item
    return [item];
}
exports.provideCompletionItems = provideCompletionItems;
//# sourceMappingURL=provider.js.map