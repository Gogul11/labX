import React, { useEffect, useState } from 'react';
import { EditorMapsStore } from '../stores/editorsMap';
import { ActivePathStore } from '../stores/activePathStore';
import { ModifiedFileStore } from '../stores/modifiedFileStore';
import { currentStyle } from '../utils/styleChooser';


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
  const ActiveEditorPath = ActivePathStore((state) => state.setPath)
  const ModifiedFiles = ModifiedFileStore((state) => state.setFiles)

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
    <div 
      className="w-full h-full overflow-x-scroll whitespace-nowrap flex items-center  space-x-[1px] hide-scrollbar"
      style={{backgroundColor : currentStyle('bottomBar.bg')}}
    >
      {Object.entries(editors).map(([path, val]) => (
        <div
          key={path}
          className="flex items-center px-3 py-1 h-full cursor-pointer text-sm"
          style={{
            backgroundColor : val.isOpen ? currentStyle('bottomBar.componentActive') : currentStyle('bottomBar.componentBg'),
            color : currentStyle('bottomBar.text')
          }}
          onClick={() => {
            tooggleOpenedEditors(path)
            ActiveEditorPath(path)
            ModifiedFiles(path)
          }}
        >
          <span>
            {editorNames[path]}
          </span>
          <span
            className="ml-2 file-close text-lg"
            style={{color : currentStyle('bottomBar.crossIcon')}}
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
