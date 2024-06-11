"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOllamaRunning = void 0;
const child_process_1 = require("child_process");
// Check if Ollama is running, using the ps command terminal
// is good option, but that issue is need to change the line .includes()
// because this function working in macos, but in linux the line is different then windows too.
// one of the task will be detect the current OS, and change the line according to the
// OS detected.
function checkOllamaRunning() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('ps aux | grep "[o]llama"', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else if (stderr) {
                reject(new Error(stderr));
            }
            else {
                resolve(stdout
                    .toLowerCase()
                    .includes("/applications/ollama.app/contents/resources/ollama serve"));
            }
        });
    });
}
exports.checkOllamaRunning = checkOllamaRunning;
//# sourceMappingURL=ollamaRun.js.map