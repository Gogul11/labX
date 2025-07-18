import { app, ipcMain, Menu } from "electron";
import { Window } from "./window.js";
import { initiateTerminal } from "./terminal.js";
import { type IPty } from "node-pty";
import { MenuTemplate } from "./menu.js";
import { saveSelectedFileFunc } from './api/saveFile.js'
import {getFileName} from './api/getFileName.js'
import {openFile} from './api/openFile.js'
import {RenameFileFolder} from './api/renameFileFolder.js'
import {CreateFolder} from './api/createFolder.js'
import {CreateFile} from './api/createFile.js'
import {OpenDir} from './api/openDir.js'
import {ReadDir} from './api/ReadDir.js'
import {ExplorerMenu} from './api/explorerMenu.js'

app.on('ready', () => {

    let ptyProcess : IPty;
    const win =  Window(app)  

    const menu = Menu.buildFromTemplate(MenuTemplate(win));
    Menu.setApplicationMenu(menu);

    let currInput :string;
    
    ipcMain.on('terminal-input', (_event, input) => {
        currInput = input;
        ptyProcess.write(input);
    }) 
        
    ipcMain.on('terminal-start', (_event, dir : string) => {
        // ptyProcess.write('\x0C');
        ptyProcess = initiateTerminal(dir)
        ptyProcess.write('\x0C\r');

        ptyProcess.onData((data) => {
            if(!data.includes(currInput))
                win.webContents.send('terminal-output', data)
        })

    })

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

    //Opening a file
    ipcMain.handle('open-file', openFile)

    //Retrive file name
    ipcMain.handle('get-file-name', getFileName)

    //Save file
    ipcMain.handle('save-selected-file', saveSelectedFileFunc)
})