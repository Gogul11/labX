import type { IpcMainInvokeEvent } from "electron";
import fs from 'fs'
import path from 'path'

export const openFile = async(
    _event : IpcMainInvokeEvent, 
    filePath : string
) => {
        try {
            if(filePath === '') return {data : '', ext : ''};
            const data : string = fs.readFileSync(filePath, 'utf-8')
            const ext : string = path.extname(filePath)
            const fileName : string = path.basename(filePath)
            return { data, ext, fileName}
        } catch (error) {
            console.log(error)
            return { data : '', ext : '', fileName : ''}
        }
    }