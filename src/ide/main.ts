import { app, dialog, ipcMain } from "electron";
import { Window } from "./window.js";
import { initiateTerminal } from "./terminal.js";
import { type IPty } from "node-pty";
import fs from 'fs'
import path from "path";

app.on('ready', () => {

    const ptyProcess : IPty = initiateTerminal()
    const win =  Window(app)  
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
    ipcMain.handle('open-dir', async (event) => {
        const result = await dialog.showOpenDialog(win, {
            properties : ['openDirectory', 'openFile', 'showHiddenFiles']
        })
        if(!result.canceled && result.filePaths.length > 0)
            return result.filePaths[0]
        return ''
    })

    //For create file
    ipcMain.on('create-file', (event, filePath : {val : string, isDir : boolean, name : string}) => {
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
    ipcMain.on('create-folder', (event, folderPath : {val : string, isDir : Boolean, name : string}) => {
        const selectedPath = folderPath.isDir ? folderPath.val : path.dirname(folderPath.val)
        const newFolderPath = path.join(selectedPath, folderPath.name)
        console.log(newFolderPath)
        try {
            fs.mkdirSync(newFolderPath)
        } catch (error) {
            console.log(error)
        }
    })
})