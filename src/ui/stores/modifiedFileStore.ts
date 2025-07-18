import { create } from "zustand";

type ModifiedFileStoreType = {
  files: string[];
  setFiles: (path: string) => void;
};

export const ModifiedFileStore = create<ModifiedFileStoreType>((set) => ({
  files: [],
  setFiles: (path: string) =>
    set((state) => ({
      files: state.files.includes(path)
        ? state.files
        : [...state.files, path],
    })),
}));
