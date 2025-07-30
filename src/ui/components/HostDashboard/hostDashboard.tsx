import { useState, useEffect } from 'react';
import './HostDashboard.css';
import Sidebar from './Sidebar/sideBar';
import ClientFolderView from './FolderView/clientFolder';
import type { Client } from '../../types/types';
import Editor from './Editor/EditorHost';


const HostDashboard: React.FC = () => {

  const [selectedClient, setSelectedClient] = useState<Client>();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(350);

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
          Room name: <span>Lab Assessment 1</span> &nbsp;|&nbsp;
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
            <Sidebar setClient={setSelectedClient}/>
            <div className="sidebar-resizer" onMouseDown={handleMouseDown} />
          </div>
        )}
        <ClientFolderView client={selectedClient} />
        <div className='editor-view'> 
          <Editor />
        </div>
      </div>
    </div>  
  );
};

export default HostDashboard;
