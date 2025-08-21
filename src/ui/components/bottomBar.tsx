import { BsCollection } from "react-icons/bs";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { VscVmConnect } from "react-icons/vsc";
import { FaDownload } from "react-icons/fa";
import { TfiTimer } from "react-icons/tfi";
import { sideBarStore } from "../stores/sideBarStore";
import { LuListTodo } from "react-icons/lu";

type Tab = 'files' | 'open' | 'chat' | 'connect' | 'download' | 'connectClient' | 'connectHost' | 'timer' | 'todo';

const BottomBar = () => {
  const activeTab = sideBarStore((state) => state.activeTab);
  const setActiveTab = sideBarStore((state) => state.setAcitveTab);
  const isOpen = sideBarStore((state) => state.isOpen);
  const toggle = sideBarStore((state) => state.toggle);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (!isOpen) toggle();
  };

  return (
    <div className="w-full flex justify-evenly h-full bg-indigo-600">
      <button className="cursor-pointer" onClick={() => handleTabClick("files")}>
        <BsCollection size={24} className={activeTab === "files" ? "text-yellow-300" : ""} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("connect")}>
        <VscVmConnect size={24} className={activeTab === "connect" ? "text-yellow-300" : ""} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("chat")}>
        <BsFillChatRightDotsFill size={24} className={activeTab === "chat" ? "text-yellow-300" : ""} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("download")}>
        <FaDownload size={24} className={activeTab === "download" ? "text-yellow-300" : ""} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("timer")}>
        <TfiTimer size={24} className={activeTab === "timer" ? "text-yellow-300" : ""} />
      </button>

      <button className="cursor-pointer" onClick={() => handleTabClick("todo")}>
        <LuListTodo size={24} className={activeTab === "todo" ? "text-yellow-300" : ""} />
      </button>
    </div>
  );
};

export default BottomBar;
