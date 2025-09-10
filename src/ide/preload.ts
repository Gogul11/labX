import { contextBridge, ipcRenderer } from "electron";



contextBridge.exposeInMainWorld('electronApi', {
    readDir : (path : string) => ipcRenderer.invoke('read-dir', path),
    openDir : () => ipcRenderer.invoke('open-dir'),
    createFile : (path : object) => ipcRenderer.send('create-file', path),
    createFolder : (path : object) => ipcRenderer.send('create-folder', path),
    openFileExplorerMenu : (filePath : string) => ipcRenderer.send('explorer-menu', filePath),
    newFileOrFolder : (func : (isDir : boolean) => void) => ipcRenderer.on('new-file-folder', (_event, isDir) => func(isDir)),
    selectRenameFileOrFolder : (func : () => void) => ipcRenderer.on('select-rename-file-folder', (_event) => func()),
    renameFileOrFolder : (name : string, filePath : string) => ipcRenderer.send('rename-file-folder', name, filePath),
    deleteFileOrFolder: (filePath: string) => ipcRenderer.send('delete-file-folder', filePath),
    deleteFileOrFolderTrigger: (func: (filePath: string) => void) =>
        ipcRenderer.on('trigger-delete-file-folder', (_event, filePath) => func(filePath)),



    openFile : (path : string) => ipcRenderer.invoke('open-file', path),
    getFileName : (path : string) => ipcRenderer.invoke('get-file-name', path),


    saveTrigger : (func : () => void) => ipcRenderer.on('save-trigger', (_event) => func()),
    saveSelectedFile : (path : string, data : string) => ipcRenderer.invoke('save-selected-file', path, data),

    saveAllTrigger : (func : () => void) => ipcRenderer.on('save-all-trigger', func),

    submitWorkSpace : (folderPath : string, outputFolderName : string) => ipcRenderer.invoke('submit-work-space', folderPath, outputFolderName),

    startServer : (
            roomId : string,
            roomName : string,
            portNo : string,
            storageDir : string
        ) => ipcRenderer.invoke('start-server', roomId, roomName, portNo, storageDir),

    readZipContent : (zipFilePath : string) => ipcRenderer.invoke('read-zip-file', zipFilePath) ,

    invokeOpenDir : (func : () => void) => ipcRenderer.on('menu-open-folder', (_event) => func()),

    openSideBar : (func : () => void) => ipcRenderer.on('menu-toggle-sidebar', (_event) => func())
})