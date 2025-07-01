import { type App, BrowserWindow } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import path from "node:pa"

export const Window = (_app : App) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);


    const win : BrowserWindow = new BrowserWindow({
        minWidth : 700,
        minHeight : 700,
        width : 900,
        height : 900,
        show : false,
        webPreferences : {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true        
        }
    })
    
    win.loadURL("http://localhost:5173/")
 
    // win.loadFile(path.join(__dirname, '../dist-ui/index.html'))
    
    win.once('ready-to-show', () => {
        win.show()
    })


    return win;
}