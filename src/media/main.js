(function () {
  const vscode = acquireVsCodeApi();
  const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>`;
  const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M6.644 2.983a.252.252 0 0 0-.253.252c0 .139.113.251.253.251h3.713c.14 0 .253-.112.253-.251a.252.252 0 0 0-.253-.252zm3.713-1.342c.734 0 1.353.49 1.544 1.16l2.175.001c.621.004 1.122.205 1.432.638c.266.372.372.85.345 1.387L15.85 17.84c.042.552-.062 1.04-.328 1.445c-.312.473-.821.71-1.452.716H3.14c-.76-.03-1.323-.209-1.675-.609c-.327-.371-.47-.88-.464-1.5V4.84c-.013-.6.154-1.106.518-1.48c.376-.384.932-.554 1.647-.559h1.935c.19-.67.809-1.16 1.543-1.16zm0 3.187H6.644c-.546 0-1.027-.27-1.317-.684H3.17c-.383.002-.602.07-.682.152c-.091.093-.144.252-.138.531v13.07c-.003.325.052.522.13.61c.054.061.286.135.685.151h10.9c.2-.002.28-.04.326-.109c.091-.138.133-.334.11-.658l.001-13.096c.014-.293-.027-.482-.096-.578c-.026-.035-.116-.072-.336-.073h-2.397c-.29.414-.771.684-1.317.684M17.2 0c.994 0 1.8.801 1.8 1.79v14.082c0 .988-.806 1.79-1.8 1.79h-1.958v-1.343h1.957c.249 0 .45-.2.45-.447V1.789a.449.449 0 0 0-.45-.447H9.643c-.248 0-.45.2-.45.447v.157h-1.35v-.157C7.843.801 8.649 0 9.643 0zM8.196 11.751c.373 0 .675.3.675.671c0 .37-.302.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm4.052-2.684c.372 0 .675.3.675.671c0 .37-.303.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm0-2.684c.372 0 .675.3.675.671a.673.673 0 0 1-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672z"/></svg>`;
  const svgUser = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5M8.75 6a3.25 3.25 0 1 1 6.5 0a3.25 3.25 0 0 1-6.5 0M12 12.25c-2.313 0-4.445.526-6.024 1.414C4.42 14.54 3.25 15.866 3.25 17.5v.102c-.001 1.162-.002 2.62 1.277 3.662c.629.512 1.51.877 2.7 1.117c1.192.242 2.747.369 4.773.369s3.58-.127 4.774-.369c1.19-.24 2.07-.605 2.7-1.117c1.279-1.042 1.277-2.5 1.276-3.662V17.5c0-1.634-1.17-2.96-2.725-3.836c-1.58-.888-3.711-1.414-6.025-1.414M4.75 17.5c0-.851.622-1.775 1.961-2.528c1.316-.74 3.184-1.222 5.29-1.222c2.104 0 3.972.482 5.288 1.222c1.34.753 1.961 1.677 1.961 2.528c0 1.308-.04 2.044-.724 2.6c-.37.302-.99.597-2.05.811c-1.057.214-2.502.339-4.476.339c-1.974 0-3.42-.125-4.476-.339c-1.06-.214-1.68-.509-2.05-.81c-.684-.557-.724-1.293-.724-2.601" clip-rule="evenodd"/></svg>`;
  const svgBot = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M17.753 14a2.25 2.25 0 0 1 2.25 2.25v.904A3.75 3.75 0 0 1 18.696 20c-1.565 1.344-3.806 2-6.696 2c-2.89 0-5.128-.656-6.69-2a3.75 3.75 0 0 1-1.306-2.843v-.908A2.25 2.25 0 0 1 6.254 14zm0 1.5h-11.5a.75.75 0 0 0-.75.75v.907c0 .655.287 1.278.784 1.706C7.545 19.945 9.441 20.5 12 20.5c2.56 0 4.458-.557 5.72-1.64a2.25 2.25 0 0 0 .783-1.707v-.905a.75.75 0 0 0-.75-.75M11.9 2.006L12 2a.75.75 0 0 1 .743.648l.007.102l-.001.749h3.5a2.25 2.25 0 0 1 2.25 2.25v4.505a2.25 2.25 0 0 1-2.25 2.25h-8.5a2.25 2.25 0 0 1-2.25-2.25V5.75A2.25 2.25 0 0 1 7.75 3.5l3.5-.001V2.75a.75.75 0 0 1 .649-.743L12 2zM16.25 5h-8.5a.75.75 0 0 0-.75.75v4.504c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75m-6.5 1.5a1.25 1.25 0 1 1 0 2.498a1.25 1.25 0 0 1 0-2.498m4.492 0a1.25 1.25 0 1 1 0 2.498a1.25 1.25 0 0 1 0-2.498"/></svg>`;
  const svgResend = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M22 12c-.237 5.082-4.622 9.133-9.995 9.133q-.976.001-1.936-.178c-.459-.087-.689-.13-.849-.105c-.16.024-.387.145-.842.386a6.5 6.5 0 0 1-4.226.657a5.3 5.3 0 0 0 1.087-2.348c.1-.53-.147-1.045-.519-1.422C3.034 16.411 2 14.105 2 11.567C2 6.284 6.48 2 12.005 2q.762 0 1.495.106M16 4.5c.491-.506 1.8-2.5 2.5-2.5M21 4.5c-.491-.506-1.8-2.5-2.5-2.5m0 0v8m-6.504 2h.008m3.987 0H16m-8 0h.009" color="currentColor"/></svg>`;

  document.addEventListener("DOMContentLoaded", (event) => {
    const ollamaDB = new OllamaDB("olDB");

    document.getElementById("openModalHistory").addEventListener("click", function () {
      document.getElementById("modalHistory").classList.remove("hidden");
    });

    document.getElementById("closeModal").addEventListener("click", function () {
      document.getElementById("modalHistory").classList.add("hidden");
    });

    function convertImgToBase64(imgElement) {
      return new Promise((resolve, reject) => {
        // Ensure the image is fully loaded
        if (!imgElement.complete) {
          imgElement.onload = () => {
            resolve(drawImageToCanvas(imgElement));
          };
          imgElement.onerror = reject;
        } else {
          resolve(drawImageToCanvas(imgElement));
        }
      });
    }

    function drawImageToCanvas(imgElement) {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match the image
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      // Draw the image onto the canvas
      ctx.drawImage(imgElement, 0, 0);

      // Get the Base64 string
      return canvas.toDataURL("image/png");
    }

    let counter = 1;
    let sendImg;

    const sendButton = document.getElementById("send");
    const requestInput = document.getElementById("send-req-ollama-bot");
    // const requestImg = document.getElementById("send-req-ollama-bot-img");

    // requestImg.addEventListener("change", (event) => {
    //   const file = event.target.files[0];

    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = async (e) => {
    //       const base64Image = e.target.result;
    //       const imgElement = document.createElement("img");
    //       imgElement.src = base64Image;
    //       const base64ImageRes = await convertImgToBase64(imgElement);
    //       const base64String = base64ImageRes.replace(/^data:image\/\w+;base64,/, "");

    //       sendImg = base64String;
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // });

    if (sendButton && requestInput) {
      sendButton.addEventListener("click", sendInfoChat);
      requestInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          sendInfoChat();
        }
      });
    }

    const removeAllChats = document.getElementById("del-all-chats");
    if (removeAllChats) {
      removeAllChats.addEventListener("click", (event) => {
        const wrapOllamaSection = document.getElementById("wrap-ollama-section");
        wrapOllamaSection.innerHTML = "";
      });
    }

    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.command) {
        case "response":
          createBotResponse(message, counter);
          break;
        case "chatId":
          chatId = message.text;
          const chats = ollamaDB.read(chatId);
          if (chats) {
            document.getElementById("wrap-ollama-section").innerHTML = chats.chat;
            counter = chats.counter;
            let uuidArray = chats.uuid;
            codeCounterGenerated(uuidArray);
          }
      }
    });

    function createBotResponse(message, counter) {
      const loadingElement = document.getElementById(`loading-${counter}`);
      if (loadingElement) {
        loadingElement.remove();
      }

      const botResponse = document.createElement("section");
      botResponse.id = `res-ollama-bot-view-${counter}`;
      botResponse.className =
        "rounded-b-md o-section-response bg-zinc-800 border-x border-b pt-1 pb-0.5 px-1.5 mb-1";

      const groupBtnCpyMsg = document.createElement("div");
      groupBtnCpyMsg.id = `group-btn-cpy-msg-${counter}`;
      groupBtnCpyMsg.className = "group-btn-cpy-msg flex justify-between mb-1.5";

      const botAvatar = document.createElement("div");
      botAvatar.id = `bot-avatar-${counter}`;
      botAvatar.className = "bot-avatar";
      botAvatar.innerHTML = svgBot;

      const btnCpyMsg = document.createElement("button");
      btnCpyMsg.id = `btn-cpy-msg-${counter}`;
      btnCpyMsg.className =
        "btn-cpy-msg text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400 m-0.5";
      btnCpyMsg.title = "copy";
      btnCpyMsg.innerHTML = svgCopy;
      btnCpyMsg.setAttribute("data-counter", `${counter}`);

      document.getElementById(`wrap-ollama-conversation-${counter}`).appendChild(botResponse);
      document.getElementById(`res-ollama-bot-view-${counter}`).appendChild(groupBtnCpyMsg);
      document.getElementById(`group-btn-cpy-msg-${counter}`).appendChild(botAvatar);
      document.getElementById(`group-btn-cpy-msg-${counter}`).appendChild(btnCpyMsg);

      let _codeCounterGenerated = [];
      let formattedMessage = message.text.replace(/(<pre id='code-[^>]+)>/g, function (match, p1) {
        let _p1 = p1 + ">";
        _codeCounterGenerated.push(_p1);
        return `${match}`;
      });

      formattedMessage = formattedMessage.replace(
        /<button data-counter=(\d+) id='cpy-pre-(\d+)'>/g,
        function (match) {
          return `${match}`;
        }
      );

      botResponse.innerHTML += `<div id="res-current-bot-o-${counter}">${formattedMessage}</div>`;

      addEventListenerCopy("btn-cpy-msg", "res-current-bot-o", counter);

      codeCounterGenerated(_codeCounterGenerated);

      localStorage.setItem("uuidArr", JSON.stringify(_codeCounterGenerated));

      getCurrentChat();
      let chatSaving = document.getElementById("wrap-ollama-section").innerHTML;
      let historyText = document.getElementById(`req-current-bot-o-${counter}`).textContent;
      ollamaDB.create({
        title: historyText,
        dateTime: new Date().toLocaleString(),
        chat: chatSaving,
        counter: counter,
        uuidArr: _codeCounterGenerated,
      });
    }

    function codeCounterGenerated(_codeCounterGenerated) {
      _codeCounterGenerated.map((id) => {
        let matchId = id.match(/code-([^>]+)(?=>)/);
        if (matchId && matchId[1]) {
          let uuid = matchId[1];
          if (uuid.endsWith("'")) {
            uuid = uuid.slice(0, -1);
          }
          addEventListenerCopy("cpy-pre", "code", uuid);
        }
      });
    }

    function addEventListenerCopy(attr1, attr2, counter) {
      const actionBtnCpyMsg = document.getElementById(`${attr1}-${counter}`);
      if (actionBtnCpyMsg) {
        actionBtnCpyMsg.addEventListener("click", (event) => {
          let counterValue = actionBtnCpyMsg.getAttribute("data-counter");
          const cpyTextMsg = document.getElementById(`${attr2}-${counterValue}`).textContent;
          navigator.clipboard.writeText(cpyTextMsg).then(
            function () {
              vscode.postMessage({ command: "copy", text: cpyTextMsg });
              console.info("Async: Copying to clipboard was successful!");
            },
            function (err) {
              console.error("Async: Could not copy text: ", err);
            }
          );
        });
      }
    }

    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function sendInfoChat() {
      counter = counter + 1;
      let _requestInputValue = escapeHtml(requestInput.value);

      let sendImgTxt = {
        txt: requestInput.value,
        img: sendImg,
      };

      vscode.postMessage({ command: "send", text: sendImgTxt });

      const loadResponseWrap = document.createElement("div");
      loadResponseWrap.id = `loading-${counter}`;
      loadResponseWrap.className =
        "rounded-b-md o-section-response bg-zinc-800 border-x border-b pt-1 pb-0.5 px-1.5 mb-1";

      const wrapConversation = document.createElement("div");
      wrapConversation.id = `wrap-ollama-conversation-${counter}`;
      wrapConversation.className = "wrap-ollama-conversation";

      const userRequestIn = document.createElement("section");
      userRequestIn.id = `req-ollama-bot-view-${counter}`;
      userRequestIn.className =
        "o-section-request bg-zinc-800 rounded-t-md border-t border-x pt-0.5 pb-1 px-1.5";

      const containerConversation = document.createElement("div");
      containerConversation.id = `container-conversation-${counter}`;
      containerConversation.className = "container-conversation pt-1 flex justify-between mb-1.5";

      const groupBtnDelCpy = document.createElement("div");
      groupBtnDelCpy.id = `btn-del-cpy-${counter}`;
      groupBtnDelCpy.className = "btn-del-cpy flex flex-row justify-end";

      const groupAvatar = document.createElement("div");
      groupAvatar.id = `group-avatar-${counter}`;
      groupAvatar.className = "group-avatar";
      groupAvatar.innerHTML = svgUser;

      const btnDel = document.createElement("button");
      btnDel.id = `btn-del-${counter}`;
      btnDel.className = `btn-del text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400 m-0.5`;
      btnDel.title = "delete conversation";
      btnDel.innerHTML = svgDelete;
      btnDel.setAttribute("data-counter", `${counter}`);

      const btnCpy = document.createElement("button");
      btnCpy.id = `btn-cpy-${counter}`;
      btnCpy.className =
        "btn-cpy text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400 m-0.5";
      btnCpy.innerHTML = svgCopy;
      btnCpy.title = "copy conversation";
      btnCpy.setAttribute("data-counter", `${counter}`);

      const btnReSend = document.createElement("button");
      btnReSend.id = `resend-${counter}`;
      btnReSend.className =
        "resend text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400 m-0.5";
      btnReSend.title = "re-send conversation";
      btnReSend.innerHTML = svgResend;
      btnReSend.setAttribute("data-counter", `${counter}`);

      document.getElementById("wrap-ollama-section").appendChild(wrapConversation);
      document.getElementById(`wrap-ollama-conversation-${counter}`).appendChild(userRequestIn);
      document.getElementById(`req-ollama-bot-view-${counter}`).appendChild(containerConversation);
      document.getElementById(`container-conversation-${counter}`).appendChild(groupAvatar);
      document.getElementById(`container-conversation-${counter}`).appendChild(groupBtnDelCpy);
      document.getElementById(`btn-del-cpy-${counter}`).appendChild(btnDel);
      document.getElementById(`btn-del-cpy-${counter}`).appendChild(btnReSend);
      document.getElementById(`btn-del-cpy-${counter}`).appendChild(btnCpy);

      userRequestIn.innerHTML += `<p id="req-current-bot-o-${counter}">${_requestInputValue}</p>`;
      requestInput.value = "";

      loadingChat(counter, loadResponseWrap);

      eventDeleteConversation("btn-del", "wrap-ollama-conversation", counter);

      addEventListenerCopy("btn-cpy", "req-current-bot-o", counter);

      eventResendConversation(
        "resend",
        "req-current-bot-o",
        "res-ollama-bot-view",
        "wrap-ollama-conversation",
        loadResponseWrap,
        counter
      );
    }

    function eventDeleteConversation(attr1, attr2, counter) {
      const actionBtnDel = document.getElementById(`${attr1}-${counter}`);
      actionBtnDel.addEventListener("click", (event) => {
        let counterValue = actionBtnDel.getAttribute("data-counter");
        document.getElementById(`${attr2}-${counterValue}`).remove();
      });
    }

    function eventResendConversation(attr1, attr2, attr3, attr4, loadResponseWrap, counter) {
      const actionBtnResend = document.getElementById(`${attr1}-${counter}`);
      actionBtnResend.addEventListener("click", (event) => {
        let counterValue = actionBtnResend.getAttribute("data-counter");
        let resendText = document.getElementById(`${attr2}-${counterValue}`).textContent;

        document.getElementById(`${attr3}-${counter}`).remove();
        document.getElementById(`${attr4}-${counter}`).appendChild(loadResponseWrap);
        let sendImgTxt = {
          txt: resendText,
          img: null,
        };
        vscode.postMessage({ command: "send", text: sendImgTxt });
      });
    }

    function getCurrentChat() {
      let chatSaving = document.getElementById("wrap-ollama-section").innerHTML;
      localStorage.setItem("chat", chatSaving);
      localStorage.setItem("counter", counter);
    }

    function loadingChat(counter, loadResponseWrap) {
      const loadResponseSec_1 = document.createElement("div");
      loadResponseSec_1.id = `loading-1-${counter}`;
      loadResponseSec_1.className = "animate-pulse flex space-x-4";

      const loadResponseAvatar = document.createElement("div");
      loadResponseAvatar.id = `avatar-${counter}`;
      loadResponseAvatar.className = "rounded-full bg-slate-700 h-8 w-8";

      const loadResponseSec_2 = document.createElement("div");
      loadResponseSec_2.id = `loading-2-${counter}`;
      loadResponseSec_2.className = "flex-1 space-y-2 py-1";

      const loadResponseSec_3 = document.createElement("div");
      loadResponseSec_3.id = `loading-3-${counter}`;
      loadResponseSec_3.className = "h-2 bg-slate-700 rounded";

      const loadResponseSec_4 = document.createElement("div");
      loadResponseSec_4.id = `loading-4-${counter}`;
      loadResponseSec_4.className = "h-2 bg-slate-700 rounded";

      const loadResponseSec_5 = document.createElement("div");
      loadResponseSec_5.id = `loading-5-${counter}`;
      loadResponseSec_5.className = "h-2 bg-slate-700 rounded";

      document.getElementById(`wrap-ollama-conversation-${counter}`).appendChild(loadResponseWrap);
      document.getElementById(`loading-${counter}`).appendChild(loadResponseSec_1);
      document.getElementById(`loading-1-${counter}`).appendChild(loadResponseAvatar);
      document.getElementById(`loading-1-${counter}`).appendChild(loadResponseSec_2);
      document.getElementById(`loading-2-${counter}`).appendChild(loadResponseSec_3);
      document.getElementById(`loading-2-${counter}`).appendChild(loadResponseSec_4);
      document.getElementById(`loading-2-${counter}`).appendChild(loadResponseSec_5);
    }

    window.addEventListener("unload", getCurrentChat);

    window.addEventListener("load", (event) => {
      // Load the chat from the local storage called olDB
      let chatSaved = localStorage.getItem("chat");
      counter = parseInt(localStorage.getItem("counter"));
      let uuidArray = JSON.parse(localStorage.getItem("uuidArr"));
      if (isNaN(counter)) {
        counter = 1;
      }
      if (chatSaved !== "") {
        document.getElementById("wrap-ollama-section").innerHTML = chatSaved;

        const loadResponseWrap = document.createElement("div");
        loadResponseWrap.id = `loading-${counter}`;
        loadResponseWrap.className =
          "rounded-b-md o-section-response bg-zinc-800 border-x border-b pt-1 pb-0.5 px-1.5 mb-1";

        eventDeleteConversation("btn-del", "wrap-ollama-conversation", counter);
        addEventListenerCopy("btn-cpy", "req-current-bot-o", counter);
        eventResendConversation(
          "resend",
          "req-current-bot-o",
          "res-ollama-bot-view",
          "wrap-ollama-conversation",
          loadResponseWrap,
          counter
        );

        addEventListenerCopy("btn-cpy-msg", "res-current-bot-o", counter);
        codeCounterGenerated(uuidArray);
      }
    });
  });

  class OllamaDB {
    constructor(storageKey) {
      this.storageKey = storageKey;
      // Initialize the storage with an empty array if it doesn't exist
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }

    // Create a new item
    create({ title, dateTime, chat, counter, uuidArr }) {
      const items = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const id = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      const item = { id, title, dateTime, chat, counter, uuid: uuidArr };
      items.push(item);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    // Read an item by id
    read(id) {
      const items = JSON.parse(localStorage.getItem(this.storageKey));
      return items.find((item) => item.id === parseInt(id));
    }

    // Update an item by uuid
    update(uuid, updatedFields) {
      const items = JSON.parse(localStorage.getItem(this.storageKey));
      const itemIndex = items.findIndex((item) => item.uuid === uuid);
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...updatedFields };
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      }
    }

    // Delete an item by uuid
    delete(id) {
      const items = JSON.parse(localStorage.getItem(this.storageKey));
      if (Array.isArray(items)) {
        const filteredItems = items.filter((item) => item.id !== parseInt(id));
        localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
      }
    }

    // List all items
    list() {
      return JSON.parse(localStorage.getItem(this.storageKey));
    }
  }
  window.OllamaDB = OllamaDB;

  class ModelDB {
    constructor(storageKey) {
      this.storageKey = storageKey;
      // Initialize the storage with an empty array if it doesn't exist
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }
    createModels({ nameModule }) {
      localStorage.setItem(this.storageKey, JSON.stringify(nameModule));
    }
    getModels() {
      return JSON.parse(localStorage.getItem(this.storageKey));
    }
  }
  window.ModelDB = ModelDB;

  function handleSaveModel(event) {
    const selectedModel = event.target.value;
    vscode.postMessage({
      command: "save",
      text: selectedModel,
    });
    // const config = vscode.workspace?.getConfiguration("ollama-script-code");
    // console.log("CONFIG", config);
    // config?.update("model", selectedModel, vscode.ConfigurationTarget.Global).then(() => {
    //   vscode.window.showInformationMessage(`Model ${selectedModel} SAVED`);
    // });
  }

  window.handleSaveModel = handleSaveModel;
})();
