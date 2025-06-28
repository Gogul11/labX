export interface Client {
  id: string;
  name: string;
  regNo: string;
  folderStructure: Folder[];
  isOnline: boolean; // ✅ New field
}

export interface Folder {
  name: string;
  files: string[];
}
