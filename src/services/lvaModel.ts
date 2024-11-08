import ollama from "ollama";
import { MODEL_LIST, OLLAMA_URL_CHAT } from "../constants/ollamaConstant";

interface RequestMessage {
  role: string;
  content: string;
  images: string[];
}

export async function apiLLava({ role, content, images }: RequestMessage): Promise<any> {
  const data = {
    model: MODEL_LIST.LlAVA,
    stream: false,
    messages: [
      {
        role,
        content,
        images,
      },
    ],
  };

  try {
    const response = await fetch(OLLAMA_URL_CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (error) {
      throw new Error(`iva-model FAILED TO PARSE JSON: ${error}`);
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
