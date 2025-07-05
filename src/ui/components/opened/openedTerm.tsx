import React from 'react';

interface Terminal {
  id: string;
  name: string;
  isActive?: boolean;
}

interface OpenedTerminalsBarProps {
  terminals: Terminal[];
  onClickTerminal?: (id: string) => void;
  onCloseTerminal?: (e: React.MouseEvent, id: string) => void;
  onAddTerminal?: () => void;
}

const OpenedTerminalsBar: React.FC<OpenedTerminalsBarProps> = ({
  terminals,
  onClickTerminal,
  onCloseTerminal,
  onAddTerminal,
}) => {
  return (
    <div className="w-full bg-purple-700 h-full flex items-center px-1 space-x-1 relative">
      <button
        onClick={onAddTerminal}
        className="flex-shrink-0 px-3 py-1 text-white text-xl hover:bg-purple-800"
        title="New Terminal"
      >
        +
      </button>

      <div className="overflow-x-auto flex-1 whitespace-nowrap flex items-center space-x-2 hide-scrollbar pl-2">
        {terminals.map((term) => (
          <div
            key={term.id}
            className={`flex items-center px-3 py-1 rounded-md cursor-pointer text-sm text-white
              ${term.isActive ? 'bg-gray-800' : 'hover:bg-purple-800'}
            `}
            onClick={() => onClickTerminal?.(term.id)}
          >
            <span>{term.name}</span>
            <span
              className="ml-2 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTerminal?.(e, term.id);
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
