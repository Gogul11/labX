import { app, BrowserWindow, ipcMain } from "electron";
import { Window } from "./window.js";


app.on('ready', () => {

    ipcMain.on('terminal-input', (event, input) => {
        console.log(input)
    })
    Window(app)   
})
