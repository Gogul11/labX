import { contextBridge, ipcRenderer } from "electron";



contextBridge.exposeInMainWorld('electronApi', {
    // startTerminal : () => ipcRenderer.send('terminal-start'),
    sendInput : (input : string) => ipcRenderer.send('terminal-input', input),
    receiveOutput : (func : (data : string) => void) => ipcRenderer.on('terminal-output', (_event, data) => func(data))
})