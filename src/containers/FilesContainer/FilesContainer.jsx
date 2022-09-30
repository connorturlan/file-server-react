import { useEffect, useRef, useState } from "react";
import FileComponent from "../../components/FileComponent/FileComponent";
import FolderComponent from "../../components/FolderComponent/FolderComponent";
import {
	downloadFile,
	getFilePath,
	getFolderTree,
	getFolderBranch as getFolderBranch,
	patchFolderTree,
	uploadFile,
} from "../../utils";
import styles from "./FilesContainer.module.scss";

function FilesContainer(props) {
	const loading = useRef(true);
	const [elements, setElements] = useState({ "..": [], ".": [] });
	const [folder, setFolder] = useState(elements);
	const [dir, setDir] = useState([]);

	const [fileView, setFileView] = useState(0);

	// fetch the entire folder tree, this may take a while.
	// this is going to be replaces with the folder leaf method to get the folder tree as
	// ...the user explores the server.
	useEffect(() => {
		const getElements = async () => {
			const tree = await getFolderTree();
			setElements(tree);

			loading.current = false;

			console.log(tree);
		};

		getElements();
	}, []);

	// recurse and return the current folder node.
	useEffect(() => {
		setFolder(
			dir.length == 0
				? elements
				: dir.reduce(
						(curr_folder, path) =>
							path in curr_folder ? curr_folder[path] : elements,
						elements
				  )
		);
	}, [elements, dir]);

	const updateFolderTree = async (path) => {
		// update the a leaf on the folder tree.
		const leaf = await getFolderBranch(path);
		setElements(patchFolderTree(path, elements, leaf));
		loading.current = false;
	};

	const goto = (path) => {
		// add the selected folder to the history.
		setDir([...dir, path]);
	};

	const goBack = () => {
		// remove the last history entry.
		const newDir = [...dir];
		newDir.pop();
		setDir(newDir);
	};

	const download = (filepath, filename) => {
		// download a specified file.
		downloadFile(filepath, filename);
	};

	const upload = async (event) => {
		// hide the page while we upload the files.
		loading.current = true;

		// run the upload dialog for each file selected.
		event.preventDefault();
		const uploads = Array.from(event.target.files).map(async (file) =>
			uploadFile(folder[".."], file)
		);

		// block until all files return a status.
		const statuses = await Promise.all(uploads);

		// update the local elements.
		const filepath = folder[".."].join("/");
		updateFolderTree(filepath);
	};

	const changeView = (event) => {
		// change the folder view index.
		setFileView((fileView + 1) % 2);
	};

	// evaluate the view class.
	const classlist = [styles.files];
	let isPreview = false;
	switch (fileView) {
		default:
		case 0:
			classlist.push(styles.grid);
			isPreview = true;
			break;
		case 1:
			classlist.push(styles.list);
			break;
	}
	const classes = classlist.join(" ");

	// generate folder icons, remove hidden folders.
	const folders = Object.keys(folder)
		.filter((dir) => !dir.startsWith("."))
		.map((e, index) => {
			return (
				<FolderComponent key={index} name={e} onClick={() => goto(e)} />
			);
		});

	// generate files, remove hidden files.
	const files = folder["."]
		.filter((dir) => !dir.startsWith("."))
		.sort((a, b) => a.split(".").at(-1).localeCompare(b.split(".").at(-1)))
		.map((e, index) => {
			const filepath = getFilePath(folder[".."], e);
			return (
				<FileComponent
					key={filepath}
					name={e}
					path={filepath}
					onClick={() => download(filepath, e)}
					isPreview={isPreview}
				/>
			);
		});

	// put the page together.
	const page = (
		<>
			{/* change the container view */}
			<button onClick={changeView}>views</button>
			{/* supply a file to upload */}
			<input type="file" onChange={upload} />
			{/* go back one folder */}
			<FolderComponent name={"←"} onClick={() => goBack()} />
			{folders}
			{files}
		</>
	);

	return (
		<div className={classes}>
			{loading.current ? <p>LOADING...</p> : page}
		</div>
	);
}

export default FilesContainer;
