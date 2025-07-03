import { contextBridge, ipcRenderer } from "electron";



contextBridge.exposeInMainWorld('electronApi', {
    startTerminal : () => ipcRenderer.send('terminal-start'),
    sendInput : (input : string) => ipcRenderer.send('terminal-input', input),
    receiveOutput : (func : (data : string) => void) => ipcRenderer.on('terminal-output', (_event, data) => func(data)),
    readDir : (path : string) => ipcRenderer.invoke('read-dir', path),
    openDir : () => ipcRenderer.invoke('open-dir'),
    createFile : (path : object) => ipcRenderer.send('create-file', path),
    createFolder : (path : object) => ipcRenderer.send('create-folder', path)
})