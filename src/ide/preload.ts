import { contextBridge, ipcRenderer } from "electron";

console.log("⚡ Preload loaded!");

contextBridge.exposeInMainWorld('electronApi', {
    sendInput : (input : string) => ipcRenderer.send('terminal-input', input)
})