export interface apiType {
sendInput: (msg: string) => void;
}

declare global {
    interface Window{
        electronApi : apiType
    }
}