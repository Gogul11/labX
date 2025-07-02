import React, { useEffect, useState } from 'react';
import Content from './content';
import { fetchFolder, openFolder } from '../../utils/flileExplorer';

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen : boolean
};

const FolderExplorer = () => {
  
  const [tree, setTree] = useState<FileNode[]>([]);
  const [dir, setDir] = useState<string>('')
  const [fetch, setFetch] = useState<boolean>(false)
  useEffect(() => {
    if(dir !== ''){
      setFetch(true)
      fetchFolder(dir)
        .then((data) => {
          setTree(data)
          setFetch(false)
        })
        .catch((err : any) => {
            window.alert("Oops, Error while fetching!")
            setFetch(false)
        })
    }
  }, [dir]);

 const renderTree = (nodes: FileNode[], level = 0) =>
  nodes.map((node) => (
    <div key={node.path} style={{ paddingLeft: level * 16 }}>
      <Content 
        isDir={node.isDir}
        name={node.name}
        toogle = {() => openFolder(node.path, setTree)}
      />
      {node.isDir && node.children && node.isOpen && renderTree(node.children, level + 1)}
    </div>
  ));

  return (
    <div className=" h-full w-full">

      {(dir === null || dir === '') ? 
        <div className='h-full flex flex-col gap-8 items-center justify-center'>
          <p
            className='text-[#c678dd] text-center font-bold max-w-[50%]'
          >You have not opened a folder, open a folder</p>
          <button
            className='bg-[#e06c75] w-[70%] h-10 rounded-lg text-[#282c34] font-bold'
            onClick={() => {
              window.electronApi.openDir().then(setDir)
              
            }}
          >open folder</button>
        </div>
        :
          fetch ? 
            <p className='text-[#61afef] text-center mt-10 text-lg font-bold'>Fetching files for you....</p>
            :
            renderTree(tree)
      }
    </div>
  );
};

export default FolderExplorer;