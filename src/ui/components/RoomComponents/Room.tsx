import { useState } from "react";
import JoinRoomForm from "./joinRoom";
import HostRoomForm from "./hostRoom";
import { UserTypeStore } from "../../stores/userTypeStore";
import { currentStyle } from "../../utils/styleChooser";

const Room: React.FC<{ tab: "client" | "host" }> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState<"client" | "host">(tab);

  return (
    <div className="h-full w-full mx-auto flex flex-col py-10 px-4 ">
      <div className="flex justify-around mb-6">
        <button
          className="px-4 py-2 rounded-sm hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color : currentStyle('room.text'),
            backgroundColor : activeTab === "client" ? currentStyle('room.buttonActive') : currentStyle('room.buttonNotActive')
          }}
          onClick={() => setActiveTab("client")}
          disabled={UserTypeStore.getState().user === "host"}
        >
          Join Room
        </button>

        <button
          className="px-4 py-2 rounded-sm hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color : currentStyle('room.text'),
            backgroundColor : activeTab === "host" ? currentStyle('room.buttonActive') : currentStyle('room.buttonNotActive') 
          }}
          onClick={() => setActiveTab("host")}
          disabled={UserTypeStore.getState().user === "client"}
        >
          Host Room
        </button>
      </div>



      <div className="p-6">
        {activeTab === "client" ? <JoinRoomForm /> : <HostRoomForm />}
      </div>
    </div>
  );
};

export default Room;
