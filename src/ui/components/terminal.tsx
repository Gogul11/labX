import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import 'xterm/css/xterm.css'

const LabXTerminal: React.FC = () => {

  const terminalParent = useRef<HTMLDivElement>(null)
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null)

  const input = useRef<string>("")

  useEffect(() => {
    if(terminalParent.current){

      terminal.current = new Terminal({
        cursorBlink : true,
        fontFamily: 'monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#ffffff'
        },
        cursorStyle : 'block',
        cursorInactiveStyle:'block'
      }) 
      
      fitAddon.current = new FitAddon();

      terminal.current.loadAddon(fitAddon.current)
      terminal.current.open(terminalParent.current)
      fitAddon.current.fit();

    }

    const handleResize = () => {
      fitAddon.current?.fit()
    }

    terminal.current?.onKey(({ key }) => {
      if (key === '\r') {
        window.electronApi.sendInput(input.current);
        input.current = "";
      } else {
        input.current += key;
        terminal.current?.write(key);
      }
    });

    
    window.addEventListener('resize', handleResize)

    return () => {
      terminal.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };

  }, [])

  useEffect(() => {
          window.electronApi.receiveOutput((data : string) => {
            terminal.current?.write('\x1b[2K');
            terminal.current?.write('\r');
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
