import { create } from "zustand";

type showTerminalType = {
    open : boolean,
    toogle : () => void
}

export const showTerminalStore = create<showTerminalType>((set) => ({
    open : true,
    toogle : () => set((state) => ({open : !state.open}))
}))