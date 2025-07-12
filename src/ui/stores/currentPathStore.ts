import { create } from "zustand";

type currentPathStoreType = {
    path :  string,
    setPath : (path : string) => void
}

export const currentPathStore = create<currentPathStoreType>((set) => ({
    path : '',
    setPath : (path : string) => set({path : path})
}))