"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHeaderSub = void 0;
const vscode_1 = __importDefault(require("vscode"));
const config_1 = require("./config");
function messageHeaderSub(document) {
    return config_1.apiMessageHeader
        .replace("{LANG}", document.languageId)
        .replace("{FILE_NAME}", document.fileName)
        .replace("{PROJECT_NAME}", vscode_1.default.workspace.name || "Untitled");
}
exports.messageHeaderSub = messageHeaderSub;
//# sourceMappingURL=MessageHeaderSub.js.map