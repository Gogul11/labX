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
  if (!term || cursor.current === null || cursor.current < 0) return;

  //ctrl + c
  if(domEvent.ctrlKey && domEvent.key === 'c'){
    term.write('\r\n')
    window.electronApi.sendInput('SIGINT\r')
    return;
  }

  //ctrl + l
  if(domEvent.ctrlKey && domEvent.key === 'l'){
    window.electronApi.sendInput('\x0C\r')
    return;
  }

  // if (domEvent.key === 'ArrowUp') {
  //   window.electronApi.sendInput('\x1b[A');  // ANSI code for ↑
  //   return;
  // }

  //ctrl + a
  if (domEvent.ctrlKey && domEvent.key.toLowerCase() === 'a') {
    const moveLeft = cursor.current;
    if (moveLeft > 0) {
      term.write(`\x1b[${moveLeft}D`); // Move cursor to start
      cursor.current = 0;
    }
    return;
  }

  //ctrl + e
  if (domEvent.ctrlKey && domEvent.key.toLowerCase() === 'e') {
    const moveRight = input.current.length - cursor.current;
    if (moveRight > 0) {
      term.write(`\x1b[${moveRight}C`); // Move cursor to end
      cursor.current = input.current.length;
    }
    return;
  }

  // ENTER
  if (key === '\n' || domEvent.key === 'Enter') {
    term.write('\r\n');
    window.electronApi.sendInput(input.current + '\r' || '');
    input.current = '';
    cursor.current = 0;
    return;
  }

  // LEFT ARROW - move cursor left
  if (domEvent.key === 'ArrowLeft') {
    if (cursor.current > 0) {
      term.write('\x1b[D'); // Move cursor left
      cursor.current -= 1;
    }
    return;
  }

  // RIGHT ARROW - move cursor right
  if (domEvent.key === 'ArrowRight') {
    if (cursor.current < (input.current?.length || 0)) {
      term.write('\x1b[C'); // Move cursor right
      cursor.current += 1;
    }
    return;
  }

  // BACKSPACE - remove character before cursor
  if ((key === '\b' || domEvent.key === 'Backspace') && input.current && input.current.length > 0) {
    if (cursor.current === 0) return; // Beginning of input

    // Update input string
    input.current = 
      input.current.substring(0, cursor.current - 1) + 
      input.current.substring(cursor.current);

    // Update terminal display
    term.write('\x1b[D');  // Move cursor left
    term.write('\x1b[P');  // Delete character at cursor
    cursor.current -= 1;
    return;
  }

  // DELETE KEY - remove character at cursor position
  if (domEvent.key === 'Delete') {
    if (input.current && cursor.current < input.current.length) {
      // Update input string
      input.current = 
        input.current.substring(0, cursor.current) + 
        input.current.substring(cursor.current + 1);

      // Update terminal display
      term.write('\x1b[P');  // Delete character at cursor
      
      // Redraw remaining characters after cursor
      if (cursor.current < input.current.length) {
        const remaining = input.current.substring(cursor.current);
        term.write(remaining);
        // Move cursor back to position
        term.write(`\x1b[${remaining.length}D`);
      }
    }
    return;
  }

  // PRINTABLE CHARACTERS
  if (
    key.length === 1 &&
    key.charCodeAt(0) >= 32 &&
    key.charCodeAt(0) < 127 &&
    !domEvent.ctrlKey &&
    !domEvent.metaKey
  ) {
    // Insert at cursor position
    input.current = 
      (input.current || '').substring(0, cursor.current) + 
      key + 
      (input.current || '').substring(cursor.current);

    // Update terminal display
    term.write(key);
    
    // If inserting in middle, redraw remaining characters
    if (cursor.current < (input.current?.length || 0) - 1) {
      const remaining = input.current.substring(cursor.current + 1);
      term.write(remaining);
      // Move cursor back to position after inserted char
      term.write(`\x1b[${remaining.length}D`);
    }
    
    cursor.current += 1;
    return;
  }
};