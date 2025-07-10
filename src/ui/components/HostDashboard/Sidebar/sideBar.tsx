import React from 'react';
import './SideBar.css';
import type { Client } from '../../../types/types';

interface Props {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  selectedClientId: string | null;
}

const Sidebar: React.FC<Props> = ({ clients, onSelectClient, selectedClientId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Connected Students</div>
      <div className="client-list">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className={`client-item ${selectedClientId === client.id ? 'active' : ''}`}
            onClick={() => onSelectClient(client)}
          >
            <div className="client-status">
              <span className={`status-dot ${client.isOnline ? 'online' : 'offline'}`} />
            </div>
            <div className="client-index">{index + 1}.</div>
            <div className="client-name">{client.name}</div>
            <div className="client-reg">{client.regNo}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
