import type { IpcMainInvokeEvent } from "electron"
import fs from 'fs'
import path from 'path'

export const RenameFileFolder = (
    _event : IpcMainInvokeEvent, 
    input : string, 
    filePath : string
) => {
        const isDir : boolean = fs.statSync(filePath).isDirectory()
        const dir = path.dirname(filePath)
        const newName = path.join(dir, input)
        try {
            if(!isDir){
                const ext = path.extname(filePath)
                if(path.extname(newName) === '')
                    fs.renameSync(filePath, newName+ext)
                else
                    fs.renameSync(filePath, newName)
            }
            else{
                fs.renameSync(filePath, newName)
            }
        } catch (error) {
            
        }
    }