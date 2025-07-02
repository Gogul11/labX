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

    ipcMain.handle('open-dir', async (event) => {
        const result = await dialog.showOpenDialog(win, {
            properties : ['openDirectory', 'openFile', 'showHiddenFiles']
        })
        if(!result.canceled && result.filePaths.length > 0)
            return result.filePaths[0]
        return ''
    })
})