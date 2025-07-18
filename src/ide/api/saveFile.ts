import type { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'

export const saveSelectedFileFunc = async(
    _event : IpcMainInvokeEvent, 
    path : string, 
    data : string
) : Promise<boolean> => {
        try {
            fs.writeFileSync(path,data)
            console.log("File Writtern")
            return true
        } catch (error) {
            console.log(error)
            return false            
        }
}