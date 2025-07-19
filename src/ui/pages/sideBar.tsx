import { useState } from 'react';
import { BsCollection } from "react-icons/bs";
import { MdOutlineFileOpen } from "react-icons/md";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { VscVmConnect } from "react-icons/vsc";
import Room from '../components/RoomComponents/Room';
import Chat from '../components/Chat';
import FileExplorer from '../components/fileExplorer/fileExplorer';
import { selectedPathStore } from '../stores/selectedPathStore';
import { dirStore } from '../stores/directoryStore';

// Optional: enum for tab keys
type Tab = 'files' | 'open' | 'chat' | 'connect';
  // const rdir = ''

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<Tab>('files');
  const setSelectedPath = selectedPathStore((state) => state.setSelectedPath)
  const globalDir = dirStore((state) => state.setDir)


  const renderTabContent = () => {
    switch (activeTab) {
      case 'files':
        return <FileExplorer />;
      case 'open':
        (async () => {
           window.electronApi.openDir().then((d) => {
            if(d === '')
                return null;
            globalDir(d)
            dirStore.getState().setInitialFetch()
            setSelectedPath({val : d, isDir : true})
          })
          setActiveTab('files')
        })();
        return null;
      case 'chat':
        return <Chat username={'Hii'} />;
      case 'connect':
        return <Room onJoin={function (): void {
          throw new Error('Function not implemented.');
        } } onHost={function (): void {
          throw new Error('Function not implemented.');
        } } />
      default:
        return null;
    }
  };

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-full bg-[#282c34] shadow-lg flex flex-col items-center">
        
        {/* Dynamic content area */}
        <div className="bg-[#282c34]/50 h-[95%] w-[96%] overflow-y-auto hide-scrollbar m-2 ">
          {renderTabContent()}
        </div>

        {/* Bottom icon bar */}
        <div className="bg-blue-800 h-[5%] w-full flex justify-evenly items-center">
          <button onClick={() => setActiveTab('files')}>
            <BsCollection size={28} className={activeTab === 'files' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('open')} title="Open Folder" >
            <MdOutlineFileOpen size={28} className={activeTab === 'open' ? 'text-yellow-300' : ''}/>
          </button>
          <button onClick={() => setActiveTab('chat')}>
            <BsFillChatRightDotsFill size={28} className={activeTab === 'chat' ? 'text-yellow-300' : ''} />
          </button>
          <button onClick={() => setActiveTab('connect')}>
            <VscVmConnect size={28} className={activeTab === 'connect' ? 'text-yellow-300' : ''} />
          </button>
        </div>
      </div>
    // </div>
  );
};

export default SideBar;