import ollama from "ollama";
import { MODEL_LIST } from "../constants/ollamaConstant";

interface ILlava {
  question: string;
  image: any;
}

export async function apiLLava({ question, image }: ILlava): Promise<any> {
  const url = "http://localhost:11434/api/generate";
  const data = {
    model: MODEL_LIST.LlAVA,
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
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const apiGenLLava = async ({ question, image }: ILlava) => {
  const response = await ollama.generate({
    model: MODEL_LIST.LlAVA,
    prompt: `${question}`,
    stream: false,
    images: [image],
  });
  return response;
};
