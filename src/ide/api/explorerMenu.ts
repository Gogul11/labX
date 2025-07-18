import type { IpcMainInvokeEvent } from "electron"
import { Menu } from "electron"
import { BrowserWindow } from "electron"
import { contextMenuItems } from "../utils.js";

export const ExplorerMenu = (
    event : IpcMainInvokeEvent, 
    filePath : string,
    win : BrowserWindow
) => {
    console.log("right click pressed")
    console.log(filePath)
    const menu = Menu.buildFromTemplate(contextMenuItems(win, filePath))
    const send = BrowserWindow.fromWebContents(event.sender)
    if(send)
        menu.popup({window : send})
    else
        menu.popup()
}