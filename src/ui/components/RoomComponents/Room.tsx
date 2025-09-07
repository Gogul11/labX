import { useState } from "react";
import JoinRoomForm from "./joinRoom";
import HostRoomForm from "./hostRoom";
import { UserTypeStore } from "../../stores/userTypeStore";
import { colorThemeStore } from "../../stores/ThemeStore";
import { darkTheme, lightTheme } from "../../utils/colors";

const Room: React.FC<{ tab: "client" | "host" }> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState<"client" | "host">(tab);
  const theme = colorThemeStore((state) => state.theme)

  return (
    <div className="h-full w-full mx-auto flex flex-col justify-center px-4">
      <div className="flex justify-around mb-6">
        <button
          className="px-4 py-2 rounded-sm hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color : theme === "dark" ? darkTheme.room.text : lightTheme.room.text,
            backgroundColor : theme === "dark" ?
                              (activeTab === "client" ? darkTheme.room.buttonActive : darkTheme.room.buttonNotActive) :
                              (activeTab === "client" ? lightTheme.room.buttonActive : lightTheme.room.buttonNotActive) 
          }}
          onClick={() => setActiveTab("client")}
          disabled={UserTypeStore.getState().user === "host"}
        >
          Join Room
        </button>

        <button
          className="px-4 py-2 rounded-sm hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color : theme === "dark" ? darkTheme.room.text : lightTheme.room.text,
            backgroundColor : theme === "dark" ?
                              (activeTab === "host" ? darkTheme.room.buttonActive : darkTheme.room.buttonNotActive) :
                              (activeTab === "host" ? lightTheme.room.buttonActive : lightTheme.room.buttonNotActive) 
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
