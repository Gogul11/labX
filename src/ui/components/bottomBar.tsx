import { BsCollection } from "react-icons/bs";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { VscVmConnect } from "react-icons/vsc";
import { FaDownload } from "react-icons/fa";
import { sideBarStore } from "../stores/sideBarStore";
import { currentStyle } from "../utils/styleChooser";

type Tab = 'files' | 'open' | 'chat' | 'connect' | 'download' | 'connectClient' | 'connectHost' | ' ';

const BottomBar = () => {
  const activeTab = sideBarStore((state) => state.activeTab);
  const setActiveTab = sideBarStore((state) => state.setAcitveTab);
  const isOpen = sideBarStore((state) => state.isOpen);
  const toggle = sideBarStore((state) => state.toggle);
  
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if(activeTab === tab){
      toggle()
      setActiveTab(' ')
    } 
    if (!isOpen) toggle();
  };

  return (
    <div 
      className="w-full flex justify-evenly h-full"
      style={{backgroundColor : currentStyle('bottomTab.bg')}}
    >
      <button className="cursor-pointer" onClick={() => handleTabClick("files")}>
        <BsCollection 
          size={24} 
          style={{
            color : activeTab === "files" ? 
                    (currentStyle('bottomTab.iconActive')) : 
                    (currentStyle('bottomTab.iconNotActive'))
                  }}
        />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("connect")}>
        <VscVmConnect 
          size={24} 
          style={{
            color : activeTab === "connect" || activeTab === "connectClient" || activeTab === "connectHost" ? 
                    (currentStyle('bottomTab.iconActive')) : 
                    (currentStyle('bottomTab.iconNotActive'))
                  }} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("chat")}>
        <BsFillChatRightDotsFill 
          size={24} 
          style={{
            color : activeTab === "chat" ? 
                    (currentStyle('bottomTab.iconActive')) : 
                    (currentStyle('bottomTab.iconNotActive'))
                  }} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("download")}>
        <FaDownload 
          size={24} 
          style={{
            color : activeTab === "download" ? 
                    (currentStyle('bottomTab.iconActive')) : 
                    (currentStyle('bottomTab.iconNotActive'))
                  }} />
      </button>
    </div>
  );
};

export default BottomBar;
