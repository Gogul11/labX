import { useEffect, useState } from 'react';
import Content from './content';
import { fetchFolder,  openFolder } from '../../utils/flileExplorer';
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";
import { dirStore } from '../../stores/directoryStore';
import { dirListStore } from '../../stores/dirListStore';
import { selectedPathStore } from '../../stores/selectedPathStore';
import { EditorMapsStore } from '../../stores/editorsMap';
import Loader from '../loader';
// import { sideBarStore } from '../../stores/sideBarStore';

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen : boolean
};

const FolderExplorer = () => {
  
	// const [tree, setTree] = useState<FileNode[]>([]);
	const [fetch, setFetch] = useState<boolean>(false)
	const [input, setInput] = useState<{val : string, type : string}>({val : '', type : ''})
	const [showInput, setShowInput] = useState<boolean>(false)
	const [renameInput, setRenameInput] = useState<string>('')
	const [rename, setRename] = useState<boolean>(false)
	
	//stores
	const globalDir = dirStore((state) => state.setDir)
	const dir = dirStore((state) => state.dir)
	const tree = dirListStore((state) => state.dirList)
	const setTree = dirListStore((state) => state.setDirList)

	const selectedPath = selectedPathStore((state) => state.selectedPath)
	const setSelectedPath = selectedPathStore((state) => state.setSelectedPath)
	// const closeSideBar = sideBarStore((state) => state.toggle)

	//Function for fetching files and folders from the directory NOTE : Don't touch this
	const refresh = (customDir?: string) => {
		const refreshPath = customDir || dir;

		fetchFolder(refreshPath)
			.then((data) => {
				setTree(data);
				setFetch(false);
			})
			.catch((_err: any) => {
				// Try refreshing parent instead
				const parentDir = refreshPath.split('/').slice(0, -1).join('/');
				if (parentDir && parentDir !== refreshPath) {
					fetchFolder(parentDir)
						.then((data) => {
							setTree(data);
							setSelectedPath({ val: parentDir, isDir: true });
							setFetch(false);
						})
						.catch((_e: any) => {
							window.alert("Oops, Error while fetching!");
							setFetch(false);
						});
				} else {
					window.alert("Oops, Error while fetching!");
					setFetch(false);
				}
			});
	};

	

	//Function for creating file and folder/
	const handleCreation = () => {
		setShowInput(false);

		const checkExists = (nodes: FileNode[], targetPath: string, name: string): boolean => {
			for (const node of nodes) {
				const parentDir = node.path.split('/').slice(0, -1).join('/');
				if (parentDir === targetPath && node.name === name) {
					return true;
				}
				if (node.isDir && node.children) {
					if (checkExists(node.children, targetPath, name)) return true;
				}
			}
			return false;
		};

		const exists = checkExists(tree, selectedPath.val, input.val);

		if (exists) {
			window.alert(`A ${input.type.toLowerCase()} named "${input.val}" already exists in this directory.`);
			setInput({ ...input, val: '' });
			return;
		}

		if (input.type === 'File') {
			window.electronApi.createFile({ ...selectedPath, name: input.val });
		} else {
			window.electronApi.createFolder({ ...selectedPath, name: input.val });
		}
		setFetch(true);
		setInput({ ...input, val: '' });
		refresh();
	};


	// Updated handleRename with duplicate name check
	const handleRename = () => {
		setRename(false);

		const checkExists = (nodes: FileNode[], targetPath: string, name: string): boolean => {
			for (const node of nodes) {
				const parentDir = node.path.split('/').slice(0, -1).join('/');
				if (parentDir === targetPath && node.name === name) {
					return true;
				}
				if (node.isDir && node.children) {
					if (checkExists(node.children, targetPath, name)) return true;
				}
			}
			return false;
		};

		const parentPath = selectedPath.val.split('/').slice(0, -1).join('/');
		const exists = checkExists(tree, parentPath, renameInput);

		if (exists) {
			window.alert(`A file or folder named "${renameInput}" already exists in this directory.`);
			setRenameInput('');
			return;
		}

		window.electronApi.renameFileOrFolder(renameInput, selectedPath.val);
		setFetch(true);
		setRenameInput('');
		refresh();
	};

// const handleDelete = () => {
// 	if (!selectedPath.val) {
// 		window.alert("No file/folder selected to delete.");
// 		return;
// 	}

// 	const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedPath.val}"?`);
// 	if (!confirmDelete) return;

// 	window.electronApi.deleteFileOrFolder(selectedPath.val);
// 	setFetch(true);
// 	refresh();
// };




useEffect(() => {
	window.electronApi.deleteFileOrFolderTrigger((filePath: string) => {
		const confirmDelete = window.confirm(`Are you sure you want to delete:\n${filePath}?`);
		if (!confirmDelete) return;

		const parentDir = filePath.split('/').slice(0, -1).join('/');

		// Reset selection to parent
		setSelectedPath({ val: parentDir, isDir: true });

		// Delete and refresh from parent
		window.electronApi.deleteFileOrFolder(filePath);
		setFetch(true);
		refresh(parentDir);
	});
}, []);





	//Function for printing like tree structure NOTE : Don't touch this
	const renderTree = (nodes: FileNode[], level = 0) =>
	nodes.map((node) => (
		<div
			key={node.path}
			style={{ paddingLeft: level + 16 }}
			className={`
				group transition-all duration-150 rounded-sm
				${EditorMapsStore.getState().openedEditors[node.path]?.isOpen ? 'bg-[#3e4451] text-[#abb2bf]' : ''}
				${node.isDir ? 'text-[#61afef]' : 'text-[#e5c07b]'}
			`}
		>
			<Content 
				isDir={node.isDir}
				name={node.name}
				toogle={() => openFolder(node.path, setTree, tree)}
				select={(p: typeof selectedPath) => setSelectedPath(p)}
				path={node.path}
			/>
			{node.isDir && node.children && node.isOpen && renderTree(node.children, level + 1)}
		</div>
	));



	useEffect(() => {
		if(dir !== '' && dirStore.getState().initialFetch){
			setFetch(true)
			dirStore.getState().setInitialFetch()
			refresh()
		}
	}, [dir]);

	useEffect(() => {
		window.electronApi.newFileOrFolder((newDir : boolean) => {
			const createEle = document.getElementById('create-id')
			createEle?.scrollIntoView({behavior : 'smooth'})
			setShowInput(true)
			if(newDir)
				setInput({...input, type : 'Folder'})
			else
				setInput({...input, type : 'File'})
		})

		window.electronApi.selectRenameFileOrFolder(() => {
			const createEle = document.getElementById('create-id')
			createEle?.scrollIntoView({behavior : 'smooth'})
			setRename(true)
		})
	}, [])

return (
	<div className="h-full w-full bg-[#282c34] text-[#abb2bf]">

		{/* TO open a folder */}
		{(dir === null || dir === '') ? 
			<div className='h-full flex flex-col gap-8 items-center justify-center'>
				<p
					className='text-[#c678dd] text-center font-bold max-w-[50%]'
				>You have not opened a folder, open a folder</p>
				<button
					className='bg-[#e06c75] w-[70%] h-10 rounded-lg text-[#282c34] font-bold'
					onClick={() => {
						window.electronApi.openDir().then((d) => {
							globalDir(d)
							// closeSideBar()
							dirStore.getState().setInitialFetch()
							setSelectedPath({isDir : true, val : d})
						})
					}}
				>open folder</button>
			</div>
			:
			fetch ? (
				// A small loading for the folders with larger no of file like multiple react projects Example : sankar's vs code
				<Loader message='Fetching Your files'/>
			) : (
				<div 
					className='flex-1 h-full'
					onContextMenu={(e) => {
                		if(e.button === 2)
							window.electronApi.openFileExplorerMenu(selectedPath.val)
						}
					}	
				>
					<div id='create-id' className='h-8 flex items-center gap-4 px-4 mt-2'>
						<VscNewFile 
							size={22} 
							className=' text-[#98c379] cursor-pointer hover:text-[#c678dd]'
							onClick={() => {
								setInput({...input, type : 'File'})
								setShowInput(true)
							}}
						/>
						<VscNewFolder 
							size={22}  
							className=' text-[#98c379] cursor-pointer hover:text-[#c678dd]'
							onClick={() => {
									setInput({...input, type : 'Directory'})
									setShowInput(true)
							}}
						/>

						{(showInput || rename) && (
							<div className='flex w-[70%] gap-4 items-center'>
								<input 
									type="text" 
									value={showInput ? input.val : renameInput}
									className="bg-[#3e4451] px-2 py-1 border border-[#c678dd] rounded-sm w-[97%] text-white outline-none"
									onChange={(e) => {
										if(showInput) setInput({...input, val: e.target.value})
										if(rename) setRenameInput(e.target.value)
									}} 
									onKeyDown={(key) => {
										if(key.key === 'Enter'){
											if(showInput) handleCreation()
											if(rename) handleRename()
										} 
									}}
								/>

								<BiSend
									size={22}
									className=' text-[#98c379] cursor-pointer hover:text-[#c678dd]'
									onClick={() => {
										if(showInput)
											handleCreation()
										if(rename)
											handleRename()
									}}
								/>
							</div>
						)}
					</div>
					{renderTree(tree)} {/*Dispalying the folder*/}
				</div>
			)
		}
    </div>
  );
};

export default FolderExplorer;