import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { io } from 'socket.io-client';

interface Client {
  id: string;
  name: string;
  regNo: string;
  startTime: string;
}

const Sidebar: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    const soc = io('http://10.16.32.194:5000');

    soc.emit('admin-join');

    soc.on('joined-studs', ({ name, regNo }) => {
      const newClient: Client = {
        id: `${regNo}-${Date.now()}`,
        name,
        regNo,
        startTime: new Date().toISOString(),
      };
      setClients(prev => [...prev, newClient]);
    });

    return () => {
      soc.disconnect();
    };
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(trimmedSearch) ||
    client.regNo.toLowerCase().includes(trimmedSearch)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Connected Students <span className="student-count">({clients.length})</span>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or reg no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="client-list">
        {filteredClients.map((client, index) => (
          <div
            key={client.id}
            className={`client-item ${selectedClientId === client.id ? 'active' : ''}`}
            onClick={() => setSelectedClientId(client.id)}
          >
            <div className="client-index">{index + 1}.</div>
            <div className="client-info">
              <div className="text-black/90 font-medium">{client.regNo}</div>
              <div className="text-green-500">{client.name}</div>
              <div className="client-time">
                Joined at: <span>{formatTime(client.startTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
