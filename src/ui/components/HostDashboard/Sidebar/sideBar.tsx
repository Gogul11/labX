import React, { useState } from 'react';
import './SideBar.css';
import type { Client } from '../../../types/types';
import { FiFilter } from 'react-icons/fi';

interface Props {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  selectedClientId: string | null;
}

type FilterStatus = 'all' | 'online' | 'offline';

const Sidebar: React.FC<Props> = ({ clients, onSelectClient, selectedClientId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesName = client.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'online') return matchesName && client.isOnline;
    if (filterStatus === 'offline') return matchesName && !client.isOnline;
    return matchesName;
  });

  return (
    <div className="sidebar">
      <div className="sidebar-header">Connected Students</div>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-container">
          <button
            className="filter-button"
            onClick={() => setShowDropdown(prev => !prev)}
            title="Filter Students"
          >
            <FiFilter size={18} />
          </button>
          {showDropdown && (
            <div className="filter-dropdown">
              <div
                className={`filter-option ${filterStatus === 'online' ? 'selected' : ''}`}
                onClick={() => {
                  setFilterStatus('online');
                  setShowDropdown(false);
                }}
              >
                Online
              </div>
              <div
                className={`filter-option ${filterStatus === 'offline' ? 'selected' : ''}`}
                onClick={() => {
                  setFilterStatus('offline');
                  setShowDropdown(false);
                }}
              >
                Offline
              </div>
              <div
                className={`filter-option ${filterStatus === 'all' ? 'selected' : ''}`}
                onClick={() => {
                  setFilterStatus('all');
                  setShowDropdown(false);
                }}
              >
                All
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="client-list">
        {filteredClients.map((client, index) => (
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
