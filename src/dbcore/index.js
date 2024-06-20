export class OllamaDB {
  constructor() {
    this.db = undefined;
  }

  async open() {
    const db_1 = await new Promise((resolve, reject) => {
      const request = indexedDB.open("ChatDB", 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = request.result;
        db.createObjectStore("chats", { keyPath: "id", autoIncrement: true });
      };
    });
    return (this.db = db_1);
  }

  async createChat(chat) {
    if (!this.db) throw new Error("DB is not initialized");
    const transaction = this.db.transaction("chats", "readwrite");
    const chats = transaction.objectStore("chats");
    return chats.add(chat);
  }

  async readChat(id) {
    if (!this.db) throw new Error("DB is not initialized");
    const transaction = this.db.transaction("chats", "readonly");
    const chats = transaction.objectStore("chats");
    return chats.get(id);
  }

  async updateChat(chat) {
    if (!this.db) throw new Error("DB is not initialized");
    const transaction = this.db.transaction("chats", "readwrite");
    const chats = transaction.objectStore("chats");
    return chats.put(chat);
  }

  async deleteChat(id) {
    if (!this.db) throw new Error("DB is not initialized");
    const transaction = this.db.transaction("chats", "readwrite");
    const chats = transaction.objectStore("chats");
    return chats.delete(id);
  }
}
