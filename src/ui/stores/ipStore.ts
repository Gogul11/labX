import { create } from "zustand";

type ipStoreType = {
    ip : string,
    setIp : (ip : string) => void
}

export const ipStore = create<ipStoreType>((set) => ({
    ip : '',
    setIp : (ip : string) => set({ip : ip})

}))