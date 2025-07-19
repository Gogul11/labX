import type { IpcMainInvokeEvent } from "electron"
import path from 'path'

export const getFileName = async(
    _event : IpcMainInvokeEvent, 
    filePath : string
) => {
        try {
            if(filePath === '') return null
            const filename : string = path.basename(filePath)
            return filename
        } catch (error) {
            console.log(error)            
        }
    }