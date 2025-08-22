import { AiOutlineClose } from "react-icons/ai";
import Room from '../components/RoomComponents/Room';
import Chat from '../components/Chat';
import FileExplorer from '../components/fileExplorer/fileExplorer';
import { selectedPathStore } from '../stores/selectedPathStore';
import { dirStore } from '../stores/directoryStore';
import { sideBarStore } from '../stores/sideBarStore';
import  Download from '../components/Download'
import Timer from "../components/Timer";
import TodoList from "../components/Todo";

const SideBar = () => {

  const activeTab = sideBarStore((state) => state.activeTab)
  const setActiveTab = sideBarStore((state) => state.setAcitveTab)
  const setSelectedPath = selectedPathStore((state) => state.setSelectedPath)
  const globalDir = dirStore((state) => state.setDir)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'files':
        return <FileExplorer />;
      case 'open':
        (async () => {
          window.electronApi.openDir().then((d) => {
            if (d === '')
              return null;
            globalDir(d)
            dirStore.getState().setInitialFetch()
            setSelectedPath({ val: d, isDir: true })
          })
          setActiveTab('files')
        })();
        return null;
      case 'chat':
        return <Chat />;
      case 'connect':
        return <Room tab="client"/>
      case 'connectClient':
        return <Room tab="client"/>
      case 'connectHost':
        return <Room tab="host"/>
      case 'download':
        return <Download/>
      case 'todo':
        return <TodoList/>
      case 'timer':
          return <Timer/>
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full shadow-lg flex flex-col items-center relative">

      
      <button
        onClick={() => {
          sideBarStore.getState().toggle()
          sideBarStore.getState().setAcitveTab(' ')
        }}
        title="Close Sidebar"
        className="absolute top-2 right-2 text-white hover:text-red-500 transition-all"
      >
        <AiOutlineClose size={20} />
      </button>

      {/* Dynamic content area */}
      <div className="bg-[#1e1e1e] h-full w-full overflow-y-auto ">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SideBar;
