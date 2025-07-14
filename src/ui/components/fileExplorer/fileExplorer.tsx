import { useEffect, useState } from 'react';
import Content from './content';
import { fetchFolder,  openFolder } from '../../utils/flileExplorer';
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";
import { dirStore } from '../../stores/directoryStore';
import { dirListStore } from '../../stores/dirListStore';
import { selectedPathStore } from '../../stores/selectedPathStore';
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
	// const [selectedPath, setSelectedPath] = useState<{val : string, isDir : boolean}>({val : '', isDir : false})
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
  	const refresh = () => {
		fetchFolder(dir)
        .then((data) => {
          setTree(data)
          setFetch(false)
		  console.log(data)
        })
        .catch((_err : any) => {
            window.alert("Oops, Error while fetching!")
            setFetch(false)
        })
	}
	

	//Function for creating file and folder/
	const handleCreation = () => {
		setShowInput(false)
		input.type === 'File' ? 
			window.electronApi.createFile({...selectedPath, name : input.val}) : 
			window.electronApi.createFolder({...selectedPath, name : input.val})
		setFetch(true)
		setInput({...input, val : ''})
		refresh()
	}

	const handleRename = () => {
		setRename(false)
		window.electronApi.renameFileOrFolder(renameInput, selectedPath.val)
		setFetch(true)
		setRenameInput('')
		refresh()
	}

	//Function for printing like tree structure NOTE : Don't touch this
	const renderTree = (nodes: FileNode[], level = 0) =>
		nodes.map((node) => (
			<div key={node.path} style={{ paddingLeft: level * 16 }}>
				<Content 
					isDir={node.isDir}
					name={node.name}
					toogle = {() => openFolder(node.path, setTree, tree)}
					select = {(p : typeof selectedPath) => setSelectedPath(p)}
					path = {node.path}
				/>
				{node.isDir && node.children && node.isOpen && renderTree(node.children, level + 1)}
			</div>
	));

	useEffect(() => {
		if(dir !== '' && tree.length === 0){
			setFetch(true)
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
    <div className=" h-full w-full">

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
							setSelectedPath({isDir : true, val : d})
						})
					}}
				>open folder</button>
			</div>
			:
			fetch ? (
				// A small loading for the folders with larger no of file like multiple react projects Example : sankar's vs code
				<p className='text-[#61afef] text-center mt-10 text-lg font-bold'>Fetching files for you....</p>
			) : (
				<div 
					className='flex-1 h-full'
					onContextMenu={(e) => {
                		if(e.button === 2)
							window.electronApi.openFileExplorerMenu(selectedPath.val)
						}
					}	
				>
					<div id='create-id' className='h-8 flex items-center gap-4 px-4'>
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
									className='bg-[#fff]/10 px-2 border border-[#c678dd] rounded-sm w-[97%] text-white'
									onChange={(e) => {
										if(showInput)
											setInput({...input, val : e.target.value})
										if(rename)
											setRenameInput( e.target.value)
									}} 
									onKeyDown={(key) => {
										if(key.key === 'Enter'){
											if(showInput)
												handleCreation()
											if(rename)
												handleRename()
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