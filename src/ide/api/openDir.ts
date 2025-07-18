import type { BrowserWindow, IpcMainInvokeEvent } from "electron"
import { dialog } from "electron"

export const OpenDir = async (
    _event : IpcMainInvokeEvent,
    win : BrowserWindow
) => {
    const result = await dialog.showOpenDialog(win, {
        properties : ['openDirectory', 'openFile']
    })
    if(!result.canceled && result.filePaths.length > 0)
        return result.filePaths[0]
    return ''
}