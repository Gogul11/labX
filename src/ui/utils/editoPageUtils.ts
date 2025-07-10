
//Function responsible for opening and closing terminal
export const handleOpenTerminal = (
    event : KeyboardEvent,
    setEditorWidth : (width : number) => void,
    setShowTerminal : (show : boolean) => void,
    editorWidth : number,
    terminalWidth : number,
    showTerminal : boolean
) : void => {
     if((event.ctrlKey || event.metaKey) && event.key == 'k'){
        event.preventDefault()
        // window.electronApi.startTerminal()
        if(showTerminal)
            setEditorWidth(editorWidth + terminalWidth)
        else
            setEditorWidth(editorWidth - terminalWidth)
        setShowTerminal(!showTerminal)
    }
}

//Fucntion responisble for resizing the editor and terminal when screen size changes
export const handleScreenResize = (
    setEditorWidth : (width : number) => void,
    setTerminalWidth : (width : number) => void,
    setShowTerminal : (show : boolean) => void
) : void => {
    // window.electronApi.startTerminal()
    const newWidth = window.innerWidth;
    setEditorWidth(newWidth * 0.5)
    setTerminalWidth(newWidth * 0.5)
    setShowTerminal(true)

}

//Function responsible for calculating the editor and terminal size while resizing
export const handleRndResize = (
    _e : any,
    _dir : any,
    ref : any,
    _delta : any,
    _position : any,
    setEditorWidth : (width :  number) => void,
    setTerminalWidth : (width : number) => void,
) => {
    
    const newEditorWidth : number = ref.offsetWidth;
    const newTerminalWidth : number = window.innerWidth - newEditorWidth
    setEditorWidth(newEditorWidth)
    setTerminalWidth(newTerminalWidth)
}

//Default options for resizing
export const enableResizingOptions =  (enable : boolean) => {
    return{
        top:false,
        bottom:false,
        left : false,
        right : enable,
        bottomLeft : true,
        bottomRight : true,
        topLeft : true,
        topRight : true
    }
}

//Default dimensions for the resizable component
export const defaultRndSize = (editorWidth : number) => {
    return{
        x : 0,
        y : 0,
        height : '100%',
        width : editorWidth
    }
}

//Default max dimensions for the resizable component
export const rndSize = (editorWidth : number) => {
    return {
        width: editorWidth,
        height: '100%',
    }
}