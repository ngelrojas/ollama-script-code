import * as vscode from "vscode";
import ollama from "ollama";
import { OLLAMA_MSG_ERROR, OLLAMA_MSG_INFO } from "../constants/ollamaConstant";

export const ListModels = async () => {
  return await ollama.list();
};

export async function retrieveModelList() {
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
    let modelName;
    response.models.forEach((model: any) => {
      modelName = model.model.split(":")[0];
      if (modelStored === modelName) {
        inputModels += `<option id="${modelName}" value=${modelName} selected>${modelName}</option>`;
      } else {
        inputModels += `<option id="${modelName}" value=${modelName}>${modelName}</option>`;
      }
    });

    return inputModels;
  } catch (e) {
    vscode.window.showErrorMessage(OLLAMA_MSG_ERROR.OLLAMA_NOT_RUNNING);
    console.error(e);
  }
}
