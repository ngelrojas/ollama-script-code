"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const listModels_1 = require("./services/listModels");
const ollamaRunning_1 = require("./modules/ollamaRunning");
const ollamaConstant_1 = require("./constants/ollamaConstant");
const ollamaViewProvider_1 = require("./views/ollamaViewProvider");
const config_1 = require("./autocomplete/config");
const command_1 = require("./autocomplete/command");
const provider_1 = require("./autocomplete/provider");
(0, config_1.updateVSConfig)();
vscode.workspace.onDidChangeConfiguration(config_1.updateVSConfig);
function activate(context) {
    const provider = new ollamaViewProvider_1.OllamaViewProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("ollama-chat-pilot", provider));
    (0, ollamaRunning_1.checkOllamaRunning)();
    context.subscriptions.push(vscode.commands.registerCommand("ollama-script-code.openSettings", async () => {
        const panel = vscode.window.createWebviewPanel("myExtensionSettings", ollamaConstant_1.OLLAMA_SETTING.TITLES.SETTINGS, vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = await getWebviewContent(panel.webview, context);
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "save":
                    const config = vscode.workspace.getConfiguration("ollama-script-code");
                    config
                        .update("model", message.value, vscode.ConfigurationTarget.Global)
                        .then(() => {
                        vscode.window.showInformationMessage(`${ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_SET_TO} ${message.value}`);
                    });
                    break;
                case 'saveParameters':
                    const configParameters = vscode.workspace.getConfiguration("ollama-script-code");
                    configParameters.update('max tokens predicted', message.value.maxTokensPredicted, vscode.ConfigurationTarget.Global);
                    configParameters.update('prompt window size', message.value.promptWindowSize, vscode.ConfigurationTarget.Global);
                    configParameters.update('completion keys', message.value.completionKeys, vscode.ConfigurationTarget.Global);
                    configParameters.update('response preview', message.value.responsePreview, vscode.ConfigurationTarget.Global);
                    configParameters.update('preview max tokens', message.value.previewMaxTokens, vscode.ConfigurationTarget.Global);
                    configParameters.update('preview delay', message.value.previewDelay, vscode.ConfigurationTarget.Global);
                    configParameters.update('continue inline', message.value.continueInline, vscode.ConfigurationTarget.Global);
                    configParameters.update('temperature', message.value.temperature, vscode.ConfigurationTarget.Global);
                    vscode.window.showInformationMessage('Parameters saved successfully!');
                    return;
            }
        }, undefined, context.subscriptions);
    }));
    const completionProvider = vscode.languages.registerCompletionItemProvider("*", {
        provideCompletionItems: provider_1.provideCompletionItems
    }, ...config_1.completionKeys.split(""));
    const externalAutocompleteCommand = vscode.commands.registerTextEditorCommand("ollama-script-code.autocomplete", (textEditor, _, cancellationToken) => {
        (0, command_1.autocompleteCommand)(textEditor, cancellationToken);
    });
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(externalAutocompleteCommand);
}
exports.activate = activate;
async function retrieveModelList(inputModels) {
    try {
        const response = await (0, listModels_1.ListModels)();
        if (response.models.length === 0) {
            vscode.window.showInformationMessage(`${ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_FOUND} ${response.models.length}`);
            vscode.window.showInformationMessage(ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_NOT_FOUND);
            return "";
        }
        const config = vscode.workspace.getConfiguration("ollama-script-code");
        const modelStored = config.get("model");
        response.models.forEach((model) => {
            let modelName = model.model.split(":")[0];
            if (modelStored === modelName) {
                inputModels += `<label id="model-name" class="label-model-input" for=${modelName}><input type="radio" id=${modelName} name="model" checked> ${modelName}</label>`;
            }
            else {
                inputModels += `<label id="model-name" class="label-model-input" for=${modelName}><input type="radio" id=${modelName} name="model" /> ${modelName}</label>`;
            }
        });
        return inputModels;
    }
    catch (e) {
        vscode.window.showErrorMessage(ollamaConstant_1.OLLAMA_MSG_ERROR.OLLAMA_NOT_RUNNING);
        console.error(e);
    }
}
async function getWebviewContent(webview, context) {
    const stylesTailwindCssUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwind.min.css"));
    const stylesSettingsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.css"));
    const scriptTailwindJsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwindcss.3.2.4.min.js"));
    const scriptSettingsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.js"));
    let inputModels = "";
    let ListInputModels = await retrieveModelList(inputModels);
    return `<!DOCTYPE html>
  <html lang="en">
      <head>
        <link href='${stylesTailwindCssUri}' rel="stylesheet" />
        <link href='${stylesSettingsUri}' rel="stylesheet" />
       <script src="${scriptTailwindJsUri}"></script>
       <script src="${scriptSettingsUri}"></script>
        <title>${ollamaConstant_1.OLLAMA_SETTING.TITLES.SETTINGS}</title>
    </head>
  
  <body>
    <main>
    
        <div class="relative mx-auto min-h-screen max-w-3xl text-gray-300">
          <div class="flex p-4 gap-x-4">
            <div class="flex w-1/3 flex-col gap-y-2 border p-2">
              <div data-tab-id="models" class="tab bg-gray-600 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500 active">${ollamaConstant_1.OLLAMA_SETTING.MENU.MODEL}</div>
              <div data-tab-id="parameters" class="tab bg-gray-600 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500">${ollamaConstant_1.OLLAMA_SETTING.MENU.PARAMETERS}</div>
            </div>
    
    <div class="flex-grow border p-2 pl-10 text-sm">
      <div class="tabContent flex flex-col gap-y-4" id="models">
        <div class="flex">
          <form class="form-save-model" id="settingsForm">
              <section class="section-list-models-">
                ${ListInputModels}
              </section>
              <button type="submit" class="input-save-model bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">save</button>
          </form>
        </div>  
      </div>
      
      <div class="tabContent hidden" id="parameters">
          <form id="parametersForm">
            <div class="flex py-2">
               <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.NUMBER_PREDICTION}</span>
              <label for="numPredict" class="relative inline-flex cursor-pointer items-center">
                <input id="numPredict" type="number" value=${config_1.numPredict} min="1000" name="numPredict" class="text-black p-1 rounded ml-10" />
              </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.WIN_SIZE}</span>
                <label for="promptWindowSize" class="relative inline-flex cursor-pointer items-center">
                    <input id="promptWindowSize" type="number" value=${config_1.promptWindowSize} min="2048" name="promptWindowSize" class="text-black p-1 ml-10 rounded" />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.KEY_COMPLETION}</span>
                <label for="completionKeys" class="relative inline-flex cursor-pointer items-center">
                    <input id="completionKeys" type="text" value=${JSON.stringify(config_1.completionKeys)}  name="completionKeys" class="text-black p-1 rounded ml-10" />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.PREVIEW}</span>
                <label for="responsePreview" class="relative inline-flex cursor-pointer items-center">    
                    <input id="responsePreview" type="checkbox"  name="responsePreview" class="ml-10 p-2" ${config_1.responsePreview ? 'checked' : ''} />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.MAX_TOKENS}</span>
                <label for="responsePreviewMaxTokens" class="relative inline-flex cursor-pointer items-center">
                    <input id="responsePreviewMaxTokens" type="number" value=${config_1.responsePreviewMaxTokens} min="50"  name="responsePreviewMaxTokens" class="text-black p-1 rounded ml-10" />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.DELAY}</span>
                <label for="responsePreviewDelay" class="relative inline-flex cursor-pointer items-center">
                    <input id="responsePreviewDelay" type="number" value=${config_1.responsePreviewDelay} min="1"  name="responsePreviewDelay" class="text-black p-1 rounded ml-10" />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.INLINE}</span>
                <label for="continueInline" class="relative inline-flex cursor-pointer items-center">
                    <input id="continueInline" type="checkbox" name="continueInline" class="text-black p-1 ml-10 rounded" ${config_1.continueInline ? 'checked' : ''} />
                </label>
            </div>
            <div class="flex py-2">
                <span class="basis-1/3 whitespace-nowrap">${ollamaConstant_1.OLLAMA_SETTING.SUB_MENU.TEMPERATURE}</span>
                <label for="apiTemperature" class="relative inline-flex cursor-pointer items-center">
                    <input id="apiTemperature" type="number" value=${config_1.apiTemperature} min="0.1" step="0.1" max="1" name="apiTemperature" class="text-black p-1 rounded ml-10" />
                </label>
            </div>
            <div class="flex py-2">
                <button type="submit" class="input-save-model bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">save</button>
            </div>
          </form>
      </div>
      
    </div>
  </div>
</div>

    </main>
  </body>
  </html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map