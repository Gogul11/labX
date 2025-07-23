import { create } from "zustand";

type roomIdStoreType = {
    roomId : string,
    setRoomId : (val : string) => void;
}

export const roomIdStore = create<roomIdStoreType>((set) => ({
    roomId : '',
    setRoomId : (val : string) => set({roomId : val})
}))