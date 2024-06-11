"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListModels = void 0;
const ollama_1 = __importDefault(require("ollama"));
const ListModels = async () => {
    return await ollama_1.default.list();
};
exports.ListModels = ListModels;
//# sourceMappingURL=listModels.js.map