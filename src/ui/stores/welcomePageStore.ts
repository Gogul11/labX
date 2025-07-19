import { create } from "zustand";

type welcomePageStoreType = {
    isOpen : boolean,
    setOpen : (val : boolean) => void
}

export const welcomePageStore = create<welcomePageStoreType>((set) => ({
    isOpen : true,
    setOpen : (val : boolean) => set({isOpen : val})
}))