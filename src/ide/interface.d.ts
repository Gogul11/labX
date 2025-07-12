type FileItem = {
  name: string;
  path: string;
  isDir: boolean;
};

export interface apiType {
    sendInput: (msg: string) => void;
    receiveOutput : (func : (data : string) => void) => void;
    startTerminal : () => void,
    readDir: (path: string) => Promise<FileItem[]>,
    openDir : () => Promise<string>,
    createFile : (path : object) => void,
    createFolder : (path : object) => void,
    openFileExplorerMenu : (filePath : string) => void,
    newFileOrFolder : (func : (isDir : boolean) => void) => void,
    selectRenameFileOrFolder : (func : () => void) => void,
    renameFileOrFolder : (input : string, filePath : string) => void,
    openFile : (path : stirng) => Promise<{data : string, ext : string, fileName : string}>,
    getFileName : (path : string) => Promise<string>
}

declare global {
    interface Window{
        electronApi : apiType
    }
}