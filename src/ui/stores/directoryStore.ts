import { create } from "zustand";

type dirStoreType = {
    dir : string,
    initialFetch : boolean,
    setInitialFetch : () => void
    setDir : (newDir : string) => void
}

export const dirStore = create<dirStoreType>((set) => ({
    dir : '',
    setDir : (newDir) => set({dir : newDir}),

    initialFetch : false,
    setInitialFetch : () => set((state) => ({
        initialFetch : !state.initialFetch
    }))
}))