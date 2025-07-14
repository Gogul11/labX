import { create } from "zustand";

type TerminalEntry = {
    name : string,
    isActive : boolean
}

type openedTerminalStoreType = {
    openedTerminal : Record<string, TerminalEntry>,
    terminalCount : number,
    addNewTerminal : (name ?: string) => void,
    toogelTerminal : (id : string) => void,
    deleteTerminal : (id : string) => void,
}

export const openedTerminalStore = create<openedTerminalStoreType>((set) => ({
    openedTerminal : {},
    terminalCount : 0,

    addNewTerminal : (name ?: string) => set((state) => {
        const newId = `id${state.terminalCount+1}`

        const updatedTerminals : Record<string, TerminalEntry> = {}

        for(const key in state.openedTerminal){
            updatedTerminals[key] = {
                ...state.openedTerminal[key],
                isActive : false
            }
        }

        updatedTerminals[newId] = {
            name : name ?? `Terminal ${state.terminalCount + 1}`,
            isActive : true
        }

        return{
            openedTerminal : updatedTerminals,
            terminalCount : state.terminalCount + 1
        }
    }),

    toogelTerminal : (id : string) => set((state) => {

        const updatedTerminals : Record<string, TerminalEntry> = {}

        for(const term in state.openedTerminal){
            updatedTerminals[term] = {
                ...state.openedTerminal[term],
                isActive : false
            }
        }

        updatedTerminals[id] = {
            ...state.openedTerminal[id],
            isActive : true
        }

        return{
            openedTerminal : updatedTerminals
        }
    }),
    
    deleteTerminal: (id: string) => set((state) => {
        const updated = { ...state.openedTerminal };

        if (updated[id]?.isActive) {
            const remainingIds = Object.entries(updated)
                .filter(([tid]) => tid !== id && tid !== '')
                .map(([key]) => key);

            if (remainingIds.length > 0 && id !== '') {
                const lastId = remainingIds[remainingIds.length - 1];
                updated[lastId] = {
                    ...updated[lastId],
                    isActive: true,
                };
            }
        }

        delete updated[id];

        return {
            openedTerminal: updated,
            terminalCount: Math.max(0, state.terminalCount - 1),
        };
    })

}))