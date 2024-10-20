(function () {
  vscode = acquireVsCodeApi();

  document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("settingsForm").addEventListener("submit", (event) => {
      event.preventDefault();

      let selectedModels = "";
      const radios = document.querySelectorAll('input[name="model"]');

      radios.forEach((radio) => {
        if (radio.checked) {
          selectedModels = radio.id;
        }
      });

      vscode.postMessage({
        command: "save",
        value: selectedModels,
      });
    });
    //tabs
    document.querySelectorAll(".tab").forEach((i) => {
      i.addEventListener("click", (e) => {
        document.querySelectorAll(".tab").forEach((e) => {
          e.classList.remove("active");
        });

        i.classList.add("active");

        document.querySelectorAll(".tabContent").forEach((e) => {
          e.classList.add("hidden");
        });
        const target = i.dataset.tabId;

        document.getElementById(target).classList.remove("hidden");
      });
    });
    // parametersForm display number realtime settings
    updateDisplay("numPredict", "numPredictDisplay");
    updateDisplay("promptWindowSize", "winSize");
    updateDisplay("responsePreviewMaxTokens", "maxTokens");
    updateDisplay("responsePreviewDelay", "delay");
    updateDisplay("apiTemperature", "temperature");
    // save parametersForm
    document.getElementById("parametersForm").addEventListener("submit", (event) => {
      event.preventDefault();
      console.log(`NUMBER PREDICTION = ${document.getElementById("numPredict").value}`);
      const parameters = {
        maxTokensPredicted: document.getElementById("numPredict").value,
        promptWindowSize: document.getElementById("promptWindowSize").value,
        completionKeys: document.getElementById("completionKeys").value,
        responsePreview: document.getElementById("responsePreview").checked,
        previewMaxTokens: document.getElementById("responsePreviewMaxTokens").value,
        previewDelay: document.getElementById("responsePreviewDelay").value,
        continueInline: document.getElementById("continueInline").checked,
        temperature: parseFloat(document.getElementById("apiTemperature").value),
      };

      vscode.postMessage({
        command: "saveParameters",
        value: parameters,
      });
    });
    function updateDisplay(inputId, displayId) {
      document.getElementById(inputId).addEventListener("input", (event) => {
        document.getElementById(displayId).innerText = event.target.value;
      });
    }
  });
})();
