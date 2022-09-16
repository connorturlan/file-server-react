import { useEffect, useState } from "react";
import FileComponent from "../../components/FileComponent/FileComponent";
import FolderComponent from "../../components/FolderComponent/FolderComponent";
import { downloadFile, getFileTree } from "../../utils";
import styles from "./FilesContainer.module.scss";

function FilesContainer(props) {
	const [elements, setElements] = useState({ ".": ["hello", "world"] });
	const [folder, setFolder] = useState(elements);
	const [dir, setDir] = useState([]);

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

	// generate folder icons, remove the `.` and `..`.
	const array_folders = Object.keys(folder);
	let root_index = array_folders.indexOf(".");
	array_folders.splice(root_index, 1);
	let parent_index = array_folders.indexOf("..");
	array_folders.splice(root_index, 1);
	const folders = array_folders.map((e, index) => {
		return <FolderComponent key={index} name={e} onClick={() => goto(e)} />;
	});

	// generate file icons.
	const files = folder["."]
		.sort((a, b) => a.split(".").at(-1).localeCompare(b.split(".").at(-1)))
		.map((e, index) => {
			return (
				<FileComponent
					key={index}
					name={e}
					path={folder[".."] + "/" + e}
					onClick={() => download(folder[".."] + "/" + e, e)}
				/>
			);
		});

	return (
		<div className={styles.FilesContainer}>
			{/* go back one folder */}
			<FolderComponent name={"←"} onClick={() => goBack()} />
			{folders}
			{files}
		</div>
	);
}

export default FilesContainer;
