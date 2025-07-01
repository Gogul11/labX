export interface Client {
  id: string;
  name: string;
  regNo: string;
  folderStructure: Folder[];
  isOnline: boolean; 
}

export interface Folder {
  name: string;
  files: string[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  isSelf: boolean;
}

 export interface ChatSidebarProps {
  username: string;
}