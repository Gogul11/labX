import React, { useState } from 'react';
import './ClientFolder.css';
import type { Client } from '../../../types/types';

interface Props {
  client?: Client;
}

const ClientFolderView: React.FC<Props> = ({ client }) => {

  if (!client) {
    return <div className="client-folder-view">Select a client to view their folder.</div>;
  }

  return (
    <div className="client-folder-view">
      <h2 className="client-header">
        <span className="client-name-highlight">{client.name}</span>
        <span className="client-reg-highlight">{client.regNo}</span>
      </h2>

      <div className="folder-structure">
        {/* {client.folderStructure.map((folder) => {
          const isExpanded = expandedFolders[folder.name] ?? true;

          return (
            <div key={folder.name} className="folder-block">
              <div className="folder-toggle" onClick={() => toggleFolder(folder.name)}>
                <span className="folder-arrow">{isExpanded ? '▾' : '▸'}</span>
                <span className="folder-name">
                  <FaFolderClosed /> {folder.name}
                </span>
              </div>

              {isExpanded && (
                <ul className="file-list">
                  {folder.files.map((file) => (
                    <li
                      key={file}
                      className="file-item"
                      onClick={() => setPath(`${client.basePath}/${folder.name}/${file}`)}
                    >
                      <FaFile /> {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default ClientFolderView;