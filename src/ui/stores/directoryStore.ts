import { create } from "zustand";

type dirStoreType = {
    dir : string,
    setDir : (newDir : string) => void
}

export const dirStore = create<dirStoreType>((set) => ({
    dir : '',
    setDir : (newDir) => set({dir : newDir})
}))