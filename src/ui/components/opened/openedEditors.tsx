import React, { useEffect, useState } from 'react';
import { EditorMapsStore } from '../../stores/editorsMap';


type openedEditorsObjectType = {
  isOpen : boolean,
  data : string
}

interface OpenedEditorsBarProps {
  editors: Record<string, openedEditorsObjectType>;
}

const OpenedEditorsBar: React.FC<OpenedEditorsBarProps> = ({ editors}) => {

  const tooggleOpenedEditors = EditorMapsStore((state) => state.toogleEditors)
  const deleteEditors = EditorMapsStore((state) => state.deleteEditor)

  const [editorNames, setEditorsName] = useState<Record<string, string>>({})

  useEffect(() => {
    (async() => {
      const retrivedNames = await Promise.all (Object.entries(editors).map(async([path]) => {
        const name = await window.electronApi.getFileName(path)
        return [path, name] as [string, string]
      }))
      setEditorsName(Object.fromEntries(retrivedNames))
    })();
  }, [editors])
  
  return (
    <div className="w-full bg-pink-600 h-full overflow-x-auto whitespace-nowrap flex items-center px-2 space-x-2 hide-scrollbar">
      {/* {editors.map((file) => (
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
      ))} */}
      {Object.entries(editors).map(([path, val]) => (
        <div
          key={path}
          className={`flex items-center px-3 py-1 rounded-md cursor-pointer text-sm text-white
            ${val.isOpen ? 'bg-gray-800' : 'hover:bg-pink-700'}
          `}
          onClick={() => tooggleOpenedEditors(path)}
        >
          <span>
            {editorNames[path]}
            {/* {file.isModified && <span className="text-red-400 ml-1">*</span>} */}
          </span>
          <span
            className="ml-2 file-close text-white hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              deleteEditors(path)
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
