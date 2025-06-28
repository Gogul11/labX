import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import 'xterm/css/xterm.css'
import { handleResize, handleTerminalRunTime, TerminalConfig } from "../utils/terminalUtils";

const LabXTerminal: React.FC = () => {

  const terminalParent = useRef<HTMLDivElement>(null)
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null)

  const input = useRef<string>("")
  const cursor = useRef<number>(0)
  

  useEffect(() => {
    if(terminalParent.current){
      terminal.current = new Terminal(TerminalConfig) 
      fitAddon.current = new FitAddon();
      terminal.current.loadAddon(fitAddon.current)
      terminal.current.open(terminalParent.current)
      fitAddon.current.fit();

      window.electronApi.startTerminal()
    }

    
    terminal.current?.onKey(({ key, domEvent }) => {
        handleTerminalRunTime(key, domEvent, terminal, input, cursor)
    });

    
    window.addEventListener('resize', () => handleResize(fitAddon))

    return () => {
      terminal.current?.dispose();
      window.removeEventListener("resize", () =>  handleResize(fitAddon));
    };

  }, [])

  useEffect(() => {
          window.electronApi.receiveOutput((data : string) => {
                terminal.current?.write(data)
          })
  }, [])

  return(
    <div className="flex h-full w-full ">
      <div 
        className="h-full w-full hide-scrollbar"
        ref={terminalParent} >
      </div>
    </div>
  )
  
};

export default LabXTerminal;
