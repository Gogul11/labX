import { create } from "zustand";

type EditorEntry = {
    isOpen : boolean,
    data : string
}

type editorMapsType = {
    openedEditors : Record<string, EditorEntry>,
    setOpenedEditors : (path : string, open : boolean, data : string) => void,
    toogleEditors : (path : string) => void
}

export const EditorMapsStore = create<editorMapsType>((set) => ({
    openedEditors : {},
    setOpenedEditors : (path : string, open : boolean, data : string) => set((state) => ({
        openedEditors : {
            ...state.openedEditors,
            [path] : {
                isOpen : open,
                data : data
            }
        }
    })),
    toogleEditors : (path : string) => set((state) => {
        const current = state.openedEditors
        const updatedMap : Record<string, EditorEntry> = {}

        for(const key in current){
                updatedMap[key] = {
                    ...current[key],
                    isOpen : key === path
                }
        }
        return {
            openedEditors : updatedMap
        }
    }) 
}))