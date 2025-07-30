import type { IpcMainInvokeEvent } from "electron";
import fs from 'fs'

export const ReadZipFile = (
    _event : IpcMainInvokeEvent,
    zipFilePath : string
) => {
    const buffer = fs.readFileSync(zipFilePath)
    // return new Blob([buffer], {type : 'application/zip'})
    return buffer
}