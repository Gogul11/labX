import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { ipStore } from '../../../stores/ipStore';
import { LuRefreshCcw } from "react-icons/lu";
import { getSocket } from '../../../utils/Socket';

interface Client {
  id: string;
  name: string;
  regNo: string;
  startTime: string;
  endTime ?: string
  status : 'active' | 'ended' | 'disconnected',
  zippedPath ?: string
}

type sideBarProps = {setClient : (val : Client) => void}

const Sidebar: React.FC<sideBarProps> = ({setClient}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended'>('all');


  useEffect(() => {
    const soc = getSocket(ipStore.getState().ip)
    console.log(ipStore.getState().ip)

    soc.emit('admin-join');

    soc.on('joined-studs', (joinedStudentList) => {
      console.log(joinedStudentList)
      setClients((prev) => {
        const updated = [...prev]
        joinedStudentList.forEach((s : any) => {
          const exsistingIdx = updated.findIndex(c => c.regNo === s.regNo)

          const entry = {
            id: `${s.regNo}-${Date.now()}`,
            name : s.name,
            regNo : s.regNo,
            startTime : new Date(s.startTime).toISOString(),
            endTime: s.endTime ? new Date(s.endTime).toISOString() : undefined,
            status: s.status,
          }

          if(exsistingIdx === -1){
            updated.push(entry)
          }
          else{
            updated[exsistingIdx] = {...updated[exsistingIdx], ...entry}
          }
        });
        return updated
      })
    });

  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(trimmedSearch) ||
      client.regNo.toLowerCase().includes(trimmedSearch);

    const matchesStatus =
      statusFilter === 'all' ||
      client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStudentOnClick = (client : Client) => {
    setSelectedClientId(client.regNo)
    setClient(client)
    const soc = getSocket(ipStore.getState().ip)

    soc.emit('get-student-folder', client.regNo)
    console.log('hi this is side bar onclick')
  }

  const handleRefresh = () => {
    const soc = getSocket(ipStore.getState().ip)
    console.log('refreshed')
    soc.emit('refresh-students')
  }

  return (
    <div className="sidebar">
      <div className='w-full flex justify-start items-center px-4'>
        <LuRefreshCcw 
          className='hover:cursor-pointer hover:text-blue-600'
          size={20} 
          onClick={handleRefresh}
        />
      </div>
      <div className="w-full px-4 py-2 rounded-md mb-2 flex flex-col gap-1 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium text-blue-500">Connected Students:</span>
          <span className='text-white'>{clients.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-600">Active:</span>
          <span className='text-white'>{clients.filter(c => c.status === 'active').length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500">Ended:</span>
          <span className='text-white'>{clients.filter(c => c.status === 'ended').length}</span>
        </div>
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

      <div className="w-full flex justify-around my-2">
        {(['all', 'active', 'ended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-sm underline-offset-4 hover:underline transition-colors duration-200 ${
              statusFilter === status
                ? 'text-blue-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>



      <div className="client-list">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`client-item ${selectedClientId === client.id ? 'active' : ''} ${client.status === 'disconnected' && 'bg-red-500/20'}`}
            onClick={() => handleStudentOnClick(client)}
          >
            <div className="client-info">
              <div className="text-black/90 font-medium">{client.regNo}</div>
              <div className="text-green-500">{client.name}</div>
              <div className="client-time">
                Joined at: <span>{formatTime(client.startTime)}</span>
              </div>
              {client.endTime && (
                <div className="client-time">
                  Ended at: <span>{formatTime(client.endTime)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Sidebar;
