import { create } from "zustand";

type EditorEntry = {
    isOpen : boolean,
    data : string,
    ext  : string
}

type editorMapsType = {
    openedEditors : Record<string, EditorEntry>,
    setOpenedEditors : (path : string, open : boolean, data : string, ext : string) => void,
    toogleEditors : (path : string) => void,
    deleteEditor : (path : string) => void,
    setEditorData : (path : string, data : string) => void,
}

export const EditorMapsStore = create<editorMapsType>((set) => ({
    openedEditors : {},

    setOpenedEditors : (path : string, open : boolean, data : string, ext : string) => set((state) => ({
        openedEditors : {
            ...state.openedEditors,
            [path] : {
                isOpen : open,
                data : data,
                ext : ext
            }
        }
    })),

    setEditorData : (path : string, data : string) => set((state) => ({
        openedEditors : {
            ...state.openedEditors,
            [path] : {
                ...state.openedEditors[path],
                data : data
            }
        }
    })),

    toogleEditors : (path : string) => set((state) => {
        const current = state.openedEditors
        const updatedMap : Record<string, EditorEntry> = {}

        for(const key in current){
                if(key === '')
                    delete updatedMap[''];
                else{
                    updatedMap[key] = {
                        ...current[key],
                        isOpen : key == path
                    }
                }
        }
        return {
            openedEditors : updatedMap
        }
    }),
    
    deleteEditor : (path : string) => set((state) => {
        const updated = {...state.openedEditors}
        if(updated[path].isOpen){
            const updatedPaths = Object.entries(updated).filter(([p]) => p !== path && p!== '').map(([key]) => key)

            if(updatedPaths.length > 0 && path !== ''){
                updated[updatedPaths[updatedPaths.length - 1]] = {
                    ...updated[updatedPaths[updatedPaths.length - 1]],
                    isOpen : true
                }
            }
        }
    
        delete updated[path]

        return {
            openedEditors : updated
        }
    }) 
}))