import React, { useState, useEffect } from 'react';
import './HostDashboard.css';
import Sidebar from './Sidebar/sideBar';
import ClientFolderView from './FolderView/clientFolder';
import type { Client } from '../../types/types';

const dummyClients: Client[] = [
  {
    id: '1',
    name: 'Gogul',
    regNo: '2023115020',
    isOnline: true,
    folderStructure: [{ name: 'my-work', files: ['Lab2.c', 'Lab3.c', 'Report.txt'] }]
  },
  {
    id: '2',
    name: 'Mohan',
    regNo: '2023115026',
    isOnline: false,
    folderStructure: [{ name: 'my-work', files: ['Task1.py'] }]
  },
  {
    id: '3',
    name: 'Sankar',
    regNo: '2023115074',
    isOnline: true,
    folderStructure: [{name: 'my-work', files: ['Lab1.cpp', 'Lab2.cpp']}]
  }
];

const HostDashboard: React.FC = () => {
  const [clients] = useState<Client[]>(dummyClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0]);

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 180 && newWidth <= 500) setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="host-dashboard">
      <div className="header">
        <div className="logo">
          <div className="red-dot" />
          <span>labX</span>
        </div>
        <div className="room-info">
          Room name: <span>Lab Assessment I</span> &nbsp;|&nbsp;
          Room ID: <span>ABC123</span>
        </div>
        <div className="controls">
          <button>Broadcast File</button>
          <button>Announcements</button>
          <button>Timer</button>
        </div>
      </div>

      <div className="main-content">
        {sidebarVisible && (
          <div className="sidebar-container" style={{ width: sidebarWidth }}>
            <Sidebar
              clients={clients}
              onSelectClient={setSelectedClient}
              selectedClientId={selectedClient?.id ?? null}
            />
            <div className="sidebar-resizer" onMouseDown={handleMouseDown} />
          </div>
        )}
        <ClientFolderView client={selectedClient} />
      </div>
    </div>
  );
};

export default HostDashboard;
