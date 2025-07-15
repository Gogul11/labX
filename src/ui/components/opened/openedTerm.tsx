import React from 'react';
import { openedTerminalStore } from '../../stores/terminlasStore';


const OpenedTerminalsBar: React.FC = () => {

  const terminals = openedTerminalStore((state) => state.openedTerminal)
  const openNewTerminal = openedTerminalStore((state) => state.addNewTerminal)
  const toogleTerminal = openedTerminalStore((state) => state.toogelTerminal)
  const deleteTerminal = openedTerminalStore((state) => state.deleteTerminal)

  return (
    <div className="w-full bg-purple-700 h-full flex items-center px-1 space-x-1 relative">
      <button
        onClick={() => openNewTerminal()}
        className="flex-shrink-0 px-3 py-1 text-white text-xl hover:bg-purple-800"
        title="New Terminal"
      >
        +
      </button>

      <div className="overflow-x-auto flex-1 whitespace-nowrap flex items-center space-x-2 hide-scrollbar pl-2">
        {Object.entries(terminals).map(([id, term]) => (
          <div
            key={id}
            className={`flex items-center px-3 py-1 rounded-md cursor-pointer text-sm text-white
              ${term.isActive ? 'bg-gray-800' : 'hover:bg-purple-800'}
            `}
            onClick={() => toogleTerminal(id)}
          >
            <span>{term.name}</span>
            <span
              className="ml-2 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                deleteTerminal(id)
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenedTerminalsBar;
