import React from 'react';

interface OpenedEditor {
  id: string;
  name: string;
  isModified?: boolean;
  isActive?: boolean;
}

interface OpenedEditorsBarProps {
  editors: OpenedEditor[];
  onClickEditor?: (id: string) => void;
  onCloseEditor?: (e: React.MouseEvent, id: string) => void;
}

const OpenedEditorsBar: React.FC<OpenedEditorsBarProps> = ({ editors, onClickEditor, onCloseEditor }) => {
  return (
    <div className="w-full bg-pink-600 h-full overflow-x-auto whitespace-nowrap flex items-center px-2 space-x-2 hide-scrollbar">
      {editors.map((file) => (
        <div
          key={file.id}
          className={`flex items-center px-3 py-1 rounded-md cursor-pointer text-sm text-white
            ${file.isActive ? 'bg-gray-800' : 'hover:bg-pink-700'}
          `}
          onClick={() => onClickEditor?.(file.id)}
        >
          <span>
            {file.name}
            {file.isModified && <span className="text-red-400 ml-1">*</span>}
          </span>
          <span
            className="ml-2 file-close text-white hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onCloseEditor?.(e, file.id);
            }}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  );
};

export default OpenedEditorsBar;
