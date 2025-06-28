import { app, ipcMain } from "electron";
import { Window } from "./window.js";
import { initiateTerminal } from "./terminal.js";
import { type IPty } from "node-pty";


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
})
