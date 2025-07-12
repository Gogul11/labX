import { create } from "zustand";

type selectedPathType = {
  val: string,
  isDir: boolean
}

type selectedPathStoreType = {
  selectedPath: selectedPathType,
  setSelectedPath: (newPath: selectedPathType) => void
}

export const selectedPathStore = create<selectedPathStoreType>((set) => ({
  selectedPath: { val: '', isDir: false },
  setSelectedPath: (val: selectedPathType) => set({ selectedPath: val })
}));