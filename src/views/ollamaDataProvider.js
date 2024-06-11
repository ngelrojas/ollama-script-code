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
exports.OllamaDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class OllamaDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    items = [
        new OllamaItem("Item 1"),
        new OllamaItem("Item 2"),
    ];
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
        }
        else {
            return Promise.resolve(this.items);
        }
    }
    displayAllItems() {
        this.items.forEach((item) => {
            return item.getHeader();
            // console.log(item.label);
        });
    }
    findItemByLabel(label) {
        return this.items.find((item) => item.label === label);
    }
}
exports.OllamaDataProvider = OllamaDataProvider;
class OllamaItem extends vscode.TreeItem {
    constructor(label) {
        super(label);
    }
    getHeader() {
        return "<h1>header</h1>";
    }
}
//# sourceMappingURL=ollamaDataProvider.js.map