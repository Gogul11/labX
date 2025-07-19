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

export const openFolder = (path:string, setTree : (list : Array<FileNode>) => void, tree : Array<FileNode>) => {
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
      const newTree = updatedTree(tree)
      setTree(newTree)
}
