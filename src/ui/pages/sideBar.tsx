import { useState } from 'react';
import { BsCollection } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { GoTerminal } from "react-icons/go";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { VscVmConnect } from "react-icons/vsc";

// Optional: enum for tab keys
type Tab = 'files' | 'editor' | 'terminal' | 'chat' | 'connect';

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<Tab>('files');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'files':
        return <div className="text-white p-4">File Explorer Content component</div>;
      case 'editor':
        return <div className="text-white p-4">Editors opened component</div>;
      case 'terminal':
        return <div className="text-white p-4">Terminals Opened component</div>;
      case 'chat':
        return <div className="text-white p-4">chat component</div>;
      case 'connect':
        return <div className="text-white p-4">Host or Join component</div>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[350px] h-[90vh] bg-amber-800 rounded-xl shadow-lg flex flex-col items-center">
        
        {/* Dynamic content area */}
        <div className="bg-green-800 h-[95%] w-[96%] overflow-y-auto hide-scrollbar m-2 rounded-2xl">
          {renderTabContent()}
        </div>

        {/* Bottom icon bar */}
        <div className="bg-blue-800 h-[5%] w-full flex justify-evenly items-center">
          <button onClick={() => setActiveTab('files')}>
            <BsCollection size={28} className={activeTab === 'files' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('editor')}>
            <FaRegEdit size={28} className={activeTab === 'editor' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('terminal')}>
            <GoTerminal size={28} className={activeTab === 'terminal' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('chat')}>
            <BsFillChatRightDotsFill size={28} className={activeTab === 'chat' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('connect')}>
            <VscVmConnect size={28} className={activeTab === 'connect' ? 'text-yellow-300' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
