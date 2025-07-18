import React, { useEffect, useState } from 'react';
import LabXEditor from '../../../components/editor';
import { currentPathStore } from '../../../stores/currentPathStore';
import { EditorMapsStore } from '../../../stores/editorsMap';

const EditorHost: React.FC = () => {
  const selectedPath = currentPathStore((state) => state.path);
  const setOpenedEditors = EditorMapsStore((state) => state.setOpenedEditors);
  const toogleEditors = EditorMapsStore((state) => state.toogleEditors);

  const [fileData, setFileData] = useState<{ data: string; ext: string } | null>(null);

  useEffect(() => {
    if (!selectedPath) return;

    (async () => {
      const res: { data: string; ext: string; fileName: string } = await window.electronApi.openFile(selectedPath);
      setOpenedEditors(selectedPath, true, res.data, res.ext);
      toogleEditors(selectedPath);
      setFileData({ data: res.data, ext: res.ext });
    })();
  }, [selectedPath]);

  return (
    <div className="w-full h-full">
      {selectedPath && fileData ? (
        <LabXEditor
          theme="vs-dark"
          value={fileData.data}
          ext={fileData.ext}
          path=''
        />
      ) : (
        <div className="text-gray-400 p-8">Click a file to open it here.</div>
      )}
    </div>
  );
};

export default EditorHost;
