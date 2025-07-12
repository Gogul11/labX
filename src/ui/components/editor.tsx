import { Editor } from '@monaco-editor/react';

type propsType = {
  theme ?: string,
  value : string,
  ext : string
}

const LabXEditor : React.FC<propsType> = ({theme, value, ext}) => {
  return (
    <div className='h-[100%] w-[100%]'>
      <Editor
        height="100%"
        width="100%"
        // defaultLanguage={ext}
        // defaultValue="// labX is live"
        language={ext}
        value={value}
        theme={theme}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
    </div>
  );
};

export default LabXEditor;
