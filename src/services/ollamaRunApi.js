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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOllamaRunningApi = void 0;
const http = __importStar(require("http"));
const ollamaConstant_1 = require("../constants/ollamaConstant");
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
//# sourceMappingURL=ollamaRunApi.js.map