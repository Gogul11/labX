import { type App, BrowserWindow, screen } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import path from "node:pa"

export const Window = (_app : App) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const {height, width} = screen.getPrimaryDisplay().workAreaSize

    const minHeight = Math.floor(height * 0.8)
    const minWidth = Math.floor(width * 0.8)

    const win : BrowserWindow = new BrowserWindow({
        minWidth : minWidth,
        minHeight : minHeight,
        width : width,
        height : height,
        show : false,
        webPreferences : {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true        
        }
    })
    
    // win.loadURL("http://localhost:5173/")
 
    win.loadFile(path.join(__dirname, '../dist-ui/index.html'))
    
    win.once('ready-to-show', () => {
        win.show()
    })


    return win;
}