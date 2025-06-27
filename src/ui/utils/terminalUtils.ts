import type React from "react";
import type { ITerminalOptions, Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";

export const TerminalConfig : ITerminalOptions = {
    cursorBlink : true,
    fontFamily: 'monospace',
    theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
    },
    cursorStyle : 'bar',
    cursorInactiveStyle:'underline'
}

export const handleResize = (fitAddon : React.RefObject<FitAddon | null>) => {
      fitAddon.current?.fit()
}


export const handleTerminalRunTime = (
  key: string,
  domEvent: KeyboardEvent,
  terminalRef: React.RefObject<Terminal | null>,
  input: React.RefObject<string>,
  cursor: React.RefObject<number>,
) => {
  const term = terminalRef.current;
  if (!term) return;

  // ENTER
  if (key === '\n' || domEvent.key === 'Enter') {
    term.write('\r\n');
    console.log(input.current);
    window.electronApi.sendInput(input.current)
    input.current = '';
    cursor.current = 0;
    return;
  }

  if (key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
    input.current += key
    term.write(key)
    cursor.current += 1;
    return;
  }
  
};
