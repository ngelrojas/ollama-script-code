"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaGenerate = void 0;
const ollama_1 = __importDefault(require("ollama"));
const config_1 = require("../autocomplete/config");
const OllamaGenerate = async ({ inputModel, prompt }) => {
    return await ollama_1.default.generate({
        model: `${inputModel}`,
        prompt: `${prompt}`,
        stream: true,
        raw: true,
        options: {
            num_predict: config_1.numPredict,
            temperature: config_1.apiTemperature,
            stop: ["```"]
        }
    });
};
exports.OllamaGenerate = OllamaGenerate;
//# sourceMappingURL=ollamaGenerate.js.map