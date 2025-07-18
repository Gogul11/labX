import type { IpcMainInvokeEvent } from "electron"
import path from 'path'
import fs from 'fs'

export const CreateFile = (
    _event : IpcMainInvokeEvent, 
    filePath : {
            val : string,
            isDir : boolean, 
            name : string
        }
) => {
        const selectedPath = filePath.isDir ? filePath.val : path.dirname(filePath.val)
        const newFilePath = path.join(selectedPath, filePath.name)
        console.log(newFilePath)
        try {
            fs.writeFileSync(newFilePath, '')
            console.log("Written successfully")
        } catch (error) {
            console.log(error)
        }
    }