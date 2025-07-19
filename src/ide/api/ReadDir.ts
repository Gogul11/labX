import type { IpcMainInvokeEvent } from "electron"
import fs from 'fs'
import path from 'path'

export const ReadDir = async(
    _event : IpcMainInvokeEvent, 
    input : string
) => {
        const files =  fs.readdirSync(input)
        const result = []

        for(const file of files){
            try {
                const fullPath = path.join(input, file)
                if(file.startsWith('.')) continue
                result.push({
                    name : file,
                    path : fullPath,
                    isDir : fs.statSync(fullPath).isDirectory()
                })
            } catch (error) {
                continue
            }
        }
        return result
    }