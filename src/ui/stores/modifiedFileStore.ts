import { create } from "zustand";

type ModifiedFileStoreType = {
  files: string[];
  setFiles: (path: string) => void;
  clearFiles : () => void;
};

export const ModifiedFileStore = create<ModifiedFileStoreType>((set) => ({
  files: [],
  setFiles: (path : string) => set((state) => {
    const newArray = [...state.files]
    if(!newArray.includes(path))
      newArray.push(path);

    return {
      files : newArray
    }
  }),
  clearFiles : () => set({files : []})
}));
