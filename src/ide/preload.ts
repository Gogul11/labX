import { contextBridge, ipcRenderer } from "electron";



contextBridge.exposeInMainWorld('electronApi', {
    startTerminal : (dir : string) => ipcRenderer.send('terminal-start', dir),
    sendInput : (input : string) => ipcRenderer.send('terminal-input', input),
    receiveOutput : (func : (data : string) => void) => ipcRenderer.on('terminal-output', (_event, data) => func(data)),
    readDir : (path : string) => ipcRenderer.invoke('read-dir', path),
    openDir : () => ipcRenderer.invoke('open-dir'),
    createFile : (path : object) => ipcRenderer.send('create-file', path),
    createFolder : (path : object) => ipcRenderer.send('create-folder', path),
    openFileExplorerMenu : (filePath : string) => ipcRenderer.send('explorer-menu', filePath),
    newFileOrFolder : (func : (isDir : boolean) => void) => ipcRenderer.on('new-file-folder', (_event, isDir) => func(isDir)),
    selectRenameFileOrFolder : (func : () => void) => ipcRenderer.on('select-rename-file-folder', (_event) => func()),
    renameFileOrFolder : (name : string, filePath : string) => ipcRenderer.send('rename-file-folder', name, filePath),
    openFile : (path : string) => ipcRenderer.invoke('open-file', path),
    getFileName : (path : string) => ipcRenderer.invoke('get-file-name', path),


    saveTrigger : (func : () => void) => ipcRenderer.on('save-trigger', (_event) => func()),
    saveSelectedFile : (path : string, data : string) => ipcRenderer.invoke('save-selected-file', path, data)
})