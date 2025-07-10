import { Editor } from '@monaco-editor/react';

type propsType = {
  theme ?: string,
}

const LabXEditor : React.FC<propsType> = ({theme}) => {
  return (
    <div className='h-[100%] w-[100%]'>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue="// labX is live"
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
