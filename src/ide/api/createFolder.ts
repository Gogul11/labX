import type { IpcMainInvokeEvent } from "electron"
import path from 'path'
import fs from 'fs'

export const CreateFolder = (
    _event : IpcMainInvokeEvent, 
    folderPath : {
            val : string, 
            isDir : Boolean, 
            name : string
        }
) => {
        const selectedPath = folderPath.isDir ? folderPath.val : path.dirname(folderPath.val)
        const newFolderPath = path.join(selectedPath, folderPath.name)
        console.log(newFolderPath)
        try {
            fs.mkdirSync(newFolderPath)
        } catch (error) {
            console.log(error)
        }
    }