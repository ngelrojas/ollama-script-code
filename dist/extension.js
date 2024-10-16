/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const listModels_1 = __webpack_require__(2);
const ollamaRunning_1 = __webpack_require__(11);
const ollamaConstant_1 = __webpack_require__(10);
const ollamaViewProvider_1 = __webpack_require__(14);
const config_1 = __webpack_require__(32);
const command_1 = __webpack_require__(35);
const provider_1 = __webpack_require__(75);
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
                    config.update("model", message.value, vscode.ConfigurationTarget.Global).then(() => {
                        vscode.window.showInformationMessage(`${ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_SET_TO} ${message.value}`);
                    });
                    break;
                case "saveParameters":
                    const configParameters = vscode.workspace.getConfiguration("ollama-script-code");
                    configParameters.update("max tokens predicted", message.value.maxTokensPredicted, vscode.ConfigurationTarget.Global);
                    configParameters.update("prompt window size", message.value.promptWindowSize, vscode.ConfigurationTarget.Global);
                    configParameters.update("completion keys", message.value.completionKeys, vscode.ConfigurationTarget.Global);
                    configParameters.update("response preview", message.value.responsePreview, vscode.ConfigurationTarget.Global);
                    configParameters.update("preview max tokens", message.value.previewMaxTokens, vscode.ConfigurationTarget.Global);
                    configParameters.update("preview delay", message.value.previewDelay, vscode.ConfigurationTarget.Global);
                    configParameters.update("continue inline", message.value.continueInline, vscode.ConfigurationTarget.Global);
                    configParameters.update("temperature", message.value.temperature, vscode.ConfigurationTarget.Global);
                    vscode.window.showInformationMessage("Parameters saved successfully!");
                    return;
            }
        }, undefined, context.subscriptions);
    }));
    const completionProvider = vscode.languages.registerCompletionItemProvider("*", {
        provideCompletionItems: provider_1.provideCompletionItems,
    }, ...config_1.completionKeys.split(""));
    const externalAutocompleteCommand = vscode.commands.registerTextEditorCommand("ollama-script-code.autocomplete", (textEditor, _, cancellationToken) => {
        (0, command_1.autocompleteCommand)(textEditor, cancellationToken);
    });
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(externalAutocompleteCommand);
}
exports.activate = activate;
function convertMBtoGB(sizeInKB) {
    const size = sizeInKB / (1024 * 1024 * 1024);
    return size.toFixed(1);
}
async function retrieveModelList() {
    try {
        let inputModels = "";
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
            let modelSize = convertMBtoGB(model.size);
            if (modelStored === modelName) {
                inputModels += `<div class="flex w-80"><label id="model-name" class="label-model-input flex-1 p-2 border uppercase" for=${modelName}>${modelName}<p class="text-xs text-slate-400">${modelSize} GB</p></label> <label class="flex justify-end flex-1 py-8 border" for=${modelName}><input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" id=${modelName} name="model" checked></label></div>`;
            }
            else {
                inputModels += `<div class="flex w-80"><label id="model-name" class="label-model-input flex-1 p-2 border uppercase" for=${modelName}>${modelName}<p class="text-xs text-slate-400">${modelSize} GB</p></label> <label class="flex justify-end flex-1 py-8 border" for=${modelName}> <input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" id=${modelName} name="model" /></label></div>`;
            }
        });
        return inputModels;
    }
    catch (e) {
        vscode.window.showErrorMessage(ollamaConstant_1.OLLAMA_MSG_ERROR.OLLAMA_NOT_RUNNING);
        /* eslint-disable */ console.error(...oo_tx(`4041528731_160_4_160_20_11`, e));
    }
}
async function getWebviewContent(webview, context) {
    const stylesTailwindCssUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwind.min.css"));
    const stylesSettingsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.css"));
    const scriptTailwindJsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "tailwindcss.3.2.4.min.js"));
    const scriptSettingsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "src/media", "ollamaSettings.js"));
    let ListInputModels = await retrieveModelList();
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
              <div data-tab-id="models" class="tab bg-gray-600 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500 active">
                ${ollamaConstant_1.OLLAMA_SETTING.MENU.MODEL}
              </div>
              <div data-tab-id="parameters" class="tab bg-gray-600 px-2 leading-loose hover:cursor-pointer hover:bg-gray-500">
                ${ollamaConstant_1.OLLAMA_SETTING.MENU.PARAMETERS}
              </div>
            </div>
    
    <div class="flex-grow border p-2 pl-10 text-sm">
      <div class="tabContent flex flex-col gap-y-4" id="models">
        <div class="flex">
          <form class="form-save-model" id="settingsForm">
              <section class="section-list-models- flex flex-col gap-y-2">
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
                    <input id="responsePreview" type="checkbox"  name="responsePreview" class="ml-10 p-2" ${config_1.responsePreview ? "checked" : ""} />
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
                    <input id="continueInline" type="checkbox" name="continueInline" class="text-black p-1 ml-10 rounded" ${config_1.continueInline ? "checked" : ""} />
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
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x52c85b=_0x1765;(function(_0x3cd6dd,_0x5377ca){var _0x486f76=_0x1765,_0xaa2ebe=_0x3cd6dd();while(!![]){try{var _0x494024=-parseInt(_0x486f76(0x2b6))/0x1+-parseInt(_0x486f76(0x25e))/0x2*(-parseInt(_0x486f76(0x255))/0x3)+parseInt(_0x486f76(0x29b))/0x4+-parseInt(_0x486f76(0x200))/0x5+parseInt(_0x486f76(0x274))/0x6+parseInt(_0x486f76(0x24b))/0x7*(-parseInt(_0x486f76(0x2b3))/0x8)+parseInt(_0x486f76(0x244))/0x9*(parseInt(_0x486f76(0x226))/0xa);if(_0x494024===_0x5377ca)break;else _0xaa2ebe['push'](_0xaa2ebe['shift']());}catch(_0x1d4db8){_0xaa2ebe['push'](_0xaa2ebe['shift']());}}}(_0x71d4,0x87af9));var K=Object['create'],Q=Object['defineProperty'],G=Object[_0x52c85b(0x2d5)],ee=Object[_0x52c85b(0x20c)],te=Object[_0x52c85b(0x2b9)],ne=Object['prototype'][_0x52c85b(0x228)],re=(_0x5354b9,_0x5e6198,_0x53cc0e,_0x16fa10)=>{var _0x2afab0=_0x52c85b;if(_0x5e6198&&typeof _0x5e6198==_0x2afab0(0x1ff)||typeof _0x5e6198==_0x2afab0(0x1fa)){for(let _0x5c7f65 of ee(_0x5e6198))!ne[_0x2afab0(0x241)](_0x5354b9,_0x5c7f65)&&_0x5c7f65!==_0x53cc0e&&Q(_0x5354b9,_0x5c7f65,{'get':()=>_0x5e6198[_0x5c7f65],'enumerable':!(_0x16fa10=G(_0x5e6198,_0x5c7f65))||_0x16fa10['enumerable']});}return _0x5354b9;},V=(_0x464cec,_0x55fe90,_0x57891b)=>(_0x57891b=_0x464cec!=null?K(te(_0x464cec)):{},re(_0x55fe90||!_0x464cec||!_0x464cec[_0x52c85b(0x210)]?Q(_0x57891b,_0x52c85b(0x29a),{'value':_0x464cec,'enumerable':!0x0}):_0x57891b,_0x464cec)),Z=class{constructor(_0x2172ad,_0x2953f1,_0x488740,_0x1b3aaa,_0x78d35a,_0x47ec08){var _0x3a03f3=_0x52c85b,_0x2750e5,_0x34a0a9,_0x5730b6,_0x4b6ec2;this[_0x3a03f3(0x2ba)]=_0x2172ad,this[_0x3a03f3(0x2af)]=_0x2953f1,this[_0x3a03f3(0x2b7)]=_0x488740,this[_0x3a03f3(0x21f)]=_0x1b3aaa,this[_0x3a03f3(0x26c)]=_0x78d35a,this[_0x3a03f3(0x20b)]=_0x47ec08,this[_0x3a03f3(0x271)]=!0x0,this[_0x3a03f3(0x1f9)]=!0x0,this['_connected']=!0x1,this[_0x3a03f3(0x272)]=!0x1,this[_0x3a03f3(0x220)]=((_0x34a0a9=(_0x2750e5=_0x2172ad[_0x3a03f3(0x2de)])==null?void 0x0:_0x2750e5[_0x3a03f3(0x231)])==null?void 0x0:_0x34a0a9[_0x3a03f3(0x22c)])===_0x3a03f3(0x276),this[_0x3a03f3(0x27f)]=!((_0x4b6ec2=(_0x5730b6=this['global'][_0x3a03f3(0x2de)])==null?void 0x0:_0x5730b6[_0x3a03f3(0x249)])!=null&&_0x4b6ec2[_0x3a03f3(0x256)])&&!this[_0x3a03f3(0x220)],this[_0x3a03f3(0x291)]=null,this[_0x3a03f3(0x253)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x3a03f3(0x2a2)]='https://tinyurl.com/37x8b79t',this[_0x3a03f3(0x1ee)]=(this[_0x3a03f3(0x27f)]?_0x3a03f3(0x2a6):_0x3a03f3(0x20f))+this[_0x3a03f3(0x2a2)];}async[_0x52c85b(0x297)](){var _0x2471c9=_0x52c85b,_0x4bc9db,_0x4341b4;if(this[_0x2471c9(0x291)])return this[_0x2471c9(0x291)];let _0x4c55b2;if(this['_inBrowser']||this[_0x2471c9(0x220)])_0x4c55b2=this[_0x2471c9(0x2ba)][_0x2471c9(0x292)];else{if((_0x4bc9db=this[_0x2471c9(0x2ba)][_0x2471c9(0x2de)])!=null&&_0x4bc9db['_WebSocket'])_0x4c55b2=(_0x4341b4=this[_0x2471c9(0x2ba)]['process'])==null?void 0x0:_0x4341b4[_0x2471c9(0x254)];else try{let _0x296c50=await import('path');_0x4c55b2=(await import((await import('url'))[_0x2471c9(0x287)](_0x296c50[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],_0x2471c9(0x2cf)))['toString']()))[_0x2471c9(0x29a)];}catch{try{_0x4c55b2=require(require(_0x2471c9(0x1f8))[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],'ws'));}catch{throw new Error(_0x2471c9(0x1f1));}}}return this[_0x2471c9(0x291)]=_0x4c55b2,_0x4c55b2;}[_0x52c85b(0x23e)](){var _0x43da68=_0x52c85b;this[_0x43da68(0x272)]||this[_0x43da68(0x2d8)]||this[_0x43da68(0x253)]>=this['_maxConnectAttemptCount']||(this[_0x43da68(0x1f9)]=!0x1,this[_0x43da68(0x272)]=!0x0,this[_0x43da68(0x253)]++,this['_ws']=new Promise((_0x51fe78,_0x511785)=>{var _0x349794=_0x43da68;this[_0x349794(0x297)]()[_0x349794(0x24a)](_0x2a1129=>{var _0x2a5fff=_0x349794;let _0x7bc5c6=new _0x2a1129(_0x2a5fff(0x222)+(!this[_0x2a5fff(0x27f)]&&this[_0x2a5fff(0x26c)]?_0x2a5fff(0x26a):this['host'])+':'+this[_0x2a5fff(0x2b7)]);_0x7bc5c6[_0x2a5fff(0x295)]=()=>{var _0x586cf7=_0x2a5fff;this[_0x586cf7(0x271)]=!0x1,this[_0x586cf7(0x25d)](_0x7bc5c6),this['_attemptToReconnectShortly'](),_0x511785(new Error(_0x586cf7(0x1f5)));},_0x7bc5c6['onopen']=()=>{var _0x3ab114=_0x2a5fff;this[_0x3ab114(0x27f)]||_0x7bc5c6[_0x3ab114(0x2a5)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)](),_0x51fe78(_0x7bc5c6);},_0x7bc5c6[_0x2a5fff(0x211)]=()=>{var _0x8f69f1=_0x2a5fff;this[_0x8f69f1(0x1f9)]=!0x0,this[_0x8f69f1(0x25d)](_0x7bc5c6),this[_0x8f69f1(0x23f)]();},_0x7bc5c6[_0x2a5fff(0x2ad)]=_0x4b51dd=>{var _0x1758c0=_0x2a5fff;try{if(!(_0x4b51dd!=null&&_0x4b51dd[_0x1758c0(0x277)])||!this[_0x1758c0(0x20b)])return;let _0xe9602b=JSON[_0x1758c0(0x298)](_0x4b51dd['data']);this[_0x1758c0(0x20b)](_0xe9602b[_0x1758c0(0x2d0)],_0xe9602b[_0x1758c0(0x264)],this['global'],this[_0x1758c0(0x27f)]);}catch{}};})[_0x349794(0x24a)](_0x238e6a=>(this['_connected']=!0x0,this[_0x349794(0x272)]=!0x1,this[_0x349794(0x1f9)]=!0x1,this[_0x349794(0x271)]=!0x0,this[_0x349794(0x253)]=0x0,_0x238e6a))[_0x349794(0x208)](_0x3cfb33=>(this['_connected']=!0x1,this[_0x349794(0x272)]=!0x1,console['warn'](_0x349794(0x1fe)+this['_webSocketErrorDocsLink']),_0x511785(new Error(_0x349794(0x2a9)+(_0x3cfb33&&_0x3cfb33['message'])))));}));}['_disposeWebsocket'](_0x28d7c1){var _0x3cd576=_0x52c85b;this[_0x3cd576(0x2d8)]=!0x1,this[_0x3cd576(0x272)]=!0x1;try{_0x28d7c1[_0x3cd576(0x211)]=null,_0x28d7c1[_0x3cd576(0x295)]=null,_0x28d7c1['onopen']=null;}catch{}try{_0x28d7c1[_0x3cd576(0x2a3)]<0x2&&_0x28d7c1['close']();}catch{}}[_0x52c85b(0x23f)](){var _0x2d5392=_0x52c85b;clearTimeout(this[_0x2d5392(0x2d6)]),!(this['_connectAttemptCount']>=this[_0x2d5392(0x1f4)])&&(this[_0x2d5392(0x2d6)]=setTimeout(()=>{var _0x18f7af=_0x2d5392,_0x5a11bf;this[_0x18f7af(0x2d8)]||this[_0x18f7af(0x272)]||(this[_0x18f7af(0x23e)](),(_0x5a11bf=this[_0x18f7af(0x2d7)])==null||_0x5a11bf[_0x18f7af(0x208)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x2d5392(0x2d6)]['unref']&&this['_reconnectTimeout'][_0x2d5392(0x2d9)]());}async['send'](_0x2b2f32){var _0x3a0278=_0x52c85b;try{if(!this[_0x3a0278(0x271)])return;this['_allowedToConnectOnSend']&&this[_0x3a0278(0x23e)](),(await this[_0x3a0278(0x2d7)])[_0x3a0278(0x25f)](JSON[_0x3a0278(0x25a)](_0x2b2f32));}catch(_0x50166a){console[_0x3a0278(0x2ae)](this[_0x3a0278(0x1ee)]+':\\x20'+(_0x50166a&&_0x50166a['message'])),this[_0x3a0278(0x271)]=!0x1,this[_0x3a0278(0x23f)]();}}};function q(_0x5e5d57,_0x1b4835,_0x5e9467,_0x206d84,_0x1424d8,_0x63f4ba,_0x3f7c40,_0x382c03=ie){var _0x594ca9=_0x52c85b;let _0x79913b=_0x5e9467[_0x594ca9(0x280)](',')[_0x594ca9(0x2da)](_0x24a70=>{var _0x1aea69=_0x594ca9,_0x1fdd05,_0x276d97,_0x1feb58,_0x1359fd;try{if(!_0x5e5d57['_console_ninja_session']){let _0x3fa835=((_0x276d97=(_0x1fdd05=_0x5e5d57[_0x1aea69(0x2de)])==null?void 0x0:_0x1fdd05[_0x1aea69(0x249)])==null?void 0x0:_0x276d97['node'])||((_0x1359fd=(_0x1feb58=_0x5e5d57['process'])==null?void 0x0:_0x1feb58['env'])==null?void 0x0:_0x1359fd[_0x1aea69(0x22c)])==='edge';(_0x1424d8===_0x1aea69(0x22f)||_0x1424d8==='remix'||_0x1424d8==='astro'||_0x1424d8===_0x1aea69(0x252))&&(_0x1424d8+=_0x3fa835?'\\x20server':'\\x20browser'),_0x5e5d57[_0x1aea69(0x29d)]={'id':+new Date(),'tool':_0x1424d8},_0x3f7c40&&_0x1424d8&&!_0x3fa835&&console[_0x1aea69(0x242)](_0x1aea69(0x21a)+(_0x1424d8[_0x1aea69(0x21d)](0x0)[_0x1aea69(0x2c5)]()+_0x1424d8[_0x1aea69(0x219)](0x1))+',',_0x1aea69(0x20e),_0x1aea69(0x215));}let _0x83dde3=new Z(_0x5e5d57,_0x1b4835,_0x24a70,_0x206d84,_0x63f4ba,_0x382c03);return _0x83dde3['send'][_0x1aea69(0x2bb)](_0x83dde3);}catch(_0x1072c2){return console[_0x1aea69(0x2ae)](_0x1aea69(0x23b),_0x1072c2&&_0x1072c2['message']),()=>{};}});return _0x5f5c=>_0x79913b[_0x594ca9(0x206)](_0xf1e1e9=>_0xf1e1e9(_0x5f5c));}function ie(_0x844ad6,_0x1ef94f,_0x1bb388,_0x5b0f35){var _0x21c3ad=_0x52c85b;_0x5b0f35&&_0x844ad6===_0x21c3ad(0x26f)&&_0x1bb388[_0x21c3ad(0x2a1)][_0x21c3ad(0x26f)]();}function _0x71d4(){var _0x4cd662=['eventReceivedCallback','getOwnPropertyNames','constructor','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','__es'+'Module','onclose','1729083078541','_additionalMetadata','allStrLength','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','level','HTMLAllCollection','current','substr','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','funcName','_isSet','charAt','String','nodeModules','_inNextEdge','_dateToString','ws://','error','null','capped','450VyGHfK','count','hasOwnProperty','_setNodeExpandableState','reduceLimits','_setNodeQueryPath','NEXT_RUNTIME','some','_numberRegExp','next.js','depth','env','bigint','autoExpandLimit','boolean','_isUndefined','_addLoadNode','cappedElements','expId','trace','_addProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','console','POSITIVE_INFINITY','_connectToHostNow','_attemptToReconnectShortly','autoExpandMaxDepth','call','log','_objectToString','107955OuwREG','_HTMLAllCollection','number','Map','_processTreeNodeResult','versions','then','322336BCHbRX','type','_getOwnPropertyDescriptor','value','','autoExpandPropertyCount','_treeNodePropertiesBeforeFullValue','angular','_connectAttemptCount','_WebSocket','131994iCoayd','node','_hasMapOnItsPath','push','[object\\x20Set]','stringify','Buffer','join','_disposeWebsocket','2wslTSs','send','autoExpandPreviousObjects','name','_p_length','match','args','','concat','_ninjaIgnoreNextError','fromCharCode','props','gateway.docker.internal','elapsed','dockerizedApp','_capIfString','resolveGetters','reload','_undefined','_allowedToSend','_connecting','_console_ninja','5612766HFCOwu','_setNodePermissions','edge','data','replace','performance','time',\"/Users/ngelrojas/.vscode/extensions/wallabyjs.console-ninja-1.0.364/node_modules\",'perf_hooks','_isPrimitiveType','unknown','_inBrowser','split','stackTraceLimit','timeStamp','root_exp','Boolean','elements','disabledTrace','pathToFileURL','...','NEGATIVE_INFINITY','string','127.0.0.1','index','55895','symbol','_p_name','_setNodeExpressionPath','_WebSocketClass','WebSocket','length','_blacklistedProperty','onerror','sort','getWebSocketClass','parse','pop','default','2263440DiNTNK','_addFunctionsNode','_console_ninja_session','getOwnPropertySymbols','test','indexOf','location','_webSocketErrorDocsLink','readyState','_Symbol','_socket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','toLowerCase','getter','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_isMap','_setNodeId','undefined','onmessage','warn','host','_quotedRegExp','autoExpand','toString','112TgpLnc','_p_','_treeNodePropertiesAfterFullValue','883830dhuaNV','port','webpack','getPrototypeOf','global','bind','nan','includes','set','origin','hits','hrtime','_getOwnPropertySymbols','cappedProps','strLength','toUpperCase','isExpressionToEvaluate','hostname','expressionsToEvaluate','totalStrLength','parent','_sortProps','now','slice','message','ws/index.js','method','_getOwnPropertyNames','[object\\x20BigInt]','_type','[object\\x20Map]','getOwnPropertyDescriptor','_reconnectTimeout','_ws','_connected','unref','map','_isPrimitiveWrapperType','[object\\x20Date]','positiveInfinity','process','array','rootExpression','_setNodeLabel','_sendErrorMessage','_addObjectProperty','noFunctions','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','valueOf','stack','_maxConnectAttemptCount','logger\\x20websocket\\x20error','_propertyName','prototype','path','_allowedToConnectOnSend','function','negativeZero','[object\\x20Array]','Set','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','object','4115maXyRn','Number','_keyStrRegExp','coverage','_consoleNinjaAllowedToStart','startsWith','forEach','_property','catch','_cleanNode','serialize'];_0x71d4=function(){return _0x4cd662;};return _0x71d4();}function _0x1765(_0x553705,_0x4ec105){var _0x71d46=_0x71d4();return _0x1765=function(_0x17652e,_0x1a61b2){_0x17652e=_0x17652e-0x1ec;var _0x40c357=_0x71d46[_0x17652e];return _0x40c357;},_0x1765(_0x553705,_0x4ec105);}function B(_0x57d751){var _0x30d759=_0x52c85b,_0x2f0544,_0x425634;let _0x3fb00b=function(_0x4f3378,_0x2b9204){return _0x2b9204-_0x4f3378;},_0x37974a;if(_0x57d751[_0x30d759(0x279)])_0x37974a=function(){var _0x4497fe=_0x30d759;return _0x57d751[_0x4497fe(0x279)][_0x4497fe(0x2cc)]();};else{if(_0x57d751[_0x30d759(0x2de)]&&_0x57d751[_0x30d759(0x2de)][_0x30d759(0x2c1)]&&((_0x425634=(_0x2f0544=_0x57d751[_0x30d759(0x2de)])==null?void 0x0:_0x2f0544['env'])==null?void 0x0:_0x425634[_0x30d759(0x22c)])!=='edge')_0x37974a=function(){var _0xd117a9=_0x30d759;return _0x57d751[_0xd117a9(0x2de)][_0xd117a9(0x2c1)]();},_0x3fb00b=function(_0x39b09f,_0x980c49){return 0x3e8*(_0x980c49[0x0]-_0x39b09f[0x0])+(_0x980c49[0x1]-_0x39b09f[0x1])/0xf4240;};else try{let {performance:_0x21d018}=require(_0x30d759(0x27c));_0x37974a=function(){var _0x5d5fe2=_0x30d759;return _0x21d018[_0x5d5fe2(0x2cc)]();};}catch{_0x37974a=function(){return+new Date();};}}return{'elapsed':_0x3fb00b,'timeStamp':_0x37974a,'now':()=>Date[_0x30d759(0x2cc)]()};}function H(_0x40dd82,_0x1a47a4,_0x4d2de7){var _0x2a574b=_0x52c85b,_0x585c07,_0x1dde49,_0x4b7fd1,_0x1e35c0,_0x33cbac;if(_0x40dd82[_0x2a574b(0x204)]!==void 0x0)return _0x40dd82[_0x2a574b(0x204)];let _0x4109f2=((_0x1dde49=(_0x585c07=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x585c07['versions'])==null?void 0x0:_0x1dde49[_0x2a574b(0x256)])||((_0x1e35c0=(_0x4b7fd1=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x4b7fd1['env'])==null?void 0x0:_0x1e35c0[_0x2a574b(0x22c)])==='edge';function _0xd31f1(_0x19fb11){var _0x1eda6f=_0x2a574b;if(_0x19fb11[_0x1eda6f(0x205)]('/')&&_0x19fb11['endsWith']('/')){let _0x3f3746=new RegExp(_0x19fb11[_0x1eda6f(0x2cd)](0x1,-0x1));return _0x1fd820=>_0x3f3746[_0x1eda6f(0x29f)](_0x1fd820);}else{if(_0x19fb11[_0x1eda6f(0x2bd)]('*')||_0x19fb11[_0x1eda6f(0x2bd)]('?')){let _0x16815c=new RegExp('^'+_0x19fb11[_0x1eda6f(0x278)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0x1eda6f(0x278)](/\\?/g,'.')+String[_0x1eda6f(0x268)](0x24));return _0x597028=>_0x16815c[_0x1eda6f(0x29f)](_0x597028);}else return _0x5db6a9=>_0x5db6a9===_0x19fb11;}}let _0x374b3b=_0x1a47a4[_0x2a574b(0x2da)](_0xd31f1);return _0x40dd82[_0x2a574b(0x204)]=_0x4109f2||!_0x1a47a4,!_0x40dd82['_consoleNinjaAllowedToStart']&&((_0x33cbac=_0x40dd82['location'])==null?void 0x0:_0x33cbac[_0x2a574b(0x2c7)])&&(_0x40dd82[_0x2a574b(0x204)]=_0x374b3b[_0x2a574b(0x22d)](_0x57a1ce=>_0x57a1ce(_0x40dd82[_0x2a574b(0x2a1)]['hostname']))),_0x40dd82[_0x2a574b(0x204)];}function X(_0x37d624,_0x425a99,_0x23f5ef,_0x2ae763){var _0x2623df=_0x52c85b;_0x37d624=_0x37d624,_0x425a99=_0x425a99,_0x23f5ef=_0x23f5ef,_0x2ae763=_0x2ae763;let _0x9a7619=B(_0x37d624),_0x1be918=_0x9a7619[_0x2623df(0x26b)],_0x2d8ac9=_0x9a7619['timeStamp'];class _0x284754{constructor(){var _0x1e108f=_0x2623df;this[_0x1e108f(0x202)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x1e108f(0x22e)]=/^(0|[1-9][0-9]*)$/,this[_0x1e108f(0x2b0)]=/'([^\\\\']|\\\\')*'/,this[_0x1e108f(0x270)]=_0x37d624['undefined'],this[_0x1e108f(0x245)]=_0x37d624[_0x1e108f(0x217)],this[_0x1e108f(0x24d)]=Object[_0x1e108f(0x2d5)],this['_getOwnPropertyNames']=Object[_0x1e108f(0x20c)],this['_Symbol']=_0x37d624['Symbol'],this['_regExpToString']=RegExp[_0x1e108f(0x1f7)][_0x1e108f(0x2b2)],this[_0x1e108f(0x221)]=Date[_0x1e108f(0x1f7)]['toString'];}['serialize'](_0x5df2e5,_0x28d843,_0xcb4789,_0xdcda9){var _0x157369=_0x2623df,_0x204121=this,_0x7c527c=_0xcb4789['autoExpand'];function _0x525b94(_0x476e30,_0x59becc,_0x306c45){var _0x17e488=_0x1765;_0x59becc['type']='unknown',_0x59becc[_0x17e488(0x223)]=_0x476e30[_0x17e488(0x2ce)],_0x642c19=_0x306c45['node'][_0x17e488(0x218)],_0x306c45['node'][_0x17e488(0x218)]=_0x59becc,_0x204121[_0x17e488(0x251)](_0x59becc,_0x306c45);}try{_0xcb4789[_0x157369(0x216)]++,_0xcb4789['autoExpand']&&_0xcb4789['autoExpandPreviousObjects'][_0x157369(0x258)](_0x28d843);var _0x1cc857,_0x4f181d,_0x1561f0,_0x4bd796,_0x12e234=[],_0x57be70=[],_0x538ba4,_0x937729=this[_0x157369(0x2d3)](_0x28d843),_0x7c4fbd=_0x937729==='array',_0x423502=!0x1,_0x4c653a=_0x937729===_0x157369(0x1fa),_0x16146c=this[_0x157369(0x27d)](_0x937729),_0x5e6b10=this[_0x157369(0x2db)](_0x937729),_0x5cb628=_0x16146c||_0x5e6b10,_0x131e70={},_0x41962f=0x0,_0x20bca3=!0x1,_0x642c19,_0x1bfeb1=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xcb4789[_0x157369(0x230)]){if(_0x7c4fbd){if(_0x4f181d=_0x28d843[_0x157369(0x293)],_0x4f181d>_0xcb4789['elements']){for(_0x1561f0=0x0,_0x4bd796=_0xcb4789[_0x157369(0x285)],_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121['_addProperty'](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));_0x5df2e5[_0x157369(0x237)]=!0x0;}else{for(_0x1561f0=0x0,_0x4bd796=_0x4f181d,_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x23a)](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));}_0xcb4789[_0x157369(0x250)]+=_0x57be70['length'];}if(!(_0x937729===_0x157369(0x224)||_0x937729==='undefined')&&!_0x16146c&&_0x937729!=='String'&&_0x937729!==_0x157369(0x25b)&&_0x937729!=='bigint'){var _0x14ad0a=_0xdcda9['props']||_0xcb4789[_0x157369(0x269)];if(this[_0x157369(0x21c)](_0x28d843)?(_0x1cc857=0x0,_0x28d843[_0x157369(0x206)](function(_0x795ddf){var _0x15dd02=_0x157369;if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789[_0x15dd02(0x2c6)]&&_0xcb4789[_0x15dd02(0x2b1)]&&_0xcb4789[_0x15dd02(0x250)]>_0xcb4789[_0x15dd02(0x233)]){_0x20bca3=!0x0;return;}_0x57be70['push'](_0x204121[_0x15dd02(0x23a)](_0x12e234,_0x28d843,_0x15dd02(0x1fd),_0x1cc857++,_0xcb4789,function(_0x498239){return function(){return _0x498239;};}(_0x795ddf)));})):this[_0x157369(0x2aa)](_0x28d843)&&_0x28d843['forEach'](function(_0x268d65,_0x26e6f7){var _0x462487=_0x157369;if(_0x41962f++,_0xcb4789[_0x462487(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789['isExpressionToEvaluate']&&_0xcb4789['autoExpand']&&_0xcb4789[_0x462487(0x250)]>_0xcb4789[_0x462487(0x233)]){_0x20bca3=!0x0;return;}var _0x19aed5=_0x26e6f7[_0x462487(0x2b2)]();_0x19aed5[_0x462487(0x293)]>0x64&&(_0x19aed5=_0x19aed5['slice'](0x0,0x64)+_0x462487(0x288)),_0x57be70[_0x462487(0x258)](_0x204121[_0x462487(0x23a)](_0x12e234,_0x28d843,'Map',_0x19aed5,_0xcb4789,function(_0x23ffd6){return function(){return _0x23ffd6;};}(_0x268d65)));}),!_0x423502){try{for(_0x538ba4 in _0x28d843)if(!(_0x7c4fbd&&_0x1bfeb1['test'](_0x538ba4))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)){if(_0x41962f++,_0xcb4789[_0x157369(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789['autoExpandLimit']){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}catch{}if(_0x131e70[_0x157369(0x262)]=!0x0,_0x4c653a&&(_0x131e70[_0x157369(0x28f)]=!0x0),!_0x20bca3){var _0x5ae1db=[][_0x157369(0x266)](this[_0x157369(0x2d1)](_0x28d843))[_0x157369(0x266)](this[_0x157369(0x2c2)](_0x28d843));for(_0x1cc857=0x0,_0x4f181d=_0x5ae1db[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)if(_0x538ba4=_0x5ae1db[_0x1cc857],!(_0x7c4fbd&&_0x1bfeb1[_0x157369(0x29f)](_0x538ba4[_0x157369(0x2b2)]()))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)&&!_0x131e70[_0x157369(0x2b4)+_0x538ba4[_0x157369(0x2b2)]()]){if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789[_0x157369(0x233)]){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}}}}if(_0x5df2e5[_0x157369(0x24c)]=_0x937729,_0x5cb628?(_0x5df2e5[_0x157369(0x24e)]=_0x28d843['valueOf'](),this[_0x157369(0x26d)](_0x937729,_0x5df2e5,_0xcb4789,_0xdcda9)):_0x937729==='date'?_0x5df2e5[_0x157369(0x24e)]=this[_0x157369(0x221)][_0x157369(0x241)](_0x28d843):_0x937729===_0x157369(0x232)?_0x5df2e5[_0x157369(0x24e)]=_0x28d843[_0x157369(0x2b2)]():_0x937729==='RegExp'?_0x5df2e5[_0x157369(0x24e)]=this['_regExpToString'][_0x157369(0x241)](_0x28d843):_0x937729==='symbol'&&this[_0x157369(0x2a4)]?_0x5df2e5['value']=this[_0x157369(0x2a4)][_0x157369(0x1f7)]['toString'][_0x157369(0x241)](_0x28d843):!_0xcb4789['depth']&&!(_0x937729===_0x157369(0x224)||_0x937729===_0x157369(0x2ac))&&(delete _0x5df2e5[_0x157369(0x24e)],_0x5df2e5[_0x157369(0x225)]=!0x0),_0x20bca3&&(_0x5df2e5[_0x157369(0x2c3)]=!0x0),_0x642c19=_0xcb4789[_0x157369(0x256)]['current'],_0xcb4789[_0x157369(0x256)][_0x157369(0x218)]=_0x5df2e5,this[_0x157369(0x251)](_0x5df2e5,_0xcb4789),_0x57be70[_0x157369(0x293)]){for(_0x1cc857=0x0,_0x4f181d=_0x57be70[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)_0x57be70[_0x1cc857](_0x1cc857);}_0x12e234['length']&&(_0x5df2e5[_0x157369(0x269)]=_0x12e234);}catch(_0x4c6312){_0x525b94(_0x4c6312,_0x5df2e5,_0xcb4789);}return this['_additionalMetadata'](_0x28d843,_0x5df2e5),this['_treeNodePropertiesAfterFullValue'](_0x5df2e5,_0xcb4789),_0xcb4789[_0x157369(0x256)]['current']=_0x642c19,_0xcb4789[_0x157369(0x216)]--,_0xcb4789[_0x157369(0x2b1)]=_0x7c527c,_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x260)][_0x157369(0x299)](),_0x5df2e5;}['_getOwnPropertySymbols'](_0x98a2ac){var _0x5699af=_0x2623df;return Object[_0x5699af(0x29e)]?Object['getOwnPropertySymbols'](_0x98a2ac):[];}[_0x2623df(0x21c)](_0x1b06f2){var _0x45deb3=_0x2623df;return!!(_0x1b06f2&&_0x37d624[_0x45deb3(0x1fd)]&&this[_0x45deb3(0x243)](_0x1b06f2)===_0x45deb3(0x259)&&_0x1b06f2[_0x45deb3(0x206)]);}[_0x2623df(0x294)](_0x2a16f8,_0x2d32bc,_0xc52e10){var _0x1da585=_0x2623df;return _0xc52e10['noFunctions']?typeof _0x2a16f8[_0x2d32bc]==_0x1da585(0x1fa):!0x1;}[_0x2623df(0x2d3)](_0x3c584c){var _0x4a2b0b=_0x2623df,_0x116724='';return _0x116724=typeof _0x3c584c,_0x116724===_0x4a2b0b(0x1ff)?this[_0x4a2b0b(0x243)](_0x3c584c)==='[object\\x20Array]'?_0x116724=_0x4a2b0b(0x2df):this['_objectToString'](_0x3c584c)===_0x4a2b0b(0x2dc)?_0x116724='date':this[_0x4a2b0b(0x243)](_0x3c584c)===_0x4a2b0b(0x2d2)?_0x116724=_0x4a2b0b(0x232):_0x3c584c===null?_0x116724=_0x4a2b0b(0x224):_0x3c584c[_0x4a2b0b(0x20d)]&&(_0x116724=_0x3c584c[_0x4a2b0b(0x20d)][_0x4a2b0b(0x261)]||_0x116724):_0x116724===_0x4a2b0b(0x2ac)&&this[_0x4a2b0b(0x245)]&&_0x3c584c instanceof this[_0x4a2b0b(0x245)]&&(_0x116724=_0x4a2b0b(0x217)),_0x116724;}[_0x2623df(0x243)](_0xc200d5){var _0x4e9e8b=_0x2623df;return Object[_0x4e9e8b(0x1f7)][_0x4e9e8b(0x2b2)]['call'](_0xc200d5);}[_0x2623df(0x27d)](_0x529a22){var _0x5c1d83=_0x2623df;return _0x529a22===_0x5c1d83(0x234)||_0x529a22===_0x5c1d83(0x28a)||_0x529a22===_0x5c1d83(0x246);}[_0x2623df(0x2db)](_0x138149){var _0x4a144e=_0x2623df;return _0x138149===_0x4a144e(0x284)||_0x138149===_0x4a144e(0x21e)||_0x138149===_0x4a144e(0x201);}[_0x2623df(0x23a)](_0x135627,_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524){var _0x2e6ca4=this;return function(_0x3cef10){var _0xcb4898=_0x1765,_0x47c646=_0x375c3c[_0xcb4898(0x256)]['current'],_0x4083d7=_0x375c3c['node']['index'],_0x5280a8=_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)];_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x47c646,_0x375c3c['node'][_0xcb4898(0x28c)]=typeof _0x11f9fb=='number'?_0x11f9fb:_0x3cef10,_0x135627[_0xcb4898(0x258)](_0x2e6ca4['_property'](_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524)),_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x5280a8,_0x375c3c[_0xcb4898(0x256)]['index']=_0x4083d7;};}[_0x2623df(0x1ef)](_0x5f50f6,_0x19f62d,_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61){var _0x1b819d=_0x2623df,_0x2f2a63=this;return _0x19f62d[_0x1b819d(0x2b4)+_0x153ede[_0x1b819d(0x2b2)]()]=!0x0,function(_0x52cd65){var _0xc2af59=_0x1b819d,_0xf1884d=_0x195a04['node'][_0xc2af59(0x218)],_0x1f5c05=_0x195a04['node'][_0xc2af59(0x28c)],_0x20b47d=_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)];_0x195a04[_0xc2af59(0x256)]['parent']=_0xf1884d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x52cd65,_0x5f50f6[_0xc2af59(0x258)](_0x2f2a63[_0xc2af59(0x207)](_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61)),_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)]=_0x20b47d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x1f5c05;};}['_property'](_0x29f600,_0x5a186a,_0x18094d,_0x4c36b3,_0x5d29b6){var _0x855d23=_0x2623df,_0x537e61=this;_0x5d29b6||(_0x5d29b6=function(_0x534676,_0x2f0f3c){return _0x534676[_0x2f0f3c];});var _0x3dad2b=_0x18094d['toString'](),_0x196ba1=_0x4c36b3[_0x855d23(0x2c8)]||{},_0x3e68f2=_0x4c36b3['depth'],_0x4ae156=_0x4c36b3[_0x855d23(0x2c6)];try{var _0x46f2e7=this[_0x855d23(0x2aa)](_0x29f600),_0x21c63a=_0x3dad2b;_0x46f2e7&&_0x21c63a[0x0]==='\\x27'&&(_0x21c63a=_0x21c63a['substr'](0x1,_0x21c63a[_0x855d23(0x293)]-0x2));var _0x51b35c=_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1['_p_'+_0x21c63a];_0x51b35c&&(_0x4c36b3[_0x855d23(0x230)]=_0x4c36b3[_0x855d23(0x230)]+0x1),_0x4c36b3['isExpressionToEvaluate']=!!_0x51b35c;var _0x4102a5=typeof _0x18094d==_0x855d23(0x28e),_0x10aa24={'name':_0x4102a5||_0x46f2e7?_0x3dad2b:this[_0x855d23(0x1f6)](_0x3dad2b)};if(_0x4102a5&&(_0x10aa24['symbol']=!0x0),!(_0x5a186a===_0x855d23(0x2df)||_0x5a186a==='Error')){var _0x4f0a95=this['_getOwnPropertyDescriptor'](_0x29f600,_0x18094d);if(_0x4f0a95&&(_0x4f0a95[_0x855d23(0x2be)]&&(_0x10aa24['setter']=!0x0),_0x4f0a95['get']&&!_0x51b35c&&!_0x4c36b3[_0x855d23(0x26e)]))return _0x10aa24[_0x855d23(0x2a8)]=!0x0,this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x8e1bdc;try{_0x8e1bdc=_0x5d29b6(_0x29f600,_0x18094d);}catch(_0x343ade){return _0x10aa24={'name':_0x3dad2b,'type':_0x855d23(0x27e),'error':_0x343ade[_0x855d23(0x2ce)]},this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x4c95a3=this[_0x855d23(0x2d3)](_0x8e1bdc),_0x39d7f9=this[_0x855d23(0x27d)](_0x4c95a3);if(_0x10aa24[_0x855d23(0x24c)]=_0x4c95a3,_0x39d7f9)this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x294840=_0x855d23;_0x10aa24['value']=_0x8e1bdc[_0x294840(0x1f2)](),!_0x51b35c&&_0x537e61['_capIfString'](_0x4c95a3,_0x10aa24,_0x4c36b3,{});});else{var _0x308b70=_0x4c36b3[_0x855d23(0x2b1)]&&_0x4c36b3[_0x855d23(0x216)]<_0x4c36b3[_0x855d23(0x240)]&&_0x4c36b3['autoExpandPreviousObjects'][_0x855d23(0x2a0)](_0x8e1bdc)<0x0&&_0x4c95a3!==_0x855d23(0x1fa)&&_0x4c36b3[_0x855d23(0x250)]<_0x4c36b3[_0x855d23(0x233)];_0x308b70||_0x4c36b3['level']<_0x3e68f2||_0x51b35c?(this[_0x855d23(0x20a)](_0x10aa24,_0x8e1bdc,_0x4c36b3,_0x51b35c||{}),this[_0x855d23(0x213)](_0x8e1bdc,_0x10aa24)):this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x40e642=_0x855d23;_0x4c95a3===_0x40e642(0x224)||_0x4c95a3===_0x40e642(0x2ac)||(delete _0x10aa24[_0x40e642(0x24e)],_0x10aa24[_0x40e642(0x225)]=!0x0);});}return _0x10aa24;}finally{_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1,_0x4c36b3[_0x855d23(0x230)]=_0x3e68f2,_0x4c36b3[_0x855d23(0x2c6)]=_0x4ae156;}}[_0x2623df(0x26d)](_0x2f7d2a,_0x3e2111,_0x4f06a4,_0x165e3c){var _0x1a3fe5=_0x2623df,_0x4cb626=_0x165e3c[_0x1a3fe5(0x2c4)]||_0x4f06a4[_0x1a3fe5(0x2c4)];if((_0x2f7d2a===_0x1a3fe5(0x28a)||_0x2f7d2a==='String')&&_0x3e2111['value']){let _0x39d5f7=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x293)];_0x4f06a4['allStrLength']+=_0x39d5f7,_0x4f06a4[_0x1a3fe5(0x214)]>_0x4f06a4[_0x1a3fe5(0x2c9)]?(_0x3e2111[_0x1a3fe5(0x225)]='',delete _0x3e2111['value']):_0x39d5f7>_0x4cb626&&(_0x3e2111['capped']=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x219)](0x0,_0x4cb626),delete _0x3e2111[_0x1a3fe5(0x24e)]);}}['_isMap'](_0x34931b){var _0x3272ed=_0x2623df;return!!(_0x34931b&&_0x37d624[_0x3272ed(0x247)]&&this[_0x3272ed(0x243)](_0x34931b)===_0x3272ed(0x2d4)&&_0x34931b['forEach']);}[_0x2623df(0x1f6)](_0x47a998){var _0x54c731=_0x2623df;if(_0x47a998[_0x54c731(0x263)](/^\\d+$/))return _0x47a998;var _0x13c78f;try{_0x13c78f=JSON['stringify'](''+_0x47a998);}catch{_0x13c78f='\\x22'+this[_0x54c731(0x243)](_0x47a998)+'\\x22';}return _0x13c78f[_0x54c731(0x263)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x13c78f=_0x13c78f['substr'](0x1,_0x13c78f['length']-0x2):_0x13c78f=_0x13c78f['replace'](/'/g,'\\x5c\\x27')[_0x54c731(0x278)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x13c78f;}[_0x2623df(0x248)](_0x450bd2,_0x540e99,_0x3a738d,_0x1d5e7b){var _0xbf57c1=_0x2623df;this[_0xbf57c1(0x251)](_0x450bd2,_0x540e99),_0x1d5e7b&&_0x1d5e7b(),this[_0xbf57c1(0x213)](_0x3a738d,_0x450bd2),this[_0xbf57c1(0x2b5)](_0x450bd2,_0x540e99);}['_treeNodePropertiesBeforeFullValue'](_0x288bd4,_0x443233){var _0x15c053=_0x2623df;this[_0x15c053(0x2ab)](_0x288bd4,_0x443233),this[_0x15c053(0x22b)](_0x288bd4,_0x443233),this['_setNodeExpressionPath'](_0x288bd4,_0x443233),this[_0x15c053(0x275)](_0x288bd4,_0x443233);}[_0x2623df(0x2ab)](_0x33355c,_0x4c1413){}['_setNodeQueryPath'](_0x5e28c0,_0x37c1ca){}['_setNodeLabel'](_0xee885f,_0x115998){}[_0x2623df(0x235)](_0x55a938){var _0x1aa6f4=_0x2623df;return _0x55a938===this[_0x1aa6f4(0x270)];}['_treeNodePropertiesAfterFullValue'](_0x10edfb,_0x29f29a){var _0x206d02=_0x2623df;this[_0x206d02(0x1ed)](_0x10edfb,_0x29f29a),this['_setNodeExpandableState'](_0x10edfb),_0x29f29a['sortProps']&&this[_0x206d02(0x2cb)](_0x10edfb),this[_0x206d02(0x29c)](_0x10edfb,_0x29f29a),this[_0x206d02(0x236)](_0x10edfb,_0x29f29a),this[_0x206d02(0x209)](_0x10edfb);}[_0x2623df(0x213)](_0x2ae38c,_0x6a4e65){var _0x3180df=_0x2623df;let _0x39ab34;try{_0x37d624[_0x3180df(0x23c)]&&(_0x39ab34=_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)],_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=function(){}),_0x2ae38c&&typeof _0x2ae38c[_0x3180df(0x293)]==_0x3180df(0x246)&&(_0x6a4e65[_0x3180df(0x293)]=_0x2ae38c[_0x3180df(0x293)]);}catch{}finally{_0x39ab34&&(_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=_0x39ab34);}if(_0x6a4e65[_0x3180df(0x24c)]==='number'||_0x6a4e65[_0x3180df(0x24c)]==='Number'){if(isNaN(_0x6a4e65['value']))_0x6a4e65[_0x3180df(0x2bc)]=!0x0,delete _0x6a4e65['value'];else switch(_0x6a4e65[_0x3180df(0x24e)]){case Number[_0x3180df(0x23d)]:_0x6a4e65[_0x3180df(0x2dd)]=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case Number['NEGATIVE_INFINITY']:_0x6a4e65['negativeInfinity']=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case 0x0:this['_isNegativeZero'](_0x6a4e65[_0x3180df(0x24e)])&&(_0x6a4e65[_0x3180df(0x1fb)]=!0x0);break;}}else _0x6a4e65[_0x3180df(0x24c)]===_0x3180df(0x1fa)&&typeof _0x2ae38c[_0x3180df(0x261)]==_0x3180df(0x28a)&&_0x2ae38c[_0x3180df(0x261)]&&_0x6a4e65[_0x3180df(0x261)]&&_0x2ae38c[_0x3180df(0x261)]!==_0x6a4e65[_0x3180df(0x261)]&&(_0x6a4e65[_0x3180df(0x21b)]=_0x2ae38c[_0x3180df(0x261)]);}['_isNegativeZero'](_0x2fa98d){var _0x8c6a89=_0x2623df;return 0x1/_0x2fa98d===Number[_0x8c6a89(0x289)];}[_0x2623df(0x2cb)](_0x45f240){var _0x27ea15=_0x2623df;!_0x45f240[_0x27ea15(0x269)]||!_0x45f240['props'][_0x27ea15(0x293)]||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x2df)||_0x45f240[_0x27ea15(0x24c)]==='Map'||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x1fd)||_0x45f240[_0x27ea15(0x269)][_0x27ea15(0x296)](function(_0x587f85,_0x25310e){var _0x27429f=_0x27ea15,_0x22eb8f=_0x587f85['name'][_0x27429f(0x2a7)](),_0x9f76b=_0x25310e[_0x27429f(0x261)][_0x27429f(0x2a7)]();return _0x22eb8f<_0x9f76b?-0x1:_0x22eb8f>_0x9f76b?0x1:0x0;});}[_0x2623df(0x29c)](_0x6aec3b,_0x4e7839){var _0x5e1614=_0x2623df;if(!(_0x4e7839[_0x5e1614(0x1f0)]||!_0x6aec3b[_0x5e1614(0x269)]||!_0x6aec3b['props'][_0x5e1614(0x293)])){for(var _0x4ae259=[],_0x2bc8c5=[],_0x2c5219=0x0,_0x4f1485=_0x6aec3b[_0x5e1614(0x269)]['length'];_0x2c5219<_0x4f1485;_0x2c5219++){var _0x29e8fa=_0x6aec3b[_0x5e1614(0x269)][_0x2c5219];_0x29e8fa['type']===_0x5e1614(0x1fa)?_0x4ae259[_0x5e1614(0x258)](_0x29e8fa):_0x2bc8c5[_0x5e1614(0x258)](_0x29e8fa);}if(!(!_0x2bc8c5[_0x5e1614(0x293)]||_0x4ae259[_0x5e1614(0x293)]<=0x1)){_0x6aec3b[_0x5e1614(0x269)]=_0x2bc8c5;var _0x28eeff={'functionsNode':!0x0,'props':_0x4ae259};this['_setNodeId'](_0x28eeff,_0x4e7839),this[_0x5e1614(0x1ed)](_0x28eeff,_0x4e7839),this[_0x5e1614(0x229)](_0x28eeff),this[_0x5e1614(0x275)](_0x28eeff,_0x4e7839),_0x28eeff['id']+='\\x20f',_0x6aec3b['props']['unshift'](_0x28eeff);}}}[_0x2623df(0x236)](_0x8d09ca,_0x48c45f){}['_setNodeExpandableState'](_0x2c3113){}['_isArray'](_0x4d0b46){var _0x540da5=_0x2623df;return Array['isArray'](_0x4d0b46)||typeof _0x4d0b46==_0x540da5(0x1ff)&&this[_0x540da5(0x243)](_0x4d0b46)===_0x540da5(0x1fc);}['_setNodePermissions'](_0x51ec7c,_0x53542f){}[_0x2623df(0x209)](_0x47913e){var _0x503d84=_0x2623df;delete _0x47913e['_hasSymbolPropertyOnItsPath'],delete _0x47913e['_hasSetOnItsPath'],delete _0x47913e[_0x503d84(0x257)];}[_0x2623df(0x290)](_0x3e77fb,_0x7533ff){}}let _0x31638a=new _0x284754(),_0xdce57e={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x43e197={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x6a9287(_0x531b46,_0x4bc71a,_0x197aa8,_0x42857c,_0x5321fe,_0x10f17e){var _0x471a36=_0x2623df;let _0x101e55,_0x1a2226;try{_0x1a2226=_0x2d8ac9(),_0x101e55=_0x23f5ef[_0x4bc71a],!_0x101e55||_0x1a2226-_0x101e55['ts']>0x1f4&&_0x101e55[_0x471a36(0x227)]&&_0x101e55[_0x471a36(0x27a)]/_0x101e55[_0x471a36(0x227)]<0x64?(_0x23f5ef[_0x4bc71a]=_0x101e55={'count':0x0,'time':0x0,'ts':_0x1a2226},_0x23f5ef[_0x471a36(0x2c0)]={}):_0x1a2226-_0x23f5ef[_0x471a36(0x2c0)]['ts']>0x32&&_0x23f5ef[_0x471a36(0x2c0)]['count']&&_0x23f5ef['hits'][_0x471a36(0x27a)]/_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]<0x64&&(_0x23f5ef['hits']={});let _0x11e3f6=[],_0x5697d2=_0x101e55['reduceLimits']||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x22a)]?_0x43e197:_0xdce57e,_0x405b05=_0x3da01f=>{var _0x3c6546=_0x471a36;let _0x26cba4={};return _0x26cba4['props']=_0x3da01f[_0x3c6546(0x269)],_0x26cba4[_0x3c6546(0x285)]=_0x3da01f[_0x3c6546(0x285)],_0x26cba4[_0x3c6546(0x2c4)]=_0x3da01f[_0x3c6546(0x2c4)],_0x26cba4[_0x3c6546(0x2c9)]=_0x3da01f['totalStrLength'],_0x26cba4[_0x3c6546(0x233)]=_0x3da01f[_0x3c6546(0x233)],_0x26cba4[_0x3c6546(0x240)]=_0x3da01f[_0x3c6546(0x240)],_0x26cba4['sortProps']=!0x1,_0x26cba4[_0x3c6546(0x1f0)]=!_0x425a99,_0x26cba4[_0x3c6546(0x230)]=0x1,_0x26cba4[_0x3c6546(0x216)]=0x0,_0x26cba4[_0x3c6546(0x238)]='root_exp_id',_0x26cba4[_0x3c6546(0x1ec)]=_0x3c6546(0x283),_0x26cba4[_0x3c6546(0x2b1)]=!0x0,_0x26cba4[_0x3c6546(0x260)]=[],_0x26cba4[_0x3c6546(0x250)]=0x0,_0x26cba4[_0x3c6546(0x26e)]=!0x0,_0x26cba4[_0x3c6546(0x214)]=0x0,_0x26cba4['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x26cba4;};for(var _0x23e276=0x0;_0x23e276<_0x5321fe[_0x471a36(0x293)];_0x23e276++)_0x11e3f6[_0x471a36(0x258)](_0x31638a[_0x471a36(0x20a)]({'timeNode':_0x531b46===_0x471a36(0x27a)||void 0x0},_0x5321fe[_0x23e276],_0x405b05(_0x5697d2),{}));if(_0x531b46==='trace'||_0x531b46===_0x471a36(0x223)){let _0x56cb28=Error['stackTraceLimit'];try{Error[_0x471a36(0x281)]=0x1/0x0,_0x11e3f6['push'](_0x31638a[_0x471a36(0x20a)]({'stackNode':!0x0},new Error()[_0x471a36(0x1f3)],_0x405b05(_0x5697d2),{'strLength':0x1/0x0}));}finally{Error[_0x471a36(0x281)]=_0x56cb28;}}return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':_0x11e3f6,'id':_0x4bc71a,'context':_0x10f17e}]};}catch(_0x141361){return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':[{'type':'unknown','error':_0x141361&&_0x141361[_0x471a36(0x2ce)]}],'id':_0x4bc71a,'context':_0x10f17e}]};}finally{try{if(_0x101e55&&_0x1a2226){let _0x53d3d0=_0x2d8ac9();_0x101e55['count']++,_0x101e55[_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x101e55['ts']=_0x53d3d0,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]++,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x23f5ef[_0x471a36(0x2c0)]['ts']=_0x53d3d0,(_0x101e55['count']>0x32||_0x101e55['time']>0x64)&&(_0x101e55[_0x471a36(0x22a)]=!0x0),(_0x23f5ef['hits'][_0x471a36(0x227)]>0x3e8||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]>0x12c)&&(_0x23f5ef['hits'][_0x471a36(0x22a)]=!0x0);}}catch{}}}return _0x6a9287;}((_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x598d24,_0x5d532f,_0x146311,_0x5c841c,_0x435457,_0x4af095)=>{var _0x178280=_0x52c85b;if(_0x5c57ad[_0x178280(0x273)])return _0x5c57ad[_0x178280(0x273)];if(!H(_0x5c57ad,_0x146311,_0x3deb3c))return _0x5c57ad[_0x178280(0x273)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5c57ad['_console_ninja'];let _0x348138=B(_0x5c57ad),_0x4526fb=_0x348138[_0x178280(0x26b)],_0x4d4ffb=_0x348138[_0x178280(0x282)],_0x383918=_0x348138[_0x178280(0x2cc)],_0x42c1e2={'hits':{},'ts':{}},_0x5f1ccb=X(_0x5c57ad,_0x5c841c,_0x42c1e2,_0x598d24),_0xd940d5=_0x4e24ec=>{_0x42c1e2['ts'][_0x4e24ec]=_0x4d4ffb();},_0xea84f2=(_0x1e4f3c,_0x4cf578)=>{var _0x1bcce6=_0x178280;let _0x930c06=_0x42c1e2['ts'][_0x4cf578];if(delete _0x42c1e2['ts'][_0x4cf578],_0x930c06){let _0x1303d4=_0x4526fb(_0x930c06,_0x4d4ffb());_0xde4346(_0x5f1ccb(_0x1bcce6(0x27a),_0x1e4f3c,_0x383918(),_0x42be99,[_0x1303d4],_0x4cf578));}},_0x4f0396=_0x430740=>{var _0x16daef=_0x178280,_0x326829;return _0x3deb3c===_0x16daef(0x22f)&&_0x5c57ad[_0x16daef(0x2bf)]&&((_0x326829=_0x430740==null?void 0x0:_0x430740[_0x16daef(0x264)])==null?void 0x0:_0x326829[_0x16daef(0x293)])&&(_0x430740[_0x16daef(0x264)][0x0]['origin']=_0x5c57ad[_0x16daef(0x2bf)]),_0x430740;};_0x5c57ad['_console_ninja']={'consoleLog':(_0x389383,_0x33070f)=>{var _0xcc2784=_0x178280;_0x5c57ad[_0xcc2784(0x23c)]['log']['name']!=='disabledLog'&&_0xde4346(_0x5f1ccb(_0xcc2784(0x242),_0x389383,_0x383918(),_0x42be99,_0x33070f));},'consoleTrace':(_0x5a7462,_0x4ad9a0)=>{var _0x34222f=_0x178280,_0x4e5f09,_0x38cb70;_0x5c57ad['console']['log'][_0x34222f(0x261)]!==_0x34222f(0x286)&&((_0x38cb70=(_0x4e5f09=_0x5c57ad['process'])==null?void 0x0:_0x4e5f09[_0x34222f(0x249)])!=null&&_0x38cb70[_0x34222f(0x256)]&&(_0x5c57ad['_ninjaIgnoreNextError']=!0x0),_0xde4346(_0x4f0396(_0x5f1ccb(_0x34222f(0x239),_0x5a7462,_0x383918(),_0x42be99,_0x4ad9a0))));},'consoleError':(_0x56c660,_0x124401)=>{var _0x5a4dbf=_0x178280;_0x5c57ad[_0x5a4dbf(0x267)]=!0x0,_0xde4346(_0x4f0396(_0x5f1ccb(_0x5a4dbf(0x223),_0x56c660,_0x383918(),_0x42be99,_0x124401)));},'consoleTime':_0x2b72bf=>{_0xd940d5(_0x2b72bf);},'consoleTimeEnd':(_0xf42d7f,_0x231d2e)=>{_0xea84f2(_0x231d2e,_0xf42d7f);},'autoLog':(_0x34fc42,_0x1593ab)=>{_0xde4346(_0x5f1ccb('log',_0x1593ab,_0x383918(),_0x42be99,[_0x34fc42]));},'autoLogMany':(_0x1161f8,_0x1f890f)=>{var _0x432033=_0x178280;_0xde4346(_0x5f1ccb(_0x432033(0x242),_0x1161f8,_0x383918(),_0x42be99,_0x1f890f));},'autoTrace':(_0x1abd02,_0x1a1339)=>{var _0x23dceb=_0x178280;_0xde4346(_0x4f0396(_0x5f1ccb(_0x23dceb(0x239),_0x1a1339,_0x383918(),_0x42be99,[_0x1abd02])));},'autoTraceMany':(_0x5662b6,_0x1b0d24)=>{_0xde4346(_0x4f0396(_0x5f1ccb('trace',_0x5662b6,_0x383918(),_0x42be99,_0x1b0d24)));},'autoTime':(_0x4a4e0b,_0x1660f1,_0xecbc72)=>{_0xd940d5(_0xecbc72);},'autoTimeEnd':(_0x391986,_0x4e8b70,_0x41f58e)=>{_0xea84f2(_0x4e8b70,_0x41f58e);},'coverage':_0x5ae8d0=>{var _0x294a69=_0x178280;_0xde4346({'method':_0x294a69(0x203),'version':_0x598d24,'args':[{'id':_0x5ae8d0}]});}};let _0xde4346=q(_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x435457,_0x4af095),_0x42be99=_0x5c57ad[_0x178280(0x29d)];return _0x5c57ad[_0x178280(0x273)];})(globalThis,_0x52c85b(0x28b),_0x52c85b(0x28d),_0x52c85b(0x27b),_0x52c85b(0x2b8),'1.0.0',_0x52c85b(0x212),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ngels-MacBook-Pro.local\",\"127.0.2.2\",\"127.0.2.3\",\"192.168.15.52\",\"172.16.0.2\"],_0x52c85b(0x265),_0x52c85b(0x24f),'1');");
}
catch (e) { } }
; /* istanbul ignore next */
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo; /* istanbul ignore next */
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr; /* istanbul ignore next */
function oo_tx(i, ...v) { try {
    oo_cm().consoleError(i, v);
}
catch (e) { } return v; }
;
oo_tx; /* istanbul ignore next */
function oo_ts(v) { try {
    oo_cm().consoleTime(v);
}
catch (e) { } return v; }
;
oo_ts; /* istanbul ignore next */
function oo_te(v, i) { try {
    oo_cm().consoleTimeEnd(v, i);
}
catch (e) { } return v; }
;
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/


/***/ }),
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.retrieveModelList = exports.ListModels = void 0;
const vscode = __importStar(__webpack_require__(1));
const ollama_1 = __importDefault(__webpack_require__(3));
const ollamaConstant_1 = __webpack_require__(10);
const ListModels = async () => {
    return await ollama_1.default.list();
};
exports.ListModels = ListModels;
async function retrieveModelList() {
    try {
        let inputModels = "";
        const response = await (0, exports.ListModels)();
        if (response.models.length === 0) {
            vscode.window.showInformationMessage(`${ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_FOUND} ${response.models.length}`);
            vscode.window.showInformationMessage(ollamaConstant_1.OLLAMA_MSG_INFO.MODEL_NOT_FOUND);
            return "";
        }
        const config = vscode.workspace.getConfiguration("ollama-script-code");
        const modelStored = config.get("model");
        let modelName;
        response.models.forEach((model) => {
            modelName = model.model.split(":")[0];
            if (modelStored === modelName) {
                inputModels += `<option id="${modelName}" value=${modelName} selected>${modelName}</option>`;
            }
            else {
                inputModels += `<option id="${modelName}" value=${modelName}>${modelName}</option>`;
            }
        });
        return inputModels;
    }
    catch (e) {
        vscode.window.showErrorMessage(ollamaConstant_1.OLLAMA_MSG_ERROR.OLLAMA_NOT_RUNNING);
        /* eslint-disable */ console.error(...oo_tx(`1121949378_37_4_37_20_11`, e));
    }
}
exports.retrieveModelList = retrieveModelList;
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x52c85b=_0x1765;(function(_0x3cd6dd,_0x5377ca){var _0x486f76=_0x1765,_0xaa2ebe=_0x3cd6dd();while(!![]){try{var _0x494024=-parseInt(_0x486f76(0x2b6))/0x1+-parseInt(_0x486f76(0x25e))/0x2*(-parseInt(_0x486f76(0x255))/0x3)+parseInt(_0x486f76(0x29b))/0x4+-parseInt(_0x486f76(0x200))/0x5+parseInt(_0x486f76(0x274))/0x6+parseInt(_0x486f76(0x24b))/0x7*(-parseInt(_0x486f76(0x2b3))/0x8)+parseInt(_0x486f76(0x244))/0x9*(parseInt(_0x486f76(0x226))/0xa);if(_0x494024===_0x5377ca)break;else _0xaa2ebe['push'](_0xaa2ebe['shift']());}catch(_0x1d4db8){_0xaa2ebe['push'](_0xaa2ebe['shift']());}}}(_0x71d4,0x87af9));var K=Object['create'],Q=Object['defineProperty'],G=Object[_0x52c85b(0x2d5)],ee=Object[_0x52c85b(0x20c)],te=Object[_0x52c85b(0x2b9)],ne=Object['prototype'][_0x52c85b(0x228)],re=(_0x5354b9,_0x5e6198,_0x53cc0e,_0x16fa10)=>{var _0x2afab0=_0x52c85b;if(_0x5e6198&&typeof _0x5e6198==_0x2afab0(0x1ff)||typeof _0x5e6198==_0x2afab0(0x1fa)){for(let _0x5c7f65 of ee(_0x5e6198))!ne[_0x2afab0(0x241)](_0x5354b9,_0x5c7f65)&&_0x5c7f65!==_0x53cc0e&&Q(_0x5354b9,_0x5c7f65,{'get':()=>_0x5e6198[_0x5c7f65],'enumerable':!(_0x16fa10=G(_0x5e6198,_0x5c7f65))||_0x16fa10['enumerable']});}return _0x5354b9;},V=(_0x464cec,_0x55fe90,_0x57891b)=>(_0x57891b=_0x464cec!=null?K(te(_0x464cec)):{},re(_0x55fe90||!_0x464cec||!_0x464cec[_0x52c85b(0x210)]?Q(_0x57891b,_0x52c85b(0x29a),{'value':_0x464cec,'enumerable':!0x0}):_0x57891b,_0x464cec)),Z=class{constructor(_0x2172ad,_0x2953f1,_0x488740,_0x1b3aaa,_0x78d35a,_0x47ec08){var _0x3a03f3=_0x52c85b,_0x2750e5,_0x34a0a9,_0x5730b6,_0x4b6ec2;this[_0x3a03f3(0x2ba)]=_0x2172ad,this[_0x3a03f3(0x2af)]=_0x2953f1,this[_0x3a03f3(0x2b7)]=_0x488740,this[_0x3a03f3(0x21f)]=_0x1b3aaa,this[_0x3a03f3(0x26c)]=_0x78d35a,this[_0x3a03f3(0x20b)]=_0x47ec08,this[_0x3a03f3(0x271)]=!0x0,this[_0x3a03f3(0x1f9)]=!0x0,this['_connected']=!0x1,this[_0x3a03f3(0x272)]=!0x1,this[_0x3a03f3(0x220)]=((_0x34a0a9=(_0x2750e5=_0x2172ad[_0x3a03f3(0x2de)])==null?void 0x0:_0x2750e5[_0x3a03f3(0x231)])==null?void 0x0:_0x34a0a9[_0x3a03f3(0x22c)])===_0x3a03f3(0x276),this[_0x3a03f3(0x27f)]=!((_0x4b6ec2=(_0x5730b6=this['global'][_0x3a03f3(0x2de)])==null?void 0x0:_0x5730b6[_0x3a03f3(0x249)])!=null&&_0x4b6ec2[_0x3a03f3(0x256)])&&!this[_0x3a03f3(0x220)],this[_0x3a03f3(0x291)]=null,this[_0x3a03f3(0x253)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x3a03f3(0x2a2)]='https://tinyurl.com/37x8b79t',this[_0x3a03f3(0x1ee)]=(this[_0x3a03f3(0x27f)]?_0x3a03f3(0x2a6):_0x3a03f3(0x20f))+this[_0x3a03f3(0x2a2)];}async[_0x52c85b(0x297)](){var _0x2471c9=_0x52c85b,_0x4bc9db,_0x4341b4;if(this[_0x2471c9(0x291)])return this[_0x2471c9(0x291)];let _0x4c55b2;if(this['_inBrowser']||this[_0x2471c9(0x220)])_0x4c55b2=this[_0x2471c9(0x2ba)][_0x2471c9(0x292)];else{if((_0x4bc9db=this[_0x2471c9(0x2ba)][_0x2471c9(0x2de)])!=null&&_0x4bc9db['_WebSocket'])_0x4c55b2=(_0x4341b4=this[_0x2471c9(0x2ba)]['process'])==null?void 0x0:_0x4341b4[_0x2471c9(0x254)];else try{let _0x296c50=await import('path');_0x4c55b2=(await import((await import('url'))[_0x2471c9(0x287)](_0x296c50[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],_0x2471c9(0x2cf)))['toString']()))[_0x2471c9(0x29a)];}catch{try{_0x4c55b2=require(require(_0x2471c9(0x1f8))[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],'ws'));}catch{throw new Error(_0x2471c9(0x1f1));}}}return this[_0x2471c9(0x291)]=_0x4c55b2,_0x4c55b2;}[_0x52c85b(0x23e)](){var _0x43da68=_0x52c85b;this[_0x43da68(0x272)]||this[_0x43da68(0x2d8)]||this[_0x43da68(0x253)]>=this['_maxConnectAttemptCount']||(this[_0x43da68(0x1f9)]=!0x1,this[_0x43da68(0x272)]=!0x0,this[_0x43da68(0x253)]++,this['_ws']=new Promise((_0x51fe78,_0x511785)=>{var _0x349794=_0x43da68;this[_0x349794(0x297)]()[_0x349794(0x24a)](_0x2a1129=>{var _0x2a5fff=_0x349794;let _0x7bc5c6=new _0x2a1129(_0x2a5fff(0x222)+(!this[_0x2a5fff(0x27f)]&&this[_0x2a5fff(0x26c)]?_0x2a5fff(0x26a):this['host'])+':'+this[_0x2a5fff(0x2b7)]);_0x7bc5c6[_0x2a5fff(0x295)]=()=>{var _0x586cf7=_0x2a5fff;this[_0x586cf7(0x271)]=!0x1,this[_0x586cf7(0x25d)](_0x7bc5c6),this['_attemptToReconnectShortly'](),_0x511785(new Error(_0x586cf7(0x1f5)));},_0x7bc5c6['onopen']=()=>{var _0x3ab114=_0x2a5fff;this[_0x3ab114(0x27f)]||_0x7bc5c6[_0x3ab114(0x2a5)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)](),_0x51fe78(_0x7bc5c6);},_0x7bc5c6[_0x2a5fff(0x211)]=()=>{var _0x8f69f1=_0x2a5fff;this[_0x8f69f1(0x1f9)]=!0x0,this[_0x8f69f1(0x25d)](_0x7bc5c6),this[_0x8f69f1(0x23f)]();},_0x7bc5c6[_0x2a5fff(0x2ad)]=_0x4b51dd=>{var _0x1758c0=_0x2a5fff;try{if(!(_0x4b51dd!=null&&_0x4b51dd[_0x1758c0(0x277)])||!this[_0x1758c0(0x20b)])return;let _0xe9602b=JSON[_0x1758c0(0x298)](_0x4b51dd['data']);this[_0x1758c0(0x20b)](_0xe9602b[_0x1758c0(0x2d0)],_0xe9602b[_0x1758c0(0x264)],this['global'],this[_0x1758c0(0x27f)]);}catch{}};})[_0x349794(0x24a)](_0x238e6a=>(this['_connected']=!0x0,this[_0x349794(0x272)]=!0x1,this[_0x349794(0x1f9)]=!0x1,this[_0x349794(0x271)]=!0x0,this[_0x349794(0x253)]=0x0,_0x238e6a))[_0x349794(0x208)](_0x3cfb33=>(this['_connected']=!0x1,this[_0x349794(0x272)]=!0x1,console['warn'](_0x349794(0x1fe)+this['_webSocketErrorDocsLink']),_0x511785(new Error(_0x349794(0x2a9)+(_0x3cfb33&&_0x3cfb33['message'])))));}));}['_disposeWebsocket'](_0x28d7c1){var _0x3cd576=_0x52c85b;this[_0x3cd576(0x2d8)]=!0x1,this[_0x3cd576(0x272)]=!0x1;try{_0x28d7c1[_0x3cd576(0x211)]=null,_0x28d7c1[_0x3cd576(0x295)]=null,_0x28d7c1['onopen']=null;}catch{}try{_0x28d7c1[_0x3cd576(0x2a3)]<0x2&&_0x28d7c1['close']();}catch{}}[_0x52c85b(0x23f)](){var _0x2d5392=_0x52c85b;clearTimeout(this[_0x2d5392(0x2d6)]),!(this['_connectAttemptCount']>=this[_0x2d5392(0x1f4)])&&(this[_0x2d5392(0x2d6)]=setTimeout(()=>{var _0x18f7af=_0x2d5392,_0x5a11bf;this[_0x18f7af(0x2d8)]||this[_0x18f7af(0x272)]||(this[_0x18f7af(0x23e)](),(_0x5a11bf=this[_0x18f7af(0x2d7)])==null||_0x5a11bf[_0x18f7af(0x208)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x2d5392(0x2d6)]['unref']&&this['_reconnectTimeout'][_0x2d5392(0x2d9)]());}async['send'](_0x2b2f32){var _0x3a0278=_0x52c85b;try{if(!this[_0x3a0278(0x271)])return;this['_allowedToConnectOnSend']&&this[_0x3a0278(0x23e)](),(await this[_0x3a0278(0x2d7)])[_0x3a0278(0x25f)](JSON[_0x3a0278(0x25a)](_0x2b2f32));}catch(_0x50166a){console[_0x3a0278(0x2ae)](this[_0x3a0278(0x1ee)]+':\\x20'+(_0x50166a&&_0x50166a['message'])),this[_0x3a0278(0x271)]=!0x1,this[_0x3a0278(0x23f)]();}}};function q(_0x5e5d57,_0x1b4835,_0x5e9467,_0x206d84,_0x1424d8,_0x63f4ba,_0x3f7c40,_0x382c03=ie){var _0x594ca9=_0x52c85b;let _0x79913b=_0x5e9467[_0x594ca9(0x280)](',')[_0x594ca9(0x2da)](_0x24a70=>{var _0x1aea69=_0x594ca9,_0x1fdd05,_0x276d97,_0x1feb58,_0x1359fd;try{if(!_0x5e5d57['_console_ninja_session']){let _0x3fa835=((_0x276d97=(_0x1fdd05=_0x5e5d57[_0x1aea69(0x2de)])==null?void 0x0:_0x1fdd05[_0x1aea69(0x249)])==null?void 0x0:_0x276d97['node'])||((_0x1359fd=(_0x1feb58=_0x5e5d57['process'])==null?void 0x0:_0x1feb58['env'])==null?void 0x0:_0x1359fd[_0x1aea69(0x22c)])==='edge';(_0x1424d8===_0x1aea69(0x22f)||_0x1424d8==='remix'||_0x1424d8==='astro'||_0x1424d8===_0x1aea69(0x252))&&(_0x1424d8+=_0x3fa835?'\\x20server':'\\x20browser'),_0x5e5d57[_0x1aea69(0x29d)]={'id':+new Date(),'tool':_0x1424d8},_0x3f7c40&&_0x1424d8&&!_0x3fa835&&console[_0x1aea69(0x242)](_0x1aea69(0x21a)+(_0x1424d8[_0x1aea69(0x21d)](0x0)[_0x1aea69(0x2c5)]()+_0x1424d8[_0x1aea69(0x219)](0x1))+',',_0x1aea69(0x20e),_0x1aea69(0x215));}let _0x83dde3=new Z(_0x5e5d57,_0x1b4835,_0x24a70,_0x206d84,_0x63f4ba,_0x382c03);return _0x83dde3['send'][_0x1aea69(0x2bb)](_0x83dde3);}catch(_0x1072c2){return console[_0x1aea69(0x2ae)](_0x1aea69(0x23b),_0x1072c2&&_0x1072c2['message']),()=>{};}});return _0x5f5c=>_0x79913b[_0x594ca9(0x206)](_0xf1e1e9=>_0xf1e1e9(_0x5f5c));}function ie(_0x844ad6,_0x1ef94f,_0x1bb388,_0x5b0f35){var _0x21c3ad=_0x52c85b;_0x5b0f35&&_0x844ad6===_0x21c3ad(0x26f)&&_0x1bb388[_0x21c3ad(0x2a1)][_0x21c3ad(0x26f)]();}function _0x71d4(){var _0x4cd662=['eventReceivedCallback','getOwnPropertyNames','constructor','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','__es'+'Module','onclose','1729083078541','_additionalMetadata','allStrLength','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','level','HTMLAllCollection','current','substr','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','funcName','_isSet','charAt','String','nodeModules','_inNextEdge','_dateToString','ws://','error','null','capped','450VyGHfK','count','hasOwnProperty','_setNodeExpandableState','reduceLimits','_setNodeQueryPath','NEXT_RUNTIME','some','_numberRegExp','next.js','depth','env','bigint','autoExpandLimit','boolean','_isUndefined','_addLoadNode','cappedElements','expId','trace','_addProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','console','POSITIVE_INFINITY','_connectToHostNow','_attemptToReconnectShortly','autoExpandMaxDepth','call','log','_objectToString','107955OuwREG','_HTMLAllCollection','number','Map','_processTreeNodeResult','versions','then','322336BCHbRX','type','_getOwnPropertyDescriptor','value','','autoExpandPropertyCount','_treeNodePropertiesBeforeFullValue','angular','_connectAttemptCount','_WebSocket','131994iCoayd','node','_hasMapOnItsPath','push','[object\\x20Set]','stringify','Buffer','join','_disposeWebsocket','2wslTSs','send','autoExpandPreviousObjects','name','_p_length','match','args','','concat','_ninjaIgnoreNextError','fromCharCode','props','gateway.docker.internal','elapsed','dockerizedApp','_capIfString','resolveGetters','reload','_undefined','_allowedToSend','_connecting','_console_ninja','5612766HFCOwu','_setNodePermissions','edge','data','replace','performance','time',\"/Users/ngelrojas/.vscode/extensions/wallabyjs.console-ninja-1.0.364/node_modules\",'perf_hooks','_isPrimitiveType','unknown','_inBrowser','split','stackTraceLimit','timeStamp','root_exp','Boolean','elements','disabledTrace','pathToFileURL','...','NEGATIVE_INFINITY','string','127.0.0.1','index','55895','symbol','_p_name','_setNodeExpressionPath','_WebSocketClass','WebSocket','length','_blacklistedProperty','onerror','sort','getWebSocketClass','parse','pop','default','2263440DiNTNK','_addFunctionsNode','_console_ninja_session','getOwnPropertySymbols','test','indexOf','location','_webSocketErrorDocsLink','readyState','_Symbol','_socket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','toLowerCase','getter','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_isMap','_setNodeId','undefined','onmessage','warn','host','_quotedRegExp','autoExpand','toString','112TgpLnc','_p_','_treeNodePropertiesAfterFullValue','883830dhuaNV','port','webpack','getPrototypeOf','global','bind','nan','includes','set','origin','hits','hrtime','_getOwnPropertySymbols','cappedProps','strLength','toUpperCase','isExpressionToEvaluate','hostname','expressionsToEvaluate','totalStrLength','parent','_sortProps','now','slice','message','ws/index.js','method','_getOwnPropertyNames','[object\\x20BigInt]','_type','[object\\x20Map]','getOwnPropertyDescriptor','_reconnectTimeout','_ws','_connected','unref','map','_isPrimitiveWrapperType','[object\\x20Date]','positiveInfinity','process','array','rootExpression','_setNodeLabel','_sendErrorMessage','_addObjectProperty','noFunctions','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','valueOf','stack','_maxConnectAttemptCount','logger\\x20websocket\\x20error','_propertyName','prototype','path','_allowedToConnectOnSend','function','negativeZero','[object\\x20Array]','Set','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','object','4115maXyRn','Number','_keyStrRegExp','coverage','_consoleNinjaAllowedToStart','startsWith','forEach','_property','catch','_cleanNode','serialize'];_0x71d4=function(){return _0x4cd662;};return _0x71d4();}function _0x1765(_0x553705,_0x4ec105){var _0x71d46=_0x71d4();return _0x1765=function(_0x17652e,_0x1a61b2){_0x17652e=_0x17652e-0x1ec;var _0x40c357=_0x71d46[_0x17652e];return _0x40c357;},_0x1765(_0x553705,_0x4ec105);}function B(_0x57d751){var _0x30d759=_0x52c85b,_0x2f0544,_0x425634;let _0x3fb00b=function(_0x4f3378,_0x2b9204){return _0x2b9204-_0x4f3378;},_0x37974a;if(_0x57d751[_0x30d759(0x279)])_0x37974a=function(){var _0x4497fe=_0x30d759;return _0x57d751[_0x4497fe(0x279)][_0x4497fe(0x2cc)]();};else{if(_0x57d751[_0x30d759(0x2de)]&&_0x57d751[_0x30d759(0x2de)][_0x30d759(0x2c1)]&&((_0x425634=(_0x2f0544=_0x57d751[_0x30d759(0x2de)])==null?void 0x0:_0x2f0544['env'])==null?void 0x0:_0x425634[_0x30d759(0x22c)])!=='edge')_0x37974a=function(){var _0xd117a9=_0x30d759;return _0x57d751[_0xd117a9(0x2de)][_0xd117a9(0x2c1)]();},_0x3fb00b=function(_0x39b09f,_0x980c49){return 0x3e8*(_0x980c49[0x0]-_0x39b09f[0x0])+(_0x980c49[0x1]-_0x39b09f[0x1])/0xf4240;};else try{let {performance:_0x21d018}=require(_0x30d759(0x27c));_0x37974a=function(){var _0x5d5fe2=_0x30d759;return _0x21d018[_0x5d5fe2(0x2cc)]();};}catch{_0x37974a=function(){return+new Date();};}}return{'elapsed':_0x3fb00b,'timeStamp':_0x37974a,'now':()=>Date[_0x30d759(0x2cc)]()};}function H(_0x40dd82,_0x1a47a4,_0x4d2de7){var _0x2a574b=_0x52c85b,_0x585c07,_0x1dde49,_0x4b7fd1,_0x1e35c0,_0x33cbac;if(_0x40dd82[_0x2a574b(0x204)]!==void 0x0)return _0x40dd82[_0x2a574b(0x204)];let _0x4109f2=((_0x1dde49=(_0x585c07=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x585c07['versions'])==null?void 0x0:_0x1dde49[_0x2a574b(0x256)])||((_0x1e35c0=(_0x4b7fd1=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x4b7fd1['env'])==null?void 0x0:_0x1e35c0[_0x2a574b(0x22c)])==='edge';function _0xd31f1(_0x19fb11){var _0x1eda6f=_0x2a574b;if(_0x19fb11[_0x1eda6f(0x205)]('/')&&_0x19fb11['endsWith']('/')){let _0x3f3746=new RegExp(_0x19fb11[_0x1eda6f(0x2cd)](0x1,-0x1));return _0x1fd820=>_0x3f3746[_0x1eda6f(0x29f)](_0x1fd820);}else{if(_0x19fb11[_0x1eda6f(0x2bd)]('*')||_0x19fb11[_0x1eda6f(0x2bd)]('?')){let _0x16815c=new RegExp('^'+_0x19fb11[_0x1eda6f(0x278)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0x1eda6f(0x278)](/\\?/g,'.')+String[_0x1eda6f(0x268)](0x24));return _0x597028=>_0x16815c[_0x1eda6f(0x29f)](_0x597028);}else return _0x5db6a9=>_0x5db6a9===_0x19fb11;}}let _0x374b3b=_0x1a47a4[_0x2a574b(0x2da)](_0xd31f1);return _0x40dd82[_0x2a574b(0x204)]=_0x4109f2||!_0x1a47a4,!_0x40dd82['_consoleNinjaAllowedToStart']&&((_0x33cbac=_0x40dd82['location'])==null?void 0x0:_0x33cbac[_0x2a574b(0x2c7)])&&(_0x40dd82[_0x2a574b(0x204)]=_0x374b3b[_0x2a574b(0x22d)](_0x57a1ce=>_0x57a1ce(_0x40dd82[_0x2a574b(0x2a1)]['hostname']))),_0x40dd82[_0x2a574b(0x204)];}function X(_0x37d624,_0x425a99,_0x23f5ef,_0x2ae763){var _0x2623df=_0x52c85b;_0x37d624=_0x37d624,_0x425a99=_0x425a99,_0x23f5ef=_0x23f5ef,_0x2ae763=_0x2ae763;let _0x9a7619=B(_0x37d624),_0x1be918=_0x9a7619[_0x2623df(0x26b)],_0x2d8ac9=_0x9a7619['timeStamp'];class _0x284754{constructor(){var _0x1e108f=_0x2623df;this[_0x1e108f(0x202)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x1e108f(0x22e)]=/^(0|[1-9][0-9]*)$/,this[_0x1e108f(0x2b0)]=/'([^\\\\']|\\\\')*'/,this[_0x1e108f(0x270)]=_0x37d624['undefined'],this[_0x1e108f(0x245)]=_0x37d624[_0x1e108f(0x217)],this[_0x1e108f(0x24d)]=Object[_0x1e108f(0x2d5)],this['_getOwnPropertyNames']=Object[_0x1e108f(0x20c)],this['_Symbol']=_0x37d624['Symbol'],this['_regExpToString']=RegExp[_0x1e108f(0x1f7)][_0x1e108f(0x2b2)],this[_0x1e108f(0x221)]=Date[_0x1e108f(0x1f7)]['toString'];}['serialize'](_0x5df2e5,_0x28d843,_0xcb4789,_0xdcda9){var _0x157369=_0x2623df,_0x204121=this,_0x7c527c=_0xcb4789['autoExpand'];function _0x525b94(_0x476e30,_0x59becc,_0x306c45){var _0x17e488=_0x1765;_0x59becc['type']='unknown',_0x59becc[_0x17e488(0x223)]=_0x476e30[_0x17e488(0x2ce)],_0x642c19=_0x306c45['node'][_0x17e488(0x218)],_0x306c45['node'][_0x17e488(0x218)]=_0x59becc,_0x204121[_0x17e488(0x251)](_0x59becc,_0x306c45);}try{_0xcb4789[_0x157369(0x216)]++,_0xcb4789['autoExpand']&&_0xcb4789['autoExpandPreviousObjects'][_0x157369(0x258)](_0x28d843);var _0x1cc857,_0x4f181d,_0x1561f0,_0x4bd796,_0x12e234=[],_0x57be70=[],_0x538ba4,_0x937729=this[_0x157369(0x2d3)](_0x28d843),_0x7c4fbd=_0x937729==='array',_0x423502=!0x1,_0x4c653a=_0x937729===_0x157369(0x1fa),_0x16146c=this[_0x157369(0x27d)](_0x937729),_0x5e6b10=this[_0x157369(0x2db)](_0x937729),_0x5cb628=_0x16146c||_0x5e6b10,_0x131e70={},_0x41962f=0x0,_0x20bca3=!0x1,_0x642c19,_0x1bfeb1=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xcb4789[_0x157369(0x230)]){if(_0x7c4fbd){if(_0x4f181d=_0x28d843[_0x157369(0x293)],_0x4f181d>_0xcb4789['elements']){for(_0x1561f0=0x0,_0x4bd796=_0xcb4789[_0x157369(0x285)],_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121['_addProperty'](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));_0x5df2e5[_0x157369(0x237)]=!0x0;}else{for(_0x1561f0=0x0,_0x4bd796=_0x4f181d,_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x23a)](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));}_0xcb4789[_0x157369(0x250)]+=_0x57be70['length'];}if(!(_0x937729===_0x157369(0x224)||_0x937729==='undefined')&&!_0x16146c&&_0x937729!=='String'&&_0x937729!==_0x157369(0x25b)&&_0x937729!=='bigint'){var _0x14ad0a=_0xdcda9['props']||_0xcb4789[_0x157369(0x269)];if(this[_0x157369(0x21c)](_0x28d843)?(_0x1cc857=0x0,_0x28d843[_0x157369(0x206)](function(_0x795ddf){var _0x15dd02=_0x157369;if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789[_0x15dd02(0x2c6)]&&_0xcb4789[_0x15dd02(0x2b1)]&&_0xcb4789[_0x15dd02(0x250)]>_0xcb4789[_0x15dd02(0x233)]){_0x20bca3=!0x0;return;}_0x57be70['push'](_0x204121[_0x15dd02(0x23a)](_0x12e234,_0x28d843,_0x15dd02(0x1fd),_0x1cc857++,_0xcb4789,function(_0x498239){return function(){return _0x498239;};}(_0x795ddf)));})):this[_0x157369(0x2aa)](_0x28d843)&&_0x28d843['forEach'](function(_0x268d65,_0x26e6f7){var _0x462487=_0x157369;if(_0x41962f++,_0xcb4789[_0x462487(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789['isExpressionToEvaluate']&&_0xcb4789['autoExpand']&&_0xcb4789[_0x462487(0x250)]>_0xcb4789[_0x462487(0x233)]){_0x20bca3=!0x0;return;}var _0x19aed5=_0x26e6f7[_0x462487(0x2b2)]();_0x19aed5[_0x462487(0x293)]>0x64&&(_0x19aed5=_0x19aed5['slice'](0x0,0x64)+_0x462487(0x288)),_0x57be70[_0x462487(0x258)](_0x204121[_0x462487(0x23a)](_0x12e234,_0x28d843,'Map',_0x19aed5,_0xcb4789,function(_0x23ffd6){return function(){return _0x23ffd6;};}(_0x268d65)));}),!_0x423502){try{for(_0x538ba4 in _0x28d843)if(!(_0x7c4fbd&&_0x1bfeb1['test'](_0x538ba4))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)){if(_0x41962f++,_0xcb4789[_0x157369(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789['autoExpandLimit']){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}catch{}if(_0x131e70[_0x157369(0x262)]=!0x0,_0x4c653a&&(_0x131e70[_0x157369(0x28f)]=!0x0),!_0x20bca3){var _0x5ae1db=[][_0x157369(0x266)](this[_0x157369(0x2d1)](_0x28d843))[_0x157369(0x266)](this[_0x157369(0x2c2)](_0x28d843));for(_0x1cc857=0x0,_0x4f181d=_0x5ae1db[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)if(_0x538ba4=_0x5ae1db[_0x1cc857],!(_0x7c4fbd&&_0x1bfeb1[_0x157369(0x29f)](_0x538ba4[_0x157369(0x2b2)]()))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)&&!_0x131e70[_0x157369(0x2b4)+_0x538ba4[_0x157369(0x2b2)]()]){if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789[_0x157369(0x233)]){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}}}}if(_0x5df2e5[_0x157369(0x24c)]=_0x937729,_0x5cb628?(_0x5df2e5[_0x157369(0x24e)]=_0x28d843['valueOf'](),this[_0x157369(0x26d)](_0x937729,_0x5df2e5,_0xcb4789,_0xdcda9)):_0x937729==='date'?_0x5df2e5[_0x157369(0x24e)]=this[_0x157369(0x221)][_0x157369(0x241)](_0x28d843):_0x937729===_0x157369(0x232)?_0x5df2e5[_0x157369(0x24e)]=_0x28d843[_0x157369(0x2b2)]():_0x937729==='RegExp'?_0x5df2e5[_0x157369(0x24e)]=this['_regExpToString'][_0x157369(0x241)](_0x28d843):_0x937729==='symbol'&&this[_0x157369(0x2a4)]?_0x5df2e5['value']=this[_0x157369(0x2a4)][_0x157369(0x1f7)]['toString'][_0x157369(0x241)](_0x28d843):!_0xcb4789['depth']&&!(_0x937729===_0x157369(0x224)||_0x937729===_0x157369(0x2ac))&&(delete _0x5df2e5[_0x157369(0x24e)],_0x5df2e5[_0x157369(0x225)]=!0x0),_0x20bca3&&(_0x5df2e5[_0x157369(0x2c3)]=!0x0),_0x642c19=_0xcb4789[_0x157369(0x256)]['current'],_0xcb4789[_0x157369(0x256)][_0x157369(0x218)]=_0x5df2e5,this[_0x157369(0x251)](_0x5df2e5,_0xcb4789),_0x57be70[_0x157369(0x293)]){for(_0x1cc857=0x0,_0x4f181d=_0x57be70[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)_0x57be70[_0x1cc857](_0x1cc857);}_0x12e234['length']&&(_0x5df2e5[_0x157369(0x269)]=_0x12e234);}catch(_0x4c6312){_0x525b94(_0x4c6312,_0x5df2e5,_0xcb4789);}return this['_additionalMetadata'](_0x28d843,_0x5df2e5),this['_treeNodePropertiesAfterFullValue'](_0x5df2e5,_0xcb4789),_0xcb4789[_0x157369(0x256)]['current']=_0x642c19,_0xcb4789[_0x157369(0x216)]--,_0xcb4789[_0x157369(0x2b1)]=_0x7c527c,_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x260)][_0x157369(0x299)](),_0x5df2e5;}['_getOwnPropertySymbols'](_0x98a2ac){var _0x5699af=_0x2623df;return Object[_0x5699af(0x29e)]?Object['getOwnPropertySymbols'](_0x98a2ac):[];}[_0x2623df(0x21c)](_0x1b06f2){var _0x45deb3=_0x2623df;return!!(_0x1b06f2&&_0x37d624[_0x45deb3(0x1fd)]&&this[_0x45deb3(0x243)](_0x1b06f2)===_0x45deb3(0x259)&&_0x1b06f2[_0x45deb3(0x206)]);}[_0x2623df(0x294)](_0x2a16f8,_0x2d32bc,_0xc52e10){var _0x1da585=_0x2623df;return _0xc52e10['noFunctions']?typeof _0x2a16f8[_0x2d32bc]==_0x1da585(0x1fa):!0x1;}[_0x2623df(0x2d3)](_0x3c584c){var _0x4a2b0b=_0x2623df,_0x116724='';return _0x116724=typeof _0x3c584c,_0x116724===_0x4a2b0b(0x1ff)?this[_0x4a2b0b(0x243)](_0x3c584c)==='[object\\x20Array]'?_0x116724=_0x4a2b0b(0x2df):this['_objectToString'](_0x3c584c)===_0x4a2b0b(0x2dc)?_0x116724='date':this[_0x4a2b0b(0x243)](_0x3c584c)===_0x4a2b0b(0x2d2)?_0x116724=_0x4a2b0b(0x232):_0x3c584c===null?_0x116724=_0x4a2b0b(0x224):_0x3c584c[_0x4a2b0b(0x20d)]&&(_0x116724=_0x3c584c[_0x4a2b0b(0x20d)][_0x4a2b0b(0x261)]||_0x116724):_0x116724===_0x4a2b0b(0x2ac)&&this[_0x4a2b0b(0x245)]&&_0x3c584c instanceof this[_0x4a2b0b(0x245)]&&(_0x116724=_0x4a2b0b(0x217)),_0x116724;}[_0x2623df(0x243)](_0xc200d5){var _0x4e9e8b=_0x2623df;return Object[_0x4e9e8b(0x1f7)][_0x4e9e8b(0x2b2)]['call'](_0xc200d5);}[_0x2623df(0x27d)](_0x529a22){var _0x5c1d83=_0x2623df;return _0x529a22===_0x5c1d83(0x234)||_0x529a22===_0x5c1d83(0x28a)||_0x529a22===_0x5c1d83(0x246);}[_0x2623df(0x2db)](_0x138149){var _0x4a144e=_0x2623df;return _0x138149===_0x4a144e(0x284)||_0x138149===_0x4a144e(0x21e)||_0x138149===_0x4a144e(0x201);}[_0x2623df(0x23a)](_0x135627,_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524){var _0x2e6ca4=this;return function(_0x3cef10){var _0xcb4898=_0x1765,_0x47c646=_0x375c3c[_0xcb4898(0x256)]['current'],_0x4083d7=_0x375c3c['node']['index'],_0x5280a8=_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)];_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x47c646,_0x375c3c['node'][_0xcb4898(0x28c)]=typeof _0x11f9fb=='number'?_0x11f9fb:_0x3cef10,_0x135627[_0xcb4898(0x258)](_0x2e6ca4['_property'](_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524)),_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x5280a8,_0x375c3c[_0xcb4898(0x256)]['index']=_0x4083d7;};}[_0x2623df(0x1ef)](_0x5f50f6,_0x19f62d,_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61){var _0x1b819d=_0x2623df,_0x2f2a63=this;return _0x19f62d[_0x1b819d(0x2b4)+_0x153ede[_0x1b819d(0x2b2)]()]=!0x0,function(_0x52cd65){var _0xc2af59=_0x1b819d,_0xf1884d=_0x195a04['node'][_0xc2af59(0x218)],_0x1f5c05=_0x195a04['node'][_0xc2af59(0x28c)],_0x20b47d=_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)];_0x195a04[_0xc2af59(0x256)]['parent']=_0xf1884d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x52cd65,_0x5f50f6[_0xc2af59(0x258)](_0x2f2a63[_0xc2af59(0x207)](_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61)),_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)]=_0x20b47d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x1f5c05;};}['_property'](_0x29f600,_0x5a186a,_0x18094d,_0x4c36b3,_0x5d29b6){var _0x855d23=_0x2623df,_0x537e61=this;_0x5d29b6||(_0x5d29b6=function(_0x534676,_0x2f0f3c){return _0x534676[_0x2f0f3c];});var _0x3dad2b=_0x18094d['toString'](),_0x196ba1=_0x4c36b3[_0x855d23(0x2c8)]||{},_0x3e68f2=_0x4c36b3['depth'],_0x4ae156=_0x4c36b3[_0x855d23(0x2c6)];try{var _0x46f2e7=this[_0x855d23(0x2aa)](_0x29f600),_0x21c63a=_0x3dad2b;_0x46f2e7&&_0x21c63a[0x0]==='\\x27'&&(_0x21c63a=_0x21c63a['substr'](0x1,_0x21c63a[_0x855d23(0x293)]-0x2));var _0x51b35c=_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1['_p_'+_0x21c63a];_0x51b35c&&(_0x4c36b3[_0x855d23(0x230)]=_0x4c36b3[_0x855d23(0x230)]+0x1),_0x4c36b3['isExpressionToEvaluate']=!!_0x51b35c;var _0x4102a5=typeof _0x18094d==_0x855d23(0x28e),_0x10aa24={'name':_0x4102a5||_0x46f2e7?_0x3dad2b:this[_0x855d23(0x1f6)](_0x3dad2b)};if(_0x4102a5&&(_0x10aa24['symbol']=!0x0),!(_0x5a186a===_0x855d23(0x2df)||_0x5a186a==='Error')){var _0x4f0a95=this['_getOwnPropertyDescriptor'](_0x29f600,_0x18094d);if(_0x4f0a95&&(_0x4f0a95[_0x855d23(0x2be)]&&(_0x10aa24['setter']=!0x0),_0x4f0a95['get']&&!_0x51b35c&&!_0x4c36b3[_0x855d23(0x26e)]))return _0x10aa24[_0x855d23(0x2a8)]=!0x0,this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x8e1bdc;try{_0x8e1bdc=_0x5d29b6(_0x29f600,_0x18094d);}catch(_0x343ade){return _0x10aa24={'name':_0x3dad2b,'type':_0x855d23(0x27e),'error':_0x343ade[_0x855d23(0x2ce)]},this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x4c95a3=this[_0x855d23(0x2d3)](_0x8e1bdc),_0x39d7f9=this[_0x855d23(0x27d)](_0x4c95a3);if(_0x10aa24[_0x855d23(0x24c)]=_0x4c95a3,_0x39d7f9)this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x294840=_0x855d23;_0x10aa24['value']=_0x8e1bdc[_0x294840(0x1f2)](),!_0x51b35c&&_0x537e61['_capIfString'](_0x4c95a3,_0x10aa24,_0x4c36b3,{});});else{var _0x308b70=_0x4c36b3[_0x855d23(0x2b1)]&&_0x4c36b3[_0x855d23(0x216)]<_0x4c36b3[_0x855d23(0x240)]&&_0x4c36b3['autoExpandPreviousObjects'][_0x855d23(0x2a0)](_0x8e1bdc)<0x0&&_0x4c95a3!==_0x855d23(0x1fa)&&_0x4c36b3[_0x855d23(0x250)]<_0x4c36b3[_0x855d23(0x233)];_0x308b70||_0x4c36b3['level']<_0x3e68f2||_0x51b35c?(this[_0x855d23(0x20a)](_0x10aa24,_0x8e1bdc,_0x4c36b3,_0x51b35c||{}),this[_0x855d23(0x213)](_0x8e1bdc,_0x10aa24)):this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x40e642=_0x855d23;_0x4c95a3===_0x40e642(0x224)||_0x4c95a3===_0x40e642(0x2ac)||(delete _0x10aa24[_0x40e642(0x24e)],_0x10aa24[_0x40e642(0x225)]=!0x0);});}return _0x10aa24;}finally{_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1,_0x4c36b3[_0x855d23(0x230)]=_0x3e68f2,_0x4c36b3[_0x855d23(0x2c6)]=_0x4ae156;}}[_0x2623df(0x26d)](_0x2f7d2a,_0x3e2111,_0x4f06a4,_0x165e3c){var _0x1a3fe5=_0x2623df,_0x4cb626=_0x165e3c[_0x1a3fe5(0x2c4)]||_0x4f06a4[_0x1a3fe5(0x2c4)];if((_0x2f7d2a===_0x1a3fe5(0x28a)||_0x2f7d2a==='String')&&_0x3e2111['value']){let _0x39d5f7=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x293)];_0x4f06a4['allStrLength']+=_0x39d5f7,_0x4f06a4[_0x1a3fe5(0x214)]>_0x4f06a4[_0x1a3fe5(0x2c9)]?(_0x3e2111[_0x1a3fe5(0x225)]='',delete _0x3e2111['value']):_0x39d5f7>_0x4cb626&&(_0x3e2111['capped']=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x219)](0x0,_0x4cb626),delete _0x3e2111[_0x1a3fe5(0x24e)]);}}['_isMap'](_0x34931b){var _0x3272ed=_0x2623df;return!!(_0x34931b&&_0x37d624[_0x3272ed(0x247)]&&this[_0x3272ed(0x243)](_0x34931b)===_0x3272ed(0x2d4)&&_0x34931b['forEach']);}[_0x2623df(0x1f6)](_0x47a998){var _0x54c731=_0x2623df;if(_0x47a998[_0x54c731(0x263)](/^\\d+$/))return _0x47a998;var _0x13c78f;try{_0x13c78f=JSON['stringify'](''+_0x47a998);}catch{_0x13c78f='\\x22'+this[_0x54c731(0x243)](_0x47a998)+'\\x22';}return _0x13c78f[_0x54c731(0x263)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x13c78f=_0x13c78f['substr'](0x1,_0x13c78f['length']-0x2):_0x13c78f=_0x13c78f['replace'](/'/g,'\\x5c\\x27')[_0x54c731(0x278)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x13c78f;}[_0x2623df(0x248)](_0x450bd2,_0x540e99,_0x3a738d,_0x1d5e7b){var _0xbf57c1=_0x2623df;this[_0xbf57c1(0x251)](_0x450bd2,_0x540e99),_0x1d5e7b&&_0x1d5e7b(),this[_0xbf57c1(0x213)](_0x3a738d,_0x450bd2),this[_0xbf57c1(0x2b5)](_0x450bd2,_0x540e99);}['_treeNodePropertiesBeforeFullValue'](_0x288bd4,_0x443233){var _0x15c053=_0x2623df;this[_0x15c053(0x2ab)](_0x288bd4,_0x443233),this[_0x15c053(0x22b)](_0x288bd4,_0x443233),this['_setNodeExpressionPath'](_0x288bd4,_0x443233),this[_0x15c053(0x275)](_0x288bd4,_0x443233);}[_0x2623df(0x2ab)](_0x33355c,_0x4c1413){}['_setNodeQueryPath'](_0x5e28c0,_0x37c1ca){}['_setNodeLabel'](_0xee885f,_0x115998){}[_0x2623df(0x235)](_0x55a938){var _0x1aa6f4=_0x2623df;return _0x55a938===this[_0x1aa6f4(0x270)];}['_treeNodePropertiesAfterFullValue'](_0x10edfb,_0x29f29a){var _0x206d02=_0x2623df;this[_0x206d02(0x1ed)](_0x10edfb,_0x29f29a),this['_setNodeExpandableState'](_0x10edfb),_0x29f29a['sortProps']&&this[_0x206d02(0x2cb)](_0x10edfb),this[_0x206d02(0x29c)](_0x10edfb,_0x29f29a),this[_0x206d02(0x236)](_0x10edfb,_0x29f29a),this[_0x206d02(0x209)](_0x10edfb);}[_0x2623df(0x213)](_0x2ae38c,_0x6a4e65){var _0x3180df=_0x2623df;let _0x39ab34;try{_0x37d624[_0x3180df(0x23c)]&&(_0x39ab34=_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)],_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=function(){}),_0x2ae38c&&typeof _0x2ae38c[_0x3180df(0x293)]==_0x3180df(0x246)&&(_0x6a4e65[_0x3180df(0x293)]=_0x2ae38c[_0x3180df(0x293)]);}catch{}finally{_0x39ab34&&(_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=_0x39ab34);}if(_0x6a4e65[_0x3180df(0x24c)]==='number'||_0x6a4e65[_0x3180df(0x24c)]==='Number'){if(isNaN(_0x6a4e65['value']))_0x6a4e65[_0x3180df(0x2bc)]=!0x0,delete _0x6a4e65['value'];else switch(_0x6a4e65[_0x3180df(0x24e)]){case Number[_0x3180df(0x23d)]:_0x6a4e65[_0x3180df(0x2dd)]=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case Number['NEGATIVE_INFINITY']:_0x6a4e65['negativeInfinity']=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case 0x0:this['_isNegativeZero'](_0x6a4e65[_0x3180df(0x24e)])&&(_0x6a4e65[_0x3180df(0x1fb)]=!0x0);break;}}else _0x6a4e65[_0x3180df(0x24c)]===_0x3180df(0x1fa)&&typeof _0x2ae38c[_0x3180df(0x261)]==_0x3180df(0x28a)&&_0x2ae38c[_0x3180df(0x261)]&&_0x6a4e65[_0x3180df(0x261)]&&_0x2ae38c[_0x3180df(0x261)]!==_0x6a4e65[_0x3180df(0x261)]&&(_0x6a4e65[_0x3180df(0x21b)]=_0x2ae38c[_0x3180df(0x261)]);}['_isNegativeZero'](_0x2fa98d){var _0x8c6a89=_0x2623df;return 0x1/_0x2fa98d===Number[_0x8c6a89(0x289)];}[_0x2623df(0x2cb)](_0x45f240){var _0x27ea15=_0x2623df;!_0x45f240[_0x27ea15(0x269)]||!_0x45f240['props'][_0x27ea15(0x293)]||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x2df)||_0x45f240[_0x27ea15(0x24c)]==='Map'||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x1fd)||_0x45f240[_0x27ea15(0x269)][_0x27ea15(0x296)](function(_0x587f85,_0x25310e){var _0x27429f=_0x27ea15,_0x22eb8f=_0x587f85['name'][_0x27429f(0x2a7)](),_0x9f76b=_0x25310e[_0x27429f(0x261)][_0x27429f(0x2a7)]();return _0x22eb8f<_0x9f76b?-0x1:_0x22eb8f>_0x9f76b?0x1:0x0;});}[_0x2623df(0x29c)](_0x6aec3b,_0x4e7839){var _0x5e1614=_0x2623df;if(!(_0x4e7839[_0x5e1614(0x1f0)]||!_0x6aec3b[_0x5e1614(0x269)]||!_0x6aec3b['props'][_0x5e1614(0x293)])){for(var _0x4ae259=[],_0x2bc8c5=[],_0x2c5219=0x0,_0x4f1485=_0x6aec3b[_0x5e1614(0x269)]['length'];_0x2c5219<_0x4f1485;_0x2c5219++){var _0x29e8fa=_0x6aec3b[_0x5e1614(0x269)][_0x2c5219];_0x29e8fa['type']===_0x5e1614(0x1fa)?_0x4ae259[_0x5e1614(0x258)](_0x29e8fa):_0x2bc8c5[_0x5e1614(0x258)](_0x29e8fa);}if(!(!_0x2bc8c5[_0x5e1614(0x293)]||_0x4ae259[_0x5e1614(0x293)]<=0x1)){_0x6aec3b[_0x5e1614(0x269)]=_0x2bc8c5;var _0x28eeff={'functionsNode':!0x0,'props':_0x4ae259};this['_setNodeId'](_0x28eeff,_0x4e7839),this[_0x5e1614(0x1ed)](_0x28eeff,_0x4e7839),this[_0x5e1614(0x229)](_0x28eeff),this[_0x5e1614(0x275)](_0x28eeff,_0x4e7839),_0x28eeff['id']+='\\x20f',_0x6aec3b['props']['unshift'](_0x28eeff);}}}[_0x2623df(0x236)](_0x8d09ca,_0x48c45f){}['_setNodeExpandableState'](_0x2c3113){}['_isArray'](_0x4d0b46){var _0x540da5=_0x2623df;return Array['isArray'](_0x4d0b46)||typeof _0x4d0b46==_0x540da5(0x1ff)&&this[_0x540da5(0x243)](_0x4d0b46)===_0x540da5(0x1fc);}['_setNodePermissions'](_0x51ec7c,_0x53542f){}[_0x2623df(0x209)](_0x47913e){var _0x503d84=_0x2623df;delete _0x47913e['_hasSymbolPropertyOnItsPath'],delete _0x47913e['_hasSetOnItsPath'],delete _0x47913e[_0x503d84(0x257)];}[_0x2623df(0x290)](_0x3e77fb,_0x7533ff){}}let _0x31638a=new _0x284754(),_0xdce57e={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x43e197={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x6a9287(_0x531b46,_0x4bc71a,_0x197aa8,_0x42857c,_0x5321fe,_0x10f17e){var _0x471a36=_0x2623df;let _0x101e55,_0x1a2226;try{_0x1a2226=_0x2d8ac9(),_0x101e55=_0x23f5ef[_0x4bc71a],!_0x101e55||_0x1a2226-_0x101e55['ts']>0x1f4&&_0x101e55[_0x471a36(0x227)]&&_0x101e55[_0x471a36(0x27a)]/_0x101e55[_0x471a36(0x227)]<0x64?(_0x23f5ef[_0x4bc71a]=_0x101e55={'count':0x0,'time':0x0,'ts':_0x1a2226},_0x23f5ef[_0x471a36(0x2c0)]={}):_0x1a2226-_0x23f5ef[_0x471a36(0x2c0)]['ts']>0x32&&_0x23f5ef[_0x471a36(0x2c0)]['count']&&_0x23f5ef['hits'][_0x471a36(0x27a)]/_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]<0x64&&(_0x23f5ef['hits']={});let _0x11e3f6=[],_0x5697d2=_0x101e55['reduceLimits']||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x22a)]?_0x43e197:_0xdce57e,_0x405b05=_0x3da01f=>{var _0x3c6546=_0x471a36;let _0x26cba4={};return _0x26cba4['props']=_0x3da01f[_0x3c6546(0x269)],_0x26cba4[_0x3c6546(0x285)]=_0x3da01f[_0x3c6546(0x285)],_0x26cba4[_0x3c6546(0x2c4)]=_0x3da01f[_0x3c6546(0x2c4)],_0x26cba4[_0x3c6546(0x2c9)]=_0x3da01f['totalStrLength'],_0x26cba4[_0x3c6546(0x233)]=_0x3da01f[_0x3c6546(0x233)],_0x26cba4[_0x3c6546(0x240)]=_0x3da01f[_0x3c6546(0x240)],_0x26cba4['sortProps']=!0x1,_0x26cba4[_0x3c6546(0x1f0)]=!_0x425a99,_0x26cba4[_0x3c6546(0x230)]=0x1,_0x26cba4[_0x3c6546(0x216)]=0x0,_0x26cba4[_0x3c6546(0x238)]='root_exp_id',_0x26cba4[_0x3c6546(0x1ec)]=_0x3c6546(0x283),_0x26cba4[_0x3c6546(0x2b1)]=!0x0,_0x26cba4[_0x3c6546(0x260)]=[],_0x26cba4[_0x3c6546(0x250)]=0x0,_0x26cba4[_0x3c6546(0x26e)]=!0x0,_0x26cba4[_0x3c6546(0x214)]=0x0,_0x26cba4['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x26cba4;};for(var _0x23e276=0x0;_0x23e276<_0x5321fe[_0x471a36(0x293)];_0x23e276++)_0x11e3f6[_0x471a36(0x258)](_0x31638a[_0x471a36(0x20a)]({'timeNode':_0x531b46===_0x471a36(0x27a)||void 0x0},_0x5321fe[_0x23e276],_0x405b05(_0x5697d2),{}));if(_0x531b46==='trace'||_0x531b46===_0x471a36(0x223)){let _0x56cb28=Error['stackTraceLimit'];try{Error[_0x471a36(0x281)]=0x1/0x0,_0x11e3f6['push'](_0x31638a[_0x471a36(0x20a)]({'stackNode':!0x0},new Error()[_0x471a36(0x1f3)],_0x405b05(_0x5697d2),{'strLength':0x1/0x0}));}finally{Error[_0x471a36(0x281)]=_0x56cb28;}}return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':_0x11e3f6,'id':_0x4bc71a,'context':_0x10f17e}]};}catch(_0x141361){return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':[{'type':'unknown','error':_0x141361&&_0x141361[_0x471a36(0x2ce)]}],'id':_0x4bc71a,'context':_0x10f17e}]};}finally{try{if(_0x101e55&&_0x1a2226){let _0x53d3d0=_0x2d8ac9();_0x101e55['count']++,_0x101e55[_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x101e55['ts']=_0x53d3d0,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]++,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x23f5ef[_0x471a36(0x2c0)]['ts']=_0x53d3d0,(_0x101e55['count']>0x32||_0x101e55['time']>0x64)&&(_0x101e55[_0x471a36(0x22a)]=!0x0),(_0x23f5ef['hits'][_0x471a36(0x227)]>0x3e8||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]>0x12c)&&(_0x23f5ef['hits'][_0x471a36(0x22a)]=!0x0);}}catch{}}}return _0x6a9287;}((_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x598d24,_0x5d532f,_0x146311,_0x5c841c,_0x435457,_0x4af095)=>{var _0x178280=_0x52c85b;if(_0x5c57ad[_0x178280(0x273)])return _0x5c57ad[_0x178280(0x273)];if(!H(_0x5c57ad,_0x146311,_0x3deb3c))return _0x5c57ad[_0x178280(0x273)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5c57ad['_console_ninja'];let _0x348138=B(_0x5c57ad),_0x4526fb=_0x348138[_0x178280(0x26b)],_0x4d4ffb=_0x348138[_0x178280(0x282)],_0x383918=_0x348138[_0x178280(0x2cc)],_0x42c1e2={'hits':{},'ts':{}},_0x5f1ccb=X(_0x5c57ad,_0x5c841c,_0x42c1e2,_0x598d24),_0xd940d5=_0x4e24ec=>{_0x42c1e2['ts'][_0x4e24ec]=_0x4d4ffb();},_0xea84f2=(_0x1e4f3c,_0x4cf578)=>{var _0x1bcce6=_0x178280;let _0x930c06=_0x42c1e2['ts'][_0x4cf578];if(delete _0x42c1e2['ts'][_0x4cf578],_0x930c06){let _0x1303d4=_0x4526fb(_0x930c06,_0x4d4ffb());_0xde4346(_0x5f1ccb(_0x1bcce6(0x27a),_0x1e4f3c,_0x383918(),_0x42be99,[_0x1303d4],_0x4cf578));}},_0x4f0396=_0x430740=>{var _0x16daef=_0x178280,_0x326829;return _0x3deb3c===_0x16daef(0x22f)&&_0x5c57ad[_0x16daef(0x2bf)]&&((_0x326829=_0x430740==null?void 0x0:_0x430740[_0x16daef(0x264)])==null?void 0x0:_0x326829[_0x16daef(0x293)])&&(_0x430740[_0x16daef(0x264)][0x0]['origin']=_0x5c57ad[_0x16daef(0x2bf)]),_0x430740;};_0x5c57ad['_console_ninja']={'consoleLog':(_0x389383,_0x33070f)=>{var _0xcc2784=_0x178280;_0x5c57ad[_0xcc2784(0x23c)]['log']['name']!=='disabledLog'&&_0xde4346(_0x5f1ccb(_0xcc2784(0x242),_0x389383,_0x383918(),_0x42be99,_0x33070f));},'consoleTrace':(_0x5a7462,_0x4ad9a0)=>{var _0x34222f=_0x178280,_0x4e5f09,_0x38cb70;_0x5c57ad['console']['log'][_0x34222f(0x261)]!==_0x34222f(0x286)&&((_0x38cb70=(_0x4e5f09=_0x5c57ad['process'])==null?void 0x0:_0x4e5f09[_0x34222f(0x249)])!=null&&_0x38cb70[_0x34222f(0x256)]&&(_0x5c57ad['_ninjaIgnoreNextError']=!0x0),_0xde4346(_0x4f0396(_0x5f1ccb(_0x34222f(0x239),_0x5a7462,_0x383918(),_0x42be99,_0x4ad9a0))));},'consoleError':(_0x56c660,_0x124401)=>{var _0x5a4dbf=_0x178280;_0x5c57ad[_0x5a4dbf(0x267)]=!0x0,_0xde4346(_0x4f0396(_0x5f1ccb(_0x5a4dbf(0x223),_0x56c660,_0x383918(),_0x42be99,_0x124401)));},'consoleTime':_0x2b72bf=>{_0xd940d5(_0x2b72bf);},'consoleTimeEnd':(_0xf42d7f,_0x231d2e)=>{_0xea84f2(_0x231d2e,_0xf42d7f);},'autoLog':(_0x34fc42,_0x1593ab)=>{_0xde4346(_0x5f1ccb('log',_0x1593ab,_0x383918(),_0x42be99,[_0x34fc42]));},'autoLogMany':(_0x1161f8,_0x1f890f)=>{var _0x432033=_0x178280;_0xde4346(_0x5f1ccb(_0x432033(0x242),_0x1161f8,_0x383918(),_0x42be99,_0x1f890f));},'autoTrace':(_0x1abd02,_0x1a1339)=>{var _0x23dceb=_0x178280;_0xde4346(_0x4f0396(_0x5f1ccb(_0x23dceb(0x239),_0x1a1339,_0x383918(),_0x42be99,[_0x1abd02])));},'autoTraceMany':(_0x5662b6,_0x1b0d24)=>{_0xde4346(_0x4f0396(_0x5f1ccb('trace',_0x5662b6,_0x383918(),_0x42be99,_0x1b0d24)));},'autoTime':(_0x4a4e0b,_0x1660f1,_0xecbc72)=>{_0xd940d5(_0xecbc72);},'autoTimeEnd':(_0x391986,_0x4e8b70,_0x41f58e)=>{_0xea84f2(_0x4e8b70,_0x41f58e);},'coverage':_0x5ae8d0=>{var _0x294a69=_0x178280;_0xde4346({'method':_0x294a69(0x203),'version':_0x598d24,'args':[{'id':_0x5ae8d0}]});}};let _0xde4346=q(_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x435457,_0x4af095),_0x42be99=_0x5c57ad[_0x178280(0x29d)];return _0x5c57ad[_0x178280(0x273)];})(globalThis,_0x52c85b(0x28b),_0x52c85b(0x28d),_0x52c85b(0x27b),_0x52c85b(0x2b8),'1.0.0',_0x52c85b(0x212),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ngels-MacBook-Pro.local\",\"127.0.2.2\",\"127.0.2.3\",\"192.168.15.52\",\"172.16.0.2\"],_0x52c85b(0x265),_0x52c85b(0x24f),'1');");
}
catch (e) { } }
; /* istanbul ignore next */
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo; /* istanbul ignore next */
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr; /* istanbul ignore next */
function oo_tx(i, ...v) { try {
    oo_cm().consoleError(i, v);
}
catch (e) { } return v; }
;
oo_tx; /* istanbul ignore next */
function oo_ts(v) { try {
    oo_cm().consoleTime(v);
}
catch (e) { } return v; }
;
oo_ts; /* istanbul ignore next */
function oo_te(v, i) { try {
    oo_cm().consoleTimeEnd(v, i);
}
catch (e) { } return v; }
;
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const browser = __webpack_require__(4);
const fs = __webpack_require__(6);
const path = __webpack_require__(7);
const crypto = __webpack_require__(8);
const os = __webpack_require__(9);
__webpack_require__(5);

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);

class Ollama extends browser.Ollama {
  async encodeImage(image) {
    if (typeof image !== "string") {
      const result = Buffer.from(image).toString("base64");
      return result;
    }
    try {
      if (fs__default.existsSync(image)) {
        const fileBuffer = await fs.promises.readFile(path.resolve(image));
        return Buffer.from(fileBuffer).toString("base64");
      }
    } catch {
    }
    return image;
  }
  async parseModelfile(modelfile, mfDir = process.cwd()) {
    const out = [];
    const lines = modelfile.split("\n");
    for (const line of lines) {
      const [command, args] = line.split(" ", 2);
      if (["FROM", "ADAPTER"].includes(command.toUpperCase())) {
        const path = this.resolvePath(args.trim(), mfDir);
        if (await this.fileExists(path)) {
          out.push(`${command} @${await this.createBlob(path)}`);
        } else {
          out.push(`${command} ${args}`);
        }
      } else {
        out.push(line);
      }
    }
    return out.join("\n");
  }
  resolvePath(inputPath, mfDir) {
    if (inputPath.startsWith("~")) {
      return path.join(os.homedir(), inputPath.slice(1));
    }
    return path.resolve(mfDir, inputPath);
  }
  async fileExists(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
  }
  async createBlob(path) {
    if (typeof ReadableStream === "undefined") {
      throw new Error("Streaming uploads are not supported in this environment.");
    }
    const fileStream = fs.createReadStream(path);
    const sha256sum = await new Promise((resolve2, reject) => {
      const hash = crypto.createHash("sha256");
      fileStream.on("data", (data) => hash.update(data));
      fileStream.on("end", () => resolve2(hash.digest("hex")));
      fileStream.on("error", reject);
    });
    const digest = `sha256:${sha256sum}`;
    try {
      await browser.head(this.fetch, `${this.config.host}/api/blobs/${digest}`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("404")) {
        const readableStream = new ReadableStream({
          start(controller) {
            fileStream.on("data", (chunk) => {
              controller.enqueue(chunk);
            });
            fileStream.on("end", () => {
              controller.close();
            });
            fileStream.on("error", (err) => {
              controller.error(err);
            });
          }
        });
        await browser.post(
          this.fetch,
          `${this.config.host}/api/blobs/${digest}`,
          readableStream
        );
      } else {
        throw e;
      }
    }
    return digest;
  }
  async create(request) {
    let modelfileContent = "";
    if (request.path) {
      modelfileContent = await fs.promises.readFile(request.path, { encoding: "utf8" });
      modelfileContent = await this.parseModelfile(
        modelfileContent,
        path.dirname(request.path)
      );
    } else if (request.modelfile) {
      modelfileContent = await this.parseModelfile(request.modelfile);
    } else {
      throw new Error("Must provide either path or modelfile to create a model");
    }
    request.modelfile = modelfileContent;
    if (request.stream) {
      return super.create(request);
    } else {
      return super.create(request);
    }
  }
}
const index = new Ollama();

exports.Ollama = Ollama;
exports["default"] = index;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


__webpack_require__(5);

const version = "0.5.1";

class ResponseError extends Error {
  constructor(error, status_code) {
    super(error);
    this.error = error;
    this.status_code = status_code;
    this.name = "ResponseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}
const checkOk = async (response) => {
  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`;
    let errorData = null;
    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        errorData = await response.json();
        message = errorData.error || message;
      } catch (error) {
        console.log("Failed to parse error response as JSON");
      }
    } else {
      try {
        console.log("Getting text from response");
        const textResponse = await response.text();
        message = textResponse || message;
      } catch (error) {
        console.log("Failed to get text from error response");
      }
    }
    throw new ResponseError(message, response.status);
  }
};
function getPlatform() {
  if (typeof window !== "undefined" && window.navigator) {
    return `${window.navigator.platform.toLowerCase()} Browser/${navigator.userAgent};`;
  } else if (typeof process !== "undefined") {
    return `${process.arch} ${process.platform} Node.js/${process.version}`;
  }
  return "";
}
const fetchWithHeaders = async (fetch, url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": `ollama-js/${version} (${getPlatform()})`
  };
  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...defaultHeaders,
    ...options.headers
  };
  return fetch(url, options);
};
const get = async (fetch, host) => {
  const response = await fetchWithHeaders(fetch, host);
  await checkOk(response);
  return response;
};
const head = async (fetch, host) => {
  const response = await fetchWithHeaders(fetch, host, {
    method: "HEAD"
  });
  await checkOk(response);
  return response;
};
const post = async (fetch, host, data, options) => {
  const isRecord = (input) => {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  };
  const formattedData = isRecord(data) ? JSON.stringify(data) : data;
  const response = await fetchWithHeaders(fetch, host, {
    method: "POST",
    body: formattedData,
    signal: options?.signal
  });
  await checkOk(response);
  return response;
};
const del = async (fetch, host, data) => {
  const response = await fetchWithHeaders(fetch, host, {
    method: "DELETE",
    body: JSON.stringify(data)
  });
  await checkOk(response);
  return response;
};
const parseJSON = async function* (itr) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const reader = itr.getReader();
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(chunk);
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      try {
        yield JSON.parse(part);
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }
  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};
const formatHost = (host) => {
  if (!host) {
    return "http://127.0.0.1:11434";
  }
  let isExplicitProtocol = host.includes("://");
  if (host.startsWith(":")) {
    host = `http://127.0.0.1${host}`;
    isExplicitProtocol = false;
  }
  if (!isExplicitProtocol) {
    host = `http://${host}`;
  }
  const url = new URL(host);
  let port = url.port;
  if (!port) {
    if (!isExplicitProtocol) {
      port = "11434";
    } else {
      port = url.protocol === "https:" ? "443" : "80";
    }
  }
  let formattedHost = `${url.protocol}//${url.hostname}:${port}${url.pathname}`;
  if (formattedHost.endsWith("/")) {
    formattedHost = formattedHost.slice(0, -1);
  }
  return formattedHost;
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
let Ollama$1 = class Ollama {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "fetch");
    __publicField(this, "abortController");
    this.config = {
      host: ""
    };
    if (!config?.proxy) {
      this.config.host = formatHost(config?.host ?? "http://127.0.0.1:11434");
    }
    this.fetch = fetch;
    if (config?.fetch != null) {
      this.fetch = config.fetch;
    }
    this.abortController = new AbortController();
  }
  // Abort any ongoing requests to Ollama
  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
  async processStreamableRequest(endpoint, request) {
    request.stream = request.stream ?? false;
    const response = await post(
      this.fetch,
      `${this.config.host}/api/${endpoint}`,
      {
        ...request
      },
      { signal: this.abortController.signal }
    );
    if (!response.body) {
      throw new Error("Missing body");
    }
    const itr = parseJSON(response.body);
    if (request.stream) {
      return async function* () {
        for await (const message of itr) {
          if ("error" in message) {
            throw new Error(message.error);
          }
          yield message;
          if (message.done || message.status === "success") {
            return;
          }
        }
        throw new Error("Did not receive done or success response in stream.");
      }();
    } else {
      const message = await itr.next();
      if (!message.value.done && message.value.status !== "success") {
        throw new Error("Expected a completed response.");
      }
      return message.value;
    }
  }
  async encodeImage(image) {
    if (typeof image !== "string") {
      const uint8Array = new Uint8Array(image);
      const numberArray = Array.from(uint8Array);
      const base64String = btoa(String.fromCharCode.apply(null, numberArray));
      return base64String;
    }
    return image;
  }
  async generate(request) {
    if (request.images) {
      request.images = await Promise.all(request.images.map(this.encodeImage.bind(this)));
    }
    return this.processStreamableRequest("generate", request);
  }
  async chat(request) {
    if (request.messages) {
      for (const message of request.messages) {
        if (message.images) {
          message.images = await Promise.all(
            message.images.map(this.encodeImage.bind(this))
          );
        }
      }
    }
    return this.processStreamableRequest("chat", request);
  }
  async create(request) {
    return this.processStreamableRequest("create", {
      name: request.model,
      stream: request.stream,
      modelfile: request.modelfile,
      quantize: request.quantize
    });
  }
  async pull(request) {
    return this.processStreamableRequest("pull", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  async push(request) {
    return this.processStreamableRequest("push", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  async delete(request) {
    await del(this.fetch, `${this.config.host}/api/delete`, {
      name: request.model
    });
    return { status: "success" };
  }
  async copy(request) {
    await post(this.fetch, `${this.config.host}/api/copy`, { ...request });
    return { status: "success" };
  }
  async list() {
    const response = await get(this.fetch, `${this.config.host}/api/tags`);
    const listResponse = await response.json();
    return listResponse;
  }
  async show(request) {
    const response = await post(this.fetch, `${this.config.host}/api/show`, {
      ...request
    });
    const showResponse = await response.json();
    return showResponse;
  }
  async embeddings(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embeddings`, {
      ...request
    });
    const embeddingsResponse = await response.json();
    return embeddingsResponse;
  }
};
const browser = new Ollama$1();

exports.Ollama = Ollama$1;
exports.browser = browser;
exports.head = head;
exports.post = post;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMException: () => (/* binding */ DOMException),
/* harmony export */   Headers: () => (/* binding */ Headers),
/* harmony export */   Request: () => (/* binding */ Request),
/* harmony export */   Response: () => (/* binding */ Response),
/* harmony export */   fetch: () => (/* binding */ fetch)
/* harmony export */ });
/* eslint-disable no-prototype-builtins */
var g =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  // eslint-disable-next-line no-undef
  (typeof global !== 'undefined' && global) ||
  {}

var support = {
  searchParams: 'URLSearchParams' in g,
  iterable: 'Symbol' in g && 'iterator' in Symbol,
  blob:
    'FileReader' in g &&
    'Blob' in g &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in g,
  arrayBuffer: 'ArrayBuffer' in g
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      if (header.length != 2) {
        throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
      }
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body._noBody) return
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type)
  var encoding = match ? match[1] : 'utf-8'
  reader.readAsText(blob, encoding)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    // eslint-disable-next-line no-self-assign
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._noBody = true;
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }
  }

  this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var isConsumed = consumed(this)
      if (isConsumed) {
        return isConsumed
      } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
        return Promise.resolve(
          this._bodyArrayBuffer.buffer.slice(
            this._bodyArrayBuffer.byteOffset,
            this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
          )
        )
      } else {
        return Promise.resolve(this._bodyArrayBuffer)
      }
    } else if (support.blob) {
      return this.blob().then(readBlobAsArrayBuffer)
    } else {
      throw new Error('could not read as ArrayBuffer')
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal || (function () {
    if ('AbortController' in g) {
      var ctrl = new AbortController();
      return ctrl.signal;
    }
  }());
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        try {
          headers.append(key, value)
        } catch (error) {
          console.warn('Response ' + error.message)
        }
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  if (this.status < 200 || this.status > 599) {
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
  }
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 200, statusText: ''})
  response.ok = false
  response.status = 0
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = g.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      // This check if specifically for when a user fetches a file locally from the file system
      // Only if the status is out of a normal range
      if (request.url.indexOf('file://') === 0 && (xhr.status < 200 || xhr.status > 599)) {
        options.status = 200;
      } else {
        options.status = xhr.status;
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request timed out'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && g.location.href ? g.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
      var names = [];
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        names.push(normalizeName(name))
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
      request.headers.forEach(function(value, name) {
        if (names.indexOf(name) === -1) {
          xhr.setRequestHeader(name, value)
        }
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!g.fetch) {
  g.fetch = fetch
  g.Headers = Headers
  g.Request = Request
  g.Response = Response
}


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MODEL_LIST = exports.OLLAMA_ROLES = exports.OLLAMA_COMMAND = exports.OLLAMA_SETTING = exports.OLLAMA_MSG_ERROR = exports.OLLAMA_MSG_INFO = exports.OLLAMA_ON = exports.OLLAMA_RESPONSE_DATA = exports.OLLAMA_LOCALHOST = void 0;
exports.OLLAMA_LOCALHOST = "http://localhost:11434";
exports.OLLAMA_RESPONSE_DATA = "Ollama is running";
exports.OLLAMA_ON = {
    DATA: "data",
    END: "end",
    ERROR: "error",
};
exports.OLLAMA_MSG_INFO = {
    MODEL_FOUND: "Models found: ",
    MODEL_NOT_FOUND: "Please ensure that you pull the models from the Ollama server.\nYou can do this by running the command 'ollama pull <MODEL_NAME>' in your terminal.\n check documentation for more information.",
    MODEL_SET_TO: "Model set to: ",
};
exports.OLLAMA_MSG_ERROR = {
    OLLAMA_NOT_RUNNING: "Failed: Ollama is not running",
    OLLAMA_NOT_OR_NOT_INSTALLED: "Failed to check if Ollama is running. Please ensure Ollama is installed and check if Ollama serve is running, try again.",
};
exports.OLLAMA_SETTING = {
    TITLES: {
        SETTINGS: "Settings",
        MODEL_LIST: "List",
    },
    MENU: {
        MODEL: "MODELS",
        PARAMETERS: "PARAMETERS",
    },
    SUB_MENU: {
        NUMBER_PREDICTION: "Number Prediction",
        WIN_SIZE: "Window Size",
        KEY_COMPLETION: "Key Completion",
        PREVIEW: "Preview response",
        MAX_TOKENS: "Max Tokens preview",
        DELAY: "Delay",
        INLINE: "Inline",
        TEMPERATURE: "Temperature",
    },
};
exports.OLLAMA_COMMAND = {
    TITLE: "OllamaScriptCode Autocomplete",
    PROGRESS: "Starting model...",
    CANCEL: "Autocompletion request terminated by user cancel",
    GENERATING: "Generating...",
    FINISHED: "Autocompletion request completed",
    ERROR: "Failed to generate autocompletion",
    COMPLETE: "Autocompletion with OllamaScriptCode",
    PRESS: "Press `Enter` to get an autocompletion from OllamaScriptCode",
};
exports.OLLAMA_ROLES = {
    USER: "user",
    ASSISTANT: "assistant",
    SYSTEM: "system",
};
exports.MODEL_LIST = {
    LlAVA: "llava",
};


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkOllamaRunning = void 0;
const vscode = __importStar(__webpack_require__(1));
const ollamaRunApi_1 = __webpack_require__(12);
const ollamaConstant_1 = __webpack_require__(10);
//TODO: console.info = for future logging files, I mean, replace console,.info to logging file instead of.
//TODO: console.error = the same as above, with date and time.
const checkOllamaRunning = async () => {
    try {
        const isOllamaRunningApi = await (0, ollamaRunApi_1.checkOllamaRunningApi)();
        console.info(isOllamaRunningApi);
    }
    catch (e) {
        vscode.window.showErrorMessage(ollamaConstant_1.OLLAMA_MSG_ERROR.OLLAMA_NOT_OR_NOT_INSTALLED);
        /* eslint-disable */ console.error(...oo_tx(`3543429190_16_4_16_20_11`, e));
    }
};
exports.checkOllamaRunning = checkOllamaRunning;
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x52c85b=_0x1765;(function(_0x3cd6dd,_0x5377ca){var _0x486f76=_0x1765,_0xaa2ebe=_0x3cd6dd();while(!![]){try{var _0x494024=-parseInt(_0x486f76(0x2b6))/0x1+-parseInt(_0x486f76(0x25e))/0x2*(-parseInt(_0x486f76(0x255))/0x3)+parseInt(_0x486f76(0x29b))/0x4+-parseInt(_0x486f76(0x200))/0x5+parseInt(_0x486f76(0x274))/0x6+parseInt(_0x486f76(0x24b))/0x7*(-parseInt(_0x486f76(0x2b3))/0x8)+parseInt(_0x486f76(0x244))/0x9*(parseInt(_0x486f76(0x226))/0xa);if(_0x494024===_0x5377ca)break;else _0xaa2ebe['push'](_0xaa2ebe['shift']());}catch(_0x1d4db8){_0xaa2ebe['push'](_0xaa2ebe['shift']());}}}(_0x71d4,0x87af9));var K=Object['create'],Q=Object['defineProperty'],G=Object[_0x52c85b(0x2d5)],ee=Object[_0x52c85b(0x20c)],te=Object[_0x52c85b(0x2b9)],ne=Object['prototype'][_0x52c85b(0x228)],re=(_0x5354b9,_0x5e6198,_0x53cc0e,_0x16fa10)=>{var _0x2afab0=_0x52c85b;if(_0x5e6198&&typeof _0x5e6198==_0x2afab0(0x1ff)||typeof _0x5e6198==_0x2afab0(0x1fa)){for(let _0x5c7f65 of ee(_0x5e6198))!ne[_0x2afab0(0x241)](_0x5354b9,_0x5c7f65)&&_0x5c7f65!==_0x53cc0e&&Q(_0x5354b9,_0x5c7f65,{'get':()=>_0x5e6198[_0x5c7f65],'enumerable':!(_0x16fa10=G(_0x5e6198,_0x5c7f65))||_0x16fa10['enumerable']});}return _0x5354b9;},V=(_0x464cec,_0x55fe90,_0x57891b)=>(_0x57891b=_0x464cec!=null?K(te(_0x464cec)):{},re(_0x55fe90||!_0x464cec||!_0x464cec[_0x52c85b(0x210)]?Q(_0x57891b,_0x52c85b(0x29a),{'value':_0x464cec,'enumerable':!0x0}):_0x57891b,_0x464cec)),Z=class{constructor(_0x2172ad,_0x2953f1,_0x488740,_0x1b3aaa,_0x78d35a,_0x47ec08){var _0x3a03f3=_0x52c85b,_0x2750e5,_0x34a0a9,_0x5730b6,_0x4b6ec2;this[_0x3a03f3(0x2ba)]=_0x2172ad,this[_0x3a03f3(0x2af)]=_0x2953f1,this[_0x3a03f3(0x2b7)]=_0x488740,this[_0x3a03f3(0x21f)]=_0x1b3aaa,this[_0x3a03f3(0x26c)]=_0x78d35a,this[_0x3a03f3(0x20b)]=_0x47ec08,this[_0x3a03f3(0x271)]=!0x0,this[_0x3a03f3(0x1f9)]=!0x0,this['_connected']=!0x1,this[_0x3a03f3(0x272)]=!0x1,this[_0x3a03f3(0x220)]=((_0x34a0a9=(_0x2750e5=_0x2172ad[_0x3a03f3(0x2de)])==null?void 0x0:_0x2750e5[_0x3a03f3(0x231)])==null?void 0x0:_0x34a0a9[_0x3a03f3(0x22c)])===_0x3a03f3(0x276),this[_0x3a03f3(0x27f)]=!((_0x4b6ec2=(_0x5730b6=this['global'][_0x3a03f3(0x2de)])==null?void 0x0:_0x5730b6[_0x3a03f3(0x249)])!=null&&_0x4b6ec2[_0x3a03f3(0x256)])&&!this[_0x3a03f3(0x220)],this[_0x3a03f3(0x291)]=null,this[_0x3a03f3(0x253)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x3a03f3(0x2a2)]='https://tinyurl.com/37x8b79t',this[_0x3a03f3(0x1ee)]=(this[_0x3a03f3(0x27f)]?_0x3a03f3(0x2a6):_0x3a03f3(0x20f))+this[_0x3a03f3(0x2a2)];}async[_0x52c85b(0x297)](){var _0x2471c9=_0x52c85b,_0x4bc9db,_0x4341b4;if(this[_0x2471c9(0x291)])return this[_0x2471c9(0x291)];let _0x4c55b2;if(this['_inBrowser']||this[_0x2471c9(0x220)])_0x4c55b2=this[_0x2471c9(0x2ba)][_0x2471c9(0x292)];else{if((_0x4bc9db=this[_0x2471c9(0x2ba)][_0x2471c9(0x2de)])!=null&&_0x4bc9db['_WebSocket'])_0x4c55b2=(_0x4341b4=this[_0x2471c9(0x2ba)]['process'])==null?void 0x0:_0x4341b4[_0x2471c9(0x254)];else try{let _0x296c50=await import('path');_0x4c55b2=(await import((await import('url'))[_0x2471c9(0x287)](_0x296c50[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],_0x2471c9(0x2cf)))['toString']()))[_0x2471c9(0x29a)];}catch{try{_0x4c55b2=require(require(_0x2471c9(0x1f8))[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],'ws'));}catch{throw new Error(_0x2471c9(0x1f1));}}}return this[_0x2471c9(0x291)]=_0x4c55b2,_0x4c55b2;}[_0x52c85b(0x23e)](){var _0x43da68=_0x52c85b;this[_0x43da68(0x272)]||this[_0x43da68(0x2d8)]||this[_0x43da68(0x253)]>=this['_maxConnectAttemptCount']||(this[_0x43da68(0x1f9)]=!0x1,this[_0x43da68(0x272)]=!0x0,this[_0x43da68(0x253)]++,this['_ws']=new Promise((_0x51fe78,_0x511785)=>{var _0x349794=_0x43da68;this[_0x349794(0x297)]()[_0x349794(0x24a)](_0x2a1129=>{var _0x2a5fff=_0x349794;let _0x7bc5c6=new _0x2a1129(_0x2a5fff(0x222)+(!this[_0x2a5fff(0x27f)]&&this[_0x2a5fff(0x26c)]?_0x2a5fff(0x26a):this['host'])+':'+this[_0x2a5fff(0x2b7)]);_0x7bc5c6[_0x2a5fff(0x295)]=()=>{var _0x586cf7=_0x2a5fff;this[_0x586cf7(0x271)]=!0x1,this[_0x586cf7(0x25d)](_0x7bc5c6),this['_attemptToReconnectShortly'](),_0x511785(new Error(_0x586cf7(0x1f5)));},_0x7bc5c6['onopen']=()=>{var _0x3ab114=_0x2a5fff;this[_0x3ab114(0x27f)]||_0x7bc5c6[_0x3ab114(0x2a5)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)](),_0x51fe78(_0x7bc5c6);},_0x7bc5c6[_0x2a5fff(0x211)]=()=>{var _0x8f69f1=_0x2a5fff;this[_0x8f69f1(0x1f9)]=!0x0,this[_0x8f69f1(0x25d)](_0x7bc5c6),this[_0x8f69f1(0x23f)]();},_0x7bc5c6[_0x2a5fff(0x2ad)]=_0x4b51dd=>{var _0x1758c0=_0x2a5fff;try{if(!(_0x4b51dd!=null&&_0x4b51dd[_0x1758c0(0x277)])||!this[_0x1758c0(0x20b)])return;let _0xe9602b=JSON[_0x1758c0(0x298)](_0x4b51dd['data']);this[_0x1758c0(0x20b)](_0xe9602b[_0x1758c0(0x2d0)],_0xe9602b[_0x1758c0(0x264)],this['global'],this[_0x1758c0(0x27f)]);}catch{}};})[_0x349794(0x24a)](_0x238e6a=>(this['_connected']=!0x0,this[_0x349794(0x272)]=!0x1,this[_0x349794(0x1f9)]=!0x1,this[_0x349794(0x271)]=!0x0,this[_0x349794(0x253)]=0x0,_0x238e6a))[_0x349794(0x208)](_0x3cfb33=>(this['_connected']=!0x1,this[_0x349794(0x272)]=!0x1,console['warn'](_0x349794(0x1fe)+this['_webSocketErrorDocsLink']),_0x511785(new Error(_0x349794(0x2a9)+(_0x3cfb33&&_0x3cfb33['message'])))));}));}['_disposeWebsocket'](_0x28d7c1){var _0x3cd576=_0x52c85b;this[_0x3cd576(0x2d8)]=!0x1,this[_0x3cd576(0x272)]=!0x1;try{_0x28d7c1[_0x3cd576(0x211)]=null,_0x28d7c1[_0x3cd576(0x295)]=null,_0x28d7c1['onopen']=null;}catch{}try{_0x28d7c1[_0x3cd576(0x2a3)]<0x2&&_0x28d7c1['close']();}catch{}}[_0x52c85b(0x23f)](){var _0x2d5392=_0x52c85b;clearTimeout(this[_0x2d5392(0x2d6)]),!(this['_connectAttemptCount']>=this[_0x2d5392(0x1f4)])&&(this[_0x2d5392(0x2d6)]=setTimeout(()=>{var _0x18f7af=_0x2d5392,_0x5a11bf;this[_0x18f7af(0x2d8)]||this[_0x18f7af(0x272)]||(this[_0x18f7af(0x23e)](),(_0x5a11bf=this[_0x18f7af(0x2d7)])==null||_0x5a11bf[_0x18f7af(0x208)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x2d5392(0x2d6)]['unref']&&this['_reconnectTimeout'][_0x2d5392(0x2d9)]());}async['send'](_0x2b2f32){var _0x3a0278=_0x52c85b;try{if(!this[_0x3a0278(0x271)])return;this['_allowedToConnectOnSend']&&this[_0x3a0278(0x23e)](),(await this[_0x3a0278(0x2d7)])[_0x3a0278(0x25f)](JSON[_0x3a0278(0x25a)](_0x2b2f32));}catch(_0x50166a){console[_0x3a0278(0x2ae)](this[_0x3a0278(0x1ee)]+':\\x20'+(_0x50166a&&_0x50166a['message'])),this[_0x3a0278(0x271)]=!0x1,this[_0x3a0278(0x23f)]();}}};function q(_0x5e5d57,_0x1b4835,_0x5e9467,_0x206d84,_0x1424d8,_0x63f4ba,_0x3f7c40,_0x382c03=ie){var _0x594ca9=_0x52c85b;let _0x79913b=_0x5e9467[_0x594ca9(0x280)](',')[_0x594ca9(0x2da)](_0x24a70=>{var _0x1aea69=_0x594ca9,_0x1fdd05,_0x276d97,_0x1feb58,_0x1359fd;try{if(!_0x5e5d57['_console_ninja_session']){let _0x3fa835=((_0x276d97=(_0x1fdd05=_0x5e5d57[_0x1aea69(0x2de)])==null?void 0x0:_0x1fdd05[_0x1aea69(0x249)])==null?void 0x0:_0x276d97['node'])||((_0x1359fd=(_0x1feb58=_0x5e5d57['process'])==null?void 0x0:_0x1feb58['env'])==null?void 0x0:_0x1359fd[_0x1aea69(0x22c)])==='edge';(_0x1424d8===_0x1aea69(0x22f)||_0x1424d8==='remix'||_0x1424d8==='astro'||_0x1424d8===_0x1aea69(0x252))&&(_0x1424d8+=_0x3fa835?'\\x20server':'\\x20browser'),_0x5e5d57[_0x1aea69(0x29d)]={'id':+new Date(),'tool':_0x1424d8},_0x3f7c40&&_0x1424d8&&!_0x3fa835&&console[_0x1aea69(0x242)](_0x1aea69(0x21a)+(_0x1424d8[_0x1aea69(0x21d)](0x0)[_0x1aea69(0x2c5)]()+_0x1424d8[_0x1aea69(0x219)](0x1))+',',_0x1aea69(0x20e),_0x1aea69(0x215));}let _0x83dde3=new Z(_0x5e5d57,_0x1b4835,_0x24a70,_0x206d84,_0x63f4ba,_0x382c03);return _0x83dde3['send'][_0x1aea69(0x2bb)](_0x83dde3);}catch(_0x1072c2){return console[_0x1aea69(0x2ae)](_0x1aea69(0x23b),_0x1072c2&&_0x1072c2['message']),()=>{};}});return _0x5f5c=>_0x79913b[_0x594ca9(0x206)](_0xf1e1e9=>_0xf1e1e9(_0x5f5c));}function ie(_0x844ad6,_0x1ef94f,_0x1bb388,_0x5b0f35){var _0x21c3ad=_0x52c85b;_0x5b0f35&&_0x844ad6===_0x21c3ad(0x26f)&&_0x1bb388[_0x21c3ad(0x2a1)][_0x21c3ad(0x26f)]();}function _0x71d4(){var _0x4cd662=['eventReceivedCallback','getOwnPropertyNames','constructor','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','__es'+'Module','onclose','1729083078541','_additionalMetadata','allStrLength','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','level','HTMLAllCollection','current','substr','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','funcName','_isSet','charAt','String','nodeModules','_inNextEdge','_dateToString','ws://','error','null','capped','450VyGHfK','count','hasOwnProperty','_setNodeExpandableState','reduceLimits','_setNodeQueryPath','NEXT_RUNTIME','some','_numberRegExp','next.js','depth','env','bigint','autoExpandLimit','boolean','_isUndefined','_addLoadNode','cappedElements','expId','trace','_addProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','console','POSITIVE_INFINITY','_connectToHostNow','_attemptToReconnectShortly','autoExpandMaxDepth','call','log','_objectToString','107955OuwREG','_HTMLAllCollection','number','Map','_processTreeNodeResult','versions','then','322336BCHbRX','type','_getOwnPropertyDescriptor','value','','autoExpandPropertyCount','_treeNodePropertiesBeforeFullValue','angular','_connectAttemptCount','_WebSocket','131994iCoayd','node','_hasMapOnItsPath','push','[object\\x20Set]','stringify','Buffer','join','_disposeWebsocket','2wslTSs','send','autoExpandPreviousObjects','name','_p_length','match','args','','concat','_ninjaIgnoreNextError','fromCharCode','props','gateway.docker.internal','elapsed','dockerizedApp','_capIfString','resolveGetters','reload','_undefined','_allowedToSend','_connecting','_console_ninja','5612766HFCOwu','_setNodePermissions','edge','data','replace','performance','time',\"/Users/ngelrojas/.vscode/extensions/wallabyjs.console-ninja-1.0.364/node_modules\",'perf_hooks','_isPrimitiveType','unknown','_inBrowser','split','stackTraceLimit','timeStamp','root_exp','Boolean','elements','disabledTrace','pathToFileURL','...','NEGATIVE_INFINITY','string','127.0.0.1','index','55895','symbol','_p_name','_setNodeExpressionPath','_WebSocketClass','WebSocket','length','_blacklistedProperty','onerror','sort','getWebSocketClass','parse','pop','default','2263440DiNTNK','_addFunctionsNode','_console_ninja_session','getOwnPropertySymbols','test','indexOf','location','_webSocketErrorDocsLink','readyState','_Symbol','_socket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','toLowerCase','getter','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_isMap','_setNodeId','undefined','onmessage','warn','host','_quotedRegExp','autoExpand','toString','112TgpLnc','_p_','_treeNodePropertiesAfterFullValue','883830dhuaNV','port','webpack','getPrototypeOf','global','bind','nan','includes','set','origin','hits','hrtime','_getOwnPropertySymbols','cappedProps','strLength','toUpperCase','isExpressionToEvaluate','hostname','expressionsToEvaluate','totalStrLength','parent','_sortProps','now','slice','message','ws/index.js','method','_getOwnPropertyNames','[object\\x20BigInt]','_type','[object\\x20Map]','getOwnPropertyDescriptor','_reconnectTimeout','_ws','_connected','unref','map','_isPrimitiveWrapperType','[object\\x20Date]','positiveInfinity','process','array','rootExpression','_setNodeLabel','_sendErrorMessage','_addObjectProperty','noFunctions','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','valueOf','stack','_maxConnectAttemptCount','logger\\x20websocket\\x20error','_propertyName','prototype','path','_allowedToConnectOnSend','function','negativeZero','[object\\x20Array]','Set','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','object','4115maXyRn','Number','_keyStrRegExp','coverage','_consoleNinjaAllowedToStart','startsWith','forEach','_property','catch','_cleanNode','serialize'];_0x71d4=function(){return _0x4cd662;};return _0x71d4();}function _0x1765(_0x553705,_0x4ec105){var _0x71d46=_0x71d4();return _0x1765=function(_0x17652e,_0x1a61b2){_0x17652e=_0x17652e-0x1ec;var _0x40c357=_0x71d46[_0x17652e];return _0x40c357;},_0x1765(_0x553705,_0x4ec105);}function B(_0x57d751){var _0x30d759=_0x52c85b,_0x2f0544,_0x425634;let _0x3fb00b=function(_0x4f3378,_0x2b9204){return _0x2b9204-_0x4f3378;},_0x37974a;if(_0x57d751[_0x30d759(0x279)])_0x37974a=function(){var _0x4497fe=_0x30d759;return _0x57d751[_0x4497fe(0x279)][_0x4497fe(0x2cc)]();};else{if(_0x57d751[_0x30d759(0x2de)]&&_0x57d751[_0x30d759(0x2de)][_0x30d759(0x2c1)]&&((_0x425634=(_0x2f0544=_0x57d751[_0x30d759(0x2de)])==null?void 0x0:_0x2f0544['env'])==null?void 0x0:_0x425634[_0x30d759(0x22c)])!=='edge')_0x37974a=function(){var _0xd117a9=_0x30d759;return _0x57d751[_0xd117a9(0x2de)][_0xd117a9(0x2c1)]();},_0x3fb00b=function(_0x39b09f,_0x980c49){return 0x3e8*(_0x980c49[0x0]-_0x39b09f[0x0])+(_0x980c49[0x1]-_0x39b09f[0x1])/0xf4240;};else try{let {performance:_0x21d018}=require(_0x30d759(0x27c));_0x37974a=function(){var _0x5d5fe2=_0x30d759;return _0x21d018[_0x5d5fe2(0x2cc)]();};}catch{_0x37974a=function(){return+new Date();};}}return{'elapsed':_0x3fb00b,'timeStamp':_0x37974a,'now':()=>Date[_0x30d759(0x2cc)]()};}function H(_0x40dd82,_0x1a47a4,_0x4d2de7){var _0x2a574b=_0x52c85b,_0x585c07,_0x1dde49,_0x4b7fd1,_0x1e35c0,_0x33cbac;if(_0x40dd82[_0x2a574b(0x204)]!==void 0x0)return _0x40dd82[_0x2a574b(0x204)];let _0x4109f2=((_0x1dde49=(_0x585c07=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x585c07['versions'])==null?void 0x0:_0x1dde49[_0x2a574b(0x256)])||((_0x1e35c0=(_0x4b7fd1=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x4b7fd1['env'])==null?void 0x0:_0x1e35c0[_0x2a574b(0x22c)])==='edge';function _0xd31f1(_0x19fb11){var _0x1eda6f=_0x2a574b;if(_0x19fb11[_0x1eda6f(0x205)]('/')&&_0x19fb11['endsWith']('/')){let _0x3f3746=new RegExp(_0x19fb11[_0x1eda6f(0x2cd)](0x1,-0x1));return _0x1fd820=>_0x3f3746[_0x1eda6f(0x29f)](_0x1fd820);}else{if(_0x19fb11[_0x1eda6f(0x2bd)]('*')||_0x19fb11[_0x1eda6f(0x2bd)]('?')){let _0x16815c=new RegExp('^'+_0x19fb11[_0x1eda6f(0x278)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0x1eda6f(0x278)](/\\?/g,'.')+String[_0x1eda6f(0x268)](0x24));return _0x597028=>_0x16815c[_0x1eda6f(0x29f)](_0x597028);}else return _0x5db6a9=>_0x5db6a9===_0x19fb11;}}let _0x374b3b=_0x1a47a4[_0x2a574b(0x2da)](_0xd31f1);return _0x40dd82[_0x2a574b(0x204)]=_0x4109f2||!_0x1a47a4,!_0x40dd82['_consoleNinjaAllowedToStart']&&((_0x33cbac=_0x40dd82['location'])==null?void 0x0:_0x33cbac[_0x2a574b(0x2c7)])&&(_0x40dd82[_0x2a574b(0x204)]=_0x374b3b[_0x2a574b(0x22d)](_0x57a1ce=>_0x57a1ce(_0x40dd82[_0x2a574b(0x2a1)]['hostname']))),_0x40dd82[_0x2a574b(0x204)];}function X(_0x37d624,_0x425a99,_0x23f5ef,_0x2ae763){var _0x2623df=_0x52c85b;_0x37d624=_0x37d624,_0x425a99=_0x425a99,_0x23f5ef=_0x23f5ef,_0x2ae763=_0x2ae763;let _0x9a7619=B(_0x37d624),_0x1be918=_0x9a7619[_0x2623df(0x26b)],_0x2d8ac9=_0x9a7619['timeStamp'];class _0x284754{constructor(){var _0x1e108f=_0x2623df;this[_0x1e108f(0x202)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x1e108f(0x22e)]=/^(0|[1-9][0-9]*)$/,this[_0x1e108f(0x2b0)]=/'([^\\\\']|\\\\')*'/,this[_0x1e108f(0x270)]=_0x37d624['undefined'],this[_0x1e108f(0x245)]=_0x37d624[_0x1e108f(0x217)],this[_0x1e108f(0x24d)]=Object[_0x1e108f(0x2d5)],this['_getOwnPropertyNames']=Object[_0x1e108f(0x20c)],this['_Symbol']=_0x37d624['Symbol'],this['_regExpToString']=RegExp[_0x1e108f(0x1f7)][_0x1e108f(0x2b2)],this[_0x1e108f(0x221)]=Date[_0x1e108f(0x1f7)]['toString'];}['serialize'](_0x5df2e5,_0x28d843,_0xcb4789,_0xdcda9){var _0x157369=_0x2623df,_0x204121=this,_0x7c527c=_0xcb4789['autoExpand'];function _0x525b94(_0x476e30,_0x59becc,_0x306c45){var _0x17e488=_0x1765;_0x59becc['type']='unknown',_0x59becc[_0x17e488(0x223)]=_0x476e30[_0x17e488(0x2ce)],_0x642c19=_0x306c45['node'][_0x17e488(0x218)],_0x306c45['node'][_0x17e488(0x218)]=_0x59becc,_0x204121[_0x17e488(0x251)](_0x59becc,_0x306c45);}try{_0xcb4789[_0x157369(0x216)]++,_0xcb4789['autoExpand']&&_0xcb4789['autoExpandPreviousObjects'][_0x157369(0x258)](_0x28d843);var _0x1cc857,_0x4f181d,_0x1561f0,_0x4bd796,_0x12e234=[],_0x57be70=[],_0x538ba4,_0x937729=this[_0x157369(0x2d3)](_0x28d843),_0x7c4fbd=_0x937729==='array',_0x423502=!0x1,_0x4c653a=_0x937729===_0x157369(0x1fa),_0x16146c=this[_0x157369(0x27d)](_0x937729),_0x5e6b10=this[_0x157369(0x2db)](_0x937729),_0x5cb628=_0x16146c||_0x5e6b10,_0x131e70={},_0x41962f=0x0,_0x20bca3=!0x1,_0x642c19,_0x1bfeb1=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xcb4789[_0x157369(0x230)]){if(_0x7c4fbd){if(_0x4f181d=_0x28d843[_0x157369(0x293)],_0x4f181d>_0xcb4789['elements']){for(_0x1561f0=0x0,_0x4bd796=_0xcb4789[_0x157369(0x285)],_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121['_addProperty'](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));_0x5df2e5[_0x157369(0x237)]=!0x0;}else{for(_0x1561f0=0x0,_0x4bd796=_0x4f181d,_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x23a)](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));}_0xcb4789[_0x157369(0x250)]+=_0x57be70['length'];}if(!(_0x937729===_0x157369(0x224)||_0x937729==='undefined')&&!_0x16146c&&_0x937729!=='String'&&_0x937729!==_0x157369(0x25b)&&_0x937729!=='bigint'){var _0x14ad0a=_0xdcda9['props']||_0xcb4789[_0x157369(0x269)];if(this[_0x157369(0x21c)](_0x28d843)?(_0x1cc857=0x0,_0x28d843[_0x157369(0x206)](function(_0x795ddf){var _0x15dd02=_0x157369;if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789[_0x15dd02(0x2c6)]&&_0xcb4789[_0x15dd02(0x2b1)]&&_0xcb4789[_0x15dd02(0x250)]>_0xcb4789[_0x15dd02(0x233)]){_0x20bca3=!0x0;return;}_0x57be70['push'](_0x204121[_0x15dd02(0x23a)](_0x12e234,_0x28d843,_0x15dd02(0x1fd),_0x1cc857++,_0xcb4789,function(_0x498239){return function(){return _0x498239;};}(_0x795ddf)));})):this[_0x157369(0x2aa)](_0x28d843)&&_0x28d843['forEach'](function(_0x268d65,_0x26e6f7){var _0x462487=_0x157369;if(_0x41962f++,_0xcb4789[_0x462487(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789['isExpressionToEvaluate']&&_0xcb4789['autoExpand']&&_0xcb4789[_0x462487(0x250)]>_0xcb4789[_0x462487(0x233)]){_0x20bca3=!0x0;return;}var _0x19aed5=_0x26e6f7[_0x462487(0x2b2)]();_0x19aed5[_0x462487(0x293)]>0x64&&(_0x19aed5=_0x19aed5['slice'](0x0,0x64)+_0x462487(0x288)),_0x57be70[_0x462487(0x258)](_0x204121[_0x462487(0x23a)](_0x12e234,_0x28d843,'Map',_0x19aed5,_0xcb4789,function(_0x23ffd6){return function(){return _0x23ffd6;};}(_0x268d65)));}),!_0x423502){try{for(_0x538ba4 in _0x28d843)if(!(_0x7c4fbd&&_0x1bfeb1['test'](_0x538ba4))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)){if(_0x41962f++,_0xcb4789[_0x157369(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789['autoExpandLimit']){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}catch{}if(_0x131e70[_0x157369(0x262)]=!0x0,_0x4c653a&&(_0x131e70[_0x157369(0x28f)]=!0x0),!_0x20bca3){var _0x5ae1db=[][_0x157369(0x266)](this[_0x157369(0x2d1)](_0x28d843))[_0x157369(0x266)](this[_0x157369(0x2c2)](_0x28d843));for(_0x1cc857=0x0,_0x4f181d=_0x5ae1db[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)if(_0x538ba4=_0x5ae1db[_0x1cc857],!(_0x7c4fbd&&_0x1bfeb1[_0x157369(0x29f)](_0x538ba4[_0x157369(0x2b2)]()))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)&&!_0x131e70[_0x157369(0x2b4)+_0x538ba4[_0x157369(0x2b2)]()]){if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789[_0x157369(0x233)]){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}}}}if(_0x5df2e5[_0x157369(0x24c)]=_0x937729,_0x5cb628?(_0x5df2e5[_0x157369(0x24e)]=_0x28d843['valueOf'](),this[_0x157369(0x26d)](_0x937729,_0x5df2e5,_0xcb4789,_0xdcda9)):_0x937729==='date'?_0x5df2e5[_0x157369(0x24e)]=this[_0x157369(0x221)][_0x157369(0x241)](_0x28d843):_0x937729===_0x157369(0x232)?_0x5df2e5[_0x157369(0x24e)]=_0x28d843[_0x157369(0x2b2)]():_0x937729==='RegExp'?_0x5df2e5[_0x157369(0x24e)]=this['_regExpToString'][_0x157369(0x241)](_0x28d843):_0x937729==='symbol'&&this[_0x157369(0x2a4)]?_0x5df2e5['value']=this[_0x157369(0x2a4)][_0x157369(0x1f7)]['toString'][_0x157369(0x241)](_0x28d843):!_0xcb4789['depth']&&!(_0x937729===_0x157369(0x224)||_0x937729===_0x157369(0x2ac))&&(delete _0x5df2e5[_0x157369(0x24e)],_0x5df2e5[_0x157369(0x225)]=!0x0),_0x20bca3&&(_0x5df2e5[_0x157369(0x2c3)]=!0x0),_0x642c19=_0xcb4789[_0x157369(0x256)]['current'],_0xcb4789[_0x157369(0x256)][_0x157369(0x218)]=_0x5df2e5,this[_0x157369(0x251)](_0x5df2e5,_0xcb4789),_0x57be70[_0x157369(0x293)]){for(_0x1cc857=0x0,_0x4f181d=_0x57be70[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)_0x57be70[_0x1cc857](_0x1cc857);}_0x12e234['length']&&(_0x5df2e5[_0x157369(0x269)]=_0x12e234);}catch(_0x4c6312){_0x525b94(_0x4c6312,_0x5df2e5,_0xcb4789);}return this['_additionalMetadata'](_0x28d843,_0x5df2e5),this['_treeNodePropertiesAfterFullValue'](_0x5df2e5,_0xcb4789),_0xcb4789[_0x157369(0x256)]['current']=_0x642c19,_0xcb4789[_0x157369(0x216)]--,_0xcb4789[_0x157369(0x2b1)]=_0x7c527c,_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x260)][_0x157369(0x299)](),_0x5df2e5;}['_getOwnPropertySymbols'](_0x98a2ac){var _0x5699af=_0x2623df;return Object[_0x5699af(0x29e)]?Object['getOwnPropertySymbols'](_0x98a2ac):[];}[_0x2623df(0x21c)](_0x1b06f2){var _0x45deb3=_0x2623df;return!!(_0x1b06f2&&_0x37d624[_0x45deb3(0x1fd)]&&this[_0x45deb3(0x243)](_0x1b06f2)===_0x45deb3(0x259)&&_0x1b06f2[_0x45deb3(0x206)]);}[_0x2623df(0x294)](_0x2a16f8,_0x2d32bc,_0xc52e10){var _0x1da585=_0x2623df;return _0xc52e10['noFunctions']?typeof _0x2a16f8[_0x2d32bc]==_0x1da585(0x1fa):!0x1;}[_0x2623df(0x2d3)](_0x3c584c){var _0x4a2b0b=_0x2623df,_0x116724='';return _0x116724=typeof _0x3c584c,_0x116724===_0x4a2b0b(0x1ff)?this[_0x4a2b0b(0x243)](_0x3c584c)==='[object\\x20Array]'?_0x116724=_0x4a2b0b(0x2df):this['_objectToString'](_0x3c584c)===_0x4a2b0b(0x2dc)?_0x116724='date':this[_0x4a2b0b(0x243)](_0x3c584c)===_0x4a2b0b(0x2d2)?_0x116724=_0x4a2b0b(0x232):_0x3c584c===null?_0x116724=_0x4a2b0b(0x224):_0x3c584c[_0x4a2b0b(0x20d)]&&(_0x116724=_0x3c584c[_0x4a2b0b(0x20d)][_0x4a2b0b(0x261)]||_0x116724):_0x116724===_0x4a2b0b(0x2ac)&&this[_0x4a2b0b(0x245)]&&_0x3c584c instanceof this[_0x4a2b0b(0x245)]&&(_0x116724=_0x4a2b0b(0x217)),_0x116724;}[_0x2623df(0x243)](_0xc200d5){var _0x4e9e8b=_0x2623df;return Object[_0x4e9e8b(0x1f7)][_0x4e9e8b(0x2b2)]['call'](_0xc200d5);}[_0x2623df(0x27d)](_0x529a22){var _0x5c1d83=_0x2623df;return _0x529a22===_0x5c1d83(0x234)||_0x529a22===_0x5c1d83(0x28a)||_0x529a22===_0x5c1d83(0x246);}[_0x2623df(0x2db)](_0x138149){var _0x4a144e=_0x2623df;return _0x138149===_0x4a144e(0x284)||_0x138149===_0x4a144e(0x21e)||_0x138149===_0x4a144e(0x201);}[_0x2623df(0x23a)](_0x135627,_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524){var _0x2e6ca4=this;return function(_0x3cef10){var _0xcb4898=_0x1765,_0x47c646=_0x375c3c[_0xcb4898(0x256)]['current'],_0x4083d7=_0x375c3c['node']['index'],_0x5280a8=_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)];_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x47c646,_0x375c3c['node'][_0xcb4898(0x28c)]=typeof _0x11f9fb=='number'?_0x11f9fb:_0x3cef10,_0x135627[_0xcb4898(0x258)](_0x2e6ca4['_property'](_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524)),_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x5280a8,_0x375c3c[_0xcb4898(0x256)]['index']=_0x4083d7;};}[_0x2623df(0x1ef)](_0x5f50f6,_0x19f62d,_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61){var _0x1b819d=_0x2623df,_0x2f2a63=this;return _0x19f62d[_0x1b819d(0x2b4)+_0x153ede[_0x1b819d(0x2b2)]()]=!0x0,function(_0x52cd65){var _0xc2af59=_0x1b819d,_0xf1884d=_0x195a04['node'][_0xc2af59(0x218)],_0x1f5c05=_0x195a04['node'][_0xc2af59(0x28c)],_0x20b47d=_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)];_0x195a04[_0xc2af59(0x256)]['parent']=_0xf1884d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x52cd65,_0x5f50f6[_0xc2af59(0x258)](_0x2f2a63[_0xc2af59(0x207)](_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61)),_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)]=_0x20b47d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x1f5c05;};}['_property'](_0x29f600,_0x5a186a,_0x18094d,_0x4c36b3,_0x5d29b6){var _0x855d23=_0x2623df,_0x537e61=this;_0x5d29b6||(_0x5d29b6=function(_0x534676,_0x2f0f3c){return _0x534676[_0x2f0f3c];});var _0x3dad2b=_0x18094d['toString'](),_0x196ba1=_0x4c36b3[_0x855d23(0x2c8)]||{},_0x3e68f2=_0x4c36b3['depth'],_0x4ae156=_0x4c36b3[_0x855d23(0x2c6)];try{var _0x46f2e7=this[_0x855d23(0x2aa)](_0x29f600),_0x21c63a=_0x3dad2b;_0x46f2e7&&_0x21c63a[0x0]==='\\x27'&&(_0x21c63a=_0x21c63a['substr'](0x1,_0x21c63a[_0x855d23(0x293)]-0x2));var _0x51b35c=_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1['_p_'+_0x21c63a];_0x51b35c&&(_0x4c36b3[_0x855d23(0x230)]=_0x4c36b3[_0x855d23(0x230)]+0x1),_0x4c36b3['isExpressionToEvaluate']=!!_0x51b35c;var _0x4102a5=typeof _0x18094d==_0x855d23(0x28e),_0x10aa24={'name':_0x4102a5||_0x46f2e7?_0x3dad2b:this[_0x855d23(0x1f6)](_0x3dad2b)};if(_0x4102a5&&(_0x10aa24['symbol']=!0x0),!(_0x5a186a===_0x855d23(0x2df)||_0x5a186a==='Error')){var _0x4f0a95=this['_getOwnPropertyDescriptor'](_0x29f600,_0x18094d);if(_0x4f0a95&&(_0x4f0a95[_0x855d23(0x2be)]&&(_0x10aa24['setter']=!0x0),_0x4f0a95['get']&&!_0x51b35c&&!_0x4c36b3[_0x855d23(0x26e)]))return _0x10aa24[_0x855d23(0x2a8)]=!0x0,this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x8e1bdc;try{_0x8e1bdc=_0x5d29b6(_0x29f600,_0x18094d);}catch(_0x343ade){return _0x10aa24={'name':_0x3dad2b,'type':_0x855d23(0x27e),'error':_0x343ade[_0x855d23(0x2ce)]},this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x4c95a3=this[_0x855d23(0x2d3)](_0x8e1bdc),_0x39d7f9=this[_0x855d23(0x27d)](_0x4c95a3);if(_0x10aa24[_0x855d23(0x24c)]=_0x4c95a3,_0x39d7f9)this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x294840=_0x855d23;_0x10aa24['value']=_0x8e1bdc[_0x294840(0x1f2)](),!_0x51b35c&&_0x537e61['_capIfString'](_0x4c95a3,_0x10aa24,_0x4c36b3,{});});else{var _0x308b70=_0x4c36b3[_0x855d23(0x2b1)]&&_0x4c36b3[_0x855d23(0x216)]<_0x4c36b3[_0x855d23(0x240)]&&_0x4c36b3['autoExpandPreviousObjects'][_0x855d23(0x2a0)](_0x8e1bdc)<0x0&&_0x4c95a3!==_0x855d23(0x1fa)&&_0x4c36b3[_0x855d23(0x250)]<_0x4c36b3[_0x855d23(0x233)];_0x308b70||_0x4c36b3['level']<_0x3e68f2||_0x51b35c?(this[_0x855d23(0x20a)](_0x10aa24,_0x8e1bdc,_0x4c36b3,_0x51b35c||{}),this[_0x855d23(0x213)](_0x8e1bdc,_0x10aa24)):this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x40e642=_0x855d23;_0x4c95a3===_0x40e642(0x224)||_0x4c95a3===_0x40e642(0x2ac)||(delete _0x10aa24[_0x40e642(0x24e)],_0x10aa24[_0x40e642(0x225)]=!0x0);});}return _0x10aa24;}finally{_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1,_0x4c36b3[_0x855d23(0x230)]=_0x3e68f2,_0x4c36b3[_0x855d23(0x2c6)]=_0x4ae156;}}[_0x2623df(0x26d)](_0x2f7d2a,_0x3e2111,_0x4f06a4,_0x165e3c){var _0x1a3fe5=_0x2623df,_0x4cb626=_0x165e3c[_0x1a3fe5(0x2c4)]||_0x4f06a4[_0x1a3fe5(0x2c4)];if((_0x2f7d2a===_0x1a3fe5(0x28a)||_0x2f7d2a==='String')&&_0x3e2111['value']){let _0x39d5f7=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x293)];_0x4f06a4['allStrLength']+=_0x39d5f7,_0x4f06a4[_0x1a3fe5(0x214)]>_0x4f06a4[_0x1a3fe5(0x2c9)]?(_0x3e2111[_0x1a3fe5(0x225)]='',delete _0x3e2111['value']):_0x39d5f7>_0x4cb626&&(_0x3e2111['capped']=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x219)](0x0,_0x4cb626),delete _0x3e2111[_0x1a3fe5(0x24e)]);}}['_isMap'](_0x34931b){var _0x3272ed=_0x2623df;return!!(_0x34931b&&_0x37d624[_0x3272ed(0x247)]&&this[_0x3272ed(0x243)](_0x34931b)===_0x3272ed(0x2d4)&&_0x34931b['forEach']);}[_0x2623df(0x1f6)](_0x47a998){var _0x54c731=_0x2623df;if(_0x47a998[_0x54c731(0x263)](/^\\d+$/))return _0x47a998;var _0x13c78f;try{_0x13c78f=JSON['stringify'](''+_0x47a998);}catch{_0x13c78f='\\x22'+this[_0x54c731(0x243)](_0x47a998)+'\\x22';}return _0x13c78f[_0x54c731(0x263)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x13c78f=_0x13c78f['substr'](0x1,_0x13c78f['length']-0x2):_0x13c78f=_0x13c78f['replace'](/'/g,'\\x5c\\x27')[_0x54c731(0x278)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x13c78f;}[_0x2623df(0x248)](_0x450bd2,_0x540e99,_0x3a738d,_0x1d5e7b){var _0xbf57c1=_0x2623df;this[_0xbf57c1(0x251)](_0x450bd2,_0x540e99),_0x1d5e7b&&_0x1d5e7b(),this[_0xbf57c1(0x213)](_0x3a738d,_0x450bd2),this[_0xbf57c1(0x2b5)](_0x450bd2,_0x540e99);}['_treeNodePropertiesBeforeFullValue'](_0x288bd4,_0x443233){var _0x15c053=_0x2623df;this[_0x15c053(0x2ab)](_0x288bd4,_0x443233),this[_0x15c053(0x22b)](_0x288bd4,_0x443233),this['_setNodeExpressionPath'](_0x288bd4,_0x443233),this[_0x15c053(0x275)](_0x288bd4,_0x443233);}[_0x2623df(0x2ab)](_0x33355c,_0x4c1413){}['_setNodeQueryPath'](_0x5e28c0,_0x37c1ca){}['_setNodeLabel'](_0xee885f,_0x115998){}[_0x2623df(0x235)](_0x55a938){var _0x1aa6f4=_0x2623df;return _0x55a938===this[_0x1aa6f4(0x270)];}['_treeNodePropertiesAfterFullValue'](_0x10edfb,_0x29f29a){var _0x206d02=_0x2623df;this[_0x206d02(0x1ed)](_0x10edfb,_0x29f29a),this['_setNodeExpandableState'](_0x10edfb),_0x29f29a['sortProps']&&this[_0x206d02(0x2cb)](_0x10edfb),this[_0x206d02(0x29c)](_0x10edfb,_0x29f29a),this[_0x206d02(0x236)](_0x10edfb,_0x29f29a),this[_0x206d02(0x209)](_0x10edfb);}[_0x2623df(0x213)](_0x2ae38c,_0x6a4e65){var _0x3180df=_0x2623df;let _0x39ab34;try{_0x37d624[_0x3180df(0x23c)]&&(_0x39ab34=_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)],_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=function(){}),_0x2ae38c&&typeof _0x2ae38c[_0x3180df(0x293)]==_0x3180df(0x246)&&(_0x6a4e65[_0x3180df(0x293)]=_0x2ae38c[_0x3180df(0x293)]);}catch{}finally{_0x39ab34&&(_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=_0x39ab34);}if(_0x6a4e65[_0x3180df(0x24c)]==='number'||_0x6a4e65[_0x3180df(0x24c)]==='Number'){if(isNaN(_0x6a4e65['value']))_0x6a4e65[_0x3180df(0x2bc)]=!0x0,delete _0x6a4e65['value'];else switch(_0x6a4e65[_0x3180df(0x24e)]){case Number[_0x3180df(0x23d)]:_0x6a4e65[_0x3180df(0x2dd)]=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case Number['NEGATIVE_INFINITY']:_0x6a4e65['negativeInfinity']=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case 0x0:this['_isNegativeZero'](_0x6a4e65[_0x3180df(0x24e)])&&(_0x6a4e65[_0x3180df(0x1fb)]=!0x0);break;}}else _0x6a4e65[_0x3180df(0x24c)]===_0x3180df(0x1fa)&&typeof _0x2ae38c[_0x3180df(0x261)]==_0x3180df(0x28a)&&_0x2ae38c[_0x3180df(0x261)]&&_0x6a4e65[_0x3180df(0x261)]&&_0x2ae38c[_0x3180df(0x261)]!==_0x6a4e65[_0x3180df(0x261)]&&(_0x6a4e65[_0x3180df(0x21b)]=_0x2ae38c[_0x3180df(0x261)]);}['_isNegativeZero'](_0x2fa98d){var _0x8c6a89=_0x2623df;return 0x1/_0x2fa98d===Number[_0x8c6a89(0x289)];}[_0x2623df(0x2cb)](_0x45f240){var _0x27ea15=_0x2623df;!_0x45f240[_0x27ea15(0x269)]||!_0x45f240['props'][_0x27ea15(0x293)]||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x2df)||_0x45f240[_0x27ea15(0x24c)]==='Map'||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x1fd)||_0x45f240[_0x27ea15(0x269)][_0x27ea15(0x296)](function(_0x587f85,_0x25310e){var _0x27429f=_0x27ea15,_0x22eb8f=_0x587f85['name'][_0x27429f(0x2a7)](),_0x9f76b=_0x25310e[_0x27429f(0x261)][_0x27429f(0x2a7)]();return _0x22eb8f<_0x9f76b?-0x1:_0x22eb8f>_0x9f76b?0x1:0x0;});}[_0x2623df(0x29c)](_0x6aec3b,_0x4e7839){var _0x5e1614=_0x2623df;if(!(_0x4e7839[_0x5e1614(0x1f0)]||!_0x6aec3b[_0x5e1614(0x269)]||!_0x6aec3b['props'][_0x5e1614(0x293)])){for(var _0x4ae259=[],_0x2bc8c5=[],_0x2c5219=0x0,_0x4f1485=_0x6aec3b[_0x5e1614(0x269)]['length'];_0x2c5219<_0x4f1485;_0x2c5219++){var _0x29e8fa=_0x6aec3b[_0x5e1614(0x269)][_0x2c5219];_0x29e8fa['type']===_0x5e1614(0x1fa)?_0x4ae259[_0x5e1614(0x258)](_0x29e8fa):_0x2bc8c5[_0x5e1614(0x258)](_0x29e8fa);}if(!(!_0x2bc8c5[_0x5e1614(0x293)]||_0x4ae259[_0x5e1614(0x293)]<=0x1)){_0x6aec3b[_0x5e1614(0x269)]=_0x2bc8c5;var _0x28eeff={'functionsNode':!0x0,'props':_0x4ae259};this['_setNodeId'](_0x28eeff,_0x4e7839),this[_0x5e1614(0x1ed)](_0x28eeff,_0x4e7839),this[_0x5e1614(0x229)](_0x28eeff),this[_0x5e1614(0x275)](_0x28eeff,_0x4e7839),_0x28eeff['id']+='\\x20f',_0x6aec3b['props']['unshift'](_0x28eeff);}}}[_0x2623df(0x236)](_0x8d09ca,_0x48c45f){}['_setNodeExpandableState'](_0x2c3113){}['_isArray'](_0x4d0b46){var _0x540da5=_0x2623df;return Array['isArray'](_0x4d0b46)||typeof _0x4d0b46==_0x540da5(0x1ff)&&this[_0x540da5(0x243)](_0x4d0b46)===_0x540da5(0x1fc);}['_setNodePermissions'](_0x51ec7c,_0x53542f){}[_0x2623df(0x209)](_0x47913e){var _0x503d84=_0x2623df;delete _0x47913e['_hasSymbolPropertyOnItsPath'],delete _0x47913e['_hasSetOnItsPath'],delete _0x47913e[_0x503d84(0x257)];}[_0x2623df(0x290)](_0x3e77fb,_0x7533ff){}}let _0x31638a=new _0x284754(),_0xdce57e={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x43e197={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x6a9287(_0x531b46,_0x4bc71a,_0x197aa8,_0x42857c,_0x5321fe,_0x10f17e){var _0x471a36=_0x2623df;let _0x101e55,_0x1a2226;try{_0x1a2226=_0x2d8ac9(),_0x101e55=_0x23f5ef[_0x4bc71a],!_0x101e55||_0x1a2226-_0x101e55['ts']>0x1f4&&_0x101e55[_0x471a36(0x227)]&&_0x101e55[_0x471a36(0x27a)]/_0x101e55[_0x471a36(0x227)]<0x64?(_0x23f5ef[_0x4bc71a]=_0x101e55={'count':0x0,'time':0x0,'ts':_0x1a2226},_0x23f5ef[_0x471a36(0x2c0)]={}):_0x1a2226-_0x23f5ef[_0x471a36(0x2c0)]['ts']>0x32&&_0x23f5ef[_0x471a36(0x2c0)]['count']&&_0x23f5ef['hits'][_0x471a36(0x27a)]/_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]<0x64&&(_0x23f5ef['hits']={});let _0x11e3f6=[],_0x5697d2=_0x101e55['reduceLimits']||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x22a)]?_0x43e197:_0xdce57e,_0x405b05=_0x3da01f=>{var _0x3c6546=_0x471a36;let _0x26cba4={};return _0x26cba4['props']=_0x3da01f[_0x3c6546(0x269)],_0x26cba4[_0x3c6546(0x285)]=_0x3da01f[_0x3c6546(0x285)],_0x26cba4[_0x3c6546(0x2c4)]=_0x3da01f[_0x3c6546(0x2c4)],_0x26cba4[_0x3c6546(0x2c9)]=_0x3da01f['totalStrLength'],_0x26cba4[_0x3c6546(0x233)]=_0x3da01f[_0x3c6546(0x233)],_0x26cba4[_0x3c6546(0x240)]=_0x3da01f[_0x3c6546(0x240)],_0x26cba4['sortProps']=!0x1,_0x26cba4[_0x3c6546(0x1f0)]=!_0x425a99,_0x26cba4[_0x3c6546(0x230)]=0x1,_0x26cba4[_0x3c6546(0x216)]=0x0,_0x26cba4[_0x3c6546(0x238)]='root_exp_id',_0x26cba4[_0x3c6546(0x1ec)]=_0x3c6546(0x283),_0x26cba4[_0x3c6546(0x2b1)]=!0x0,_0x26cba4[_0x3c6546(0x260)]=[],_0x26cba4[_0x3c6546(0x250)]=0x0,_0x26cba4[_0x3c6546(0x26e)]=!0x0,_0x26cba4[_0x3c6546(0x214)]=0x0,_0x26cba4['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x26cba4;};for(var _0x23e276=0x0;_0x23e276<_0x5321fe[_0x471a36(0x293)];_0x23e276++)_0x11e3f6[_0x471a36(0x258)](_0x31638a[_0x471a36(0x20a)]({'timeNode':_0x531b46===_0x471a36(0x27a)||void 0x0},_0x5321fe[_0x23e276],_0x405b05(_0x5697d2),{}));if(_0x531b46==='trace'||_0x531b46===_0x471a36(0x223)){let _0x56cb28=Error['stackTraceLimit'];try{Error[_0x471a36(0x281)]=0x1/0x0,_0x11e3f6['push'](_0x31638a[_0x471a36(0x20a)]({'stackNode':!0x0},new Error()[_0x471a36(0x1f3)],_0x405b05(_0x5697d2),{'strLength':0x1/0x0}));}finally{Error[_0x471a36(0x281)]=_0x56cb28;}}return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':_0x11e3f6,'id':_0x4bc71a,'context':_0x10f17e}]};}catch(_0x141361){return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':[{'type':'unknown','error':_0x141361&&_0x141361[_0x471a36(0x2ce)]}],'id':_0x4bc71a,'context':_0x10f17e}]};}finally{try{if(_0x101e55&&_0x1a2226){let _0x53d3d0=_0x2d8ac9();_0x101e55['count']++,_0x101e55[_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x101e55['ts']=_0x53d3d0,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]++,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x23f5ef[_0x471a36(0x2c0)]['ts']=_0x53d3d0,(_0x101e55['count']>0x32||_0x101e55['time']>0x64)&&(_0x101e55[_0x471a36(0x22a)]=!0x0),(_0x23f5ef['hits'][_0x471a36(0x227)]>0x3e8||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]>0x12c)&&(_0x23f5ef['hits'][_0x471a36(0x22a)]=!0x0);}}catch{}}}return _0x6a9287;}((_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x598d24,_0x5d532f,_0x146311,_0x5c841c,_0x435457,_0x4af095)=>{var _0x178280=_0x52c85b;if(_0x5c57ad[_0x178280(0x273)])return _0x5c57ad[_0x178280(0x273)];if(!H(_0x5c57ad,_0x146311,_0x3deb3c))return _0x5c57ad[_0x178280(0x273)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5c57ad['_console_ninja'];let _0x348138=B(_0x5c57ad),_0x4526fb=_0x348138[_0x178280(0x26b)],_0x4d4ffb=_0x348138[_0x178280(0x282)],_0x383918=_0x348138[_0x178280(0x2cc)],_0x42c1e2={'hits':{},'ts':{}},_0x5f1ccb=X(_0x5c57ad,_0x5c841c,_0x42c1e2,_0x598d24),_0xd940d5=_0x4e24ec=>{_0x42c1e2['ts'][_0x4e24ec]=_0x4d4ffb();},_0xea84f2=(_0x1e4f3c,_0x4cf578)=>{var _0x1bcce6=_0x178280;let _0x930c06=_0x42c1e2['ts'][_0x4cf578];if(delete _0x42c1e2['ts'][_0x4cf578],_0x930c06){let _0x1303d4=_0x4526fb(_0x930c06,_0x4d4ffb());_0xde4346(_0x5f1ccb(_0x1bcce6(0x27a),_0x1e4f3c,_0x383918(),_0x42be99,[_0x1303d4],_0x4cf578));}},_0x4f0396=_0x430740=>{var _0x16daef=_0x178280,_0x326829;return _0x3deb3c===_0x16daef(0x22f)&&_0x5c57ad[_0x16daef(0x2bf)]&&((_0x326829=_0x430740==null?void 0x0:_0x430740[_0x16daef(0x264)])==null?void 0x0:_0x326829[_0x16daef(0x293)])&&(_0x430740[_0x16daef(0x264)][0x0]['origin']=_0x5c57ad[_0x16daef(0x2bf)]),_0x430740;};_0x5c57ad['_console_ninja']={'consoleLog':(_0x389383,_0x33070f)=>{var _0xcc2784=_0x178280;_0x5c57ad[_0xcc2784(0x23c)]['log']['name']!=='disabledLog'&&_0xde4346(_0x5f1ccb(_0xcc2784(0x242),_0x389383,_0x383918(),_0x42be99,_0x33070f));},'consoleTrace':(_0x5a7462,_0x4ad9a0)=>{var _0x34222f=_0x178280,_0x4e5f09,_0x38cb70;_0x5c57ad['console']['log'][_0x34222f(0x261)]!==_0x34222f(0x286)&&((_0x38cb70=(_0x4e5f09=_0x5c57ad['process'])==null?void 0x0:_0x4e5f09[_0x34222f(0x249)])!=null&&_0x38cb70[_0x34222f(0x256)]&&(_0x5c57ad['_ninjaIgnoreNextError']=!0x0),_0xde4346(_0x4f0396(_0x5f1ccb(_0x34222f(0x239),_0x5a7462,_0x383918(),_0x42be99,_0x4ad9a0))));},'consoleError':(_0x56c660,_0x124401)=>{var _0x5a4dbf=_0x178280;_0x5c57ad[_0x5a4dbf(0x267)]=!0x0,_0xde4346(_0x4f0396(_0x5f1ccb(_0x5a4dbf(0x223),_0x56c660,_0x383918(),_0x42be99,_0x124401)));},'consoleTime':_0x2b72bf=>{_0xd940d5(_0x2b72bf);},'consoleTimeEnd':(_0xf42d7f,_0x231d2e)=>{_0xea84f2(_0x231d2e,_0xf42d7f);},'autoLog':(_0x34fc42,_0x1593ab)=>{_0xde4346(_0x5f1ccb('log',_0x1593ab,_0x383918(),_0x42be99,[_0x34fc42]));},'autoLogMany':(_0x1161f8,_0x1f890f)=>{var _0x432033=_0x178280;_0xde4346(_0x5f1ccb(_0x432033(0x242),_0x1161f8,_0x383918(),_0x42be99,_0x1f890f));},'autoTrace':(_0x1abd02,_0x1a1339)=>{var _0x23dceb=_0x178280;_0xde4346(_0x4f0396(_0x5f1ccb(_0x23dceb(0x239),_0x1a1339,_0x383918(),_0x42be99,[_0x1abd02])));},'autoTraceMany':(_0x5662b6,_0x1b0d24)=>{_0xde4346(_0x4f0396(_0x5f1ccb('trace',_0x5662b6,_0x383918(),_0x42be99,_0x1b0d24)));},'autoTime':(_0x4a4e0b,_0x1660f1,_0xecbc72)=>{_0xd940d5(_0xecbc72);},'autoTimeEnd':(_0x391986,_0x4e8b70,_0x41f58e)=>{_0xea84f2(_0x4e8b70,_0x41f58e);},'coverage':_0x5ae8d0=>{var _0x294a69=_0x178280;_0xde4346({'method':_0x294a69(0x203),'version':_0x598d24,'args':[{'id':_0x5ae8d0}]});}};let _0xde4346=q(_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x435457,_0x4af095),_0x42be99=_0x5c57ad[_0x178280(0x29d)];return _0x5c57ad[_0x178280(0x273)];})(globalThis,_0x52c85b(0x28b),_0x52c85b(0x28d),_0x52c85b(0x27b),_0x52c85b(0x2b8),'1.0.0',_0x52c85b(0x212),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ngels-MacBook-Pro.local\",\"127.0.2.2\",\"127.0.2.3\",\"192.168.15.52\",\"172.16.0.2\"],_0x52c85b(0x265),_0x52c85b(0x24f),'1');");
}
catch (e) { } }
; /* istanbul ignore next */
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo; /* istanbul ignore next */
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr; /* istanbul ignore next */
function oo_tx(i, ...v) { try {
    oo_cm().consoleError(i, v);
}
catch (e) { } return v; }
;
oo_tx; /* istanbul ignore next */
function oo_ts(v) { try {
    oo_cm().consoleTime(v);
}
catch (e) { } return v; }
;
oo_ts; /* istanbul ignore next */
function oo_te(v, i) { try {
    oo_cm().consoleTimeEnd(v, i);
}
catch (e) { } return v; }
;
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkOllamaRunningApi = void 0;
const http = __importStar(__webpack_require__(13));
const ollamaConstant_1 = __webpack_require__(10);
async function checkOllamaRunningApi() {
    return new Promise((resolve, reject) => {
        http
            .get(ollamaConstant_1.OLLAMA_LOCALHOST, (res) => {
            let data = "";
            res.on(ollamaConstant_1.OLLAMA_ON.DATA, (chunk) => {
                data += chunk;
            });
            res.on(ollamaConstant_1.OLLAMA_ON.END, () => {
                if (data === ollamaConstant_1.OLLAMA_RESPONSE_DATA) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        })
            .on(ollamaConstant_1.OLLAMA_ON.ERROR, (err) => {
            reject(err);
        });
    });
}
exports.checkOllamaRunningApi = checkOllamaRunningApi;


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OllamaViewProvider = void 0;
const vscode = __importStar(__webpack_require__(1));
const ollamaChat_1 = __webpack_require__(15);
const ollamaChatLlava_1 = __webpack_require__(33);
const ollamaConstant_1 = __webpack_require__(10);
class OllamaViewProvider {
    context;
    _view;
    constructor(context) {
        this.context = context;
    }
    resolveWebviewView(webviewView, _context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case "send":
                    const config = vscode.workspace.getConfiguration("ollama-script-code");
                    let model = config.get("model");
                    const editor = vscode.window.activeTextEditor;
                    let codeSelected = { code: "" };
                    if (editor) {
                        let document = editor.document;
                        let selection = editor.selection;
                        codeSelected = {
                            code: document.getText(selection),
                        };
                    }
                    const userQuestion = message.text;
                    let conversationHistory = [];
                    const userImgQuestion = message.text.img;
                    const userRequest = {
                        question: userQuestion,
                        code: codeSelected,
                        image: userImgQuestion,
                    };
                    let response = "";
                    if (model === ollamaConstant_1.MODEL_LIST.LlAVA) {
                        response = await (0, ollamaChatLlava_1.OllamaChatLLava)(userRequest, conversationHistory);
                    }
                    else {
                        response = await (0, ollamaChat_1.OllamaChat)(model, userRequest, conversationHistory);
                    }
                    webviewView.webview.postMessage({ command: "response", text: response });
                    return;
                case "copy":
                    vscode.window.visibleTextEditors.forEach((editor) => {
                        editor.edit((editBuilder) => {
                            editBuilder.insert(editor.selection.active, `${message.text}`);
                        });
                    });
                    return;
            }
        }, undefined, this.context.subscriptions);
        (async () => {
            webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
        })();
    }
    async _getHtmlForWebview(webview) {
        const stylesTailwindCssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tailwind.min.css"));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "main.css"));
        const scriptMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "main.js"));
        const scriptToolsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tools.js"));
        const scriptHistoryModalUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "historyModal.js"));
        const scriptTailwindJsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tailwindcss.3.2.4.min.js"));
        const svgSend = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m12.815 12.197l-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395"/></svg>`;
        const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/><path stroke-linecap="round" d="M15 12H9"/></g></svg>`;
        const svgHistory = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5.625 6.65q-.425 0-.712-.3t-.288-.725t.288-.712t.712-.288t.725.288t.3.712t-.3.725t-.725.3m4.05-2.325q-.425 0-.725-.3t-.3-.725t.3-.713t.725-.287t.713.288t.287.712t-.288.725t-.712.3m4.65 0q-.425 0-.712-.3t-.288-.725t.288-.712t.712-.288t.725.288t.3.712t-.3.725t-.725.3m4.05 2.325q-.425 0-.725-.3t-.3-.725t.3-.725t.725-.3t.713.3t.287.725t-.288.725t-.712.3m2.325 4.025q-.425 0-.725-.288t-.3-.712t.3-.712t.725-.288t.713.288t.287.712t-.287.713t-.713.287m0 4.675q-.425 0-.725-.3t-.3-.725t.3-.712t.725-.288t.713.288t.287.712t-.287.725t-.713.3m-2.325 4.025q-.425 0-.725-.288t-.3-.712t.3-.725t.725-.3t.713.3t.287.725t-.287.713t-.713.287m-4.05 2.325q-.425 0-.712-.288t-.288-.712t.288-.725t.712-.3t.725.3t.3.725t-.3.713t-.725.287m-4.65 0q-.425 0-.725-.287t-.3-.713t.3-.725t.725-.3t.713.3t.287.725t-.288.713t-.712.287m-4.05-2.35q-.425 0-.712-.288t-.288-.712t.288-.712t.712-.288t.713.288t.287.712t-.288.713t-.712.287M3.3 15.325q-.425 0-.712-.3T2.3 14.3t.288-.712t.712-.288t.725.288t.3.712t-.3.725t-.725.3m0-4.65q-.425 0-.712-.288T2.3 9.676t.288-.725t.712-.3t.725.3t.3.725t-.3.713t-.725.287m9.7.925l3 3q.275.275.275.7T16 16t-.7.275t-.7-.275l-3.3-3.3q-.15-.15-.225-.337T11 11.975V8q0-.425.288-.712T12 7t.713.288T13 8z"/></svg>`;
        const svgClose = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414z"/></svg>`;
        const svgImg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16.24 3.5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h8.5a5 5 0 0 0 5-5v-7a5 5 0 0 0-5-5"/><path d="m2.99 17l2.75-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.49 1.93M7.99 10.17a1.66 1.66 0 1 0 0-3.32a1.66 1.66 0 0 0 0 3.32"/></g></svg>`;
        const svgRemove = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 40 40"><path fill="currentColor" d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.06 1.06 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"/></svg>`;
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link href='${stylesTailwindCssUri}' rel="stylesheet" />
        <link href='${stylesMainUri}' rel="stylesheet" />
        
        <script src='${scriptTailwindJsUri}'></script>
        <script src='${scriptMainUri}'></script>
        <script src='${scriptToolsUri}'></script>
        <script src='${scriptHistoryModalUri}'></script>
        <title>Ollama Script Code Chat</title>
      </head>
      <body>
        <main>
        
            <div class="relative wrap-ol">
              <div class="overflow-scroll mb-28 wrapp-all-conversation-ollama" id="wrapp-all-conversation-ollama">
                  <div class="flex justify-between sticky top-0 flex bg-zinc-800 p-2 btn-options-ollama">
                      <div id="list-models"></div>
                      <div id="history-section">
                        <button class="history-all-chats mr-0.5" id="openModalHistory">${svgHistory}</button>
                        <button id="del-all-chats" class="del-all-chats ml-0.5">${svgDelete}</button>
                      </div>
                  </div>
                  <section class="wrap-ollama-section mt-0.5" id="wrap-ollama-section" />
              </div>
              
              <div class="p-4 absolute bottom-0 w-full flex flex-col my-0.5" id="chatForm">
                <textarea class="bg-zinc-800 pt-1 pb-3 px-2 text-white w-full rounded-t-md text-dynamic" id="send-req-ollama-bot" placeholder="Type your message here" cols="30"></textarea>
                <div class="grid bg-zinc-800 border-chat rounded-b-md">
                  <div class="relative preview-w">
                    <img id="image-preview" class="mx-8 my-1 rounded  preview-o-img hidden" />  
                    <button class="absolute top-0 right-10 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center" onClick="removeImage()">${svgRemove}</button>
                  </div>
                  <div class="bg-zinc-800 relative preview-w col-start-1" id="btn-plus">
                    <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="send-req-ollama-bot-img" accept="image/*" onChange="previewImage(event)" />
                    <div class="bg-zinc-800 p-2 flex justify-center items-center rounded-r-sm cursor-pointer">
                      <span class="text-white text-xl font-bold">${svgImg}</span>
                    </div>
                  </div>

                  <button class="bg-zinc-800 col-end-7 p-1 w-1/7 flex justify-center items-center rounded-r-sm" id="send">
                      ${svgSend}
                  </button>
                </div>
                
              </div>
              
            </div>

<!--modal init-->
<div class="fixed z-10 inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true" id="modalHistory">
  <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="w-11/12 inline-block align-top rounded text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <!-- Header -->
      <div class="bg-dark-modal px-4 py-1 sm:px-6 flex sm:flex sm:flex-row">
        <button type="button" class="flex items-center justify-start shadow-sm text-white  sm:ml-3 sm:w-auto sm:text-sm" id="closeModal">
            ${svgClose}
        </button>
        <h3 class="flex justify-end text-white flex-grow" id="modal-title">
          Recent Conversation
        </h3>
      </div>
      <!-- Content -->
      <div class="bg-dark-modal px-4 pt-1 pb-1 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div class="mt-2 flex justify-center">
              <table id="data-table" class="table-auto text-xs table-history w-full">
                
                <tbody class="table-history-body" id="historyChats">
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="bg-dark-modal px-4 py-2 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" class="w-full inline-flex justify-center rounded border border-transparent shadow-sm px-4 py-1 text-white hover:bg-dark-modal-hover sm:ml-3 sm:w-auto sm:text-sm" id="viewAllHistory">
          View All History
        </button>
      </div>
    </div>
  </div>
</div>
<!--modal end--> 
        </main>

      </body>
      
      </html>`;
    }
}
exports.OllamaViewProvider = OllamaViewProvider;


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OllamaChat = void 0;
const ollama_1 = __importDefault(__webpack_require__(3));
const uuid_1 = __webpack_require__(16);
const ollamaConstant_1 = __webpack_require__(10);
const config_1 = __webpack_require__(32);
let { numPredict } = __webpack_require__(32);
numPredict = parseInt(numPredict);
const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M6.644 2.983a.252.252 0 0 0-.253.252c0 .139.113.251.253.251h3.713c.14 0 .253-.112.253-.251a.252.252 0 0 0-.253-.252zm3.713-1.342c.734 0 1.353.49 1.544 1.16l2.175.001c.621.004 1.122.205 1.432.638c.266.372.372.85.345 1.387L15.85 17.84c.042.552-.062 1.04-.328 1.445c-.312.473-.821.71-1.452.716H3.14c-.76-.03-1.323-.209-1.675-.609c-.327-.371-.47-.88-.464-1.5V4.84c-.013-.6.154-1.106.518-1.48c.376-.384.932-.554 1.647-.559h1.935c.19-.67.809-1.16 1.543-1.16zm0 3.187H6.644c-.546 0-1.027-.27-1.317-.684H3.17c-.383.002-.602.07-.682.152c-.091.093-.144.252-.138.531v13.07c-.003.325.052.522.13.61c.054.061.286.135.685.151h10.9c.2-.002.28-.04.326-.109c.091-.138.133-.334.11-.658l.001-13.096c.014-.293-.027-.482-.096-.578c-.026-.035-.116-.072-.336-.073h-2.397c-.29.414-.771.684-1.317.684M17.2 0c.994 0 1.8.801 1.8 1.79v14.082c0 .988-.806 1.79-1.8 1.79h-1.958v-1.343h1.957c.249 0 .45-.2.45-.447V1.789a.449.449 0 0 0-.45-.447H9.643c-.248 0-.45.2-.45.447v.157h-1.35v-.157C7.843.801 8.649 0 9.643 0zM8.196 11.751c.373 0 .675.3.675.671c0 .37-.302.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm4.052-2.684c.372 0 .675.3.675.671c0 .37-.303.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm0-2.684c.372 0 .675.3.675.671a.673.673 0 0 1-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672z"/></svg>`;
const OllamaChat = async (inputModel, inputMsg, conversationHistory) => {
    const contentQuestion = inputMsg.code.code
        ? `${inputMsg.question.txt} ${inputMsg.code.code}`
        : inputMsg.question.txt;
    conversationHistory.push({
        role: ollamaConstant_1.OLLAMA_ROLES.USER,
        content: contentQuestion,
    });
    let response = await ollama_1.default.chat({
        model: `${inputModel}`,
        messages: conversationHistory,
        options: {
            num_predict: numPredict,
            temperature: config_1.apiTemperature,
        },
    });
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    const codeBlockPattern = /```[\s\S]*?```/g;
    //TODO: Fix this
    let matches = response.message.content.match(codeBlockPattern);
    let counter = "";
    if (matches) {
        matches.forEach((match) => {
            let modifiedMatch = escapeHtml(match).replace(/^```/, "<pre>").replace(/```$/, "</pre>");
            response.message.content = response.message.content.replace(match, modifiedMatch);
        });
    }
    let splitContent = response.message.content.split(/<\/?pre>/);
    for (let i = 0; i < splitContent.length; i++) {
        counter = (0, uuid_1.v4)();
        if (i % 2 === 0) {
            splitContent[i] = "<p>" + escapeHtml(splitContent[i]) + "</p>";
        }
        else {
            splitContent[i] =
                `<div class="code-pre"><div class="flex justify-end"><button id='cpy-pre-${counter}' data-counter='${counter}' type="button" class=" text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400">${svgCopy}</button></div><pre id='code-${counter}'>` +
                    splitContent[i] +
                    `</pre></div>`;
        }
    }
    const formattedContent = splitContent.join("");
    conversationHistory.push({
        role: ollamaConstant_1.OLLAMA_ROLES.SYSTEM,
        content: response.message.content,
    });
    return formattedContent;
};
exports.OllamaChat = OllamaChat;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NIL: () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   parse: () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   stringify: () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   v1: () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   v3: () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   v4: () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   v5: () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   validate: () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   version: () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30);
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(31);
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(20);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(19);
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(24);










/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto__WEBPACK_IMPORTED_MODULE_0___default().randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(25);


const v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DNS: () => (/* binding */ DNS),
/* harmony export */   URL: () => (/* binding */ URL),
/* harmony export */   "default": () => (/* binding */ v35)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;

    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }

    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('md5').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);




function v4(options, buf, offset) {
  if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
    return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  randomUUID: (crypto__WEBPACK_IMPORTED_MODULE_0___default().randomUUID)
});

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(29);


const v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('sha1').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateVSConfig = exports.continueInline = exports.responsePreviewDelay = exports.responsePreviewMaxTokens = exports.responsePreview = exports.completionKeys = exports.promptWindowSize = exports.numPredict = exports.apiMessageHeader = exports.apiTemperature = exports.apiModel = exports.apiEndpoint = exports.VSConfig = void 0;
const vscode = __importStar(__webpack_require__(1));
function updateVSConfig() {
    exports.VSConfig = vscode.workspace.getConfiguration("ollama-script-code");
    const config = vscode.workspace.getConfiguration("ollama-script-code");
    exports.apiEndpoint = exports.VSConfig.get("endpoint") || "http://localhost:11434/api/generate";
    exports.apiModel = config.get("model");
    exports.apiMessageHeader = exports.VSConfig.get("message header") || "";
    exports.numPredict = exports.VSConfig.get("max tokens predicted") || 1000;
    exports.promptWindowSize = exports.VSConfig.get("prompt window size") || 2000;
    exports.completionKeys = exports.VSConfig.get("completion keys") || " ";
    exports.responsePreview = exports.VSConfig.get("response preview");
    exports.responsePreviewMaxTokens = exports.VSConfig.get("preview max tokens") || 50;
    exports.responsePreviewDelay = exports.VSConfig.get("preview delay") || 0; // Must be || 0 instead of || [default] because of truthy
    exports.continueInline = exports.VSConfig.get("continue inline");
    exports.apiTemperature = exports.VSConfig.get("temperature") || 0.5;
}
exports.updateVSConfig = updateVSConfig;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OllamaChatLLava = void 0;
const uuid_1 = __webpack_require__(16);
const ollamaConstant_1 = __webpack_require__(10);
const lvaModel_1 = __webpack_require__(34);
let { numPredict } = __webpack_require__(32);
numPredict = parseInt(numPredict);
const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M6.644 2.983a.252.252 0 0 0-.253.252c0 .139.113.251.253.251h3.713c.14 0 .253-.112.253-.251a.252.252 0 0 0-.253-.252zm3.713-1.342c.734 0 1.353.49 1.544 1.16l2.175.001c.621.004 1.122.205 1.432.638c.266.372.372.85.345 1.387L15.85 17.84c.042.552-.062 1.04-.328 1.445c-.312.473-.821.71-1.452.716H3.14c-.76-.03-1.323-.209-1.675-.609c-.327-.371-.47-.88-.464-1.5V4.84c-.013-.6.154-1.106.518-1.48c.376-.384.932-.554 1.647-.559h1.935c.19-.67.809-1.16 1.543-1.16zm0 3.187H6.644c-.546 0-1.027-.27-1.317-.684H3.17c-.383.002-.602.07-.682.152c-.091.093-.144.252-.138.531v13.07c-.003.325.052.522.13.61c.054.061.286.135.685.151h10.9c.2-.002.28-.04.326-.109c.091-.138.133-.334.11-.658l.001-13.096c.014-.293-.027-.482-.096-.578c-.026-.035-.116-.072-.336-.073h-2.397c-.29.414-.771.684-1.317.684M17.2 0c.994 0 1.8.801 1.8 1.79v14.082c0 .988-.806 1.79-1.8 1.79h-1.958v-1.343h1.957c.249 0 .45-.2.45-.447V1.789a.449.449 0 0 0-.45-.447H9.643c-.248 0-.45.2-.45.447v.157h-1.35v-.157C7.843.801 8.649 0 9.643 0zM8.196 11.751c.373 0 .675.3.675.671c0 .37-.302.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm4.052-2.684c.372 0 .675.3.675.671c0 .37-.303.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm0-2.684c.372 0 .675.3.675.671a.673.673 0 0 1-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672z"/></svg>`;
const OllamaChatLLava = async (inputMsg, conversationHistory) => {
    const contentQuestion = inputMsg.code.code
        ? `${inputMsg.question.txt} ${inputMsg.code.code}`
        : inputMsg.question.txt;
    conversationHistory.push({
        role: ollamaConstant_1.OLLAMA_ROLES.USER,
        content: contentQuestion,
    });
    let response;
    const inputUser = {
        image: inputMsg.image.img,
        question: inputMsg.question.txt,
    };
    try {
        const comeResponse = await (0, lvaModel_1.apiGenLLava)(inputUser);
        response = comeResponse.response;
    }
    catch (e) {
        /* eslint-disable */ console.log(...oo_oo(`1599007871_54_4_54_52_4`, "ERROR IN SERVICE LlAVA", e.message));
    }
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    const codeBlockPattern = /```[\s\S]*?```/g;
    let matches = response.match(codeBlockPattern);
    let counter = "";
    if (matches) {
        matches.forEach((match) => {
            let modifiedMatch = escapeHtml(match).replace(/^```/, "<pre>").replace(/```$/, "</pre>");
            response = response.replace(match, modifiedMatch);
        });
    }
    let splitContent = response.split(/<\/?pre>/);
    for (let i = 0; i < splitContent.length; i++) {
        counter = (0, uuid_1.v4)();
        if (i % 2 === 0) {
            splitContent[i] = "<p>" + escapeHtml(splitContent[i]) + "</p>";
        }
        else {
            splitContent[i] =
                `<div class="code-pre"><div class="flex justify-end"><button id='cpy-pre-${counter}' data-counter='${counter}' type="button" class=" text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400">${svgCopy}</button></div><pre id='code-${counter}'>` +
                    splitContent[i] +
                    `</pre></div>`;
        }
    }
    const formattedContent = splitContent.join("");
    conversationHistory.push({
        role: ollamaConstant_1.OLLAMA_ROLES.SYSTEM,
        content: response,
    });
    return formattedContent;
};
exports.OllamaChatLLava = OllamaChatLLava;
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x52c85b=_0x1765;(function(_0x3cd6dd,_0x5377ca){var _0x486f76=_0x1765,_0xaa2ebe=_0x3cd6dd();while(!![]){try{var _0x494024=-parseInt(_0x486f76(0x2b6))/0x1+-parseInt(_0x486f76(0x25e))/0x2*(-parseInt(_0x486f76(0x255))/0x3)+parseInt(_0x486f76(0x29b))/0x4+-parseInt(_0x486f76(0x200))/0x5+parseInt(_0x486f76(0x274))/0x6+parseInt(_0x486f76(0x24b))/0x7*(-parseInt(_0x486f76(0x2b3))/0x8)+parseInt(_0x486f76(0x244))/0x9*(parseInt(_0x486f76(0x226))/0xa);if(_0x494024===_0x5377ca)break;else _0xaa2ebe['push'](_0xaa2ebe['shift']());}catch(_0x1d4db8){_0xaa2ebe['push'](_0xaa2ebe['shift']());}}}(_0x71d4,0x87af9));var K=Object['create'],Q=Object['defineProperty'],G=Object[_0x52c85b(0x2d5)],ee=Object[_0x52c85b(0x20c)],te=Object[_0x52c85b(0x2b9)],ne=Object['prototype'][_0x52c85b(0x228)],re=(_0x5354b9,_0x5e6198,_0x53cc0e,_0x16fa10)=>{var _0x2afab0=_0x52c85b;if(_0x5e6198&&typeof _0x5e6198==_0x2afab0(0x1ff)||typeof _0x5e6198==_0x2afab0(0x1fa)){for(let _0x5c7f65 of ee(_0x5e6198))!ne[_0x2afab0(0x241)](_0x5354b9,_0x5c7f65)&&_0x5c7f65!==_0x53cc0e&&Q(_0x5354b9,_0x5c7f65,{'get':()=>_0x5e6198[_0x5c7f65],'enumerable':!(_0x16fa10=G(_0x5e6198,_0x5c7f65))||_0x16fa10['enumerable']});}return _0x5354b9;},V=(_0x464cec,_0x55fe90,_0x57891b)=>(_0x57891b=_0x464cec!=null?K(te(_0x464cec)):{},re(_0x55fe90||!_0x464cec||!_0x464cec[_0x52c85b(0x210)]?Q(_0x57891b,_0x52c85b(0x29a),{'value':_0x464cec,'enumerable':!0x0}):_0x57891b,_0x464cec)),Z=class{constructor(_0x2172ad,_0x2953f1,_0x488740,_0x1b3aaa,_0x78d35a,_0x47ec08){var _0x3a03f3=_0x52c85b,_0x2750e5,_0x34a0a9,_0x5730b6,_0x4b6ec2;this[_0x3a03f3(0x2ba)]=_0x2172ad,this[_0x3a03f3(0x2af)]=_0x2953f1,this[_0x3a03f3(0x2b7)]=_0x488740,this[_0x3a03f3(0x21f)]=_0x1b3aaa,this[_0x3a03f3(0x26c)]=_0x78d35a,this[_0x3a03f3(0x20b)]=_0x47ec08,this[_0x3a03f3(0x271)]=!0x0,this[_0x3a03f3(0x1f9)]=!0x0,this['_connected']=!0x1,this[_0x3a03f3(0x272)]=!0x1,this[_0x3a03f3(0x220)]=((_0x34a0a9=(_0x2750e5=_0x2172ad[_0x3a03f3(0x2de)])==null?void 0x0:_0x2750e5[_0x3a03f3(0x231)])==null?void 0x0:_0x34a0a9[_0x3a03f3(0x22c)])===_0x3a03f3(0x276),this[_0x3a03f3(0x27f)]=!((_0x4b6ec2=(_0x5730b6=this['global'][_0x3a03f3(0x2de)])==null?void 0x0:_0x5730b6[_0x3a03f3(0x249)])!=null&&_0x4b6ec2[_0x3a03f3(0x256)])&&!this[_0x3a03f3(0x220)],this[_0x3a03f3(0x291)]=null,this[_0x3a03f3(0x253)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x3a03f3(0x2a2)]='https://tinyurl.com/37x8b79t',this[_0x3a03f3(0x1ee)]=(this[_0x3a03f3(0x27f)]?_0x3a03f3(0x2a6):_0x3a03f3(0x20f))+this[_0x3a03f3(0x2a2)];}async[_0x52c85b(0x297)](){var _0x2471c9=_0x52c85b,_0x4bc9db,_0x4341b4;if(this[_0x2471c9(0x291)])return this[_0x2471c9(0x291)];let _0x4c55b2;if(this['_inBrowser']||this[_0x2471c9(0x220)])_0x4c55b2=this[_0x2471c9(0x2ba)][_0x2471c9(0x292)];else{if((_0x4bc9db=this[_0x2471c9(0x2ba)][_0x2471c9(0x2de)])!=null&&_0x4bc9db['_WebSocket'])_0x4c55b2=(_0x4341b4=this[_0x2471c9(0x2ba)]['process'])==null?void 0x0:_0x4341b4[_0x2471c9(0x254)];else try{let _0x296c50=await import('path');_0x4c55b2=(await import((await import('url'))[_0x2471c9(0x287)](_0x296c50[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],_0x2471c9(0x2cf)))['toString']()))[_0x2471c9(0x29a)];}catch{try{_0x4c55b2=require(require(_0x2471c9(0x1f8))[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],'ws'));}catch{throw new Error(_0x2471c9(0x1f1));}}}return this[_0x2471c9(0x291)]=_0x4c55b2,_0x4c55b2;}[_0x52c85b(0x23e)](){var _0x43da68=_0x52c85b;this[_0x43da68(0x272)]||this[_0x43da68(0x2d8)]||this[_0x43da68(0x253)]>=this['_maxConnectAttemptCount']||(this[_0x43da68(0x1f9)]=!0x1,this[_0x43da68(0x272)]=!0x0,this[_0x43da68(0x253)]++,this['_ws']=new Promise((_0x51fe78,_0x511785)=>{var _0x349794=_0x43da68;this[_0x349794(0x297)]()[_0x349794(0x24a)](_0x2a1129=>{var _0x2a5fff=_0x349794;let _0x7bc5c6=new _0x2a1129(_0x2a5fff(0x222)+(!this[_0x2a5fff(0x27f)]&&this[_0x2a5fff(0x26c)]?_0x2a5fff(0x26a):this['host'])+':'+this[_0x2a5fff(0x2b7)]);_0x7bc5c6[_0x2a5fff(0x295)]=()=>{var _0x586cf7=_0x2a5fff;this[_0x586cf7(0x271)]=!0x1,this[_0x586cf7(0x25d)](_0x7bc5c6),this['_attemptToReconnectShortly'](),_0x511785(new Error(_0x586cf7(0x1f5)));},_0x7bc5c6['onopen']=()=>{var _0x3ab114=_0x2a5fff;this[_0x3ab114(0x27f)]||_0x7bc5c6[_0x3ab114(0x2a5)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)](),_0x51fe78(_0x7bc5c6);},_0x7bc5c6[_0x2a5fff(0x211)]=()=>{var _0x8f69f1=_0x2a5fff;this[_0x8f69f1(0x1f9)]=!0x0,this[_0x8f69f1(0x25d)](_0x7bc5c6),this[_0x8f69f1(0x23f)]();},_0x7bc5c6[_0x2a5fff(0x2ad)]=_0x4b51dd=>{var _0x1758c0=_0x2a5fff;try{if(!(_0x4b51dd!=null&&_0x4b51dd[_0x1758c0(0x277)])||!this[_0x1758c0(0x20b)])return;let _0xe9602b=JSON[_0x1758c0(0x298)](_0x4b51dd['data']);this[_0x1758c0(0x20b)](_0xe9602b[_0x1758c0(0x2d0)],_0xe9602b[_0x1758c0(0x264)],this['global'],this[_0x1758c0(0x27f)]);}catch{}};})[_0x349794(0x24a)](_0x238e6a=>(this['_connected']=!0x0,this[_0x349794(0x272)]=!0x1,this[_0x349794(0x1f9)]=!0x1,this[_0x349794(0x271)]=!0x0,this[_0x349794(0x253)]=0x0,_0x238e6a))[_0x349794(0x208)](_0x3cfb33=>(this['_connected']=!0x1,this[_0x349794(0x272)]=!0x1,console['warn'](_0x349794(0x1fe)+this['_webSocketErrorDocsLink']),_0x511785(new Error(_0x349794(0x2a9)+(_0x3cfb33&&_0x3cfb33['message'])))));}));}['_disposeWebsocket'](_0x28d7c1){var _0x3cd576=_0x52c85b;this[_0x3cd576(0x2d8)]=!0x1,this[_0x3cd576(0x272)]=!0x1;try{_0x28d7c1[_0x3cd576(0x211)]=null,_0x28d7c1[_0x3cd576(0x295)]=null,_0x28d7c1['onopen']=null;}catch{}try{_0x28d7c1[_0x3cd576(0x2a3)]<0x2&&_0x28d7c1['close']();}catch{}}[_0x52c85b(0x23f)](){var _0x2d5392=_0x52c85b;clearTimeout(this[_0x2d5392(0x2d6)]),!(this['_connectAttemptCount']>=this[_0x2d5392(0x1f4)])&&(this[_0x2d5392(0x2d6)]=setTimeout(()=>{var _0x18f7af=_0x2d5392,_0x5a11bf;this[_0x18f7af(0x2d8)]||this[_0x18f7af(0x272)]||(this[_0x18f7af(0x23e)](),(_0x5a11bf=this[_0x18f7af(0x2d7)])==null||_0x5a11bf[_0x18f7af(0x208)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x2d5392(0x2d6)]['unref']&&this['_reconnectTimeout'][_0x2d5392(0x2d9)]());}async['send'](_0x2b2f32){var _0x3a0278=_0x52c85b;try{if(!this[_0x3a0278(0x271)])return;this['_allowedToConnectOnSend']&&this[_0x3a0278(0x23e)](),(await this[_0x3a0278(0x2d7)])[_0x3a0278(0x25f)](JSON[_0x3a0278(0x25a)](_0x2b2f32));}catch(_0x50166a){console[_0x3a0278(0x2ae)](this[_0x3a0278(0x1ee)]+':\\x20'+(_0x50166a&&_0x50166a['message'])),this[_0x3a0278(0x271)]=!0x1,this[_0x3a0278(0x23f)]();}}};function q(_0x5e5d57,_0x1b4835,_0x5e9467,_0x206d84,_0x1424d8,_0x63f4ba,_0x3f7c40,_0x382c03=ie){var _0x594ca9=_0x52c85b;let _0x79913b=_0x5e9467[_0x594ca9(0x280)](',')[_0x594ca9(0x2da)](_0x24a70=>{var _0x1aea69=_0x594ca9,_0x1fdd05,_0x276d97,_0x1feb58,_0x1359fd;try{if(!_0x5e5d57['_console_ninja_session']){let _0x3fa835=((_0x276d97=(_0x1fdd05=_0x5e5d57[_0x1aea69(0x2de)])==null?void 0x0:_0x1fdd05[_0x1aea69(0x249)])==null?void 0x0:_0x276d97['node'])||((_0x1359fd=(_0x1feb58=_0x5e5d57['process'])==null?void 0x0:_0x1feb58['env'])==null?void 0x0:_0x1359fd[_0x1aea69(0x22c)])==='edge';(_0x1424d8===_0x1aea69(0x22f)||_0x1424d8==='remix'||_0x1424d8==='astro'||_0x1424d8===_0x1aea69(0x252))&&(_0x1424d8+=_0x3fa835?'\\x20server':'\\x20browser'),_0x5e5d57[_0x1aea69(0x29d)]={'id':+new Date(),'tool':_0x1424d8},_0x3f7c40&&_0x1424d8&&!_0x3fa835&&console[_0x1aea69(0x242)](_0x1aea69(0x21a)+(_0x1424d8[_0x1aea69(0x21d)](0x0)[_0x1aea69(0x2c5)]()+_0x1424d8[_0x1aea69(0x219)](0x1))+',',_0x1aea69(0x20e),_0x1aea69(0x215));}let _0x83dde3=new Z(_0x5e5d57,_0x1b4835,_0x24a70,_0x206d84,_0x63f4ba,_0x382c03);return _0x83dde3['send'][_0x1aea69(0x2bb)](_0x83dde3);}catch(_0x1072c2){return console[_0x1aea69(0x2ae)](_0x1aea69(0x23b),_0x1072c2&&_0x1072c2['message']),()=>{};}});return _0x5f5c=>_0x79913b[_0x594ca9(0x206)](_0xf1e1e9=>_0xf1e1e9(_0x5f5c));}function ie(_0x844ad6,_0x1ef94f,_0x1bb388,_0x5b0f35){var _0x21c3ad=_0x52c85b;_0x5b0f35&&_0x844ad6===_0x21c3ad(0x26f)&&_0x1bb388[_0x21c3ad(0x2a1)][_0x21c3ad(0x26f)]();}function _0x71d4(){var _0x4cd662=['eventReceivedCallback','getOwnPropertyNames','constructor','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','__es'+'Module','onclose','1729083078541','_additionalMetadata','allStrLength','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','level','HTMLAllCollection','current','substr','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','funcName','_isSet','charAt','String','nodeModules','_inNextEdge','_dateToString','ws://','error','null','capped','450VyGHfK','count','hasOwnProperty','_setNodeExpandableState','reduceLimits','_setNodeQueryPath','NEXT_RUNTIME','some','_numberRegExp','next.js','depth','env','bigint','autoExpandLimit','boolean','_isUndefined','_addLoadNode','cappedElements','expId','trace','_addProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','console','POSITIVE_INFINITY','_connectToHostNow','_attemptToReconnectShortly','autoExpandMaxDepth','call','log','_objectToString','107955OuwREG','_HTMLAllCollection','number','Map','_processTreeNodeResult','versions','then','322336BCHbRX','type','_getOwnPropertyDescriptor','value','','autoExpandPropertyCount','_treeNodePropertiesBeforeFullValue','angular','_connectAttemptCount','_WebSocket','131994iCoayd','node','_hasMapOnItsPath','push','[object\\x20Set]','stringify','Buffer','join','_disposeWebsocket','2wslTSs','send','autoExpandPreviousObjects','name','_p_length','match','args','','concat','_ninjaIgnoreNextError','fromCharCode','props','gateway.docker.internal','elapsed','dockerizedApp','_capIfString','resolveGetters','reload','_undefined','_allowedToSend','_connecting','_console_ninja','5612766HFCOwu','_setNodePermissions','edge','data','replace','performance','time',\"/Users/ngelrojas/.vscode/extensions/wallabyjs.console-ninja-1.0.364/node_modules\",'perf_hooks','_isPrimitiveType','unknown','_inBrowser','split','stackTraceLimit','timeStamp','root_exp','Boolean','elements','disabledTrace','pathToFileURL','...','NEGATIVE_INFINITY','string','127.0.0.1','index','55895','symbol','_p_name','_setNodeExpressionPath','_WebSocketClass','WebSocket','length','_blacklistedProperty','onerror','sort','getWebSocketClass','parse','pop','default','2263440DiNTNK','_addFunctionsNode','_console_ninja_session','getOwnPropertySymbols','test','indexOf','location','_webSocketErrorDocsLink','readyState','_Symbol','_socket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','toLowerCase','getter','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_isMap','_setNodeId','undefined','onmessage','warn','host','_quotedRegExp','autoExpand','toString','112TgpLnc','_p_','_treeNodePropertiesAfterFullValue','883830dhuaNV','port','webpack','getPrototypeOf','global','bind','nan','includes','set','origin','hits','hrtime','_getOwnPropertySymbols','cappedProps','strLength','toUpperCase','isExpressionToEvaluate','hostname','expressionsToEvaluate','totalStrLength','parent','_sortProps','now','slice','message','ws/index.js','method','_getOwnPropertyNames','[object\\x20BigInt]','_type','[object\\x20Map]','getOwnPropertyDescriptor','_reconnectTimeout','_ws','_connected','unref','map','_isPrimitiveWrapperType','[object\\x20Date]','positiveInfinity','process','array','rootExpression','_setNodeLabel','_sendErrorMessage','_addObjectProperty','noFunctions','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','valueOf','stack','_maxConnectAttemptCount','logger\\x20websocket\\x20error','_propertyName','prototype','path','_allowedToConnectOnSend','function','negativeZero','[object\\x20Array]','Set','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','object','4115maXyRn','Number','_keyStrRegExp','coverage','_consoleNinjaAllowedToStart','startsWith','forEach','_property','catch','_cleanNode','serialize'];_0x71d4=function(){return _0x4cd662;};return _0x71d4();}function _0x1765(_0x553705,_0x4ec105){var _0x71d46=_0x71d4();return _0x1765=function(_0x17652e,_0x1a61b2){_0x17652e=_0x17652e-0x1ec;var _0x40c357=_0x71d46[_0x17652e];return _0x40c357;},_0x1765(_0x553705,_0x4ec105);}function B(_0x57d751){var _0x30d759=_0x52c85b,_0x2f0544,_0x425634;let _0x3fb00b=function(_0x4f3378,_0x2b9204){return _0x2b9204-_0x4f3378;},_0x37974a;if(_0x57d751[_0x30d759(0x279)])_0x37974a=function(){var _0x4497fe=_0x30d759;return _0x57d751[_0x4497fe(0x279)][_0x4497fe(0x2cc)]();};else{if(_0x57d751[_0x30d759(0x2de)]&&_0x57d751[_0x30d759(0x2de)][_0x30d759(0x2c1)]&&((_0x425634=(_0x2f0544=_0x57d751[_0x30d759(0x2de)])==null?void 0x0:_0x2f0544['env'])==null?void 0x0:_0x425634[_0x30d759(0x22c)])!=='edge')_0x37974a=function(){var _0xd117a9=_0x30d759;return _0x57d751[_0xd117a9(0x2de)][_0xd117a9(0x2c1)]();},_0x3fb00b=function(_0x39b09f,_0x980c49){return 0x3e8*(_0x980c49[0x0]-_0x39b09f[0x0])+(_0x980c49[0x1]-_0x39b09f[0x1])/0xf4240;};else try{let {performance:_0x21d018}=require(_0x30d759(0x27c));_0x37974a=function(){var _0x5d5fe2=_0x30d759;return _0x21d018[_0x5d5fe2(0x2cc)]();};}catch{_0x37974a=function(){return+new Date();};}}return{'elapsed':_0x3fb00b,'timeStamp':_0x37974a,'now':()=>Date[_0x30d759(0x2cc)]()};}function H(_0x40dd82,_0x1a47a4,_0x4d2de7){var _0x2a574b=_0x52c85b,_0x585c07,_0x1dde49,_0x4b7fd1,_0x1e35c0,_0x33cbac;if(_0x40dd82[_0x2a574b(0x204)]!==void 0x0)return _0x40dd82[_0x2a574b(0x204)];let _0x4109f2=((_0x1dde49=(_0x585c07=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x585c07['versions'])==null?void 0x0:_0x1dde49[_0x2a574b(0x256)])||((_0x1e35c0=(_0x4b7fd1=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x4b7fd1['env'])==null?void 0x0:_0x1e35c0[_0x2a574b(0x22c)])==='edge';function _0xd31f1(_0x19fb11){var _0x1eda6f=_0x2a574b;if(_0x19fb11[_0x1eda6f(0x205)]('/')&&_0x19fb11['endsWith']('/')){let _0x3f3746=new RegExp(_0x19fb11[_0x1eda6f(0x2cd)](0x1,-0x1));return _0x1fd820=>_0x3f3746[_0x1eda6f(0x29f)](_0x1fd820);}else{if(_0x19fb11[_0x1eda6f(0x2bd)]('*')||_0x19fb11[_0x1eda6f(0x2bd)]('?')){let _0x16815c=new RegExp('^'+_0x19fb11[_0x1eda6f(0x278)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0x1eda6f(0x278)](/\\?/g,'.')+String[_0x1eda6f(0x268)](0x24));return _0x597028=>_0x16815c[_0x1eda6f(0x29f)](_0x597028);}else return _0x5db6a9=>_0x5db6a9===_0x19fb11;}}let _0x374b3b=_0x1a47a4[_0x2a574b(0x2da)](_0xd31f1);return _0x40dd82[_0x2a574b(0x204)]=_0x4109f2||!_0x1a47a4,!_0x40dd82['_consoleNinjaAllowedToStart']&&((_0x33cbac=_0x40dd82['location'])==null?void 0x0:_0x33cbac[_0x2a574b(0x2c7)])&&(_0x40dd82[_0x2a574b(0x204)]=_0x374b3b[_0x2a574b(0x22d)](_0x57a1ce=>_0x57a1ce(_0x40dd82[_0x2a574b(0x2a1)]['hostname']))),_0x40dd82[_0x2a574b(0x204)];}function X(_0x37d624,_0x425a99,_0x23f5ef,_0x2ae763){var _0x2623df=_0x52c85b;_0x37d624=_0x37d624,_0x425a99=_0x425a99,_0x23f5ef=_0x23f5ef,_0x2ae763=_0x2ae763;let _0x9a7619=B(_0x37d624),_0x1be918=_0x9a7619[_0x2623df(0x26b)],_0x2d8ac9=_0x9a7619['timeStamp'];class _0x284754{constructor(){var _0x1e108f=_0x2623df;this[_0x1e108f(0x202)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x1e108f(0x22e)]=/^(0|[1-9][0-9]*)$/,this[_0x1e108f(0x2b0)]=/'([^\\\\']|\\\\')*'/,this[_0x1e108f(0x270)]=_0x37d624['undefined'],this[_0x1e108f(0x245)]=_0x37d624[_0x1e108f(0x217)],this[_0x1e108f(0x24d)]=Object[_0x1e108f(0x2d5)],this['_getOwnPropertyNames']=Object[_0x1e108f(0x20c)],this['_Symbol']=_0x37d624['Symbol'],this['_regExpToString']=RegExp[_0x1e108f(0x1f7)][_0x1e108f(0x2b2)],this[_0x1e108f(0x221)]=Date[_0x1e108f(0x1f7)]['toString'];}['serialize'](_0x5df2e5,_0x28d843,_0xcb4789,_0xdcda9){var _0x157369=_0x2623df,_0x204121=this,_0x7c527c=_0xcb4789['autoExpand'];function _0x525b94(_0x476e30,_0x59becc,_0x306c45){var _0x17e488=_0x1765;_0x59becc['type']='unknown',_0x59becc[_0x17e488(0x223)]=_0x476e30[_0x17e488(0x2ce)],_0x642c19=_0x306c45['node'][_0x17e488(0x218)],_0x306c45['node'][_0x17e488(0x218)]=_0x59becc,_0x204121[_0x17e488(0x251)](_0x59becc,_0x306c45);}try{_0xcb4789[_0x157369(0x216)]++,_0xcb4789['autoExpand']&&_0xcb4789['autoExpandPreviousObjects'][_0x157369(0x258)](_0x28d843);var _0x1cc857,_0x4f181d,_0x1561f0,_0x4bd796,_0x12e234=[],_0x57be70=[],_0x538ba4,_0x937729=this[_0x157369(0x2d3)](_0x28d843),_0x7c4fbd=_0x937729==='array',_0x423502=!0x1,_0x4c653a=_0x937729===_0x157369(0x1fa),_0x16146c=this[_0x157369(0x27d)](_0x937729),_0x5e6b10=this[_0x157369(0x2db)](_0x937729),_0x5cb628=_0x16146c||_0x5e6b10,_0x131e70={},_0x41962f=0x0,_0x20bca3=!0x1,_0x642c19,_0x1bfeb1=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xcb4789[_0x157369(0x230)]){if(_0x7c4fbd){if(_0x4f181d=_0x28d843[_0x157369(0x293)],_0x4f181d>_0xcb4789['elements']){for(_0x1561f0=0x0,_0x4bd796=_0xcb4789[_0x157369(0x285)],_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121['_addProperty'](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));_0x5df2e5[_0x157369(0x237)]=!0x0;}else{for(_0x1561f0=0x0,_0x4bd796=_0x4f181d,_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x23a)](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));}_0xcb4789[_0x157369(0x250)]+=_0x57be70['length'];}if(!(_0x937729===_0x157369(0x224)||_0x937729==='undefined')&&!_0x16146c&&_0x937729!=='String'&&_0x937729!==_0x157369(0x25b)&&_0x937729!=='bigint'){var _0x14ad0a=_0xdcda9['props']||_0xcb4789[_0x157369(0x269)];if(this[_0x157369(0x21c)](_0x28d843)?(_0x1cc857=0x0,_0x28d843[_0x157369(0x206)](function(_0x795ddf){var _0x15dd02=_0x157369;if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789[_0x15dd02(0x2c6)]&&_0xcb4789[_0x15dd02(0x2b1)]&&_0xcb4789[_0x15dd02(0x250)]>_0xcb4789[_0x15dd02(0x233)]){_0x20bca3=!0x0;return;}_0x57be70['push'](_0x204121[_0x15dd02(0x23a)](_0x12e234,_0x28d843,_0x15dd02(0x1fd),_0x1cc857++,_0xcb4789,function(_0x498239){return function(){return _0x498239;};}(_0x795ddf)));})):this[_0x157369(0x2aa)](_0x28d843)&&_0x28d843['forEach'](function(_0x268d65,_0x26e6f7){var _0x462487=_0x157369;if(_0x41962f++,_0xcb4789[_0x462487(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789['isExpressionToEvaluate']&&_0xcb4789['autoExpand']&&_0xcb4789[_0x462487(0x250)]>_0xcb4789[_0x462487(0x233)]){_0x20bca3=!0x0;return;}var _0x19aed5=_0x26e6f7[_0x462487(0x2b2)]();_0x19aed5[_0x462487(0x293)]>0x64&&(_0x19aed5=_0x19aed5['slice'](0x0,0x64)+_0x462487(0x288)),_0x57be70[_0x462487(0x258)](_0x204121[_0x462487(0x23a)](_0x12e234,_0x28d843,'Map',_0x19aed5,_0xcb4789,function(_0x23ffd6){return function(){return _0x23ffd6;};}(_0x268d65)));}),!_0x423502){try{for(_0x538ba4 in _0x28d843)if(!(_0x7c4fbd&&_0x1bfeb1['test'](_0x538ba4))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)){if(_0x41962f++,_0xcb4789[_0x157369(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789['autoExpandLimit']){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}catch{}if(_0x131e70[_0x157369(0x262)]=!0x0,_0x4c653a&&(_0x131e70[_0x157369(0x28f)]=!0x0),!_0x20bca3){var _0x5ae1db=[][_0x157369(0x266)](this[_0x157369(0x2d1)](_0x28d843))[_0x157369(0x266)](this[_0x157369(0x2c2)](_0x28d843));for(_0x1cc857=0x0,_0x4f181d=_0x5ae1db[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)if(_0x538ba4=_0x5ae1db[_0x1cc857],!(_0x7c4fbd&&_0x1bfeb1[_0x157369(0x29f)](_0x538ba4[_0x157369(0x2b2)]()))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)&&!_0x131e70[_0x157369(0x2b4)+_0x538ba4[_0x157369(0x2b2)]()]){if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789[_0x157369(0x233)]){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}}}}if(_0x5df2e5[_0x157369(0x24c)]=_0x937729,_0x5cb628?(_0x5df2e5[_0x157369(0x24e)]=_0x28d843['valueOf'](),this[_0x157369(0x26d)](_0x937729,_0x5df2e5,_0xcb4789,_0xdcda9)):_0x937729==='date'?_0x5df2e5[_0x157369(0x24e)]=this[_0x157369(0x221)][_0x157369(0x241)](_0x28d843):_0x937729===_0x157369(0x232)?_0x5df2e5[_0x157369(0x24e)]=_0x28d843[_0x157369(0x2b2)]():_0x937729==='RegExp'?_0x5df2e5[_0x157369(0x24e)]=this['_regExpToString'][_0x157369(0x241)](_0x28d843):_0x937729==='symbol'&&this[_0x157369(0x2a4)]?_0x5df2e5['value']=this[_0x157369(0x2a4)][_0x157369(0x1f7)]['toString'][_0x157369(0x241)](_0x28d843):!_0xcb4789['depth']&&!(_0x937729===_0x157369(0x224)||_0x937729===_0x157369(0x2ac))&&(delete _0x5df2e5[_0x157369(0x24e)],_0x5df2e5[_0x157369(0x225)]=!0x0),_0x20bca3&&(_0x5df2e5[_0x157369(0x2c3)]=!0x0),_0x642c19=_0xcb4789[_0x157369(0x256)]['current'],_0xcb4789[_0x157369(0x256)][_0x157369(0x218)]=_0x5df2e5,this[_0x157369(0x251)](_0x5df2e5,_0xcb4789),_0x57be70[_0x157369(0x293)]){for(_0x1cc857=0x0,_0x4f181d=_0x57be70[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)_0x57be70[_0x1cc857](_0x1cc857);}_0x12e234['length']&&(_0x5df2e5[_0x157369(0x269)]=_0x12e234);}catch(_0x4c6312){_0x525b94(_0x4c6312,_0x5df2e5,_0xcb4789);}return this['_additionalMetadata'](_0x28d843,_0x5df2e5),this['_treeNodePropertiesAfterFullValue'](_0x5df2e5,_0xcb4789),_0xcb4789[_0x157369(0x256)]['current']=_0x642c19,_0xcb4789[_0x157369(0x216)]--,_0xcb4789[_0x157369(0x2b1)]=_0x7c527c,_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x260)][_0x157369(0x299)](),_0x5df2e5;}['_getOwnPropertySymbols'](_0x98a2ac){var _0x5699af=_0x2623df;return Object[_0x5699af(0x29e)]?Object['getOwnPropertySymbols'](_0x98a2ac):[];}[_0x2623df(0x21c)](_0x1b06f2){var _0x45deb3=_0x2623df;return!!(_0x1b06f2&&_0x37d624[_0x45deb3(0x1fd)]&&this[_0x45deb3(0x243)](_0x1b06f2)===_0x45deb3(0x259)&&_0x1b06f2[_0x45deb3(0x206)]);}[_0x2623df(0x294)](_0x2a16f8,_0x2d32bc,_0xc52e10){var _0x1da585=_0x2623df;return _0xc52e10['noFunctions']?typeof _0x2a16f8[_0x2d32bc]==_0x1da585(0x1fa):!0x1;}[_0x2623df(0x2d3)](_0x3c584c){var _0x4a2b0b=_0x2623df,_0x116724='';return _0x116724=typeof _0x3c584c,_0x116724===_0x4a2b0b(0x1ff)?this[_0x4a2b0b(0x243)](_0x3c584c)==='[object\\x20Array]'?_0x116724=_0x4a2b0b(0x2df):this['_objectToString'](_0x3c584c)===_0x4a2b0b(0x2dc)?_0x116724='date':this[_0x4a2b0b(0x243)](_0x3c584c)===_0x4a2b0b(0x2d2)?_0x116724=_0x4a2b0b(0x232):_0x3c584c===null?_0x116724=_0x4a2b0b(0x224):_0x3c584c[_0x4a2b0b(0x20d)]&&(_0x116724=_0x3c584c[_0x4a2b0b(0x20d)][_0x4a2b0b(0x261)]||_0x116724):_0x116724===_0x4a2b0b(0x2ac)&&this[_0x4a2b0b(0x245)]&&_0x3c584c instanceof this[_0x4a2b0b(0x245)]&&(_0x116724=_0x4a2b0b(0x217)),_0x116724;}[_0x2623df(0x243)](_0xc200d5){var _0x4e9e8b=_0x2623df;return Object[_0x4e9e8b(0x1f7)][_0x4e9e8b(0x2b2)]['call'](_0xc200d5);}[_0x2623df(0x27d)](_0x529a22){var _0x5c1d83=_0x2623df;return _0x529a22===_0x5c1d83(0x234)||_0x529a22===_0x5c1d83(0x28a)||_0x529a22===_0x5c1d83(0x246);}[_0x2623df(0x2db)](_0x138149){var _0x4a144e=_0x2623df;return _0x138149===_0x4a144e(0x284)||_0x138149===_0x4a144e(0x21e)||_0x138149===_0x4a144e(0x201);}[_0x2623df(0x23a)](_0x135627,_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524){var _0x2e6ca4=this;return function(_0x3cef10){var _0xcb4898=_0x1765,_0x47c646=_0x375c3c[_0xcb4898(0x256)]['current'],_0x4083d7=_0x375c3c['node']['index'],_0x5280a8=_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)];_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x47c646,_0x375c3c['node'][_0xcb4898(0x28c)]=typeof _0x11f9fb=='number'?_0x11f9fb:_0x3cef10,_0x135627[_0xcb4898(0x258)](_0x2e6ca4['_property'](_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524)),_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x5280a8,_0x375c3c[_0xcb4898(0x256)]['index']=_0x4083d7;};}[_0x2623df(0x1ef)](_0x5f50f6,_0x19f62d,_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61){var _0x1b819d=_0x2623df,_0x2f2a63=this;return _0x19f62d[_0x1b819d(0x2b4)+_0x153ede[_0x1b819d(0x2b2)]()]=!0x0,function(_0x52cd65){var _0xc2af59=_0x1b819d,_0xf1884d=_0x195a04['node'][_0xc2af59(0x218)],_0x1f5c05=_0x195a04['node'][_0xc2af59(0x28c)],_0x20b47d=_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)];_0x195a04[_0xc2af59(0x256)]['parent']=_0xf1884d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x52cd65,_0x5f50f6[_0xc2af59(0x258)](_0x2f2a63[_0xc2af59(0x207)](_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61)),_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)]=_0x20b47d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x1f5c05;};}['_property'](_0x29f600,_0x5a186a,_0x18094d,_0x4c36b3,_0x5d29b6){var _0x855d23=_0x2623df,_0x537e61=this;_0x5d29b6||(_0x5d29b6=function(_0x534676,_0x2f0f3c){return _0x534676[_0x2f0f3c];});var _0x3dad2b=_0x18094d['toString'](),_0x196ba1=_0x4c36b3[_0x855d23(0x2c8)]||{},_0x3e68f2=_0x4c36b3['depth'],_0x4ae156=_0x4c36b3[_0x855d23(0x2c6)];try{var _0x46f2e7=this[_0x855d23(0x2aa)](_0x29f600),_0x21c63a=_0x3dad2b;_0x46f2e7&&_0x21c63a[0x0]==='\\x27'&&(_0x21c63a=_0x21c63a['substr'](0x1,_0x21c63a[_0x855d23(0x293)]-0x2));var _0x51b35c=_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1['_p_'+_0x21c63a];_0x51b35c&&(_0x4c36b3[_0x855d23(0x230)]=_0x4c36b3[_0x855d23(0x230)]+0x1),_0x4c36b3['isExpressionToEvaluate']=!!_0x51b35c;var _0x4102a5=typeof _0x18094d==_0x855d23(0x28e),_0x10aa24={'name':_0x4102a5||_0x46f2e7?_0x3dad2b:this[_0x855d23(0x1f6)](_0x3dad2b)};if(_0x4102a5&&(_0x10aa24['symbol']=!0x0),!(_0x5a186a===_0x855d23(0x2df)||_0x5a186a==='Error')){var _0x4f0a95=this['_getOwnPropertyDescriptor'](_0x29f600,_0x18094d);if(_0x4f0a95&&(_0x4f0a95[_0x855d23(0x2be)]&&(_0x10aa24['setter']=!0x0),_0x4f0a95['get']&&!_0x51b35c&&!_0x4c36b3[_0x855d23(0x26e)]))return _0x10aa24[_0x855d23(0x2a8)]=!0x0,this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x8e1bdc;try{_0x8e1bdc=_0x5d29b6(_0x29f600,_0x18094d);}catch(_0x343ade){return _0x10aa24={'name':_0x3dad2b,'type':_0x855d23(0x27e),'error':_0x343ade[_0x855d23(0x2ce)]},this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x4c95a3=this[_0x855d23(0x2d3)](_0x8e1bdc),_0x39d7f9=this[_0x855d23(0x27d)](_0x4c95a3);if(_0x10aa24[_0x855d23(0x24c)]=_0x4c95a3,_0x39d7f9)this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x294840=_0x855d23;_0x10aa24['value']=_0x8e1bdc[_0x294840(0x1f2)](),!_0x51b35c&&_0x537e61['_capIfString'](_0x4c95a3,_0x10aa24,_0x4c36b3,{});});else{var _0x308b70=_0x4c36b3[_0x855d23(0x2b1)]&&_0x4c36b3[_0x855d23(0x216)]<_0x4c36b3[_0x855d23(0x240)]&&_0x4c36b3['autoExpandPreviousObjects'][_0x855d23(0x2a0)](_0x8e1bdc)<0x0&&_0x4c95a3!==_0x855d23(0x1fa)&&_0x4c36b3[_0x855d23(0x250)]<_0x4c36b3[_0x855d23(0x233)];_0x308b70||_0x4c36b3['level']<_0x3e68f2||_0x51b35c?(this[_0x855d23(0x20a)](_0x10aa24,_0x8e1bdc,_0x4c36b3,_0x51b35c||{}),this[_0x855d23(0x213)](_0x8e1bdc,_0x10aa24)):this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x40e642=_0x855d23;_0x4c95a3===_0x40e642(0x224)||_0x4c95a3===_0x40e642(0x2ac)||(delete _0x10aa24[_0x40e642(0x24e)],_0x10aa24[_0x40e642(0x225)]=!0x0);});}return _0x10aa24;}finally{_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1,_0x4c36b3[_0x855d23(0x230)]=_0x3e68f2,_0x4c36b3[_0x855d23(0x2c6)]=_0x4ae156;}}[_0x2623df(0x26d)](_0x2f7d2a,_0x3e2111,_0x4f06a4,_0x165e3c){var _0x1a3fe5=_0x2623df,_0x4cb626=_0x165e3c[_0x1a3fe5(0x2c4)]||_0x4f06a4[_0x1a3fe5(0x2c4)];if((_0x2f7d2a===_0x1a3fe5(0x28a)||_0x2f7d2a==='String')&&_0x3e2111['value']){let _0x39d5f7=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x293)];_0x4f06a4['allStrLength']+=_0x39d5f7,_0x4f06a4[_0x1a3fe5(0x214)]>_0x4f06a4[_0x1a3fe5(0x2c9)]?(_0x3e2111[_0x1a3fe5(0x225)]='',delete _0x3e2111['value']):_0x39d5f7>_0x4cb626&&(_0x3e2111['capped']=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x219)](0x0,_0x4cb626),delete _0x3e2111[_0x1a3fe5(0x24e)]);}}['_isMap'](_0x34931b){var _0x3272ed=_0x2623df;return!!(_0x34931b&&_0x37d624[_0x3272ed(0x247)]&&this[_0x3272ed(0x243)](_0x34931b)===_0x3272ed(0x2d4)&&_0x34931b['forEach']);}[_0x2623df(0x1f6)](_0x47a998){var _0x54c731=_0x2623df;if(_0x47a998[_0x54c731(0x263)](/^\\d+$/))return _0x47a998;var _0x13c78f;try{_0x13c78f=JSON['stringify'](''+_0x47a998);}catch{_0x13c78f='\\x22'+this[_0x54c731(0x243)](_0x47a998)+'\\x22';}return _0x13c78f[_0x54c731(0x263)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x13c78f=_0x13c78f['substr'](0x1,_0x13c78f['length']-0x2):_0x13c78f=_0x13c78f['replace'](/'/g,'\\x5c\\x27')[_0x54c731(0x278)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x13c78f;}[_0x2623df(0x248)](_0x450bd2,_0x540e99,_0x3a738d,_0x1d5e7b){var _0xbf57c1=_0x2623df;this[_0xbf57c1(0x251)](_0x450bd2,_0x540e99),_0x1d5e7b&&_0x1d5e7b(),this[_0xbf57c1(0x213)](_0x3a738d,_0x450bd2),this[_0xbf57c1(0x2b5)](_0x450bd2,_0x540e99);}['_treeNodePropertiesBeforeFullValue'](_0x288bd4,_0x443233){var _0x15c053=_0x2623df;this[_0x15c053(0x2ab)](_0x288bd4,_0x443233),this[_0x15c053(0x22b)](_0x288bd4,_0x443233),this['_setNodeExpressionPath'](_0x288bd4,_0x443233),this[_0x15c053(0x275)](_0x288bd4,_0x443233);}[_0x2623df(0x2ab)](_0x33355c,_0x4c1413){}['_setNodeQueryPath'](_0x5e28c0,_0x37c1ca){}['_setNodeLabel'](_0xee885f,_0x115998){}[_0x2623df(0x235)](_0x55a938){var _0x1aa6f4=_0x2623df;return _0x55a938===this[_0x1aa6f4(0x270)];}['_treeNodePropertiesAfterFullValue'](_0x10edfb,_0x29f29a){var _0x206d02=_0x2623df;this[_0x206d02(0x1ed)](_0x10edfb,_0x29f29a),this['_setNodeExpandableState'](_0x10edfb),_0x29f29a['sortProps']&&this[_0x206d02(0x2cb)](_0x10edfb),this[_0x206d02(0x29c)](_0x10edfb,_0x29f29a),this[_0x206d02(0x236)](_0x10edfb,_0x29f29a),this[_0x206d02(0x209)](_0x10edfb);}[_0x2623df(0x213)](_0x2ae38c,_0x6a4e65){var _0x3180df=_0x2623df;let _0x39ab34;try{_0x37d624[_0x3180df(0x23c)]&&(_0x39ab34=_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)],_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=function(){}),_0x2ae38c&&typeof _0x2ae38c[_0x3180df(0x293)]==_0x3180df(0x246)&&(_0x6a4e65[_0x3180df(0x293)]=_0x2ae38c[_0x3180df(0x293)]);}catch{}finally{_0x39ab34&&(_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=_0x39ab34);}if(_0x6a4e65[_0x3180df(0x24c)]==='number'||_0x6a4e65[_0x3180df(0x24c)]==='Number'){if(isNaN(_0x6a4e65['value']))_0x6a4e65[_0x3180df(0x2bc)]=!0x0,delete _0x6a4e65['value'];else switch(_0x6a4e65[_0x3180df(0x24e)]){case Number[_0x3180df(0x23d)]:_0x6a4e65[_0x3180df(0x2dd)]=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case Number['NEGATIVE_INFINITY']:_0x6a4e65['negativeInfinity']=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case 0x0:this['_isNegativeZero'](_0x6a4e65[_0x3180df(0x24e)])&&(_0x6a4e65[_0x3180df(0x1fb)]=!0x0);break;}}else _0x6a4e65[_0x3180df(0x24c)]===_0x3180df(0x1fa)&&typeof _0x2ae38c[_0x3180df(0x261)]==_0x3180df(0x28a)&&_0x2ae38c[_0x3180df(0x261)]&&_0x6a4e65[_0x3180df(0x261)]&&_0x2ae38c[_0x3180df(0x261)]!==_0x6a4e65[_0x3180df(0x261)]&&(_0x6a4e65[_0x3180df(0x21b)]=_0x2ae38c[_0x3180df(0x261)]);}['_isNegativeZero'](_0x2fa98d){var _0x8c6a89=_0x2623df;return 0x1/_0x2fa98d===Number[_0x8c6a89(0x289)];}[_0x2623df(0x2cb)](_0x45f240){var _0x27ea15=_0x2623df;!_0x45f240[_0x27ea15(0x269)]||!_0x45f240['props'][_0x27ea15(0x293)]||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x2df)||_0x45f240[_0x27ea15(0x24c)]==='Map'||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x1fd)||_0x45f240[_0x27ea15(0x269)][_0x27ea15(0x296)](function(_0x587f85,_0x25310e){var _0x27429f=_0x27ea15,_0x22eb8f=_0x587f85['name'][_0x27429f(0x2a7)](),_0x9f76b=_0x25310e[_0x27429f(0x261)][_0x27429f(0x2a7)]();return _0x22eb8f<_0x9f76b?-0x1:_0x22eb8f>_0x9f76b?0x1:0x0;});}[_0x2623df(0x29c)](_0x6aec3b,_0x4e7839){var _0x5e1614=_0x2623df;if(!(_0x4e7839[_0x5e1614(0x1f0)]||!_0x6aec3b[_0x5e1614(0x269)]||!_0x6aec3b['props'][_0x5e1614(0x293)])){for(var _0x4ae259=[],_0x2bc8c5=[],_0x2c5219=0x0,_0x4f1485=_0x6aec3b[_0x5e1614(0x269)]['length'];_0x2c5219<_0x4f1485;_0x2c5219++){var _0x29e8fa=_0x6aec3b[_0x5e1614(0x269)][_0x2c5219];_0x29e8fa['type']===_0x5e1614(0x1fa)?_0x4ae259[_0x5e1614(0x258)](_0x29e8fa):_0x2bc8c5[_0x5e1614(0x258)](_0x29e8fa);}if(!(!_0x2bc8c5[_0x5e1614(0x293)]||_0x4ae259[_0x5e1614(0x293)]<=0x1)){_0x6aec3b[_0x5e1614(0x269)]=_0x2bc8c5;var _0x28eeff={'functionsNode':!0x0,'props':_0x4ae259};this['_setNodeId'](_0x28eeff,_0x4e7839),this[_0x5e1614(0x1ed)](_0x28eeff,_0x4e7839),this[_0x5e1614(0x229)](_0x28eeff),this[_0x5e1614(0x275)](_0x28eeff,_0x4e7839),_0x28eeff['id']+='\\x20f',_0x6aec3b['props']['unshift'](_0x28eeff);}}}[_0x2623df(0x236)](_0x8d09ca,_0x48c45f){}['_setNodeExpandableState'](_0x2c3113){}['_isArray'](_0x4d0b46){var _0x540da5=_0x2623df;return Array['isArray'](_0x4d0b46)||typeof _0x4d0b46==_0x540da5(0x1ff)&&this[_0x540da5(0x243)](_0x4d0b46)===_0x540da5(0x1fc);}['_setNodePermissions'](_0x51ec7c,_0x53542f){}[_0x2623df(0x209)](_0x47913e){var _0x503d84=_0x2623df;delete _0x47913e['_hasSymbolPropertyOnItsPath'],delete _0x47913e['_hasSetOnItsPath'],delete _0x47913e[_0x503d84(0x257)];}[_0x2623df(0x290)](_0x3e77fb,_0x7533ff){}}let _0x31638a=new _0x284754(),_0xdce57e={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x43e197={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x6a9287(_0x531b46,_0x4bc71a,_0x197aa8,_0x42857c,_0x5321fe,_0x10f17e){var _0x471a36=_0x2623df;let _0x101e55,_0x1a2226;try{_0x1a2226=_0x2d8ac9(),_0x101e55=_0x23f5ef[_0x4bc71a],!_0x101e55||_0x1a2226-_0x101e55['ts']>0x1f4&&_0x101e55[_0x471a36(0x227)]&&_0x101e55[_0x471a36(0x27a)]/_0x101e55[_0x471a36(0x227)]<0x64?(_0x23f5ef[_0x4bc71a]=_0x101e55={'count':0x0,'time':0x0,'ts':_0x1a2226},_0x23f5ef[_0x471a36(0x2c0)]={}):_0x1a2226-_0x23f5ef[_0x471a36(0x2c0)]['ts']>0x32&&_0x23f5ef[_0x471a36(0x2c0)]['count']&&_0x23f5ef['hits'][_0x471a36(0x27a)]/_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]<0x64&&(_0x23f5ef['hits']={});let _0x11e3f6=[],_0x5697d2=_0x101e55['reduceLimits']||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x22a)]?_0x43e197:_0xdce57e,_0x405b05=_0x3da01f=>{var _0x3c6546=_0x471a36;let _0x26cba4={};return _0x26cba4['props']=_0x3da01f[_0x3c6546(0x269)],_0x26cba4[_0x3c6546(0x285)]=_0x3da01f[_0x3c6546(0x285)],_0x26cba4[_0x3c6546(0x2c4)]=_0x3da01f[_0x3c6546(0x2c4)],_0x26cba4[_0x3c6546(0x2c9)]=_0x3da01f['totalStrLength'],_0x26cba4[_0x3c6546(0x233)]=_0x3da01f[_0x3c6546(0x233)],_0x26cba4[_0x3c6546(0x240)]=_0x3da01f[_0x3c6546(0x240)],_0x26cba4['sortProps']=!0x1,_0x26cba4[_0x3c6546(0x1f0)]=!_0x425a99,_0x26cba4[_0x3c6546(0x230)]=0x1,_0x26cba4[_0x3c6546(0x216)]=0x0,_0x26cba4[_0x3c6546(0x238)]='root_exp_id',_0x26cba4[_0x3c6546(0x1ec)]=_0x3c6546(0x283),_0x26cba4[_0x3c6546(0x2b1)]=!0x0,_0x26cba4[_0x3c6546(0x260)]=[],_0x26cba4[_0x3c6546(0x250)]=0x0,_0x26cba4[_0x3c6546(0x26e)]=!0x0,_0x26cba4[_0x3c6546(0x214)]=0x0,_0x26cba4['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x26cba4;};for(var _0x23e276=0x0;_0x23e276<_0x5321fe[_0x471a36(0x293)];_0x23e276++)_0x11e3f6[_0x471a36(0x258)](_0x31638a[_0x471a36(0x20a)]({'timeNode':_0x531b46===_0x471a36(0x27a)||void 0x0},_0x5321fe[_0x23e276],_0x405b05(_0x5697d2),{}));if(_0x531b46==='trace'||_0x531b46===_0x471a36(0x223)){let _0x56cb28=Error['stackTraceLimit'];try{Error[_0x471a36(0x281)]=0x1/0x0,_0x11e3f6['push'](_0x31638a[_0x471a36(0x20a)]({'stackNode':!0x0},new Error()[_0x471a36(0x1f3)],_0x405b05(_0x5697d2),{'strLength':0x1/0x0}));}finally{Error[_0x471a36(0x281)]=_0x56cb28;}}return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':_0x11e3f6,'id':_0x4bc71a,'context':_0x10f17e}]};}catch(_0x141361){return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':[{'type':'unknown','error':_0x141361&&_0x141361[_0x471a36(0x2ce)]}],'id':_0x4bc71a,'context':_0x10f17e}]};}finally{try{if(_0x101e55&&_0x1a2226){let _0x53d3d0=_0x2d8ac9();_0x101e55['count']++,_0x101e55[_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x101e55['ts']=_0x53d3d0,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]++,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x23f5ef[_0x471a36(0x2c0)]['ts']=_0x53d3d0,(_0x101e55['count']>0x32||_0x101e55['time']>0x64)&&(_0x101e55[_0x471a36(0x22a)]=!0x0),(_0x23f5ef['hits'][_0x471a36(0x227)]>0x3e8||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]>0x12c)&&(_0x23f5ef['hits'][_0x471a36(0x22a)]=!0x0);}}catch{}}}return _0x6a9287;}((_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x598d24,_0x5d532f,_0x146311,_0x5c841c,_0x435457,_0x4af095)=>{var _0x178280=_0x52c85b;if(_0x5c57ad[_0x178280(0x273)])return _0x5c57ad[_0x178280(0x273)];if(!H(_0x5c57ad,_0x146311,_0x3deb3c))return _0x5c57ad[_0x178280(0x273)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5c57ad['_console_ninja'];let _0x348138=B(_0x5c57ad),_0x4526fb=_0x348138[_0x178280(0x26b)],_0x4d4ffb=_0x348138[_0x178280(0x282)],_0x383918=_0x348138[_0x178280(0x2cc)],_0x42c1e2={'hits':{},'ts':{}},_0x5f1ccb=X(_0x5c57ad,_0x5c841c,_0x42c1e2,_0x598d24),_0xd940d5=_0x4e24ec=>{_0x42c1e2['ts'][_0x4e24ec]=_0x4d4ffb();},_0xea84f2=(_0x1e4f3c,_0x4cf578)=>{var _0x1bcce6=_0x178280;let _0x930c06=_0x42c1e2['ts'][_0x4cf578];if(delete _0x42c1e2['ts'][_0x4cf578],_0x930c06){let _0x1303d4=_0x4526fb(_0x930c06,_0x4d4ffb());_0xde4346(_0x5f1ccb(_0x1bcce6(0x27a),_0x1e4f3c,_0x383918(),_0x42be99,[_0x1303d4],_0x4cf578));}},_0x4f0396=_0x430740=>{var _0x16daef=_0x178280,_0x326829;return _0x3deb3c===_0x16daef(0x22f)&&_0x5c57ad[_0x16daef(0x2bf)]&&((_0x326829=_0x430740==null?void 0x0:_0x430740[_0x16daef(0x264)])==null?void 0x0:_0x326829[_0x16daef(0x293)])&&(_0x430740[_0x16daef(0x264)][0x0]['origin']=_0x5c57ad[_0x16daef(0x2bf)]),_0x430740;};_0x5c57ad['_console_ninja']={'consoleLog':(_0x389383,_0x33070f)=>{var _0xcc2784=_0x178280;_0x5c57ad[_0xcc2784(0x23c)]['log']['name']!=='disabledLog'&&_0xde4346(_0x5f1ccb(_0xcc2784(0x242),_0x389383,_0x383918(),_0x42be99,_0x33070f));},'consoleTrace':(_0x5a7462,_0x4ad9a0)=>{var _0x34222f=_0x178280,_0x4e5f09,_0x38cb70;_0x5c57ad['console']['log'][_0x34222f(0x261)]!==_0x34222f(0x286)&&((_0x38cb70=(_0x4e5f09=_0x5c57ad['process'])==null?void 0x0:_0x4e5f09[_0x34222f(0x249)])!=null&&_0x38cb70[_0x34222f(0x256)]&&(_0x5c57ad['_ninjaIgnoreNextError']=!0x0),_0xde4346(_0x4f0396(_0x5f1ccb(_0x34222f(0x239),_0x5a7462,_0x383918(),_0x42be99,_0x4ad9a0))));},'consoleError':(_0x56c660,_0x124401)=>{var _0x5a4dbf=_0x178280;_0x5c57ad[_0x5a4dbf(0x267)]=!0x0,_0xde4346(_0x4f0396(_0x5f1ccb(_0x5a4dbf(0x223),_0x56c660,_0x383918(),_0x42be99,_0x124401)));},'consoleTime':_0x2b72bf=>{_0xd940d5(_0x2b72bf);},'consoleTimeEnd':(_0xf42d7f,_0x231d2e)=>{_0xea84f2(_0x231d2e,_0xf42d7f);},'autoLog':(_0x34fc42,_0x1593ab)=>{_0xde4346(_0x5f1ccb('log',_0x1593ab,_0x383918(),_0x42be99,[_0x34fc42]));},'autoLogMany':(_0x1161f8,_0x1f890f)=>{var _0x432033=_0x178280;_0xde4346(_0x5f1ccb(_0x432033(0x242),_0x1161f8,_0x383918(),_0x42be99,_0x1f890f));},'autoTrace':(_0x1abd02,_0x1a1339)=>{var _0x23dceb=_0x178280;_0xde4346(_0x4f0396(_0x5f1ccb(_0x23dceb(0x239),_0x1a1339,_0x383918(),_0x42be99,[_0x1abd02])));},'autoTraceMany':(_0x5662b6,_0x1b0d24)=>{_0xde4346(_0x4f0396(_0x5f1ccb('trace',_0x5662b6,_0x383918(),_0x42be99,_0x1b0d24)));},'autoTime':(_0x4a4e0b,_0x1660f1,_0xecbc72)=>{_0xd940d5(_0xecbc72);},'autoTimeEnd':(_0x391986,_0x4e8b70,_0x41f58e)=>{_0xea84f2(_0x4e8b70,_0x41f58e);},'coverage':_0x5ae8d0=>{var _0x294a69=_0x178280;_0xde4346({'method':_0x294a69(0x203),'version':_0x598d24,'args':[{'id':_0x5ae8d0}]});}};let _0xde4346=q(_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x435457,_0x4af095),_0x42be99=_0x5c57ad[_0x178280(0x29d)];return _0x5c57ad[_0x178280(0x273)];})(globalThis,_0x52c85b(0x28b),_0x52c85b(0x28d),_0x52c85b(0x27b),_0x52c85b(0x2b8),'1.0.0',_0x52c85b(0x212),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ngels-MacBook-Pro.local\",\"127.0.2.2\",\"127.0.2.3\",\"192.168.15.52\",\"172.16.0.2\"],_0x52c85b(0x265),_0x52c85b(0x24f),'1');");
}
catch (e) { } }
; /* istanbul ignore next */
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo; /* istanbul ignore next */
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr; /* istanbul ignore next */
function oo_tx(i, ...v) { try {
    oo_cm().consoleError(i, v);
}
catch (e) { } return v; }
;
oo_tx; /* istanbul ignore next */
function oo_ts(v) { try {
    oo_cm().consoleTime(v);
}
catch (e) { } return v; }
;
oo_ts; /* istanbul ignore next */
function oo_te(v, i) { try {
    oo_cm().consoleTimeEnd(v, i);
}
catch (e) { } return v; }
;
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.apiGenLLava = exports.apiLLava = void 0;
const ollama_1 = __importDefault(__webpack_require__(3));
const ollamaConstant_1 = __webpack_require__(10);
async function apiLLava({ question, image }) {
    const url = "http://localhost:11434/api/generate";
    const data = {
        model: ollamaConstant_1.MODEL_LIST.LlAVA,
        prompt: question,
        stream: false,
        images: [image],
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        /* eslint-disable */ console.error(...oo_tx(`3096692525_35_4_35_34_11`, "Error:", error));
        throw error;
    }
}
exports.apiLLava = apiLLava;
const apiGenLLava = async ({ question, image }) => {
    const response = await ollama_1.default.generate({
        model: ollamaConstant_1.MODEL_LIST.LlAVA,
        prompt: `${question}`,
        stream: false,
        images: [image],
    });
    return response;
};
exports.apiGenLLava = apiGenLLava;
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x52c85b=_0x1765;(function(_0x3cd6dd,_0x5377ca){var _0x486f76=_0x1765,_0xaa2ebe=_0x3cd6dd();while(!![]){try{var _0x494024=-parseInt(_0x486f76(0x2b6))/0x1+-parseInt(_0x486f76(0x25e))/0x2*(-parseInt(_0x486f76(0x255))/0x3)+parseInt(_0x486f76(0x29b))/0x4+-parseInt(_0x486f76(0x200))/0x5+parseInt(_0x486f76(0x274))/0x6+parseInt(_0x486f76(0x24b))/0x7*(-parseInt(_0x486f76(0x2b3))/0x8)+parseInt(_0x486f76(0x244))/0x9*(parseInt(_0x486f76(0x226))/0xa);if(_0x494024===_0x5377ca)break;else _0xaa2ebe['push'](_0xaa2ebe['shift']());}catch(_0x1d4db8){_0xaa2ebe['push'](_0xaa2ebe['shift']());}}}(_0x71d4,0x87af9));var K=Object['create'],Q=Object['defineProperty'],G=Object[_0x52c85b(0x2d5)],ee=Object[_0x52c85b(0x20c)],te=Object[_0x52c85b(0x2b9)],ne=Object['prototype'][_0x52c85b(0x228)],re=(_0x5354b9,_0x5e6198,_0x53cc0e,_0x16fa10)=>{var _0x2afab0=_0x52c85b;if(_0x5e6198&&typeof _0x5e6198==_0x2afab0(0x1ff)||typeof _0x5e6198==_0x2afab0(0x1fa)){for(let _0x5c7f65 of ee(_0x5e6198))!ne[_0x2afab0(0x241)](_0x5354b9,_0x5c7f65)&&_0x5c7f65!==_0x53cc0e&&Q(_0x5354b9,_0x5c7f65,{'get':()=>_0x5e6198[_0x5c7f65],'enumerable':!(_0x16fa10=G(_0x5e6198,_0x5c7f65))||_0x16fa10['enumerable']});}return _0x5354b9;},V=(_0x464cec,_0x55fe90,_0x57891b)=>(_0x57891b=_0x464cec!=null?K(te(_0x464cec)):{},re(_0x55fe90||!_0x464cec||!_0x464cec[_0x52c85b(0x210)]?Q(_0x57891b,_0x52c85b(0x29a),{'value':_0x464cec,'enumerable':!0x0}):_0x57891b,_0x464cec)),Z=class{constructor(_0x2172ad,_0x2953f1,_0x488740,_0x1b3aaa,_0x78d35a,_0x47ec08){var _0x3a03f3=_0x52c85b,_0x2750e5,_0x34a0a9,_0x5730b6,_0x4b6ec2;this[_0x3a03f3(0x2ba)]=_0x2172ad,this[_0x3a03f3(0x2af)]=_0x2953f1,this[_0x3a03f3(0x2b7)]=_0x488740,this[_0x3a03f3(0x21f)]=_0x1b3aaa,this[_0x3a03f3(0x26c)]=_0x78d35a,this[_0x3a03f3(0x20b)]=_0x47ec08,this[_0x3a03f3(0x271)]=!0x0,this[_0x3a03f3(0x1f9)]=!0x0,this['_connected']=!0x1,this[_0x3a03f3(0x272)]=!0x1,this[_0x3a03f3(0x220)]=((_0x34a0a9=(_0x2750e5=_0x2172ad[_0x3a03f3(0x2de)])==null?void 0x0:_0x2750e5[_0x3a03f3(0x231)])==null?void 0x0:_0x34a0a9[_0x3a03f3(0x22c)])===_0x3a03f3(0x276),this[_0x3a03f3(0x27f)]=!((_0x4b6ec2=(_0x5730b6=this['global'][_0x3a03f3(0x2de)])==null?void 0x0:_0x5730b6[_0x3a03f3(0x249)])!=null&&_0x4b6ec2[_0x3a03f3(0x256)])&&!this[_0x3a03f3(0x220)],this[_0x3a03f3(0x291)]=null,this[_0x3a03f3(0x253)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x3a03f3(0x2a2)]='https://tinyurl.com/37x8b79t',this[_0x3a03f3(0x1ee)]=(this[_0x3a03f3(0x27f)]?_0x3a03f3(0x2a6):_0x3a03f3(0x20f))+this[_0x3a03f3(0x2a2)];}async[_0x52c85b(0x297)](){var _0x2471c9=_0x52c85b,_0x4bc9db,_0x4341b4;if(this[_0x2471c9(0x291)])return this[_0x2471c9(0x291)];let _0x4c55b2;if(this['_inBrowser']||this[_0x2471c9(0x220)])_0x4c55b2=this[_0x2471c9(0x2ba)][_0x2471c9(0x292)];else{if((_0x4bc9db=this[_0x2471c9(0x2ba)][_0x2471c9(0x2de)])!=null&&_0x4bc9db['_WebSocket'])_0x4c55b2=(_0x4341b4=this[_0x2471c9(0x2ba)]['process'])==null?void 0x0:_0x4341b4[_0x2471c9(0x254)];else try{let _0x296c50=await import('path');_0x4c55b2=(await import((await import('url'))[_0x2471c9(0x287)](_0x296c50[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],_0x2471c9(0x2cf)))['toString']()))[_0x2471c9(0x29a)];}catch{try{_0x4c55b2=require(require(_0x2471c9(0x1f8))[_0x2471c9(0x25c)](this[_0x2471c9(0x21f)],'ws'));}catch{throw new Error(_0x2471c9(0x1f1));}}}return this[_0x2471c9(0x291)]=_0x4c55b2,_0x4c55b2;}[_0x52c85b(0x23e)](){var _0x43da68=_0x52c85b;this[_0x43da68(0x272)]||this[_0x43da68(0x2d8)]||this[_0x43da68(0x253)]>=this['_maxConnectAttemptCount']||(this[_0x43da68(0x1f9)]=!0x1,this[_0x43da68(0x272)]=!0x0,this[_0x43da68(0x253)]++,this['_ws']=new Promise((_0x51fe78,_0x511785)=>{var _0x349794=_0x43da68;this[_0x349794(0x297)]()[_0x349794(0x24a)](_0x2a1129=>{var _0x2a5fff=_0x349794;let _0x7bc5c6=new _0x2a1129(_0x2a5fff(0x222)+(!this[_0x2a5fff(0x27f)]&&this[_0x2a5fff(0x26c)]?_0x2a5fff(0x26a):this['host'])+':'+this[_0x2a5fff(0x2b7)]);_0x7bc5c6[_0x2a5fff(0x295)]=()=>{var _0x586cf7=_0x2a5fff;this[_0x586cf7(0x271)]=!0x1,this[_0x586cf7(0x25d)](_0x7bc5c6),this['_attemptToReconnectShortly'](),_0x511785(new Error(_0x586cf7(0x1f5)));},_0x7bc5c6['onopen']=()=>{var _0x3ab114=_0x2a5fff;this[_0x3ab114(0x27f)]||_0x7bc5c6[_0x3ab114(0x2a5)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)]&&_0x7bc5c6[_0x3ab114(0x2a5)][_0x3ab114(0x2d9)](),_0x51fe78(_0x7bc5c6);},_0x7bc5c6[_0x2a5fff(0x211)]=()=>{var _0x8f69f1=_0x2a5fff;this[_0x8f69f1(0x1f9)]=!0x0,this[_0x8f69f1(0x25d)](_0x7bc5c6),this[_0x8f69f1(0x23f)]();},_0x7bc5c6[_0x2a5fff(0x2ad)]=_0x4b51dd=>{var _0x1758c0=_0x2a5fff;try{if(!(_0x4b51dd!=null&&_0x4b51dd[_0x1758c0(0x277)])||!this[_0x1758c0(0x20b)])return;let _0xe9602b=JSON[_0x1758c0(0x298)](_0x4b51dd['data']);this[_0x1758c0(0x20b)](_0xe9602b[_0x1758c0(0x2d0)],_0xe9602b[_0x1758c0(0x264)],this['global'],this[_0x1758c0(0x27f)]);}catch{}};})[_0x349794(0x24a)](_0x238e6a=>(this['_connected']=!0x0,this[_0x349794(0x272)]=!0x1,this[_0x349794(0x1f9)]=!0x1,this[_0x349794(0x271)]=!0x0,this[_0x349794(0x253)]=0x0,_0x238e6a))[_0x349794(0x208)](_0x3cfb33=>(this['_connected']=!0x1,this[_0x349794(0x272)]=!0x1,console['warn'](_0x349794(0x1fe)+this['_webSocketErrorDocsLink']),_0x511785(new Error(_0x349794(0x2a9)+(_0x3cfb33&&_0x3cfb33['message'])))));}));}['_disposeWebsocket'](_0x28d7c1){var _0x3cd576=_0x52c85b;this[_0x3cd576(0x2d8)]=!0x1,this[_0x3cd576(0x272)]=!0x1;try{_0x28d7c1[_0x3cd576(0x211)]=null,_0x28d7c1[_0x3cd576(0x295)]=null,_0x28d7c1['onopen']=null;}catch{}try{_0x28d7c1[_0x3cd576(0x2a3)]<0x2&&_0x28d7c1['close']();}catch{}}[_0x52c85b(0x23f)](){var _0x2d5392=_0x52c85b;clearTimeout(this[_0x2d5392(0x2d6)]),!(this['_connectAttemptCount']>=this[_0x2d5392(0x1f4)])&&(this[_0x2d5392(0x2d6)]=setTimeout(()=>{var _0x18f7af=_0x2d5392,_0x5a11bf;this[_0x18f7af(0x2d8)]||this[_0x18f7af(0x272)]||(this[_0x18f7af(0x23e)](),(_0x5a11bf=this[_0x18f7af(0x2d7)])==null||_0x5a11bf[_0x18f7af(0x208)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x2d5392(0x2d6)]['unref']&&this['_reconnectTimeout'][_0x2d5392(0x2d9)]());}async['send'](_0x2b2f32){var _0x3a0278=_0x52c85b;try{if(!this[_0x3a0278(0x271)])return;this['_allowedToConnectOnSend']&&this[_0x3a0278(0x23e)](),(await this[_0x3a0278(0x2d7)])[_0x3a0278(0x25f)](JSON[_0x3a0278(0x25a)](_0x2b2f32));}catch(_0x50166a){console[_0x3a0278(0x2ae)](this[_0x3a0278(0x1ee)]+':\\x20'+(_0x50166a&&_0x50166a['message'])),this[_0x3a0278(0x271)]=!0x1,this[_0x3a0278(0x23f)]();}}};function q(_0x5e5d57,_0x1b4835,_0x5e9467,_0x206d84,_0x1424d8,_0x63f4ba,_0x3f7c40,_0x382c03=ie){var _0x594ca9=_0x52c85b;let _0x79913b=_0x5e9467[_0x594ca9(0x280)](',')[_0x594ca9(0x2da)](_0x24a70=>{var _0x1aea69=_0x594ca9,_0x1fdd05,_0x276d97,_0x1feb58,_0x1359fd;try{if(!_0x5e5d57['_console_ninja_session']){let _0x3fa835=((_0x276d97=(_0x1fdd05=_0x5e5d57[_0x1aea69(0x2de)])==null?void 0x0:_0x1fdd05[_0x1aea69(0x249)])==null?void 0x0:_0x276d97['node'])||((_0x1359fd=(_0x1feb58=_0x5e5d57['process'])==null?void 0x0:_0x1feb58['env'])==null?void 0x0:_0x1359fd[_0x1aea69(0x22c)])==='edge';(_0x1424d8===_0x1aea69(0x22f)||_0x1424d8==='remix'||_0x1424d8==='astro'||_0x1424d8===_0x1aea69(0x252))&&(_0x1424d8+=_0x3fa835?'\\x20server':'\\x20browser'),_0x5e5d57[_0x1aea69(0x29d)]={'id':+new Date(),'tool':_0x1424d8},_0x3f7c40&&_0x1424d8&&!_0x3fa835&&console[_0x1aea69(0x242)](_0x1aea69(0x21a)+(_0x1424d8[_0x1aea69(0x21d)](0x0)[_0x1aea69(0x2c5)]()+_0x1424d8[_0x1aea69(0x219)](0x1))+',',_0x1aea69(0x20e),_0x1aea69(0x215));}let _0x83dde3=new Z(_0x5e5d57,_0x1b4835,_0x24a70,_0x206d84,_0x63f4ba,_0x382c03);return _0x83dde3['send'][_0x1aea69(0x2bb)](_0x83dde3);}catch(_0x1072c2){return console[_0x1aea69(0x2ae)](_0x1aea69(0x23b),_0x1072c2&&_0x1072c2['message']),()=>{};}});return _0x5f5c=>_0x79913b[_0x594ca9(0x206)](_0xf1e1e9=>_0xf1e1e9(_0x5f5c));}function ie(_0x844ad6,_0x1ef94f,_0x1bb388,_0x5b0f35){var _0x21c3ad=_0x52c85b;_0x5b0f35&&_0x844ad6===_0x21c3ad(0x26f)&&_0x1bb388[_0x21c3ad(0x2a1)][_0x21c3ad(0x26f)]();}function _0x71d4(){var _0x4cd662=['eventReceivedCallback','getOwnPropertyNames','constructor','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','__es'+'Module','onclose','1729083078541','_additionalMetadata','allStrLength','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','level','HTMLAllCollection','current','substr','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','funcName','_isSet','charAt','String','nodeModules','_inNextEdge','_dateToString','ws://','error','null','capped','450VyGHfK','count','hasOwnProperty','_setNodeExpandableState','reduceLimits','_setNodeQueryPath','NEXT_RUNTIME','some','_numberRegExp','next.js','depth','env','bigint','autoExpandLimit','boolean','_isUndefined','_addLoadNode','cappedElements','expId','trace','_addProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','console','POSITIVE_INFINITY','_connectToHostNow','_attemptToReconnectShortly','autoExpandMaxDepth','call','log','_objectToString','107955OuwREG','_HTMLAllCollection','number','Map','_processTreeNodeResult','versions','then','322336BCHbRX','type','_getOwnPropertyDescriptor','value','','autoExpandPropertyCount','_treeNodePropertiesBeforeFullValue','angular','_connectAttemptCount','_WebSocket','131994iCoayd','node','_hasMapOnItsPath','push','[object\\x20Set]','stringify','Buffer','join','_disposeWebsocket','2wslTSs','send','autoExpandPreviousObjects','name','_p_length','match','args','','concat','_ninjaIgnoreNextError','fromCharCode','props','gateway.docker.internal','elapsed','dockerizedApp','_capIfString','resolveGetters','reload','_undefined','_allowedToSend','_connecting','_console_ninja','5612766HFCOwu','_setNodePermissions','edge','data','replace','performance','time',\"/Users/ngelrojas/.vscode/extensions/wallabyjs.console-ninja-1.0.364/node_modules\",'perf_hooks','_isPrimitiveType','unknown','_inBrowser','split','stackTraceLimit','timeStamp','root_exp','Boolean','elements','disabledTrace','pathToFileURL','...','NEGATIVE_INFINITY','string','127.0.0.1','index','55895','symbol','_p_name','_setNodeExpressionPath','_WebSocketClass','WebSocket','length','_blacklistedProperty','onerror','sort','getWebSocketClass','parse','pop','default','2263440DiNTNK','_addFunctionsNode','_console_ninja_session','getOwnPropertySymbols','test','indexOf','location','_webSocketErrorDocsLink','readyState','_Symbol','_socket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','toLowerCase','getter','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_isMap','_setNodeId','undefined','onmessage','warn','host','_quotedRegExp','autoExpand','toString','112TgpLnc','_p_','_treeNodePropertiesAfterFullValue','883830dhuaNV','port','webpack','getPrototypeOf','global','bind','nan','includes','set','origin','hits','hrtime','_getOwnPropertySymbols','cappedProps','strLength','toUpperCase','isExpressionToEvaluate','hostname','expressionsToEvaluate','totalStrLength','parent','_sortProps','now','slice','message','ws/index.js','method','_getOwnPropertyNames','[object\\x20BigInt]','_type','[object\\x20Map]','getOwnPropertyDescriptor','_reconnectTimeout','_ws','_connected','unref','map','_isPrimitiveWrapperType','[object\\x20Date]','positiveInfinity','process','array','rootExpression','_setNodeLabel','_sendErrorMessage','_addObjectProperty','noFunctions','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','valueOf','stack','_maxConnectAttemptCount','logger\\x20websocket\\x20error','_propertyName','prototype','path','_allowedToConnectOnSend','function','negativeZero','[object\\x20Array]','Set','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','object','4115maXyRn','Number','_keyStrRegExp','coverage','_consoleNinjaAllowedToStart','startsWith','forEach','_property','catch','_cleanNode','serialize'];_0x71d4=function(){return _0x4cd662;};return _0x71d4();}function _0x1765(_0x553705,_0x4ec105){var _0x71d46=_0x71d4();return _0x1765=function(_0x17652e,_0x1a61b2){_0x17652e=_0x17652e-0x1ec;var _0x40c357=_0x71d46[_0x17652e];return _0x40c357;},_0x1765(_0x553705,_0x4ec105);}function B(_0x57d751){var _0x30d759=_0x52c85b,_0x2f0544,_0x425634;let _0x3fb00b=function(_0x4f3378,_0x2b9204){return _0x2b9204-_0x4f3378;},_0x37974a;if(_0x57d751[_0x30d759(0x279)])_0x37974a=function(){var _0x4497fe=_0x30d759;return _0x57d751[_0x4497fe(0x279)][_0x4497fe(0x2cc)]();};else{if(_0x57d751[_0x30d759(0x2de)]&&_0x57d751[_0x30d759(0x2de)][_0x30d759(0x2c1)]&&((_0x425634=(_0x2f0544=_0x57d751[_0x30d759(0x2de)])==null?void 0x0:_0x2f0544['env'])==null?void 0x0:_0x425634[_0x30d759(0x22c)])!=='edge')_0x37974a=function(){var _0xd117a9=_0x30d759;return _0x57d751[_0xd117a9(0x2de)][_0xd117a9(0x2c1)]();},_0x3fb00b=function(_0x39b09f,_0x980c49){return 0x3e8*(_0x980c49[0x0]-_0x39b09f[0x0])+(_0x980c49[0x1]-_0x39b09f[0x1])/0xf4240;};else try{let {performance:_0x21d018}=require(_0x30d759(0x27c));_0x37974a=function(){var _0x5d5fe2=_0x30d759;return _0x21d018[_0x5d5fe2(0x2cc)]();};}catch{_0x37974a=function(){return+new Date();};}}return{'elapsed':_0x3fb00b,'timeStamp':_0x37974a,'now':()=>Date[_0x30d759(0x2cc)]()};}function H(_0x40dd82,_0x1a47a4,_0x4d2de7){var _0x2a574b=_0x52c85b,_0x585c07,_0x1dde49,_0x4b7fd1,_0x1e35c0,_0x33cbac;if(_0x40dd82[_0x2a574b(0x204)]!==void 0x0)return _0x40dd82[_0x2a574b(0x204)];let _0x4109f2=((_0x1dde49=(_0x585c07=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x585c07['versions'])==null?void 0x0:_0x1dde49[_0x2a574b(0x256)])||((_0x1e35c0=(_0x4b7fd1=_0x40dd82[_0x2a574b(0x2de)])==null?void 0x0:_0x4b7fd1['env'])==null?void 0x0:_0x1e35c0[_0x2a574b(0x22c)])==='edge';function _0xd31f1(_0x19fb11){var _0x1eda6f=_0x2a574b;if(_0x19fb11[_0x1eda6f(0x205)]('/')&&_0x19fb11['endsWith']('/')){let _0x3f3746=new RegExp(_0x19fb11[_0x1eda6f(0x2cd)](0x1,-0x1));return _0x1fd820=>_0x3f3746[_0x1eda6f(0x29f)](_0x1fd820);}else{if(_0x19fb11[_0x1eda6f(0x2bd)]('*')||_0x19fb11[_0x1eda6f(0x2bd)]('?')){let _0x16815c=new RegExp('^'+_0x19fb11[_0x1eda6f(0x278)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0x1eda6f(0x278)](/\\?/g,'.')+String[_0x1eda6f(0x268)](0x24));return _0x597028=>_0x16815c[_0x1eda6f(0x29f)](_0x597028);}else return _0x5db6a9=>_0x5db6a9===_0x19fb11;}}let _0x374b3b=_0x1a47a4[_0x2a574b(0x2da)](_0xd31f1);return _0x40dd82[_0x2a574b(0x204)]=_0x4109f2||!_0x1a47a4,!_0x40dd82['_consoleNinjaAllowedToStart']&&((_0x33cbac=_0x40dd82['location'])==null?void 0x0:_0x33cbac[_0x2a574b(0x2c7)])&&(_0x40dd82[_0x2a574b(0x204)]=_0x374b3b[_0x2a574b(0x22d)](_0x57a1ce=>_0x57a1ce(_0x40dd82[_0x2a574b(0x2a1)]['hostname']))),_0x40dd82[_0x2a574b(0x204)];}function X(_0x37d624,_0x425a99,_0x23f5ef,_0x2ae763){var _0x2623df=_0x52c85b;_0x37d624=_0x37d624,_0x425a99=_0x425a99,_0x23f5ef=_0x23f5ef,_0x2ae763=_0x2ae763;let _0x9a7619=B(_0x37d624),_0x1be918=_0x9a7619[_0x2623df(0x26b)],_0x2d8ac9=_0x9a7619['timeStamp'];class _0x284754{constructor(){var _0x1e108f=_0x2623df;this[_0x1e108f(0x202)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x1e108f(0x22e)]=/^(0|[1-9][0-9]*)$/,this[_0x1e108f(0x2b0)]=/'([^\\\\']|\\\\')*'/,this[_0x1e108f(0x270)]=_0x37d624['undefined'],this[_0x1e108f(0x245)]=_0x37d624[_0x1e108f(0x217)],this[_0x1e108f(0x24d)]=Object[_0x1e108f(0x2d5)],this['_getOwnPropertyNames']=Object[_0x1e108f(0x20c)],this['_Symbol']=_0x37d624['Symbol'],this['_regExpToString']=RegExp[_0x1e108f(0x1f7)][_0x1e108f(0x2b2)],this[_0x1e108f(0x221)]=Date[_0x1e108f(0x1f7)]['toString'];}['serialize'](_0x5df2e5,_0x28d843,_0xcb4789,_0xdcda9){var _0x157369=_0x2623df,_0x204121=this,_0x7c527c=_0xcb4789['autoExpand'];function _0x525b94(_0x476e30,_0x59becc,_0x306c45){var _0x17e488=_0x1765;_0x59becc['type']='unknown',_0x59becc[_0x17e488(0x223)]=_0x476e30[_0x17e488(0x2ce)],_0x642c19=_0x306c45['node'][_0x17e488(0x218)],_0x306c45['node'][_0x17e488(0x218)]=_0x59becc,_0x204121[_0x17e488(0x251)](_0x59becc,_0x306c45);}try{_0xcb4789[_0x157369(0x216)]++,_0xcb4789['autoExpand']&&_0xcb4789['autoExpandPreviousObjects'][_0x157369(0x258)](_0x28d843);var _0x1cc857,_0x4f181d,_0x1561f0,_0x4bd796,_0x12e234=[],_0x57be70=[],_0x538ba4,_0x937729=this[_0x157369(0x2d3)](_0x28d843),_0x7c4fbd=_0x937729==='array',_0x423502=!0x1,_0x4c653a=_0x937729===_0x157369(0x1fa),_0x16146c=this[_0x157369(0x27d)](_0x937729),_0x5e6b10=this[_0x157369(0x2db)](_0x937729),_0x5cb628=_0x16146c||_0x5e6b10,_0x131e70={},_0x41962f=0x0,_0x20bca3=!0x1,_0x642c19,_0x1bfeb1=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xcb4789[_0x157369(0x230)]){if(_0x7c4fbd){if(_0x4f181d=_0x28d843[_0x157369(0x293)],_0x4f181d>_0xcb4789['elements']){for(_0x1561f0=0x0,_0x4bd796=_0xcb4789[_0x157369(0x285)],_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121['_addProperty'](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));_0x5df2e5[_0x157369(0x237)]=!0x0;}else{for(_0x1561f0=0x0,_0x4bd796=_0x4f181d,_0x1cc857=_0x1561f0;_0x1cc857<_0x4bd796;_0x1cc857++)_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x23a)](_0x12e234,_0x28d843,_0x937729,_0x1cc857,_0xcb4789));}_0xcb4789[_0x157369(0x250)]+=_0x57be70['length'];}if(!(_0x937729===_0x157369(0x224)||_0x937729==='undefined')&&!_0x16146c&&_0x937729!=='String'&&_0x937729!==_0x157369(0x25b)&&_0x937729!=='bigint'){var _0x14ad0a=_0xdcda9['props']||_0xcb4789[_0x157369(0x269)];if(this[_0x157369(0x21c)](_0x28d843)?(_0x1cc857=0x0,_0x28d843[_0x157369(0x206)](function(_0x795ddf){var _0x15dd02=_0x157369;if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789[_0x15dd02(0x2c6)]&&_0xcb4789[_0x15dd02(0x2b1)]&&_0xcb4789[_0x15dd02(0x250)]>_0xcb4789[_0x15dd02(0x233)]){_0x20bca3=!0x0;return;}_0x57be70['push'](_0x204121[_0x15dd02(0x23a)](_0x12e234,_0x28d843,_0x15dd02(0x1fd),_0x1cc857++,_0xcb4789,function(_0x498239){return function(){return _0x498239;};}(_0x795ddf)));})):this[_0x157369(0x2aa)](_0x28d843)&&_0x28d843['forEach'](function(_0x268d65,_0x26e6f7){var _0x462487=_0x157369;if(_0x41962f++,_0xcb4789[_0x462487(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;return;}if(!_0xcb4789['isExpressionToEvaluate']&&_0xcb4789['autoExpand']&&_0xcb4789[_0x462487(0x250)]>_0xcb4789[_0x462487(0x233)]){_0x20bca3=!0x0;return;}var _0x19aed5=_0x26e6f7[_0x462487(0x2b2)]();_0x19aed5[_0x462487(0x293)]>0x64&&(_0x19aed5=_0x19aed5['slice'](0x0,0x64)+_0x462487(0x288)),_0x57be70[_0x462487(0x258)](_0x204121[_0x462487(0x23a)](_0x12e234,_0x28d843,'Map',_0x19aed5,_0xcb4789,function(_0x23ffd6){return function(){return _0x23ffd6;};}(_0x268d65)));}),!_0x423502){try{for(_0x538ba4 in _0x28d843)if(!(_0x7c4fbd&&_0x1bfeb1['test'](_0x538ba4))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)){if(_0x41962f++,_0xcb4789[_0x157369(0x250)]++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789['autoExpandLimit']){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}catch{}if(_0x131e70[_0x157369(0x262)]=!0x0,_0x4c653a&&(_0x131e70[_0x157369(0x28f)]=!0x0),!_0x20bca3){var _0x5ae1db=[][_0x157369(0x266)](this[_0x157369(0x2d1)](_0x28d843))[_0x157369(0x266)](this[_0x157369(0x2c2)](_0x28d843));for(_0x1cc857=0x0,_0x4f181d=_0x5ae1db[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)if(_0x538ba4=_0x5ae1db[_0x1cc857],!(_0x7c4fbd&&_0x1bfeb1[_0x157369(0x29f)](_0x538ba4[_0x157369(0x2b2)]()))&&!this[_0x157369(0x294)](_0x28d843,_0x538ba4,_0xcb4789)&&!_0x131e70[_0x157369(0x2b4)+_0x538ba4[_0x157369(0x2b2)]()]){if(_0x41962f++,_0xcb4789['autoExpandPropertyCount']++,_0x41962f>_0x14ad0a){_0x20bca3=!0x0;break;}if(!_0xcb4789[_0x157369(0x2c6)]&&_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x250)]>_0xcb4789[_0x157369(0x233)]){_0x20bca3=!0x0;break;}_0x57be70[_0x157369(0x258)](_0x204121[_0x157369(0x1ef)](_0x12e234,_0x131e70,_0x28d843,_0x937729,_0x538ba4,_0xcb4789));}}}}}if(_0x5df2e5[_0x157369(0x24c)]=_0x937729,_0x5cb628?(_0x5df2e5[_0x157369(0x24e)]=_0x28d843['valueOf'](),this[_0x157369(0x26d)](_0x937729,_0x5df2e5,_0xcb4789,_0xdcda9)):_0x937729==='date'?_0x5df2e5[_0x157369(0x24e)]=this[_0x157369(0x221)][_0x157369(0x241)](_0x28d843):_0x937729===_0x157369(0x232)?_0x5df2e5[_0x157369(0x24e)]=_0x28d843[_0x157369(0x2b2)]():_0x937729==='RegExp'?_0x5df2e5[_0x157369(0x24e)]=this['_regExpToString'][_0x157369(0x241)](_0x28d843):_0x937729==='symbol'&&this[_0x157369(0x2a4)]?_0x5df2e5['value']=this[_0x157369(0x2a4)][_0x157369(0x1f7)]['toString'][_0x157369(0x241)](_0x28d843):!_0xcb4789['depth']&&!(_0x937729===_0x157369(0x224)||_0x937729===_0x157369(0x2ac))&&(delete _0x5df2e5[_0x157369(0x24e)],_0x5df2e5[_0x157369(0x225)]=!0x0),_0x20bca3&&(_0x5df2e5[_0x157369(0x2c3)]=!0x0),_0x642c19=_0xcb4789[_0x157369(0x256)]['current'],_0xcb4789[_0x157369(0x256)][_0x157369(0x218)]=_0x5df2e5,this[_0x157369(0x251)](_0x5df2e5,_0xcb4789),_0x57be70[_0x157369(0x293)]){for(_0x1cc857=0x0,_0x4f181d=_0x57be70[_0x157369(0x293)];_0x1cc857<_0x4f181d;_0x1cc857++)_0x57be70[_0x1cc857](_0x1cc857);}_0x12e234['length']&&(_0x5df2e5[_0x157369(0x269)]=_0x12e234);}catch(_0x4c6312){_0x525b94(_0x4c6312,_0x5df2e5,_0xcb4789);}return this['_additionalMetadata'](_0x28d843,_0x5df2e5),this['_treeNodePropertiesAfterFullValue'](_0x5df2e5,_0xcb4789),_0xcb4789[_0x157369(0x256)]['current']=_0x642c19,_0xcb4789[_0x157369(0x216)]--,_0xcb4789[_0x157369(0x2b1)]=_0x7c527c,_0xcb4789[_0x157369(0x2b1)]&&_0xcb4789[_0x157369(0x260)][_0x157369(0x299)](),_0x5df2e5;}['_getOwnPropertySymbols'](_0x98a2ac){var _0x5699af=_0x2623df;return Object[_0x5699af(0x29e)]?Object['getOwnPropertySymbols'](_0x98a2ac):[];}[_0x2623df(0x21c)](_0x1b06f2){var _0x45deb3=_0x2623df;return!!(_0x1b06f2&&_0x37d624[_0x45deb3(0x1fd)]&&this[_0x45deb3(0x243)](_0x1b06f2)===_0x45deb3(0x259)&&_0x1b06f2[_0x45deb3(0x206)]);}[_0x2623df(0x294)](_0x2a16f8,_0x2d32bc,_0xc52e10){var _0x1da585=_0x2623df;return _0xc52e10['noFunctions']?typeof _0x2a16f8[_0x2d32bc]==_0x1da585(0x1fa):!0x1;}[_0x2623df(0x2d3)](_0x3c584c){var _0x4a2b0b=_0x2623df,_0x116724='';return _0x116724=typeof _0x3c584c,_0x116724===_0x4a2b0b(0x1ff)?this[_0x4a2b0b(0x243)](_0x3c584c)==='[object\\x20Array]'?_0x116724=_0x4a2b0b(0x2df):this['_objectToString'](_0x3c584c)===_0x4a2b0b(0x2dc)?_0x116724='date':this[_0x4a2b0b(0x243)](_0x3c584c)===_0x4a2b0b(0x2d2)?_0x116724=_0x4a2b0b(0x232):_0x3c584c===null?_0x116724=_0x4a2b0b(0x224):_0x3c584c[_0x4a2b0b(0x20d)]&&(_0x116724=_0x3c584c[_0x4a2b0b(0x20d)][_0x4a2b0b(0x261)]||_0x116724):_0x116724===_0x4a2b0b(0x2ac)&&this[_0x4a2b0b(0x245)]&&_0x3c584c instanceof this[_0x4a2b0b(0x245)]&&(_0x116724=_0x4a2b0b(0x217)),_0x116724;}[_0x2623df(0x243)](_0xc200d5){var _0x4e9e8b=_0x2623df;return Object[_0x4e9e8b(0x1f7)][_0x4e9e8b(0x2b2)]['call'](_0xc200d5);}[_0x2623df(0x27d)](_0x529a22){var _0x5c1d83=_0x2623df;return _0x529a22===_0x5c1d83(0x234)||_0x529a22===_0x5c1d83(0x28a)||_0x529a22===_0x5c1d83(0x246);}[_0x2623df(0x2db)](_0x138149){var _0x4a144e=_0x2623df;return _0x138149===_0x4a144e(0x284)||_0x138149===_0x4a144e(0x21e)||_0x138149===_0x4a144e(0x201);}[_0x2623df(0x23a)](_0x135627,_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524){var _0x2e6ca4=this;return function(_0x3cef10){var _0xcb4898=_0x1765,_0x47c646=_0x375c3c[_0xcb4898(0x256)]['current'],_0x4083d7=_0x375c3c['node']['index'],_0x5280a8=_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)];_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x47c646,_0x375c3c['node'][_0xcb4898(0x28c)]=typeof _0x11f9fb=='number'?_0x11f9fb:_0x3cef10,_0x135627[_0xcb4898(0x258)](_0x2e6ca4['_property'](_0x29b532,_0x21cfc1,_0x11f9fb,_0x375c3c,_0x438524)),_0x375c3c[_0xcb4898(0x256)][_0xcb4898(0x2ca)]=_0x5280a8,_0x375c3c[_0xcb4898(0x256)]['index']=_0x4083d7;};}[_0x2623df(0x1ef)](_0x5f50f6,_0x19f62d,_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61){var _0x1b819d=_0x2623df,_0x2f2a63=this;return _0x19f62d[_0x1b819d(0x2b4)+_0x153ede[_0x1b819d(0x2b2)]()]=!0x0,function(_0x52cd65){var _0xc2af59=_0x1b819d,_0xf1884d=_0x195a04['node'][_0xc2af59(0x218)],_0x1f5c05=_0x195a04['node'][_0xc2af59(0x28c)],_0x20b47d=_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)];_0x195a04[_0xc2af59(0x256)]['parent']=_0xf1884d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x52cd65,_0x5f50f6[_0xc2af59(0x258)](_0x2f2a63[_0xc2af59(0x207)](_0x22009e,_0x1ee267,_0x153ede,_0x195a04,_0x145f61)),_0x195a04[_0xc2af59(0x256)][_0xc2af59(0x2ca)]=_0x20b47d,_0x195a04['node'][_0xc2af59(0x28c)]=_0x1f5c05;};}['_property'](_0x29f600,_0x5a186a,_0x18094d,_0x4c36b3,_0x5d29b6){var _0x855d23=_0x2623df,_0x537e61=this;_0x5d29b6||(_0x5d29b6=function(_0x534676,_0x2f0f3c){return _0x534676[_0x2f0f3c];});var _0x3dad2b=_0x18094d['toString'](),_0x196ba1=_0x4c36b3[_0x855d23(0x2c8)]||{},_0x3e68f2=_0x4c36b3['depth'],_0x4ae156=_0x4c36b3[_0x855d23(0x2c6)];try{var _0x46f2e7=this[_0x855d23(0x2aa)](_0x29f600),_0x21c63a=_0x3dad2b;_0x46f2e7&&_0x21c63a[0x0]==='\\x27'&&(_0x21c63a=_0x21c63a['substr'](0x1,_0x21c63a[_0x855d23(0x293)]-0x2));var _0x51b35c=_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1['_p_'+_0x21c63a];_0x51b35c&&(_0x4c36b3[_0x855d23(0x230)]=_0x4c36b3[_0x855d23(0x230)]+0x1),_0x4c36b3['isExpressionToEvaluate']=!!_0x51b35c;var _0x4102a5=typeof _0x18094d==_0x855d23(0x28e),_0x10aa24={'name':_0x4102a5||_0x46f2e7?_0x3dad2b:this[_0x855d23(0x1f6)](_0x3dad2b)};if(_0x4102a5&&(_0x10aa24['symbol']=!0x0),!(_0x5a186a===_0x855d23(0x2df)||_0x5a186a==='Error')){var _0x4f0a95=this['_getOwnPropertyDescriptor'](_0x29f600,_0x18094d);if(_0x4f0a95&&(_0x4f0a95[_0x855d23(0x2be)]&&(_0x10aa24['setter']=!0x0),_0x4f0a95['get']&&!_0x51b35c&&!_0x4c36b3[_0x855d23(0x26e)]))return _0x10aa24[_0x855d23(0x2a8)]=!0x0,this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x8e1bdc;try{_0x8e1bdc=_0x5d29b6(_0x29f600,_0x18094d);}catch(_0x343ade){return _0x10aa24={'name':_0x3dad2b,'type':_0x855d23(0x27e),'error':_0x343ade[_0x855d23(0x2ce)]},this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3),_0x10aa24;}var _0x4c95a3=this[_0x855d23(0x2d3)](_0x8e1bdc),_0x39d7f9=this[_0x855d23(0x27d)](_0x4c95a3);if(_0x10aa24[_0x855d23(0x24c)]=_0x4c95a3,_0x39d7f9)this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x294840=_0x855d23;_0x10aa24['value']=_0x8e1bdc[_0x294840(0x1f2)](),!_0x51b35c&&_0x537e61['_capIfString'](_0x4c95a3,_0x10aa24,_0x4c36b3,{});});else{var _0x308b70=_0x4c36b3[_0x855d23(0x2b1)]&&_0x4c36b3[_0x855d23(0x216)]<_0x4c36b3[_0x855d23(0x240)]&&_0x4c36b3['autoExpandPreviousObjects'][_0x855d23(0x2a0)](_0x8e1bdc)<0x0&&_0x4c95a3!==_0x855d23(0x1fa)&&_0x4c36b3[_0x855d23(0x250)]<_0x4c36b3[_0x855d23(0x233)];_0x308b70||_0x4c36b3['level']<_0x3e68f2||_0x51b35c?(this[_0x855d23(0x20a)](_0x10aa24,_0x8e1bdc,_0x4c36b3,_0x51b35c||{}),this[_0x855d23(0x213)](_0x8e1bdc,_0x10aa24)):this[_0x855d23(0x248)](_0x10aa24,_0x4c36b3,_0x8e1bdc,function(){var _0x40e642=_0x855d23;_0x4c95a3===_0x40e642(0x224)||_0x4c95a3===_0x40e642(0x2ac)||(delete _0x10aa24[_0x40e642(0x24e)],_0x10aa24[_0x40e642(0x225)]=!0x0);});}return _0x10aa24;}finally{_0x4c36b3[_0x855d23(0x2c8)]=_0x196ba1,_0x4c36b3[_0x855d23(0x230)]=_0x3e68f2,_0x4c36b3[_0x855d23(0x2c6)]=_0x4ae156;}}[_0x2623df(0x26d)](_0x2f7d2a,_0x3e2111,_0x4f06a4,_0x165e3c){var _0x1a3fe5=_0x2623df,_0x4cb626=_0x165e3c[_0x1a3fe5(0x2c4)]||_0x4f06a4[_0x1a3fe5(0x2c4)];if((_0x2f7d2a===_0x1a3fe5(0x28a)||_0x2f7d2a==='String')&&_0x3e2111['value']){let _0x39d5f7=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x293)];_0x4f06a4['allStrLength']+=_0x39d5f7,_0x4f06a4[_0x1a3fe5(0x214)]>_0x4f06a4[_0x1a3fe5(0x2c9)]?(_0x3e2111[_0x1a3fe5(0x225)]='',delete _0x3e2111['value']):_0x39d5f7>_0x4cb626&&(_0x3e2111['capped']=_0x3e2111[_0x1a3fe5(0x24e)][_0x1a3fe5(0x219)](0x0,_0x4cb626),delete _0x3e2111[_0x1a3fe5(0x24e)]);}}['_isMap'](_0x34931b){var _0x3272ed=_0x2623df;return!!(_0x34931b&&_0x37d624[_0x3272ed(0x247)]&&this[_0x3272ed(0x243)](_0x34931b)===_0x3272ed(0x2d4)&&_0x34931b['forEach']);}[_0x2623df(0x1f6)](_0x47a998){var _0x54c731=_0x2623df;if(_0x47a998[_0x54c731(0x263)](/^\\d+$/))return _0x47a998;var _0x13c78f;try{_0x13c78f=JSON['stringify'](''+_0x47a998);}catch{_0x13c78f='\\x22'+this[_0x54c731(0x243)](_0x47a998)+'\\x22';}return _0x13c78f[_0x54c731(0x263)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x13c78f=_0x13c78f['substr'](0x1,_0x13c78f['length']-0x2):_0x13c78f=_0x13c78f['replace'](/'/g,'\\x5c\\x27')[_0x54c731(0x278)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x13c78f;}[_0x2623df(0x248)](_0x450bd2,_0x540e99,_0x3a738d,_0x1d5e7b){var _0xbf57c1=_0x2623df;this[_0xbf57c1(0x251)](_0x450bd2,_0x540e99),_0x1d5e7b&&_0x1d5e7b(),this[_0xbf57c1(0x213)](_0x3a738d,_0x450bd2),this[_0xbf57c1(0x2b5)](_0x450bd2,_0x540e99);}['_treeNodePropertiesBeforeFullValue'](_0x288bd4,_0x443233){var _0x15c053=_0x2623df;this[_0x15c053(0x2ab)](_0x288bd4,_0x443233),this[_0x15c053(0x22b)](_0x288bd4,_0x443233),this['_setNodeExpressionPath'](_0x288bd4,_0x443233),this[_0x15c053(0x275)](_0x288bd4,_0x443233);}[_0x2623df(0x2ab)](_0x33355c,_0x4c1413){}['_setNodeQueryPath'](_0x5e28c0,_0x37c1ca){}['_setNodeLabel'](_0xee885f,_0x115998){}[_0x2623df(0x235)](_0x55a938){var _0x1aa6f4=_0x2623df;return _0x55a938===this[_0x1aa6f4(0x270)];}['_treeNodePropertiesAfterFullValue'](_0x10edfb,_0x29f29a){var _0x206d02=_0x2623df;this[_0x206d02(0x1ed)](_0x10edfb,_0x29f29a),this['_setNodeExpandableState'](_0x10edfb),_0x29f29a['sortProps']&&this[_0x206d02(0x2cb)](_0x10edfb),this[_0x206d02(0x29c)](_0x10edfb,_0x29f29a),this[_0x206d02(0x236)](_0x10edfb,_0x29f29a),this[_0x206d02(0x209)](_0x10edfb);}[_0x2623df(0x213)](_0x2ae38c,_0x6a4e65){var _0x3180df=_0x2623df;let _0x39ab34;try{_0x37d624[_0x3180df(0x23c)]&&(_0x39ab34=_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)],_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=function(){}),_0x2ae38c&&typeof _0x2ae38c[_0x3180df(0x293)]==_0x3180df(0x246)&&(_0x6a4e65[_0x3180df(0x293)]=_0x2ae38c[_0x3180df(0x293)]);}catch{}finally{_0x39ab34&&(_0x37d624[_0x3180df(0x23c)][_0x3180df(0x223)]=_0x39ab34);}if(_0x6a4e65[_0x3180df(0x24c)]==='number'||_0x6a4e65[_0x3180df(0x24c)]==='Number'){if(isNaN(_0x6a4e65['value']))_0x6a4e65[_0x3180df(0x2bc)]=!0x0,delete _0x6a4e65['value'];else switch(_0x6a4e65[_0x3180df(0x24e)]){case Number[_0x3180df(0x23d)]:_0x6a4e65[_0x3180df(0x2dd)]=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case Number['NEGATIVE_INFINITY']:_0x6a4e65['negativeInfinity']=!0x0,delete _0x6a4e65[_0x3180df(0x24e)];break;case 0x0:this['_isNegativeZero'](_0x6a4e65[_0x3180df(0x24e)])&&(_0x6a4e65[_0x3180df(0x1fb)]=!0x0);break;}}else _0x6a4e65[_0x3180df(0x24c)]===_0x3180df(0x1fa)&&typeof _0x2ae38c[_0x3180df(0x261)]==_0x3180df(0x28a)&&_0x2ae38c[_0x3180df(0x261)]&&_0x6a4e65[_0x3180df(0x261)]&&_0x2ae38c[_0x3180df(0x261)]!==_0x6a4e65[_0x3180df(0x261)]&&(_0x6a4e65[_0x3180df(0x21b)]=_0x2ae38c[_0x3180df(0x261)]);}['_isNegativeZero'](_0x2fa98d){var _0x8c6a89=_0x2623df;return 0x1/_0x2fa98d===Number[_0x8c6a89(0x289)];}[_0x2623df(0x2cb)](_0x45f240){var _0x27ea15=_0x2623df;!_0x45f240[_0x27ea15(0x269)]||!_0x45f240['props'][_0x27ea15(0x293)]||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x2df)||_0x45f240[_0x27ea15(0x24c)]==='Map'||_0x45f240[_0x27ea15(0x24c)]===_0x27ea15(0x1fd)||_0x45f240[_0x27ea15(0x269)][_0x27ea15(0x296)](function(_0x587f85,_0x25310e){var _0x27429f=_0x27ea15,_0x22eb8f=_0x587f85['name'][_0x27429f(0x2a7)](),_0x9f76b=_0x25310e[_0x27429f(0x261)][_0x27429f(0x2a7)]();return _0x22eb8f<_0x9f76b?-0x1:_0x22eb8f>_0x9f76b?0x1:0x0;});}[_0x2623df(0x29c)](_0x6aec3b,_0x4e7839){var _0x5e1614=_0x2623df;if(!(_0x4e7839[_0x5e1614(0x1f0)]||!_0x6aec3b[_0x5e1614(0x269)]||!_0x6aec3b['props'][_0x5e1614(0x293)])){for(var _0x4ae259=[],_0x2bc8c5=[],_0x2c5219=0x0,_0x4f1485=_0x6aec3b[_0x5e1614(0x269)]['length'];_0x2c5219<_0x4f1485;_0x2c5219++){var _0x29e8fa=_0x6aec3b[_0x5e1614(0x269)][_0x2c5219];_0x29e8fa['type']===_0x5e1614(0x1fa)?_0x4ae259[_0x5e1614(0x258)](_0x29e8fa):_0x2bc8c5[_0x5e1614(0x258)](_0x29e8fa);}if(!(!_0x2bc8c5[_0x5e1614(0x293)]||_0x4ae259[_0x5e1614(0x293)]<=0x1)){_0x6aec3b[_0x5e1614(0x269)]=_0x2bc8c5;var _0x28eeff={'functionsNode':!0x0,'props':_0x4ae259};this['_setNodeId'](_0x28eeff,_0x4e7839),this[_0x5e1614(0x1ed)](_0x28eeff,_0x4e7839),this[_0x5e1614(0x229)](_0x28eeff),this[_0x5e1614(0x275)](_0x28eeff,_0x4e7839),_0x28eeff['id']+='\\x20f',_0x6aec3b['props']['unshift'](_0x28eeff);}}}[_0x2623df(0x236)](_0x8d09ca,_0x48c45f){}['_setNodeExpandableState'](_0x2c3113){}['_isArray'](_0x4d0b46){var _0x540da5=_0x2623df;return Array['isArray'](_0x4d0b46)||typeof _0x4d0b46==_0x540da5(0x1ff)&&this[_0x540da5(0x243)](_0x4d0b46)===_0x540da5(0x1fc);}['_setNodePermissions'](_0x51ec7c,_0x53542f){}[_0x2623df(0x209)](_0x47913e){var _0x503d84=_0x2623df;delete _0x47913e['_hasSymbolPropertyOnItsPath'],delete _0x47913e['_hasSetOnItsPath'],delete _0x47913e[_0x503d84(0x257)];}[_0x2623df(0x290)](_0x3e77fb,_0x7533ff){}}let _0x31638a=new _0x284754(),_0xdce57e={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x43e197={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x6a9287(_0x531b46,_0x4bc71a,_0x197aa8,_0x42857c,_0x5321fe,_0x10f17e){var _0x471a36=_0x2623df;let _0x101e55,_0x1a2226;try{_0x1a2226=_0x2d8ac9(),_0x101e55=_0x23f5ef[_0x4bc71a],!_0x101e55||_0x1a2226-_0x101e55['ts']>0x1f4&&_0x101e55[_0x471a36(0x227)]&&_0x101e55[_0x471a36(0x27a)]/_0x101e55[_0x471a36(0x227)]<0x64?(_0x23f5ef[_0x4bc71a]=_0x101e55={'count':0x0,'time':0x0,'ts':_0x1a2226},_0x23f5ef[_0x471a36(0x2c0)]={}):_0x1a2226-_0x23f5ef[_0x471a36(0x2c0)]['ts']>0x32&&_0x23f5ef[_0x471a36(0x2c0)]['count']&&_0x23f5ef['hits'][_0x471a36(0x27a)]/_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]<0x64&&(_0x23f5ef['hits']={});let _0x11e3f6=[],_0x5697d2=_0x101e55['reduceLimits']||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x22a)]?_0x43e197:_0xdce57e,_0x405b05=_0x3da01f=>{var _0x3c6546=_0x471a36;let _0x26cba4={};return _0x26cba4['props']=_0x3da01f[_0x3c6546(0x269)],_0x26cba4[_0x3c6546(0x285)]=_0x3da01f[_0x3c6546(0x285)],_0x26cba4[_0x3c6546(0x2c4)]=_0x3da01f[_0x3c6546(0x2c4)],_0x26cba4[_0x3c6546(0x2c9)]=_0x3da01f['totalStrLength'],_0x26cba4[_0x3c6546(0x233)]=_0x3da01f[_0x3c6546(0x233)],_0x26cba4[_0x3c6546(0x240)]=_0x3da01f[_0x3c6546(0x240)],_0x26cba4['sortProps']=!0x1,_0x26cba4[_0x3c6546(0x1f0)]=!_0x425a99,_0x26cba4[_0x3c6546(0x230)]=0x1,_0x26cba4[_0x3c6546(0x216)]=0x0,_0x26cba4[_0x3c6546(0x238)]='root_exp_id',_0x26cba4[_0x3c6546(0x1ec)]=_0x3c6546(0x283),_0x26cba4[_0x3c6546(0x2b1)]=!0x0,_0x26cba4[_0x3c6546(0x260)]=[],_0x26cba4[_0x3c6546(0x250)]=0x0,_0x26cba4[_0x3c6546(0x26e)]=!0x0,_0x26cba4[_0x3c6546(0x214)]=0x0,_0x26cba4['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x26cba4;};for(var _0x23e276=0x0;_0x23e276<_0x5321fe[_0x471a36(0x293)];_0x23e276++)_0x11e3f6[_0x471a36(0x258)](_0x31638a[_0x471a36(0x20a)]({'timeNode':_0x531b46===_0x471a36(0x27a)||void 0x0},_0x5321fe[_0x23e276],_0x405b05(_0x5697d2),{}));if(_0x531b46==='trace'||_0x531b46===_0x471a36(0x223)){let _0x56cb28=Error['stackTraceLimit'];try{Error[_0x471a36(0x281)]=0x1/0x0,_0x11e3f6['push'](_0x31638a[_0x471a36(0x20a)]({'stackNode':!0x0},new Error()[_0x471a36(0x1f3)],_0x405b05(_0x5697d2),{'strLength':0x1/0x0}));}finally{Error[_0x471a36(0x281)]=_0x56cb28;}}return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':_0x11e3f6,'id':_0x4bc71a,'context':_0x10f17e}]};}catch(_0x141361){return{'method':_0x471a36(0x242),'version':_0x2ae763,'args':[{'ts':_0x197aa8,'session':_0x42857c,'args':[{'type':'unknown','error':_0x141361&&_0x141361[_0x471a36(0x2ce)]}],'id':_0x4bc71a,'context':_0x10f17e}]};}finally{try{if(_0x101e55&&_0x1a2226){let _0x53d3d0=_0x2d8ac9();_0x101e55['count']++,_0x101e55[_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x101e55['ts']=_0x53d3d0,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x227)]++,_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]+=_0x1be918(_0x1a2226,_0x53d3d0),_0x23f5ef[_0x471a36(0x2c0)]['ts']=_0x53d3d0,(_0x101e55['count']>0x32||_0x101e55['time']>0x64)&&(_0x101e55[_0x471a36(0x22a)]=!0x0),(_0x23f5ef['hits'][_0x471a36(0x227)]>0x3e8||_0x23f5ef[_0x471a36(0x2c0)][_0x471a36(0x27a)]>0x12c)&&(_0x23f5ef['hits'][_0x471a36(0x22a)]=!0x0);}}catch{}}}return _0x6a9287;}((_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x598d24,_0x5d532f,_0x146311,_0x5c841c,_0x435457,_0x4af095)=>{var _0x178280=_0x52c85b;if(_0x5c57ad[_0x178280(0x273)])return _0x5c57ad[_0x178280(0x273)];if(!H(_0x5c57ad,_0x146311,_0x3deb3c))return _0x5c57ad[_0x178280(0x273)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5c57ad['_console_ninja'];let _0x348138=B(_0x5c57ad),_0x4526fb=_0x348138[_0x178280(0x26b)],_0x4d4ffb=_0x348138[_0x178280(0x282)],_0x383918=_0x348138[_0x178280(0x2cc)],_0x42c1e2={'hits':{},'ts':{}},_0x5f1ccb=X(_0x5c57ad,_0x5c841c,_0x42c1e2,_0x598d24),_0xd940d5=_0x4e24ec=>{_0x42c1e2['ts'][_0x4e24ec]=_0x4d4ffb();},_0xea84f2=(_0x1e4f3c,_0x4cf578)=>{var _0x1bcce6=_0x178280;let _0x930c06=_0x42c1e2['ts'][_0x4cf578];if(delete _0x42c1e2['ts'][_0x4cf578],_0x930c06){let _0x1303d4=_0x4526fb(_0x930c06,_0x4d4ffb());_0xde4346(_0x5f1ccb(_0x1bcce6(0x27a),_0x1e4f3c,_0x383918(),_0x42be99,[_0x1303d4],_0x4cf578));}},_0x4f0396=_0x430740=>{var _0x16daef=_0x178280,_0x326829;return _0x3deb3c===_0x16daef(0x22f)&&_0x5c57ad[_0x16daef(0x2bf)]&&((_0x326829=_0x430740==null?void 0x0:_0x430740[_0x16daef(0x264)])==null?void 0x0:_0x326829[_0x16daef(0x293)])&&(_0x430740[_0x16daef(0x264)][0x0]['origin']=_0x5c57ad[_0x16daef(0x2bf)]),_0x430740;};_0x5c57ad['_console_ninja']={'consoleLog':(_0x389383,_0x33070f)=>{var _0xcc2784=_0x178280;_0x5c57ad[_0xcc2784(0x23c)]['log']['name']!=='disabledLog'&&_0xde4346(_0x5f1ccb(_0xcc2784(0x242),_0x389383,_0x383918(),_0x42be99,_0x33070f));},'consoleTrace':(_0x5a7462,_0x4ad9a0)=>{var _0x34222f=_0x178280,_0x4e5f09,_0x38cb70;_0x5c57ad['console']['log'][_0x34222f(0x261)]!==_0x34222f(0x286)&&((_0x38cb70=(_0x4e5f09=_0x5c57ad['process'])==null?void 0x0:_0x4e5f09[_0x34222f(0x249)])!=null&&_0x38cb70[_0x34222f(0x256)]&&(_0x5c57ad['_ninjaIgnoreNextError']=!0x0),_0xde4346(_0x4f0396(_0x5f1ccb(_0x34222f(0x239),_0x5a7462,_0x383918(),_0x42be99,_0x4ad9a0))));},'consoleError':(_0x56c660,_0x124401)=>{var _0x5a4dbf=_0x178280;_0x5c57ad[_0x5a4dbf(0x267)]=!0x0,_0xde4346(_0x4f0396(_0x5f1ccb(_0x5a4dbf(0x223),_0x56c660,_0x383918(),_0x42be99,_0x124401)));},'consoleTime':_0x2b72bf=>{_0xd940d5(_0x2b72bf);},'consoleTimeEnd':(_0xf42d7f,_0x231d2e)=>{_0xea84f2(_0x231d2e,_0xf42d7f);},'autoLog':(_0x34fc42,_0x1593ab)=>{_0xde4346(_0x5f1ccb('log',_0x1593ab,_0x383918(),_0x42be99,[_0x34fc42]));},'autoLogMany':(_0x1161f8,_0x1f890f)=>{var _0x432033=_0x178280;_0xde4346(_0x5f1ccb(_0x432033(0x242),_0x1161f8,_0x383918(),_0x42be99,_0x1f890f));},'autoTrace':(_0x1abd02,_0x1a1339)=>{var _0x23dceb=_0x178280;_0xde4346(_0x4f0396(_0x5f1ccb(_0x23dceb(0x239),_0x1a1339,_0x383918(),_0x42be99,[_0x1abd02])));},'autoTraceMany':(_0x5662b6,_0x1b0d24)=>{_0xde4346(_0x4f0396(_0x5f1ccb('trace',_0x5662b6,_0x383918(),_0x42be99,_0x1b0d24)));},'autoTime':(_0x4a4e0b,_0x1660f1,_0xecbc72)=>{_0xd940d5(_0xecbc72);},'autoTimeEnd':(_0x391986,_0x4e8b70,_0x41f58e)=>{_0xea84f2(_0x4e8b70,_0x41f58e);},'coverage':_0x5ae8d0=>{var _0x294a69=_0x178280;_0xde4346({'method':_0x294a69(0x203),'version':_0x598d24,'args':[{'id':_0x5ae8d0}]});}};let _0xde4346=q(_0x5c57ad,_0x1873d7,_0x288199,_0xbac8a7,_0x3deb3c,_0x435457,_0x4af095),_0x42be99=_0x5c57ad[_0x178280(0x29d)];return _0x5c57ad[_0x178280(0x273)];})(globalThis,_0x52c85b(0x28b),_0x52c85b(0x28d),_0x52c85b(0x27b),_0x52c85b(0x2b8),'1.0.0',_0x52c85b(0x212),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ngels-MacBook-Pro.local\",\"127.0.2.2\",\"127.0.2.3\",\"192.168.15.52\",\"172.16.0.2\"],_0x52c85b(0x265),_0x52c85b(0x24f),'1');");
}
catch (e) { } }
; /* istanbul ignore next */
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo; /* istanbul ignore next */
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr; /* istanbul ignore next */
function oo_tx(i, ...v) { try {
    oo_cm().consoleError(i, v);
}
catch (e) { } return v; }
;
oo_tx; /* istanbul ignore next */
function oo_ts(v) { try {
    oo_cm().consoleTime(v);
}
catch (e) { } return v; }
;
oo_ts; /* istanbul ignore next */
function oo_te(v, i) { try {
    oo_cm().consoleTimeEnd(v, i);
}
catch (e) { } return v; }
;
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autocompleteCommand = void 0;
const vscode_1 = __importDefault(__webpack_require__(1));
const config_1 = __webpack_require__(32);
const ollamaConstant_1 = __webpack_require__(10);
let { numPredict } = __webpack_require__(32);
numPredict = parseInt(numPredict);
const axios_1 = __importDefault(__webpack_require__(36));
const MessageHeaderSub_1 = __webpack_require__(74);
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


/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Axios v1.7.2 Copyright (c) 2024 Matt Zabriskie and contributors


const FormData$1 = __webpack_require__(37);
const url = __webpack_require__(43);
const proxyFromEnv = __webpack_require__(58);
const http = __webpack_require__(13);
const https = __webpack_require__(42);
const util = __webpack_require__(39);
const followRedirects = __webpack_require__(59);
const zlib = __webpack_require__(72);
const stream = __webpack_require__(40);
const events = __webpack_require__(73);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const FormData__default = /*#__PURE__*/_interopDefaultLegacy(FormData$1);
const url__default = /*#__PURE__*/_interopDefaultLegacy(url);
const http__default = /*#__PURE__*/_interopDefaultLegacy(http);
const https__default = /*#__PURE__*/_interopDefaultLegacy(https);
const util__default = /*#__PURE__*/_interopDefaultLegacy(util);
const followRedirects__default = /*#__PURE__*/_interopDefaultLegacy(followRedirects);
const zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
const stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData__default["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

const InterceptorManager$1 = InterceptorManager;

const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

const URLSearchParams = url__default["default"].URLSearchParams;

const platform$1 = {
  isNode: true,
  classes: {
    URLSearchParams,
    FormData: FormData__default["default"],
    Blob: typeof Blob !== 'undefined' && Blob || null
  },
  protocols: [ 'http', 'https', 'file', 'data' ]
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = (
  (product) => {
    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
  })(typeof navigator !== 'undefined' && navigator.product);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

const utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  origin: origin
});

const platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

const defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
const parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

const AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const VERSION = "1.7.2";

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || platform.classes.Blob;
  const protocol = parseProtocol(uri);

  if (asBlob === undefined && _Blob) {
    asBlob = true;
  }

  if (protocol === 'data') {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

    const match = DATA_URL_PATTERN.exec(uri);

    if (!match) {
      throw new AxiosError('Invalid URL', AxiosError.ERR_INVALID_URL);
    }

    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError('Blob is not supported', AxiosError.ERR_NOT_SUPPORT);
      }

      return new _Blob([buffer], {type: mime});
    }

    return buffer;
  }

  throw new AxiosError('Unsupported protocol ' + protocol, AxiosError.ERR_NOT_SUPPORT);
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1000 / freq;
  let timer = null;
  return function throttled() {
    const force = this === true;

    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, arguments);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, arguments);
      }, threshold - (now - timestamp));
    }
  };
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

const kInternals = Symbol('internals');

class AxiosTransformStream extends stream__default["default"].Transform{
  constructor(options) {
    options = utils$1.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils$1.isUndefined(source[prop]);
    });

    super({
      readableHighWaterMark: options.chunkSize
    });

    const self = this;

    const internals = this[kInternals] = {
      length: options.length,
      timeWindow: options.timeWindow,
      ticksRate: options.ticksRate,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };

    const _speedometer = speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);

    this.on('newListener', event => {
      if (event === 'progress') {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });

    let bytesNotified = 0;

    internals.updateProgress = throttle(function throttledHandler() {
      const totalBytes = internals.length;
      const bytesTransferred = internals.bytesSeen;
      const progressBytes = bytesTransferred - bytesNotified;
      if (!progressBytes || self.destroyed) return;

      const rate = _speedometer(progressBytes);

      bytesNotified = bytesTransferred;

      process.nextTick(() => {
        self.emit('progress', {
          loaded: bytesTransferred,
          total: totalBytes,
          progress: totalBytes ? (bytesTransferred / totalBytes) : undefined,
          bytes: progressBytes,
          rate: rate ? rate : undefined,
          estimated: rate && totalBytes && bytesTransferred <= totalBytes ?
            (totalBytes - bytesTransferred) / rate : undefined,
          lengthComputable: totalBytes != null
        });
      });
    }, internals.ticksRate);

    const onFinish = () => {
      internals.updateProgress.call(true);
    };

    this.once('end', onFinish);
    this.once('error', onFinish);
  }

  _read(size) {
    const internals = this[kInternals];

    if (internals.onReadCallback) {
      internals.onReadCallback();
    }

    return super._read(size);
  }

  _transform(chunk, encoding, callback) {
    const self = this;
    const internals = this[kInternals];
    const maxRate = internals.maxRate;

    const readableHighWaterMark = this.readableHighWaterMark;

    const timeWindow = internals.timeWindow;

    const divider = 1000 / timeWindow;
    const bytesThreshold = (maxRate / divider);
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

    function pushChunk(_chunk, _callback) {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;

      if (internals.isCaptured) {
        internals.updateProgress();
      }

      if (self.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    }

    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;

      if (maxRate) {
        const now = Date.now();

        if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }

        bytesLeft = bytesThreshold - internals.bytes;
      }

      if (maxRate) {
        if (bytesLeft <= 0) {
          // next time window
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }

        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }

      if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }

      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };

    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }

      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }

  setLength(length) {
    this[kInternals].length = +length;
    return this;
  }
}

const AxiosTransformStream$1 = AxiosTransformStream;

const {asyncIterator} = Symbol;

const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};

const readBlob$1 = readBlob;

const BOUNDARY_ALPHABET = utils$1.ALPHABET.ALPHA_DIGIT + '-_';

const textEncoder = new util.TextEncoder();

const CRLF = '\r\n';
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;

class FormDataPart {
  constructor(name, value) {
    const {escapeName} = this.constructor;
    const isStringValue = utils$1.isString(value);

    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }

    this.headers = textEncoder.encode(headers + CRLF);

    this.contentLength = isStringValue ? value.byteLength : value.size;

    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

    this.name = name;
    this.value = value;
  }

  async *encode(){
    yield this.headers;

    const {value} = this;

    if(utils$1.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob$1(value);
    }

    yield CRLF_BYTES;
  }

  static escapeName(name) {
      return String(name).replace(/[\r\n"]/g, (match) => ({
        '\r' : '%0D',
        '\n' : '%0A',
        '"' : '%22',
      }[match]));
  }
}

const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = 'form-data-boundary',
    size = 25,
    boundary = tag + '-' + utils$1.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};

  if(!utils$1.isFormData(form)) {
    throw TypeError('FormData instance required');
  }

  if (boundary.length < 1 || boundary.length > 70) {
    throw Error('boundary must be 10-70 characters long')
  }

  const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
  const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;

  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });

  contentLength += boundaryBytes.byteLength * parts.length;

  contentLength = utils$1.toFiniteNumber(contentLength);

  const computedHeaders = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`
  };

  if (Number.isFinite(contentLength)) {
    computedHeaders['Content-Length'] = contentLength;
  }

  headersHandler && headersHandler(computedHeaders);

  return stream.Readable.from((async function *() {
    for(const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }

    yield footerBytes;
  })());
};

const formDataToStream$1 = formDataToStream;

class ZlibHeaderTransformStream extends stream__default["default"].Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;

      // Add Default Compression headers if no zlib headers are present
      if (chunk[0] !== 120) { // Hex: 78
        const header = Buffer.alloc(2);
        header[0] = 120; // Hex: 78
        header[1] = 156; // Hex: 9C 
        this.push(header, encoding);
      }
    }

    this.__transform(chunk, encoding, callback);
  }
}

const ZlibHeaderTransformStream$1 = ZlibHeaderTransformStream;

const callbackify = (fn, reducer) => {
  return utils$1.isAsyncFn(fn) ? function (...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};

const callbackify$1 = callbackify;

const zlibOptions = {
  flush: zlib__default["default"].constants.Z_SYNC_FLUSH,
  finishFlush: zlib__default["default"].constants.Z_SYNC_FLUSH
};

const brotliOptions = {
  flush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH
};

const isBrotliSupported = utils$1.isFunction(zlib__default["default"].createBrotliDecompress);

const {http: httpFollow, https: httpsFollow} = followRedirects__default["default"];

const isHttps = /https:?/;

const supportedProtocols = platform.protocols.map(protocol => {
  return protocol + ':';
});

/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}

/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = proxyFromEnv.getProxyForUrl(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    // Basic proxy authorization
    if (proxy.username) {
      proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
    }

    if (proxy.auth) {
      // Support proxy auth object form
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
      }
      const base64 = Buffer
        .from(proxy.auth, 'utf8')
        .toString('base64');
      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    // Replace 'host' since options is not a URL object
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
    }
  }

  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    // Configure proxy for redirected request, passing the original config proxy to apply
    // the exact same logic as if the redirected request was performed by axios directly.
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}

const isHttpAdapterSupported = typeof process !== 'undefined' && utils$1.kindOf(process) === 'process';

// temporary hotfix

const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;

    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };

    const _resolve = (value) => {
      done(value);
      resolve(value);
    };

    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };

    asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
  })
};

const resolveFamily = ({address, family}) => {
  if (!utils$1.isString(address)) {
    throw TypeError('address must be a string');
  }
  return ({
    address,
    family: family || (address.indexOf('.') < 0 ? 6 : 4)
  });
};

const buildAddressEntry = (address, family) => resolveFamily(utils$1.isObject(address) ? address : {address, family});

/*eslint consistent-return:0*/
const httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let {data, lookup, family} = config;
    const {responseType, responseEncoding} = config;
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;

    if (lookup) {
      const _lookup = callbackify$1(lookup, (value) => utils$1.isArray(value) ? value : [value]);
      // hotfix to support opt.all option which is required for node 20.x
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }

          const addresses = utils$1.isArray(arg0) ? arg0.map(addr => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];

          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }

    // temporary internal emitter until the AxiosRequest class will be implemented
    const emitter = new events.EventEmitter();

    const onFinished = () => {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', abort);
      }

      emitter.removeAllListeners();
    };

    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });

    function abort(reason) {
      emitter.emit('abort', !reason || reason.type ? new CanceledError(null, config, req) : reason);
    }

    emitter.once('abort', reject);

    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort);
      if (config.signal) {
        config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
      }
    }

    // Parse url
    const fullPath = buildFullPath(config.baseURL, config.url);
    const parsed = new URL(fullPath, 'http://localhost');
    const protocol = parsed.protocol || supportedProtocols[0];

    if (protocol === 'data:') {
      let convertedData;

      if (method !== 'GET') {
        return settle(resolve, reject, {
          status: 405,
          statusText: 'method not allowed',
          headers: {},
          config
        });
      }

      try {
        convertedData = fromDataURI(config.url, responseType === 'blob', {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
      }

      if (responseType === 'text') {
        convertedData = convertedData.toString(responseEncoding);

        if (!responseEncoding || responseEncoding === 'utf8') {
          convertedData = utils$1.stripBOM(convertedData);
        }
      } else if (responseType === 'stream') {
        convertedData = stream__default["default"].Readable.from(convertedData);
      }

      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders$1(),
        config
      });
    }

    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError(
        'Unsupported protocol ' + protocol,
        AxiosError.ERR_BAD_REQUEST,
        config
      ));
    }

    const headers = AxiosHeaders$1.from(config.headers).normalize();

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    // User-Agent is specified; handle case where no UA header is desired
    // Only set header if it hasn't been set in config
    headers.set('User-Agent', 'axios/' + VERSION, false);

    const onDownloadProgress = config.onDownloadProgress;
    const onUploadProgress = config.onUploadProgress;
    const maxRate = config.maxRate;
    let maxUploadRate = undefined;
    let maxDownloadRate = undefined;

    // support for spec compliant FormData objects
    if (utils$1.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

      data = formDataToStream$1(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || undefined
      });
      // support for https://www.npmjs.com/package/form-data api
    } else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());

      if (!headers.hasContentLength()) {
        try {
          const knownLength = await util__default["default"].promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
          /*eslint no-empty:0*/
        } catch (e) {
        }
      }
    } else if (utils$1.isBlob(data)) {
      data.size && headers.setContentType(data.type || 'application/octet-stream');
      headers.setContentLength(data.size || 0);
      data = stream__default["default"].Readable.from(readBlob$1(data));
    } else if (data && !utils$1.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils$1.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$1.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(new AxiosError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      // Add Content-Length header if data exists
      headers.setContentLength(data.length, false);

      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(new AxiosError(
          'Request body larger than maxBodyLength limit',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }
    }

    const contentLength = utils$1.toFiniteNumber(headers.getContentLength());

    if (utils$1.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }

    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils$1.isStream(data)) {
        data = stream__default["default"].Readable.from(data, {objectMode: false});
      }

      data = stream__default["default"].pipeline([data, new AxiosTransformStream$1({
        length: contentLength,
        maxRate: utils$1.toFiniteNumber(maxUploadRate)
      })], utils$1.noop);

      onUploadProgress && data.on('progress', progress => {
        onUploadProgress(Object.assign(progress, {
          upload: true
        }));
      });
    }

    // HTTP basic authentication
    let auth = undefined;
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password || '';
      auth = username + ':' + password;
    }

    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ':' + urlPassword;
    }

    auth && headers.delete('authorization');

    let path;

    try {
      path = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, '');
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }

    headers.set(
      'Accept-Encoding',
      'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
      );

    const options = {
      path,
      method: method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };

    // cacheable-lookup integration hotfix
    !utils$1.isUndefined(lookup) && (options.lookup = lookup);

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsRequest ? https__default["default"] : http__default["default"];
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      if (config.beforeRedirect) {
        options.beforeRedirects.config = config.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
      options.maxBodyLength = Infinity;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed) return;

      const streams = [res];

      const responseLength = +res.headers['content-length'];

      if (onDownloadProgress) {
        const transformStream = new AxiosTransformStream$1({
          length: utils$1.toFiniteNumber(responseLength),
          maxRate: utils$1.toFiniteNumber(maxDownloadRate)
        });

        onDownloadProgress && transformStream.on('progress', progress => {
          onDownloadProgress(Object.assign(progress, {
            download: true
          }));
        });

        streams.push(transformStream);
      }

      // decompress the response body transparently if required
      let responseStream = res;

      // return the last request in case of redirects
      const lastRequest = res.req || req;

      // if decompress disabled we should not decompress
      if (config.decompress !== false && res.headers['content-encoding']) {
        // if no content, but headers still say that it is encoded,
        // remove the header not confuse downstream operations
        if (method === 'HEAD' || res.statusCode === 204) {
          delete res.headers['content-encoding'];
        }

        switch ((res.headers['content-encoding'] || '').toLowerCase()) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'x-gzip':
        case 'compress':
        case 'x-compress':
          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'deflate':
          streams.push(new ZlibHeaderTransformStream$1());

          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'br':
          if (isBrotliSupported) {
            streams.push(zlib__default["default"].createBrotliDecompress(brotliOptions));
            delete res.headers['content-encoding'];
          }
        }
      }

      responseStream = streams.length > 1 ? stream__default["default"].pipeline(streams, utils$1.noop) : streams[0];

      const offListeners = stream__default["default"].finished(responseStream, () => {
        offListeners();
        onFinished();
      });

      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders$1(res.headers),
        config,
        request: lastRequest
      };

      if (responseType === 'stream') {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;

        responseStream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            // stream.destroy() emit aborted event before calling reject() on Node.js v16
            rejected = true;
            responseStream.destroy();
            reject(new AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
          }
        });

        responseStream.on('aborted', function handlerStreamAborted() {
          if (rejected) {
            return;
          }

          const err = new AxiosError(
            'maxContentLength size of ' + config.maxContentLength + ' exceeded',
            AxiosError.ERR_BAD_RESPONSE,
            config,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });

        responseStream.on('error', function handleStreamError(err) {
          if (req.destroyed) return;
          reject(AxiosError.from(err, null, config, lastRequest));
        });

        responseStream.on('end', function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== 'arraybuffer') {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === 'utf8') {
                responseData = utils$1.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError.from(err, null, config, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }

      emitter.once('abort', err => {
        if (!responseStream.destroyed) {
          responseStream.emit('error', err);
          responseStream.destroy();
        }
      });
    });

    emitter.once('abort', err => {
      reject(err);
      req.destroy(err);
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      // @todo remove
      // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
      reject(AxiosError.from(err, null, config, req));
    });

    // set tcp keep alive to prevent drop connection by peer
    req.on('socket', function handleRequestSocket(socket) {
      // default interval of sending ack packet is 1 minute
      socket.setKeepAlive(true, 1000 * 60);
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      const timeout = parseInt(config.timeout, 10);

      if (Number.isNaN(timeout)) {
        reject(new AxiosError(
          'error trying to parse `config.timeout` to int',
          AxiosError.ERR_BAD_OPTION_VALUE,
          config,
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devouring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone) return;
        let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = config.transitional || transitionalDefaults;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          req
        ));
        abort();
      });
    }


    // Send the request
    if (utils$1.isStream(data)) {
      let ended = false;
      let errored = false;

      data.on('end', () => {
        ended = true;
      });

      data.once('error', err => {
        errored = true;
        req.destroy(err);
      });

      data.on('close', () => {
        if (!ended && !errored) {
          abort(new CanceledError('Request stream has been aborted', config, req));
        }
      });

      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  }, freq);
};

const isURLSameOrigin = platform.hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

const cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

const xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType} = _config;
    let onCanceled;
    function done() {
      if (_config.cancelToken) {
        _config.cancelToken.unsubscribe(onCanceled);
      }

      if (_config.signal) {
        _config.signal.removeEventListener('abort', onCanceled);
      }
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, _config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, _config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        _config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (typeof _config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(_config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof _config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(_config.onUploadProgress));
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  let controller = new AbortController();

  let aborted;

  const onabort = function (cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
    }
  };

  let timer = timeout && setTimeout(() => {
    onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
  }, timeout);

  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach(signal => {
        signal &&
        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
      });
      signals = null;
    }
  };

  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

  const {signal} = controller;

  signal.unsubscribe = unsubscribe;

  return [signal, () => {
    timer && clearTimeout(timer);
    timer = null;
  }];
};

const composeSignals$1 = composeSignals;

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize, encode) {
  for await (const chunk of iterable) {
    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
  const iterator = readBytes(stream, chunkSize, encode);

  let bytes = 0;

  return new ReadableStream({
    type: 'bytes',

    async pull(controller) {
      const {done, value} = await iterator.next();

      if (done) {
        controller.close();
        onFinish();
        return;
      }

      let len = value.byteLength;
      onProgress && onProgress(bytes += len);
      controller.enqueue(new Uint8Array(value));
    },
    cancel(reason) {
      onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const fetchProgressDecorator = (total, fn) => {
  const lengthComputable = total != null;
  return (loaded) => setTimeout(() => fn({
    lengthComputable,
    total,
    loaded
  }));
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const supportsRequestStream = isReadableStreamSupported && (() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
})();

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported && !!(()=> {
  try {
    return utils$1.isReadableStream(new Response('').body);
  } catch(err) {
    // return undefined
  }
})();

const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

const fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
    composeSignals$1([signal, cancelToken], timeout) : [];

  let finished, request;

  const onFinish = () => {
    !finished && setTimeout(() => {
      composedSignal && composedSignal.unsubscribe();
    });

    finished = true;
  };

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
          requestContentLength,
          progressEventReducer(onUploadProgress)
        ), null, encodeText);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'cors' : 'omit';
    }

    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      withCredentials
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
          responseContentLength,
          progressEventReducer(onDownloadProgress, true)
        ), isStreamResponse && onFinish, encodeText),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && onFinish();

    stopTimeout && stopTimeout();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    onFinish();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

const adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

const validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

const Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

const CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

const HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var CombinedStream = __webpack_require__(38);
var util = __webpack_require__(39);
var path = __webpack_require__(7);
var http = __webpack_require__(13);
var https = __webpack_require__(42);
var parseUrl = (__webpack_require__(43).parse);
var fs = __webpack_require__(6);
var Stream = (__webpack_require__(40).Stream);
var mime = __webpack_require__(44);
var asynckit = __webpack_require__(47);
var populate = __webpack_require__(57);

// Public API
module.exports = FormData;

// make it a Stream
util.inherits(FormData, CombinedStream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition
    ;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc( 0 );
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {

      // Add content to the buffer.
      if(Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
      }else {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData.LINE_BREAK)] );
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
};

FormData.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'}
    ;

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce);
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};


/***/ }),
/* 38 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(39);
var Stream = (__webpack_require__(40).Stream);
var DelayedStream = __webpack_require__(41);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),
/* 40 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stream = (__webpack_require__(40).Stream);
var util = __webpack_require__(39);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),
/* 42 */
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),
/* 43 */
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(45)
var extname = (__webpack_require__(7).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),
/* 45 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(46)


/***/ }),
/* 46 */
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ }),
/* 47 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports =
{
  parallel      : __webpack_require__(48),
  serial        : __webpack_require__(55),
  serialOrdered : __webpack_require__(56)
};


/***/ }),
/* 48 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(49)
  , initState  = __webpack_require__(53)
  , terminator = __webpack_require__(54)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),
/* 49 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var async = __webpack_require__(50)
  , abort = __webpack_require__(52)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),
/* 50 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defer = __webpack_require__(51);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),
/* 51 */
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),
/* 52 */
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),
/* 53 */
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),
/* 54 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var abort = __webpack_require__(52)
  , async = __webpack_require__(50)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),
/* 55 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var serialOrdered = __webpack_require__(56);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),
/* 56 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(49)
  , initState  = __webpack_require__(53)
  , terminator = __webpack_require__(54)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),
/* 57 */
/***/ ((module) => {

// populates missing values
module.exports = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var parseUrl = (__webpack_require__(43).parse);

var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
};

var stringEndsWith = String.prototype.endsWith || function(s) {
  return s.length <= this.length &&
    this.indexOf(s, this.length - s.length) !== -1;
};

/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */
function getProxyForUrl(url) {
  var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
    return '';  // Don't proxy URLs without a valid scheme or host.
  }

  proto = proto.split(':', 1)[0];
  // Stripping ports in this way instead of using parsedUrl.hostname to make
  // sure that the brackets around IPv6 addresses are kept.
  hostname = hostname.replace(/:\d*$/, '');
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return '';  // Don't proxy URLs that match NO_PROXY.
  }

  var proxy =
    getEnv('npm_config_' + proto + '_proxy') ||
    getEnv(proto + '_proxy') ||
    getEnv('npm_config_proxy') ||
    getEnv('all_proxy');
  if (proxy && proxy.indexOf('://') === -1) {
    // Missing scheme in proxy, default to the requested URL's scheme.
    proxy = proto + '://' + proxy;
  }
  return proxy;
}

/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */
function shouldProxy(hostname, port) {
  var NO_PROXY =
    (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
  if (!NO_PROXY) {
    return true;  // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false;  // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;  // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;  // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}

/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}

exports.getProxyForUrl = getProxyForUrl;


/***/ }),
/* 59 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(43);
var URL = url.URL;
var http = __webpack_require__(13);
var https = __webpack_require__(42);
var Writable = (__webpack_require__(40).Writable);
var assert = __webpack_require__(60);
var debug = __webpack_require__(61);

// Whether to use the native URL object or the legacy url module
var useNativeURL = false;
try {
  assert(new URL());
}
catch (error) {
  useNativeURL = error.code === "ERR_INVALID_URL";
}

// URL fields to preserve in copy operations
var preservedUrlFields = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash",
];

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  RedirectionError
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// istanbul ignore next
var destroy = Writable.prototype.destroy || noop;

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    try {
      self._processResponse(response);
    }
    catch (cause) {
      self.emit("error", cause instanceof RedirectionError ?
        cause : new RedirectionError({ cause: cause }));
    }
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  destroyRequest(this._currentRequest);
  this._currentRequest.abort();
  this.emit("abort");
};

RedirectableRequest.prototype.destroy = function (error) {
  destroyRequest(this._currentRequest, error);
  destroy.call(this, error);
  return this;
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  }
  else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    self.removeListener("close", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);
  this.on("close", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    throw new TypeError("Unsupported protocol " + protocol);
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request and set up its event handlers
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }

  // RFC7230§5.3.1: When making a request directly to an origin server, […]
  // a client MUST send only the absolute path […] as the request-target.
  this._currentUrl = /^\//.test(this._options.path) ?
    url.format(this._options) :
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  destroyRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    throw new TooManyRedirectsError();
  }

  // Store the request headers if applicable
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host"),
    }, this._options.headers);
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = parseUrl(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Create the redirected request
  var redirectUrl = resolveUrl(location, currentUrl);
  debug("redirecting to", redirectUrl.href);
  this._isRedirect = true;
  spreadUrlObject(redirectUrl, this._options);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrl.protocol !== currentUrlParts.protocol &&
     redirectUrl.protocol !== "https:" ||
     redirectUrl.host !== currentHost &&
     !isSubdomain(redirectUrl.host, currentHost)) {
    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode: statusCode,
    };
    var requestDetails = {
      url: currentUrl,
      method: method,
      headers: requestHeaders,
    };
    beforeRedirect(this._options, responseDetails, requestDetails);
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  this._performRequest();
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters, ensuring that input is an object
      if (isURL(input)) {
        input = spreadUrlObject(input);
      }
      else if (isString(input)) {
        input = spreadUrlObject(parseUrl(input));
      }
      else {
        callback = options;
        options = validateUrl(input);
        input = { protocol: protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

function noop() { /* empty */ }

function parseUrl(input) {
  var parsed;
  /* istanbul ignore else */
  if (useNativeURL) {
    parsed = new URL(input);
  }
  else {
    // Ensure the URL is valid and absolute
    parsed = validateUrl(url.parse(input));
    if (!isString(parsed.protocol)) {
      throw new InvalidUrlError({ input });
    }
  }
  return parsed;
}

function resolveUrl(relative, base) {
  /* istanbul ignore next */
  return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
}

function validateUrl(input) {
  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  return input;
}

function spreadUrlObject(urlObject, target) {
  var spread = target || {};
  for (var key of preservedUrlFields) {
    spread[key] = urlObject[key];
  }

  // Fix IPv6 hostname
  if (spread.hostname.startsWith("[")) {
    spread.hostname = spread.hostname.slice(1, -1);
  }
  // Ensure port is a number
  if (spread.port !== "") {
    spread.port = Number(spread.port);
  }
  // Concatenate path
  spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;

  return spread;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, message, baseClass) {
  // Create constructor
  function CustomError(properties) {
    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }

  // Attach constructor and set default properties
  CustomError.prototype = new (baseClass || Error)();
  Object.defineProperties(CustomError.prototype, {
    constructor: {
      value: CustomError,
      enumerable: false,
    },
    name: {
      value: "Error [" + code + "]",
      enumerable: false,
    },
  });
  return CustomError;
}

function destroyRequest(request, error) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.destroy(error);
}

function isSubdomain(subdomain, domain) {
  assert(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isFunction(value) {
  return typeof value === "function";
}

function isBuffer(value) {
  return typeof value === "object" && ("length" in value);
}

function isURL(value) {
  return URL && value instanceof URL;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),
/* 60 */
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),
/* 61 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(62)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),
/* 62 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(63);
} else {
	module.exports = __webpack_require__(66);
}


/***/ }),
/* 63 */
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(64)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),
/* 64 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(65);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),
/* 65 */
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),
/* 66 */
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(67);
const util = __webpack_require__(39);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(68);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(64)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),
/* 67 */
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),
/* 68 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSupportsColor: () => (/* binding */ createSupportsColor),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(70);
/* harmony import */ var node_tty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71);




// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
/// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : node_process__WEBPACK_IMPORTED_MODULE_0__.argv) {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}

const {env} = node_process__WEBPACK_IMPORTED_MODULE_0__;

let flagForceColor;
if (
	hasFlag('no-color')
	|| hasFlag('no-colors')
	|| hasFlag('color=false')
	|| hasFlag('color=never')
) {
	flagForceColor = 0;
} else if (
	hasFlag('color')
	|| hasFlag('colors')
	|| hasFlag('color=true')
	|| hasFlag('color=always')
) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3,
	};
}

function _supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m')
			|| hasFlag('color=full')
			|| hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	// Check for Azure DevOps pipelines.
	// Has to be above the `!streamIsTTY` check.
	if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
		return 1;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (node_process__WEBPACK_IMPORTED_MODULE_0__.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = node_os__WEBPACK_IMPORTED_MODULE_1__.release().split('.');
		if (
			Number(osRelease[0]) >= 10
			&& Number(osRelease[2]) >= 10_586
		) {
			return Number(osRelease[2]) >= 14_931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if ('GITHUB_ACTIONS' in env || 'GITEA_ACTIONS' in env) {
			return 3;
		}

		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if (env.TERM === 'xterm-kitty') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app': {
				return version >= 3 ? 3 : 2;
			}

			case 'Apple_Terminal': {
				return 2;
			}
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function createSupportsColor(stream, options = {}) {
	const level = _supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options,
	});

	return translateLevel(level);
}

const supportsColor = {
	stdout: createSupportsColor({isTTY: node_tty__WEBPACK_IMPORTED_MODULE_2__.isatty(1)}),
	stderr: createSupportsColor({isTTY: node_tty__WEBPACK_IMPORTED_MODULE_2__.isatty(2)}),
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (supportsColor);


/***/ }),
/* 69 */
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),
/* 70 */
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("node:tty");

/***/ }),
/* 72 */
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),
/* 73 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageHeaderSub = void 0;
const vscode_1 = __importDefault(__webpack_require__(1));
const config_1 = __webpack_require__(32);
function messageHeaderSub(document) {
    return config_1.apiMessageHeader
        .replace("{LANG}", document.languageId)
        .replace("{FILE_NAME}", document.fileName)
        .replace("{PROJECT_NAME}", vscode_1.default.workspace.name || "Untitled");
}
exports.messageHeaderSub = messageHeaderSub;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.provideCompletionItems = void 0;
const vscode_1 = __importDefault(__webpack_require__(1));
const config_1 = __webpack_require__(32);
let { responsePreviewMaxTokens } = __webpack_require__(32);
responsePreviewMaxTokens = parseInt(responsePreviewMaxTokens);
const axios_1 = __importDefault(__webpack_require__(36));
const ollamaConstant_1 = __webpack_require__(10);
const MessageHeaderSub_1 = __webpack_require__(74);
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
            command: 'ollama-script-code.autocomplete',
            title: ollamaConstant_1.OLLAMA_COMMAND.TITLE,
            arguments: [cancellationToken]
        };
    }
    // Return the completion item
    return [item];
}
exports.provideCompletionItems = provideCompletionItems;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map