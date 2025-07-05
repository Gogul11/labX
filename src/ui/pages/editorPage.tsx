import { useEffect, useState } from 'react';
import LabXEditor from '../components/editor';
import LabXTerminal from '../components/terminal';
import OpenedEditors from '../components/opened/openedEditors';
import OpenedTerminals from '../components/opened/openedTerm';
import { Rnd } from 'react-rnd';
import { 
    defaultRndSize, 
    enableResizingOptions, 
    handleOpenTerminal, 
    handleRndResize, 
    handleScreenResize, 
    rndSize } from '../utils/editoPageUtils';

// Define the Editor type
interface Editor {
  id: string;
  name: string;
  isModified?: boolean;
  isActive?: boolean;
}

// Define the Terminal type
interface Terminal {
  id: string;
  name: string;
  isActive?: boolean;
}

const EditorPage = () => {

    const[showTerminal, setShowTerminal] = useState<boolean>(false)
    const[terminalWidth, setTerminalWidth] = useState<number>(window.innerWidth * 0.5)
    const[editorWidth, setEditorWidth] = useState<number>(window.innerWidth)
  const [editors, setEditors] = useState<Editor[]>([
    { id: '1', name: 'App.tsx', isModified: true },
    { id: '2', name: 'editorPage.tsx', isModified: true, isActive: true },
    { id: '3', name: 'window.ts' },
    { id: '4', name: 'tsconfig.json' }
  ]);

  const handleEditorClick = (id: string) => {
    setEditors((prev) =>
      prev.map((file) => ({ ...file, isActive: file.id === id }))
    );
  };

  const handleEditorClose = (_e: React.MouseEvent, id: string) => {
    setEditors((prev) => prev.filter((file) => file.id !== id));
  };

  const [terminals, setTerminals] = useState<Terminal[]>([
    { id: 't1', name: 'Terminal 1', isActive: true },
    { id: 't2', name: 'Terminal 2' }
  ]);

  const handleTerminalClick = (id: string) => {
    setTerminals((prev) =>
      prev.map((term) => ({ ...term, isActive: term.id === id }))
    );
  };

  const handleTerminalClose = (_e: React.MouseEvent, id: string) => {
    setTerminals((prev) => prev.filter((term) => term.id !== id));
  };

  const handleTerminalAdd = () => {
    const nextIndex = terminals.length + 1;
    const newId = `t${nextIndex}`;
    setTerminals((prev) => [
      ...prev.map((term) => ({ ...term, isActive: false })),
      { id: newId, name: `Terminal ${nextIndex}`, isActive: true },
    ]);
  };

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
                    <div className='h-[97%] w-full border border-green-500'>
                        <LabXEditor theme="vs-dark"/>
                    </div>
                </Rnd>

                {/* Terminal */}
                {showTerminal && 
                    <div className="h-[98%] absolute top-0 -right-0 overflow-hidden" 
                        style={{width : terminalWidth}}>
                        <LabXTerminal />
                    </div>}
                
                <div className='h-[4%] flex w-full absolute bottom-0 border border-red-600'>
                    <div className='w-[47%] bg-pink-600 h-full hide-scrollbar'>
                         <OpenedEditors editors={editors}
                         onClickEditor={handleEditorClick}
                         onCloseEditor={handleEditorClose}/> 
                    </div>

                    <div className='w-[6%] bg-fuchsia-600 h-full hide-scrollbar'>
                    </div>

                    <div className='w-[47%] bg-indigo-600 h-full'>
                        <OpenedTerminals 
                            terminals={terminals} 
                            onClickTerminal={handleTerminalClick} 
                            onCloseTerminal={handleTerminalClose} 
                            onAddTerminal={handleTerminalAdd}/>
                    </div>
                </div>
        </div>
    );
};

export default EditorPage;
