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
  timestamp: string;
  isSelf: boolean;
}

 export interface ChatSidebarProps {
  username: string;
}


// Define the Terminal type
export interface Terminal {
  id: string;
  name: string;
  isActive?: boolean;
}
