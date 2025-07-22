import { app, ipcMain, Menu } from "electron";
import { Window } from "./window.js";
import { MenuTemplate } from "./menu.js";
import { saveSelectedFileFunc } from './api/saveFile.js'
import {getFileName} from './api/getFileName.js'
import {openFile} from './api/openFile.js'
import {RenameFileFolder} from './api/renameFileFolder.js'
import {CreateFolder} from './api/createFolder.js'
import {CreateFile} from './api/createFile.js'
import { DeleteFileFolder } from './api/deleteFIleFolder.js'
import {OpenDir} from './api/openDir.js'
import {ReadDir} from './api/ReadDir.js'
import {ExplorerMenu} from './api/explorerMenu.js'
import {zipFolder} from './api/zipper.js'
import {startServer} from './backend/server.js'
import {ReadZipFile} from './api/readZipFile.js'

app.on('ready', () => {

    const win =  Window(app)  

    const menu = Menu.buildFromTemplate(MenuTemplate(win));
    Menu.setApplicationMenu(menu);

    //For reading the content in a dir
    ipcMain.handle('read-dir', ReadDir)

    //For opening a dir
    ipcMain.handle('open-dir', (event) => OpenDir(event, win))

    //For create file
    ipcMain.on('create-file', CreateFile)

    //For creating folder
    ipcMain.on('create-folder', CreateFolder)

    //For context menu
    ipcMain.on('explorer-menu', (event, filePath) => ExplorerMenu(event, filePath, win))

    //For Renaming file or folder
    ipcMain.on('rename-file-folder', RenameFileFolder)
    
    //For Deleting a file or folder
    ipcMain.on('delete-file-folder', DeleteFileFolder)
    

    //Opening a file
    ipcMain.handle('open-file', openFile)

    //Retrive file name
    ipcMain.handle('get-file-name', getFileName)

    //Save file
    ipcMain.handle('save-selected-file', saveSelectedFileFunc)

    ipcMain.handle('submit-work-space', zipFolder),

    ipcMain.handle('start-server', (event, roomId, roomNo, portNo, storageDir) => startServer(event, roomId, roomNo, portNo, storageDir))

    ipcMain.handle('read-zip-file', (event, zipFilePath) => ReadZipFile(event, zipFilePath))
})