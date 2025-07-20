type FileItem = {
  name: string;
  path: string;
  isDir: boolean;
};

export interface apiType {
    readDir: (path: string) => Promise<FileItem[]>,
    openDir : () => Promise<string>,
    createFile : (path : object) => void,
    createFolder : (path : object) => void,
    openFileExplorerMenu : (filePath : string) => void,
    newFileOrFolder : (func : (isDir : boolean) => void) => void,
    selectRenameFileOrFolder : (func : () => void) => void,
    renameFileOrFolder : (input : string, filePath : string) => void,
    openFile : (path : string) => Promise<{data : string, ext : string, fileName : string}>,
    getFileName : (path : string) => Promise<string>,

    saveTrigger : (func : () => void) => void,
    saveSelectedFile : (path : string, data : string) => Promise<boolean>,

    saveAllTrigger : (func : () => void) => void,

    submitWorkSpace : (folderPath : string, outputFolderName : string) => Promise<boolean>,

    startServer : (roomId : string) => Promise<boolean>
}

declare global {
    interface Window{
        electronApi : apiType
    }
}