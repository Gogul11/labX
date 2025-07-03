import React, { useEffect, useState } from 'react';
import Content from './content';
import { fetchFolder, openFolder } from '../../utils/flileExplorer';
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
  isOpen : boolean
};

const FolderExplorer = () => {
  
	const [tree, setTree] = useState<FileNode[]>([]);
	const [dir, setDir] = useState<string>('')
	const [fetch, setFetch] = useState<boolean>(false)
	const [input, setInput] = useState<{val : string, type : string}>({val : '', type : ''})
	const [showInput, setShowInput] = useState<boolean>(false)
	const [selectedPath, setSelectedPath] = useState<{val : string, isDir : boolean}>({val : '', isDir : false})

	//Function for fetching files and folders from the directory NOTE : Don't touch this
  	const refresh = () => {
		fetchFolder(dir)
        .then((data) => {
          setTree(data)
          setFetch(false)
		  console.log(data)
        })
        .catch((err : any) => {
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

	//Function for printing like tree structure NOTE : Don't touch this
	const renderTree = (nodes: FileNode[], level = 0) =>
	nodes.map((node) => (
		<div key={node.path} style={{ paddingLeft: level * 16 }}>
		<Content 
			isDir={node.isDir}
			name={node.name}
			toogle = {() => openFolder(node.path, setTree)}
			select = {(p : typeof selectedPath) => setSelectedPath(p)}
			path = {node.path}
		/>
		{node.isDir && node.children && node.isOpen && renderTree(node.children, level + 1)}
		</div>
	));

	useEffect(() => {
		if(dir !== ''){
		setFetch(true)
		refresh()
		}
	}, [dir]);

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
							setDir(d)
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
				<div className='flex-1 '>
					<div className='h-8 flex items-center gap-4 px-4'>
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

						{showInput && (
							<div className='flex w-[70%] gap-4 items-center'>
								<input 
									type="text" 
									value={input.val}
									className='bg-[#fff]/10 px-2 border border-[#c678dd] rounded-sm w-[97%] text-white'
									onChange={(e) => setInput({...input, val : e.target.value})} 
									onKeyDown={(key) => {
										if(key.key === 'Enter') handleCreation()
									}}
								/>
								<BiSend
									size={22}
									className=' text-[#98c379] cursor-pointer hover:text-[#c678dd]'
									onClick={handleCreation}
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