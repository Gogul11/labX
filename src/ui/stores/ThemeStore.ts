import { create } from "zustand";

type themeType = "dark" | "light"

interface props {
    theme : themeType,
    setTheme : (t : themeType) => void
}

export const colorThemeStore = create<props>((set) => ({
    theme : "light",
    setTheme : (t : themeType) => set({theme : t})
}))