import { useEffect, useState, useContext } from "react";
import styles from "./App.module.scss";
import FolderComponent from "./components/FolderComponent/FolderComponent";
import FolderSidebar from "./components/FolderSidebar/FolderSidebar";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import FolderViewer from "./containers/FolderViewer/FolderViewer";
import SelectionProvider, {
	SelectionContext,
} from "./contexts/SelectionContext";
import {
	getFolderTree,
	getFolderBranch,
	patchFolderTree,
	uploadFile,
	createNewFolder,
} from "./utils";

function FileServer() {
	const [loading, setLoading] = useState(true);
	const [elements, setElements] = useState({ "..": [], ".": [] });
	const [dir, setDir] = useState([]);
	const [viewMode, setViewMode] = useState(0);

	const { isSelecting, setSelecting } = useContext(SelectionContext);

	// fetch the entire folder tree, this may take a while.
	// this is going to be replaces with the folder leaf method to get the folder tree as
	// ...the user explores the server.
	useEffect(() => {
		const getElements = async () => {
			const tree = await getFolderTree();
			setElements(tree);
			setLoading(false);
			console.log(tree);
		};

		getElements();
	}, []);

	const updateFolderTree = async (path) => {
		// update the loading state.
		setLoading(true);

		// update the a leaf on the folder tree.
		const leaf = await getFolderBranch(path);
		setElements(patchFolderTree(path, elements, leaf));

		// update the loading state.
		setLoading(false);
	};

	const navigateToFolder = (path) => {
		// add the selected folder to the history.
		const newDir = [...dir, path];
		setDir(newDir);
	};

	const navigateFrom = () => {
		// remove the last history entry.
		const newDir = [...dir];
		newDir.pop();
		setDir(newDir);
	};

	const beginFileUpload = async (event) => {
		// hide the page while we upload the files.
		setLoading(true);

		// run the upload dialog for each file selected.
		event.preventDefault();
		const uploads = Array.from(event.target.files).map(async (file) =>
			uploadFile(folder[".."], file)
		);

		// block until all files return a status.
		await Promise.all(uploads);

		// update the local elements.
		const filepath = "/" + dir.join("/");
		updateFolderTree(filepath);
	};

	const beginFolderCreation = async (event) => {
		// hide the page while we upload the files.
		setLoading(true);

		event.preventDefault();

		const folderName = prompt("New folder name:", "New Folder");

		const status = await createNewFolder(folder[".."], folderName);

		console.log("creating:", folder[".."].join("/"), folderName, status);

		// update the local elements.
		/* const folderPath = "/" + dir.join("/");
		updateFolderTree(folderPath);
		*/

		const tree = await getFolderTree();
		setElements(tree);
		setLoading(false);
	};

	const changeViewMode = (event) => {
		event.preventDefault();

		// change the folder view index.
		setViewMode((viewMode + 1) % 2);
	};

	const toggleSelection = () => {
		setSelecting(!isSelecting);
	};

	const getFolder = (breadcrumbs, folderTree) => {
		return breadcrumbs.length == 0
			? folderTree
			: breadcrumbs.reduce(
					(curr_folder, path) =>
						path in curr_folder ? curr_folder[path] : folderTree,
					folderTree
			  );
	};

	// get the folder to view.
	const folder = getFolder(dir, elements);

	const getIcon = (i) => {
		switch (i) {
			default:
			case 0:
				return "☷";
			case 1:
				return "☰";
		}
	};

	return (
		<div className={styles.App}>
			<NavigationBar className={styles.header}>
				<label htmlFor="file-upload" className={styles.header_button}>
					🗎+
				</label>
				<input
					id="file-upload"
					className={styles.file_upload_input}
					type="file"
					onChange={beginFileUpload}
					multiple
				/>
				<div
					className={styles.header_button}
					onClick={beginFolderCreation}
				>
					🗀+
				</div>
				<div className={styles.header_button} onClick={changeViewMode}>
					🗘{getIcon(viewMode)}
				</div>
				<div className={styles.header_button} onClick={toggleSelection}>
					{isSelecting ? "☒" : "☐"}
				</div>
			</NavigationBar>
			<main className={styles.main}>
				<FolderSidebar
					folderTree={elements}
					currentFolder={dir}
					setFolder={setDir}
				/>
				{loading ? (
					<LoadingScreen />
				) : (
					<FolderViewer
						folder={getFolder(dir, elements)}
						viewMode={viewMode}
						navigateToFolder={navigateToFolder}
					>
						{dir.length > 0 && (
							<FolderComponent
								name={"←"}
								onClick={() => navigateFrom()}
							/>
						)}
					</FolderViewer>
				)}
			</main>
		</div>
	);
}

export default FileServer;
