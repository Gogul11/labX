import { create } from "zustand";

type ActivePathStoreType = {
  path: string;
  setPath: (p: string) => void;
};

export const ActivePathStore = create<ActivePathStoreType>((set) => ({
  path: '',
  setPath: (p: string) => set(() => ({
    path: p
  }))
}));
