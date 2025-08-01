import React, { useEffect, useState } from 'react';
import type { Client } from '../../../types/types';
import Content from '../../fileExplorer/content';
import { fetchFolder, openFolder } from '../../../utils/flileExplorer';
import { io } from 'socket.io-client';
import { ipStore } from '../../../stores/ipStore';

interface Props {
  client?: Client;
}

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen: boolean;
};

const ClientFolderView: React.FC<Props> = ({ client }) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState({ val: '', isDir: false });
  const [fetch, setFetch] = useState<boolean>(false);
  const [folderPath, setFolderPath] = useState<string>('');

  useEffect(() => {
    const soc = io(ipStore.getState().ip);

    if (client) {
      const { regNo } = client;

      soc.emit('get-student-folder', regNo);

      const handleNotFound = () => {
        window.alert(`Student ${regNo} not in the room`);
        setFolderPath('');
        refresh();
      };
      const handleFolderMissing = () => {
        window.alert(`Student ${regNo} has not yet submitted`);
        setFolderPath('');
        refresh();
      };
      const handleFolderFound = (path: string) => {
        setFolderPath(path);
        setTimeout(() => refresh(path), 0);
      };

      soc.on('student-not-found', handleNotFound);
      soc.on('student-folder-not-found', handleFolderMissing);
      soc.on('student-folder-found', handleFolderFound);
    }

    return () => {
      soc.disconnect();
    };
  }, [client]);

  const refresh = (newPath = folderPath) => {
    if (newPath === '') return;

    fetchFolder(newPath)
      .then((data) => {
        setTree(data);
        setFetch(false);
      })
      .catch((_err: any) => {
        const parentDir = newPath.split('/').slice(0, -1).join('/');
        if (parentDir && parentDir !== newPath) {
          fetchFolder(parentDir)
            .then((data) => {
              setTree(data);
              setSelectedPath({ val: parentDir, isDir: true });
              setFetch(false);
            })
            .catch((_e: any) => {
              window.alert('Oops, Error while fetching!');
              setFetch(false);
            });
        } else {
          window.alert('Oops, Error while fetching!');
          setFetch(false);
        }
      });
  };

  const renderTree = (nodes: FileNode[], level = 0) =>
    nodes.map((node) => (
      <div
        key={node.path}
        style={{ paddingLeft: level + 16 }}
        className={`
          group transition-all duration-150 rounded-sm
          ${selectedPath.val === node.path ? 'bg-[#3e4451] text-[#abb2bf]' : ''}
          ${node.isDir ? 'text-[#61afef]' : 'text-[#e5c07b]'}
        `}
      >
        <Content
          isDir={node.isDir}
          name={node.name}
          toogle={() => openFolder(node.path, setTree, tree)}
          select={(p: typeof selectedPath) => setSelectedPath(p)}
          path={node.path}
        />
        {node.isDir && node.children && node.isOpen && renderTree(node.children, level + 1)}
      </div>
    ));

  if (!client) {
    return <div className="p-5 bg-[#21252b] text-[#abb2bf]">Select a client to view their folder.</div>;
  }

  if (fetch) {
    return <div className="p-5 bg-[#21252b] text-[#abb2bf]">Fetching folder</div>;
  }

  return (
    <div className="flex flex-col p-5 bg-[#21252b] text-[#abb2bf] border-r border-[#3e4451] h-[90%]">
      <h2 className="mb-4">
        <span className="text-[#61afef] text-2xl font-bold mr-2">{client.name}</span>
        <span className="text-[#e5c07b] text-xl font-bold font-mono">{client.regNo}</span>
      </h2>

      <div className="text-base h-[500px] overflow-auto">
        {folderPath === '' ? null : renderTree(tree)}
      </div>
    </div>
  );
};

export default ClientFolderView;
