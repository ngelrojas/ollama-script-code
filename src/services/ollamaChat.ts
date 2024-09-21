import ollama from "ollama";
import { v4 as uuidv4 } from "uuid";
import { OLLAMA_ROLES } from "../constants/ollamaConstant";
import { apiTemperature } from "../autocomplete/config";

let { numPredict } = require("../autocomplete/config");
numPredict = parseInt(numPredict);

interface userRequest {
  question: string;
  code: string;
  image: string;
}

interface Message {
  role: string;
  content: string;
}

const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M6.644 2.983a.252.252 0 0 0-.253.252c0 .139.113.251.253.251h3.713c.14 0 .253-.112.253-.251a.252.252 0 0 0-.253-.252zm3.713-1.342c.734 0 1.353.49 1.544 1.16l2.175.001c.621.004 1.122.205 1.432.638c.266.372.372.85.345 1.387L15.85 17.84c.042.552-.062 1.04-.328 1.445c-.312.473-.821.71-1.452.716H3.14c-.76-.03-1.323-.209-1.675-.609c-.327-.371-.47-.88-.464-1.5V4.84c-.013-.6.154-1.106.518-1.48c.376-.384.932-.554 1.647-.559h1.935c.19-.67.809-1.16 1.543-1.16zm0 3.187H6.644c-.546 0-1.027-.27-1.317-.684H3.17c-.383.002-.602.07-.682.152c-.091.093-.144.252-.138.531v13.07c-.003.325.052.522.13.61c.054.061.286.135.685.151h10.9c.2-.002.28-.04.326-.109c.091-.138.133-.334.11-.658l.001-13.096c.014-.293-.027-.482-.096-.578c-.026-.035-.116-.072-.336-.073h-2.397c-.29.414-.771.684-1.317.684M17.2 0c.994 0 1.8.801 1.8 1.79v14.082c0 .988-.806 1.79-1.8 1.79h-1.958v-1.343h1.957c.249 0 .45-.2.45-.447V1.789a.449.449 0 0 0-.45-.447H9.643c-.248 0-.45.2-.45.447v.157h-1.35v-.157C7.843.801 8.649 0 9.643 0zM8.196 11.751c.373 0 .675.3.675.671c0 .37-.302.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm4.052-2.684c.372 0 .675.3.675.671c0 .37-.303.671-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672zm0-2.684c.372 0 .675.3.675.671a.673.673 0 0 1-.675.671H4.145a.673.673 0 0 1-.676-.67c0-.371.303-.672.676-.672z"/></svg>`;

export const OllamaChat = async (
  inputModel: String,
  inputMsg: userRequest,
  conversationHistory: Message[]
) => {
  conversationHistory.push({
    role: OLLAMA_ROLES.USER,
    content: `${inputMsg.question} ${inputMsg.code}`,
  });

  let response = await ollama.chat({
    model: `${inputModel}`,
    messages: conversationHistory,
    options: {
      num_predict: numPredict,
      temperature: apiTemperature,
    },
  });

  function escapeHtml(unsafe: string) {
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
    matches.forEach((match: any) => {
      let modifiedMatch = escapeHtml(match).replace(/^```/, "<pre>").replace(/```$/, "</pre>");
      response.message.content = response.message.content.replace(match, modifiedMatch);
    });
  }

  let splitContent = response.message.content.split(/<\/?pre>/);

  for (let i = 0; i < splitContent.length; i++) {
    counter = uuidv4();
    if (i % 2 === 0) {
      splitContent[i] = "<p>" + escapeHtml(splitContent[i]) + "</p>";
    } else {
      splitContent[i] =
        `<div class="code-pre"><div class="flex justify-end"><button id='cpy-pre-${counter}' data-counter='${counter}' type="button" class=" text-gray-500 opacity-50 hover:opacity-100 hover:text-slate-400">${svgCopy}</button></div><pre id='code-${counter}'>` +
        splitContent[i] +
        `</pre></div>`;
    }
  }

  const formattedContent = splitContent.join("");

  conversationHistory.push({
    role: OLLAMA_ROLES.SYSTEM,
    content: response.message.content,
  });

  return formattedContent;
};
