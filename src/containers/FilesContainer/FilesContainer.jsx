import { useEffect, useState } from "react";
import FileComponent from "../../components/FileComponent/FileComponent";
import FolderComponent from "../../components/FolderComponent/FolderComponent";
import {
	downloadFile,
	getFilePath,
	getFileTree,
	uploadFile,
} from "../../utils";
import styles from "./FilesContainer.module.scss";

function FilesContainer(props) {
	const [elements, setElements] = useState({ ".": ["hello", "world"] });
	const [folder, setFolder] = useState(elements);
	const [dir, setDir] = useState([]);

	const [fileView, setFileView] = useState(0);

	useEffect(() => {
		const getElements = async () => {
			const tree = await getFileTree();
			/* console.log(tree); */
			setElements(tree);
		};

		getElements();
	}, []);

	useEffect(() => {
		/* console.log("update", dir.toString()); */
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

	const goto = (path) => {
		setDir([...dir, path]);
	};

	const goBack = () => {
		const newDir = [...dir];
		newDir.pop();
		setDir(newDir);
	};

	const download = (filepath, filename) => {
		downloadFile(filepath, filename);
	};

	const upload = (event) => {
		event.preventDefault();
		Array.from(event.target.files).forEach((file) =>
			uploadFile(folder[".."], file)
		);
	};

	const changeView = (event) => {
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

	return (
		<div className={classes}>
			{/* go back one folder */}
			<button onClick={changeView}>views</button>
			<input type="file" onChange={upload} />
			<FolderComponent name={"←"} onClick={() => goBack()} />
			{folders}
			{files}
		</div>
	);
}

export default FilesContainer;
