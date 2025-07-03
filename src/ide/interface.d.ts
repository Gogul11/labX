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
    createFolder : (path : object) => void
}

declare global {
    interface Window{
        electronApi : apiType
    }
}