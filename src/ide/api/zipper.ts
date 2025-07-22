import AdmZip from 'adm-zip'
import type { IpcMainInvokeEvent } from 'electron'
import path from 'path'

export const zipFolder = async (
    _event : IpcMainInvokeEvent,
    folderPath : string, 
    outputFolderName : string
) => {
    try{
        const zip = new AdmZip()
        zip.addLocalFolder(folderPath)
        
        const parentDir = path.dirname(folderPath);
        const outputZipPath = path.join(parentDir, `${outputFolderName}.zip`);

        zip.writeZip(outputZipPath);
        console.log("✅ Zip written to:", outputZipPath);

        return outputZipPath
    }
    catch(e){
        console.log("failure ", e)

        return null
    }
}