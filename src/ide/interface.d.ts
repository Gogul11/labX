type FileItem = {
  name: string;
  path: string;
  isDir: boolean;
};

export interface apiType {
	deleteFileOrFolder(val: string): unknown;
	deleteFileOrFolderTrigger(arg0: (filePath: string) => void): unknown;
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

    submitWorkSpace : (folderPath : string, outputFolderName : string) => Promise<string>,

    startServer : (roomId : string, roomName : string, portNo : string, storageDir : string) => Promise<boolean>,

    readZipContent : (zipFilePath : string) => Promise<Blob>,

    invokeOpenDir : (func : () => void) => void,
}

declare global {
    interface Window{
        electronApi : apiType
    }
}