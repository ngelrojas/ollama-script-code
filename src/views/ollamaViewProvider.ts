import * as vscode from "vscode";
import { OllamaChat } from "../services/ollamaChat";
import { OllamaChatLLava } from "../services/ollamaChatLlava";
import { MODEL_LIST } from "../constants/ollamaConstant";

interface questionRequest {
  txt: string;
}
interface imageRequest {
  img: string;
}

interface codeRequest {
  code: string;
}

interface userRequest {
  question: questionRequest;
  code: codeRequest;
  image: imageRequest;
}

function getCurrentModel() {
  const config = vscode.workspace.getConfiguration("ollama-script-code");
  return config.get("model") as string;
}

export class OllamaViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private currentModel: string = "";

  constructor(private context: vscode.ExtensionContext) {
    this.currentModel = getCurrentModel();
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("ollama-script-code.model")) {
        this.currentModel = getCurrentModel();
        // this._view?.webview.postMessage({ command: "model", text: this.currentModel });
      }
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webviewView.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "send":
            // const config = vscode.workspace.getConfiguration("ollama-script-code");
            // let model = config.get("model") as string;
            let model = this.currentModel;
            const editor = vscode.window.activeTextEditor;
            let codeSelected: codeRequest = { code: "" };
            if (editor) {
              let document = editor.document;
              let selection = editor.selection;
              codeSelected = {
                code: document.getText(selection),
              };
            }

            const userQuestion = message.text;
            let conversationHistory: any = [];
            const userImgQuestion = message.text.img;
            const userRequest: userRequest = {
              question: userQuestion,
              code: codeSelected,
              image: userImgQuestion,
            };

            let response = "";
            if (model === MODEL_LIST.LlAVA) {
              response = await OllamaChatLLava(userRequest, conversationHistory);
            } else {
              response = await OllamaChat(model, userRequest, conversationHistory);
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
      },
      undefined,
      this.context.subscriptions
    );

    (async () => {
      webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
    })();
  }

  public async _getHtmlForWebview(webview: vscode.Webview) {
    const stylesTailwindCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tailwind.min.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "main.css")
    );
    const scriptMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "main.js")
    );
    const scriptToolsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tools.js")
    );
    const scriptHistoryModalUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "historyModal.js")
    );
    const scriptTailwindJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "src/media", "tailwindcss.3.2.4.min.js")
    );

    const svgSend = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m12.815 12.197l-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395"/></svg>`;
    const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/><path stroke-linecap="round" d="M15 12H9"/></g></svg>`;
    const svgHistory = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5m4-1v5l4 2"/></g></svg>`;
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
        <script src='${scriptHistoryModalUri}'></script>
        <script src='${scriptToolsUri}'></script>
        <title>Ollama Script Code Chat</title>
      </head>
      <body>
        <main>
        
            <div class="relative wrap-ol">
              <div class="overflow-scroll mb-28 wrapp-all-conversation-ollama" id="wrapp-all-conversation-ollama">
                  <div class="flex justify-between sticky top-0 flex bg-history-nav p-2 btn-options-ollama">
                      <div id="list-models">MODEL: ${getCurrentModel()}</div>
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
                    <button class="absolute top-0 right-10 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center" onClick="removeFile()">${svgRemove}</button>
                  </div>
                  <div class="bg-zinc-800 relative preview-w col-start-1" id="btn-plus">
                    <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="send-req-ollama-bot-file" accept="image/*" onChange="previewFile(event)" />
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
