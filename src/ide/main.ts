
import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { Window } from "./window.js";
import { initiateTerminal } from "./terminal.js";
import { type IPty } from "node-pty";
import fs from 'fs'
import path from "path";
import { MenuTemplate } from "./menu.js";
import { contextMenuItems } from "./utils.js";

app.on('ready', () => {

    const ptyProcess : IPty = initiateTerminal()
    const win =  Window(app)  

    const menu = Menu.buildFromTemplate(MenuTemplate(win));
    Menu.setApplicationMenu(menu);
    let currInput :string;
    ipcMain.on('terminal-input', (_event, input) => {
        currInput = input;
        ptyProcess.write(input);
    }) 

    ptyProcess.onData((data) => {
        if(!data.includes(currInput))
            win.webContents.send('terminal-output', data)
    })

    ipcMain.on('terminal-start', () => {
        // ptyProcess.write('\x0C');
        ptyProcess.write('\x0C\r');
    })

    //For reading the content in a dir
    ipcMain.handle('read-dir', async (_event, input : string) => {
        const files =  fs.readdirSync(input)
        const result = []

        for(const file of files){
            try {
                const fullPath = path.join(input, file)
                if(file.startsWith('.')) continue
                result.push({
                    name : file,
                    path : fullPath,
                    isDir : fs.statSync(fullPath).isDirectory()
                })
            } catch (error) {
                continue
            }
        }
        return result
    })

    //For opening a dir
    ipcMain.handle('open-dir', async (_event) => {
        const result = await dialog.showOpenDialog(win, {
            properties : ['openDirectory', 'openFile']
        })
        if(!result.canceled && result.filePaths.length > 0)
            return result.filePaths[0]
        return ''
    })

    //For create file
    ipcMain.on('create-file', (_event, filePath : {val : string, isDir : boolean, name : string}) => {
        const selectedPath = filePath.isDir ? filePath.val : path.dirname(filePath.val)
        const newFilePath = path.join(selectedPath, filePath.name)
        console.log(newFilePath)
        try {
            fs.writeFileSync(newFilePath, '')
            console.log("Written successfully")
        } catch (error) {
            console.log(error)
        }
    })

    //For creating folder
    ipcMain.on('create-folder', (_event, folderPath : {val : string, isDir : Boolean, name : string}) => {
        const selectedPath = folderPath.isDir ? folderPath.val : path.dirname(folderPath.val)
        const newFolderPath = path.join(selectedPath, folderPath.name)
        console.log(newFolderPath)
        try {
            fs.mkdirSync(newFolderPath)
        } catch (error) {
            console.log(error)
        }
    })




    //For context menu
    ipcMain.on('explorer-menu', (event, filePath) => {
        console.log("right click pressed")
        console.log(filePath)
        const menu = Menu.buildFromTemplate(contextMenuItems(win, filePath))
        const send = BrowserWindow.fromWebContents(event.sender)
        if(send)
            menu.popup({window : send})
        else
            menu.popup()
    })

    //For Renaming file or folder
    ipcMain.on('rename-file-folder', (_event, input : string, filePath : string) => {
        const isDir : boolean = fs.statSync(filePath).isDirectory()
        const dir = path.dirname(filePath)
        const newName = path.join(dir, input)
        try {
            if(!isDir){
                const ext = path.extname(filePath)
                fs.renameSync(filePath, newName+ext)
            }
            else{
                fs.renameSync(filePath, newName)
            }
        } catch (error) {
            
        }
    })

    //Opening a file
    ipcMain.handle('open-file', async(_event, filePath : string) => {
        try {
            if(filePath === '') return {data : '', ext : ''};
            const data : string = fs.readFileSync(filePath, 'utf-8')
            const ext : string = path.extname(filePath)
            const fileName : string = path.basename(filePath)
            return { data, ext, fileName}
        } catch (error) {
            console.log(error)
            return { data : '', ext : '', fileName : ''}
        }
    })

    //Retrive file name
    ipcMain.handle('get-file-name', async(_event, filePath : string) => {
        try {
            if(filePath === '') return null
            const filename : string = path.basename(filePath)
            return filename
        } catch (error) {
            console.log(error)            
        }
    })
})