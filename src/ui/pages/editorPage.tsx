import { useEffect, useState } from 'react';
import LabXEditor from '../components/editor';
import LabXTerminal from '../components/terminal';
import OpenedEditors from '../components/opened/openedEditors';
import OpenedTerminals from '../components/opened/openedTerm';
// import type { Terminal } from '../types/types'
import { Rnd } from 'react-rnd';
import { 
    defaultRndSize, 
    enableResizingOptions, 
    handleOpenTerminal, 
    handleRndResize, 
    handleScreenResize, 
    rndSize } from '../utils/editoPageUtils';
import { sideBarStore } from '../stores/sideBarStore';
import { currentPathStore } from '../stores/currentPathStore';
import { EditorMapsStore } from '../stores/editorsMap';
import { openedTerminalStore } from '../stores/terminlasStore';
import { GiDolphin } from "react-icons/gi";
import { ActivePathStore } from '../stores/activePathStore';
import { ModifiedFileStore } from '../stores/modifiedFileStore';
import { showTerminalStore } from '../stores/showTerminalStore';

const EditorPage = () => {

    // const[showTerminal, setShowTerminal] = useState<boolean>(false)
    const[terminalWidth, setTerminalWidth] = useState<number>(window.innerWidth * 0.5)
    const[editorWidth, setEditorWidth] = useState<number>(window.innerWidth)
    
    //stores
    const toogleSideBar = sideBarStore((state) => state.toggle)

    const showTerminal = showTerminalStore((state) => state.open)
    const setShowTerminal = showTerminalStore((state) => state.toogle)

    //selectedPath store 
    const selectedPath = currentPathStore((state) => state.path)

    //Editor related
    const openedEditors = EditorMapsStore((state) => state.openedEditors)
    const setOpenedEditors = EditorMapsStore((state) => state.setOpenedEditors)
    const toogleEditors = EditorMapsStore((state) => state.toogleEditors)

    //terminals
    const openedTerminals = openedTerminalStore((state) => state.openedTerminal)

    //Responsible for closing and opeing terminal
    useEffect(() => {
        const openTerminal = (event : KeyboardEvent) : void => {
           handleOpenTerminal(event, setEditorWidth, setShowTerminal, editorWidth, terminalWidth, showTerminal)
        }

        window.addEventListener('keydown', openTerminal)

        return () => {
            window.removeEventListener('keydown', openTerminal);
        }
    }, [showTerminal, terminalWidth, editorWidth])

    //Responsible for editor and terminal size when the screen size changes
    useEffect(() => {
        window.addEventListener('resize', () => handleScreenResize(setEditorWidth, setTerminalWidth, setShowTerminal))

        return () => window.removeEventListener('resize', () => handleScreenResize(setEditorWidth, setTerminalWidth, setShowTerminal))

    }, [editorWidth, terminalWidth])

    useEffect(() => {
      (async () => {
        const res : {data : string, ext : string, fileName : string} = await window.electronApi.openFile(selectedPath);
        console.log(selectedPath)
        setOpenedEditors(selectedPath, true, res.data, res.ext)
        toogleEditors(selectedPath)
      })();
    }, [selectedPath]);

   useEffect(() => {
        window.electronApi.saveTrigger(() => {
            const saveFile = async () => {
                const path = ActivePathStore.getState().path;
                const editors = EditorMapsStore.getState().openedEditors;

                const entry = editors[path];

                if (entry) {
                    const res: boolean = await window.electronApi.saveSelectedFile(path, entry.data);
                    console.log(path, entry);

                    if (res) console.log("success");
                    else console.log("fail");
                }
            };

            saveFile();
        });
    }, []); // only once on mount


    useEffect(() => {
        window.electronApi.saveAllTrigger(() => {
            if(ModifiedFileStore.getState().files.length <= 0){
                window.alert("Nothing to save for now")
                return;
            }
            const saveAllFile = async () => {
                const openedFiles = ModifiedFileStore.getState().files
                for(const val in openedFiles){
                    console.log(openedFiles[val])
                    const res: boolean = await window.electronApi.saveSelectedFile(openedFiles[val], EditorMapsStore.getState().openedEditors[openedFiles[val]].data);
                     if (res) console.log("success");
                    else console.log("fail");
                }
                ModifiedFileStore.getState().clearFiles()
            }


            saveAllFile()
        })
    }, [])
    
    return (
        <div className="flex h-screen gap-6 w-screen">

                {/* Editor */}
                <Rnd
                    default={defaultRndSize(editorWidth)}
                    size={rndSize(editorWidth)}
                    minWidth={400}
                    maxWidth={showTerminal ? window.innerWidth-300 : window.innerWidth - 5}
                    onResize={(e, dir, ref, delta, position) => 
                        handleRndResize(e, dir, ref, delta, position, setEditorWidth, setTerminalWidth)}
                    disableDragging
                    enableResizing = {enableResizingOptions(showTerminal)}
                    className='hide-scrollbar'
                >
                    {Object.entries(openedEditors).map(([path, vals]) => (
                      vals.isOpen && 
                      <div className='h-[96%] w-full'>
                          <LabXEditor theme="vs-dark"
                            key={path} 
                            value={vals.data}
                            ext={vals.ext}
                            path = {path}
                          />
                      </div>
                    ))}
                </Rnd>

                {/* Terminal */}
                {showTerminal && 
                    <div className="h-[96%] absolute top-0 -right-0 overflow-hidden"
                        style={{width : terminalWidth}}>
                          {Object.entries(openedTerminals).map(([id, term]) => (
                            term.isActive && <LabXTerminal key={id} />
                        ))}

                    </div>}
                
                <div className='h-[4%] flex w-full absolute bottom-0 border'>
                    <div className='w-[47%]  h-full hide-scrollbar'>
                         <OpenedEditors editors={openedEditors}/> 
                    </div>

                    <div 
                      className='w-[6%] bg-indigo-600 h-full hide-scrollbar cursor-pointer flex justify-center items-center rounded-md'
                      onClick={toogleSideBar}
                    >
                        <GiDolphin size={30}/>
                    </div>

                    <div className='w-[47%] bg-indigo-900 h-full'>
                        <OpenedTerminals />
                    </div>
                </div>
        </div>
    );
};

export default EditorPage;
