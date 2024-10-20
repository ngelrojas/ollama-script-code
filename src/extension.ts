import * as vscode from "vscode";
import { ListModels } from "./services/listModels";
import { checkOllamaRunning } from "./modules/ollamaRunning";
import {
  OLLAMA_MSG_ERROR,
  OLLAMA_SETTING,
  OLLAMA_MSG_INFO,
  OLLAMA_DES,
} from "./constants/ollamaConstant";
import { OllamaViewProvider } from "./views/ollamaViewProvider";

import {
  completionKeys,
  apiTemperature,
  numPredict,
  promptWindowSize,
  responsePreview,
  responsePreviewMaxTokens,
  responsePreviewDelay,
  continueInline,
  updateVSConfig,
} from "./autocomplete/config";

import { autocompleteCommand } from "./autocomplete/command";
import { provideCompletionItems } from "./autocomplete/provider";

updateVSConfig();

vscode.workspace.onDidChangeConfiguration(updateVSConfig);

export function activate(context: vscode.ExtensionContext) {
  const provider = new OllamaViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("ollama-chat-pilot", provider)
  );

  checkOllamaRunning();

  context.subscriptions.push(
    vscode.commands.registerCommand("ollama-script-code.openSettings", async () => {
      const panel = vscode.window.createWebviewPanel(
        "myExtensionSettings",
        OLLAMA_SETTING.TITLES.SETTINGS,
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = await getWebviewContent(panel.webview, context);

      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "save":
              const config = vscode.workspace.getConfiguration("ollama-script-code");
              config.update("model", message.value, vscode.ConfigurationTarget.Global).then(() => {
                vscode.window.showInformationMessage(
                  `${OLLAMA_MSG_INFO.MODEL_SET_TO} ${message.value}`
                );
              });
              break;
            case "saveParameters":
              const configParameters = vscode.workspace.getConfiguration("ollama-script-code");
              configParameters.update(
                "max tokens predicted",
                message.value.maxTokensPredicted,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "prompt window size",
                message.value.promptWindowSize,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "completion keys",
                message.value.completionKeys,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "response preview",
                message.value.responsePreview,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "preview max tokens",
                message.value.previewMaxTokens,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "preview delay",
                message.value.previewDelay,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "continue inline",
                message.value.continueInline,
                vscode.ConfigurationTarget.Global
              );
              configParameters.update(
                "temperature",
                message.value.temperature,
                vscode.ConfigurationTarget.Global
              );
              vscode.window.showInformationMessage("Parameters saved successfully!");
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    "*",
    {
      provideCompletionItems,
    },
    ...completionKeys.split("")
  );

  const externalAutocompleteCommand = vscode.commands.registerTextEditorCommand(
    "ollama-script-code.autocomplete",
    (textEditor, _, cancellationToken?) => {
      autocompleteCommand(textEditor, cancellationToken);
    }
  );

  context.subscriptions.push(completionProvider);
  context.subscriptions.push(externalAutocompleteCommand);
}
function convertMBtoGB(sizeInKB: number): string {
  const size = sizeInKB / (1024 * 1024 * 1024);
  return size.toFixed(1);
}

async function retrieveModelList() {
  try {
    let inputModels = "";
    const response = await ListModels();

    if (response.models.length === 0) {
      vscode.window.showInformationMessage(
        `${OLLAMA_MSG_INFO.MODEL_FOUND} ${response.models.length}`
      );
      vscode.window.showInformationMessage(OLLAMA_MSG_INFO.MODEL_NOT_FOUND);
      return "";
    }

    const config = vscode.workspace.getConfiguration("ollama-script-code");
    const modelStored = config.get("model") as string;

    response.models.forEach((model: any) => {
      let modelName = model.model.split(":")[0];
      let modelSize = convertMBtoGB(model.size);
      if (modelStored === modelName) {
        inputModels += `<div class="flex rounded bg-slate-800 p-2"><label id="model-name" class="text-white label-model-input flex-1 p-2 border uppercase" for=${modelName}>${modelName}<p class="text-xs text-slate-400 mt-2">${modelSize} GB</p></label> <label class="flex justify-end flex-1 py-8 border" for=${modelName}><input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" id=${modelName} name="model" checked></label></div>`;
      } else {
        inputModels += `<div class="flex rounded bg-slate-800 p-2"><label id="model-name" class="text-white label-model-input flex-1 p-2 border uppercase" for=${modelName}>${modelName}<p class="text-xs mt-2 text-slate-400">${modelSize} GB</p></label> <label class="flex justify-end flex-1 py-8 border" for=${modelName}> <input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" id=${modelName} name="model" /></label></div>`;
      }
    });

    return inputModels;
  } catch (e) {
    vscode.window.showErrorMessage(OLLAMA_MSG_ERROR.OLLAMA_NOT_RUNNING);
    console.error(e);
  }
}

async function getWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext) {
  const stylesTailwindCssUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwind.min.css")
  );
  const stylesSettingsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.css")
  );
  const scriptTailwindJsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwindcss.3.2.4.min.js")
  );
  const scriptSettingsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.js")
  );

  let ListInputModels = await retrieveModelList();
  const svgExclamation = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50"><path fill="currentColor" d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"/><path fill="currentColor" d="M24 32h2v2h-2zm1.6-2h-1.2l-.4-8v-6h2v6z"/></svg>`;
  return `<!DOCTYPE html>
  <html lang="en">
      <head>
        <link href='${stylesTailwindCssUri}' rel="stylesheet" />
        <link href='${stylesSettingsUri}' rel="stylesheet" />
        <script src="${scriptTailwindJsUri}"></script>
        <script src="${scriptSettingsUri}"></script>
        <title>${OLLAMA_SETTING.TITLES.SETTINGS}</title>
    </head>
  
  <body>
    <main>
    
        <div class="relative mx-auto min-h-screen max-w-3xl text-gray-300">
          <div class="flex p-4 gap-x-4">
            <div class="flex w-1/3 flex-col gap-y-2 border p-2">
              <div data-tab-id="models" class="rounded tab bg-slate-800 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500 active">
                ${OLLAMA_SETTING.MENU.MODEL}
              </div>
              <div data-tab-id="parameters" class="rounded tab bg-slate-800 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500">
                ${OLLAMA_SETTING.MENU.PARAMETERS}
              </div>
            </div>
    
    <div class="flex-grow border p-2 pl-10 text-sm">
      <div class="tabContent flex flex-col gap-y-4" id="models">
        <div class="flex">
          <form class="form-save-model" id="settingsForm">
              <section class="section-list-models- flex flex-col gap-y-2 w-96">
                  ${ListInputModels}
              </section>
              <button type="submit" class="mt-3 w-full relative inline-flex items-center justify-center mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span class="w-full text-white relative px-5 py-2.5 transition-all ease-in duration-75 bg-blue-600 dark:bg-gray-900 rounded group-hover:bg-opacity-0">
                  SAVE
                </span>
              </button>
          </form>
        </div>  
      </div>
      
      <div class="tabContent hidden" id="parameters">
          <form id="parametersForm">
            <div class="grid items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
              <div class="case-up flex justify-between mb-6">
                <div class="basis-1/3 whitespace-nowrap">${
                  OLLAMA_SETTING.SUB_MENU.NUMBER_PREDICTION
                }</div>
                <div class="flex justify-end" id="numPredictDisplay">${numPredict}</div>
              </div>
              <div class="case-down grid">
                <input id="numPredict" type="range" value=${numPredict} min="100" step="1" max="2000" name="numPredict" class="w-full h-2 rounded-lg" />
                <div id="ansNumberPrediction" class="flex justify-end relative group mt-6">${svgExclamation}
                  <span class="absolute -top-5 left-5 transform w-64 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ${OLLAMA_DES.NUMBER_PREDICTION}
                  </span>
                </div>
              </div>
            </div>
            <div class="grid items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up flex justify-between mb-6">
                  <div class="basis-1/3 whitespace-nowrap">${OLLAMA_SETTING.SUB_MENU.WIN_SIZE}</div>
                  <div class="flex justify-end" id="winSize">${promptWindowSize}</div>
                </div>
                <div class="case-down grid">
                  <input id="promptWindowSize" type="range" value=${promptWindowSize} min="100" step="1" max="3048" name="promptWindowSize" class="w-full h-2 rounded-lg" />
                  
                  <div id="ansMenuWinSize" class="relative group flex justify-end mt-6">${svgExclamation}
                    <span class="absolute  -top-5 left-5 transform w-64 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.WIN_SIZE}
                    </span>
                  </div>
                </div>
                 
            </div>
            <div class="flex items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up">
                  <div class="basis-1/3 whitespace-nowrap">${
                    OLLAMA_SETTING.SUB_MENU.KEY_COMPLETION
                  }</div>
                </div>
                <div class="case-down flex w-full">
                  <label for="completionKeys" class="w-full">
                      <input id="completionKeys" type="text" value=${JSON.stringify(
                        completionKeys
                      )}  name="completionKeys" class="text-black p-1 rounded ml-10" /> 
                  </label>
                  <div id="ansKeyCompletion" class="relative group flex justify-end">${svgExclamation}
                    <span class="absolute -top-2 left-9 w-64 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.KEY_COMPLETION}
                    </span>
                  </div>
                </div>
            </div>
            <div class="flex items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up">
                  <div class="basis-1/3 whitespace-nowrap">${OLLAMA_SETTING.SUB_MENU.PREVIEW}</div>
                </div>
                <div class="case-down flex w-full">
                  <label for="responsePreview" class="w-full">    
                      <input id="responsePreview" type="checkbox"  name="responsePreview" class="ml-10 p-2" ${
                        responsePreview ? "checked" : ""
                      } />
                  </label> 
                  <div id="ansMenuPreview" class="relative group flex justify-end">${svgExclamation}
                    <span class="absolute -top-2 left-9 w-64 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.PREVIEW}
                    </span>
                  </div>
                </div>
                
                 
            </div>
            <div class="grid items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up flex justify-between mb-6">
                  <div class="basis-1/3 whitespace-nowrap">${
                    OLLAMA_SETTING.SUB_MENU.MAX_TOKENS
                  }</div>
                  <div class="flex justify-end" id="maxTokens">${responsePreviewMaxTokens}</div>
                </div>
                <div class="case-down grid">
                <input id="responsePreviewMaxTokens" type="range" value=${responsePreviewMaxTokens} min="10" step="1" max="1000"  name="responsePreviewMaxTokens" class="w-full h-2 rounded-lg" />
                 
                <div id="ansMaxTokens" class="relative group flex justify-end mt-6">${svgExclamation}
                  <span class="absolute -top-5 left-5 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ${OLLAMA_DES.MAX_TOKENS}
                  </span>
                </div>
                </div>
            </div>
            <div class="grid items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up flex justify-between mb-6">
                  <div class="basis-1/3 whitespace-nowrap">${OLLAMA_SETTING.SUB_MENU.DELAY}</div>  
                  <div class="flex justify-end" id="delay">${responsePreviewDelay}</div>
                </div>
                <div class="case-down grid">
                  <input id="responsePreviewDelay" type="range" value=${responsePreviewDelay} min="1" step="1" max="5"  name="responsePreviewDelay" class="w-full h-2 rounded-lg" />
                  
                  <div id="ansMenuDelay" class="relative group flex justify-end mt-6">${svgExclamation}
                    <span class="absolute -top-5 left-5 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.DELAY}
                    </span>
                  </div>
                </div> 
            </div>
            <div class="flex items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up">
                  <div class="basis-1/3 whitespace-nowrap">${OLLAMA_SETTING.SUB_MENU.INLINE}</div>
                </div>
                <div class="case-down flex w-full">
                  <label for="continueInline" class="w-full">
                      <input id="continueInline" type="checkbox" name="continueInline" class="text-black p-1 ml-10 rounded" ${
                        continueInline ? "checked" : ""
                      } />
                  </label>
                  <div id="ansMenuInline" class="relative group flex justify-end">${svgExclamation}
                    <span class="absolute -top-3 left-9 w-64 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.INLINE}
                    </span>
                  </div>
                </div>
            </div>
            <div class="grid items-center py-2 w-full p-4 rounded bg-slate-800 mb-4">
                <div class="case-up flex justify-between mb-6">
                  <div class="basis-1/3 whitespace-nowrap">${
                    OLLAMA_SETTING.SUB_MENU.TEMPERATURE
                  }</div>
                  <div class="flex justify-end" id="temperature">${apiTemperature}</div>
                </div>
                <div class="case-down grid">
                  <input id="apiTemperature" type="range" value=${apiTemperature} min="0.1" step="0.1" max="1" name="apiTemperature" class="w-full h-2 rounded-lg" />
                  
                  <div id="ansTemperature" class="relative group flex justify-end mt-6">${svgExclamation}
                    <span class="absolute -top-5 w-64 left-5 transform p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ${OLLAMA_DES.TEMPERATURE}
                    </span>
                  </div>
                </div>
            </div>
            <div class="flex py-2">
                
                <button type="submit" class="w-full relative inline-flex items-center justify-center mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                  <span class="w-full text-white relative px-5 py-2.5 transition-all ease-in duration-75 bg-blue-600 dark:bg-gray-900 rounded group-hover:bg-opacity-0">
                    SAVE
                  </span>
                </button>
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

export function deactivate() {}
