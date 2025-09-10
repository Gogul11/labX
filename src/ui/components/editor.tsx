import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { EditorMapsStore } from '../stores/editorsMap';
import Loader from './loader';
import { colorThemeStore } from '../stores/ThemeStore';
import { getMonacoLanguageFromExtension } from '../utils/programingLanguageMapUtils';

type propsType = {
  value : string,
  ext : string,
  path : string,
  read : boolean
}

const LabXEditor : React.FC<propsType> = ({value, ext, path, read}) => {

  const [val, setVal] = useState<string>(value)
  const setEditorData = EditorMapsStore((state) => state.setEditorData)
  const theme = colorThemeStore((state) => state.theme)

  useEffect(() => {
    setVal(val)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
        setEditorData(path, val)    
    }, 500)

    return () => clearTimeout(timer)
  }, [val, value, path, setEditorData])

  return (
    <div className='h-[100%] w-[100%]'>
      <Editor
        height="100%"
        width="100%"
        language={getMonacoLanguageFromExtension(ext)}
        value={value}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: {
            top: 16,
            bottom: 16,
          },
          readOnly:read
        }}
        onChange={(val) => setVal(val ?? '')}
        loading={<Loader message='Opening File'/>}
      />
    </div>
  );
};

export default LabXEditor;
