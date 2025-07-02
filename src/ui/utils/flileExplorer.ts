type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen : boolean
};

export  const fetchFolder = async (dir: string): Promise<FileNode[]> => {
    const items = await window.electronApi.readDir(dir);
    const result: FileNode[] = await Promise.all(items.map(async (item: any) => {
        if (item.isDir) {
        return { ...item, children: await fetchFolder(item.path) };
        }
        return item;
    }));
    return result;
};

export const openFolder = (path:string, setTree : React.Dispatch<React.SetStateAction<FileNode[]>>) => {
      const updatedTree = (nodes : FileNode[]) : FileNode[] => {
          const newTree = nodes.map((node) => {
            if(node.path === path){
              return {...node, isOpen : !node.isOpen}
            }
             if (node.children) {
              return { ...node, children: updatedTree(node.children) };
            }
            return node;
          })

          return newTree
      }

      setTree((prev : FileNode[]) => updatedTree(prev))
}
