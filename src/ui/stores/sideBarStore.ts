import { create } from 'zustand'

type Tab = 'files' | 'open' | 'chat' | 'connect' | 'download' | 'connectClient' | 'connectHost' | ' ';


type SideBarState = {
    activeTab : Tab,
    setAcitveTab : (tab : Tab) => void,
    isOpen : boolean,
    toggle : () => void
}

export const sideBarStore = create<SideBarState>((set) => ({
  activeTab : ' ',
  setAcitveTab : (tab : Tab) => set({activeTab : tab}),
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))
