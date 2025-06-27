import { app, ipcMain } from "electron";
import { Window } from "./window.js";
import { initiateTerminal } from "./terminal.js";
import { type IPty } from "node-pty";


app.on('ready', () => {

    const ptyProcess : IPty = initiateTerminal()
    const win =  Window(app)  

    ipcMain.on('terminal-input', (_event, input) => {
        ptyProcess.write(input+"\r");
    }) 


    ptyProcess.onData((data) => {
        win.webContents.send('terminal-output', data)
    })
})
