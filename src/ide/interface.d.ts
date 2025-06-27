export interface apiType {
sendInput: (msg: string) => void;
receiveOutput : (func : (data : string) => void) => void;
}

declare global {
    interface Window{
        electronApi : apiType
    }
}