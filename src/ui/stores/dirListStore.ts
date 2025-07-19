import { create } from "zustand";

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen : boolean
};

type dirListType = {
    dirList : Array<FileNode>,
    setDirList : (list : Array<FileNode>) => void
}

export const dirListStore = create<dirListType>((set) => ({
    dirList : [],
    setDirList : (list : Array<FileNode>) => set({dirList : list})
}))