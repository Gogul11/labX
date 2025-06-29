import React from 'react';
import './ClientFolder.css';
import type { Client } from '../../../types/types';

interface Props {
  client: Client | null;
}

const ClientFolderView: React.FC<Props> = ({ client }) => {
  if (!client) {
    return <div className="client-folder-view">Select a client to view their folder.</div>;
  }

  return (
    <div className="client-folder-view">
      <h2>
        <span className="client-name-highlight">{client.name}</span>{' '}
        <span className="client-reg-highlight">{client.regNo}</span>
      </h2>
      <div className="folder-structure">
        {client.folderStructure.map((folder) => (
          <div key={folder.name}>
            <div className="folder-name">📁 {folder.name}</div>
            <ul>
              {folder.files.map((file) => (
                <li key={file} className='file-names'>├── {file}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientFolderView;
