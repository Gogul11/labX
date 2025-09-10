import { colorThemeStore } from "../stores/ThemeStore"
import { darkTheme, lightTheme } from "./colors"

const getStyle = (obj : any, path : string) : string => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export const currentStyle = (s : string) => {

    let style : string = '';
    switch(colorThemeStore.getState().theme){
        case "dark":
            return getStyle(darkTheme, s)
        case "light":
            return getStyle(lightTheme, s)
        default:
            return getStyle(darkTheme, s)
    }

    return style;
}