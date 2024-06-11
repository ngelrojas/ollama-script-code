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
exports.updateVSConfig = exports.continueInline = exports.responsePreviewDelay = exports.responsePreviewMaxTokens = exports.responsePreview = exports.completionKeys = exports.promptWindowSize = exports.numPredict = exports.apiMessageHeader = exports.apiTemperature = exports.apiModel = exports.apiEndpoint = exports.VSConfig = void 0;
const vscode = __importStar(require("vscode"));
function updateVSConfig() {
    exports.VSConfig = vscode.workspace.getConfiguration("mylocal-autocoder");
    const config = vscode.workspace.getConfiguration("my-local-copilot");
    exports.apiEndpoint = exports.VSConfig.get("endpoint") || "http://localhost:11434/api/generate";
    exports.apiModel = config.get("model");
    exports.apiMessageHeader = exports.VSConfig.get("message header") || "";
    exports.numPredict = exports.VSConfig.get("max tokens predicted") || 1000;
    exports.promptWindowSize = exports.VSConfig.get("prompt window size") || 2000;
    exports.completionKeys = exports.VSConfig.get("completion keys") || " ";
    exports.responsePreview = exports.VSConfig.get("response preview");
    exports.responsePreviewMaxTokens = exports.VSConfig.get("preview max tokens") || 50;
    exports.responsePreviewDelay = exports.VSConfig.get("preview delay") || 0; // Must be || 0 instead of || [default] because of truthy
    exports.continueInline = exports.VSConfig.get("continue inline");
    exports.apiTemperature = exports.VSConfig.get("temperature") || 0.5;
}
exports.updateVSConfig = updateVSConfig;
//# sourceMappingURL=config.js.map