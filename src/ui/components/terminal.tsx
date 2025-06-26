import { useEffect, useRef, useState } from "react";
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
      terminal.current.writeln('Welcome to LabX Terminal\r\n');
      terminal.current.writeln("$")

      // terminal.current.onData((data : string) => {
      //   setInput(val => val + data)
      //   terminal.current?.write(data)
      //   console.log(input)
      // })
    }

    const handleResize = () => {
      fitAddon.current?.fit()
    }

    terminal.current?.onKey(({key, domEvent}) => {
        if(key === '\r'){
          terminal.current?.write('\r\n')
          console.log(input.current)
          window.electronApi.sendInput(input.current)
          terminal.current?.writeln('$');
          input.current = ""
        }
        else{
          input.current += key
          terminal.current?.write(key)
        }
    })
    
    window.addEventListener('resize', handleResize)

    return () => {
      terminal.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };

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
