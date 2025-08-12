import { useState, useEffect } from 'react';
import './HostDashboard.css';
import Sidebar from './Sidebar/sideBar';
import ClientFolderView from './FolderView/clientFolder';
import type { Client } from '../../types/types';
import Editor from './Editor/EditorHost';
import { roomNameStore } from '../../stores/roomNameStore';
import { roomIdStore } from '../../stores/roomIdStore';
import axios from 'axios';
import { ipStore } from '../../stores/ipStore';

const HostDashboard: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [sidebarVisible, setSidebarVisible] = useState(true);

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

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleBroadcast = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${ipStore.getState().ip}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      if(res.data.success){
        alert("File sent successfully")
      }
    }).catch((err) => {
      console.log(err)
      alert(`Something went wrong ${err.message}`)
    });
  };


  return (
    <div className="flex flex-col h-screen  text-[#abb2bf]">
      {/* Header */}
      <div className="h-[5%] bg-gradient-to-br from-[#21252b] to-[#2c313c] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center text-white text-3xl font-bold font-[Geostar_Fill]">
          <span>Orca</span>
        </div>
        <div className="text-[22px] ml-[110px]">
          Room name: <span>{roomNameStore.getState().roomName}</span> &nbsp;|&nbsp;
          Room ID: <span>{roomIdStore.getState().roomId}</span>
        </div>
        <div className="flex gap-2">
          <input type='file' onChange={handleFileChange} className="bg-[#3e4451] text-white text-sm px-3 py-1"/>
          <button onClick={handleBroadcast} className="bg-[#3e4451] text-white text-sm px-3 py-1">Broadcast</button>
          <button className="bg-[#3e4451] text-white text-sm px-3 py-1">Announcements</button>
          <button className="bg-[#3e4451] text-white text-sm px-3 py-1">Timer</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[95%]">
        {sidebarVisible && (
          <div className="h-full bg-[#2b2b2b]" style={{ width: '15%' }}>
            <Sidebar setClient={setSelectedClient} />
          </div>
        )}

        <div className="h-full bg-[#252526]" style={{ width: '25%' }}>
          <ClientFolderView client={selectedClient} />
        </div>

        <div className="h-full bg-[#1e1e1e]" style={{ width: '60%' }}>
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
