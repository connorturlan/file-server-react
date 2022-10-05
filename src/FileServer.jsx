import { useEffect, useState, useContext } from "react";
import styles from "./App.module.scss";
import FolderIcon from "./components/FolderIcon/FolderIcon";
import FolderSidebar from "./containers/FolderSidebar/FolderSidebar";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import FolderViewer from "./containers/FolderViewer/FolderViewer";
import { SelectionContext } from "./contexts/SelectionContext";
import {
	getFolderTree,
	getFolderBranch,
	patchFolderTree,
	uploadFile,
	createNewFolder,
	copyItem,
	moveItem,
	deleteItem,
} from "./utils";

function FileServer() {
	const [loading, setLoading] = useState(true);
	const [elements, setElements] = useState({ "..": [], ".": [] });
	const [dir, setDir] = useState([]);
	const [viewMode, setViewMode] = useState(0);

	const [clipboard, setClipboard] = useState([]);
	const [clipboardMode, setClipboardMode] = useState(0);

	const { isSelecting, setSelecting, selection } =
		useContext(SelectionContext);

	// fetch the entire folder tree, this may take a while.
	// this is going to be replaces with the folder leaf method to get the folder tree as
	// ...the user explores the server.
	useEffect(() => {
		const getElements = async () => {
			await updateFolderTree(dir.join("/"));
		};

		getElements();
	}, []);

	const reloadFolderTree = async () => {
		setLoading(true);
		const tree = await getFolderTree();
		setElements(tree);
		setLoading(false);
	};

	const updateFolderTree = async (path) => {
		// update the loading state.
		//setLoading(true);

		// update the a leaf on the folder tree.
		const leaf = await getFolderBranch(path);
		setElements(patchFolderTree(path, elements, leaf));

		// update the loading state.
		setLoading(false);
	};

	const navigateToFolder = async (path) => {
		// add the selected folder to the history.
		const newDir = [...dir, path];
		await updateFolderTree(newDir.join("/"));
		setDir(newDir);
	};

	const navigateFrom = async () => {
		// remove the last history entry.
		const newDir = [...dir];
		newDir.pop();
		await updateFolderTree(newDir.join("/"));
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
		await updateFolderTree(dir.join("/"));
	};

	const beginFolderCreation = async (event) => {
		// hide the page while we upload the files.
		setLoading(true);

		event.preventDefault();

		const folderName = prompt("New folder name:", "New Folder");

		const status = await createNewFolder(folder[".."], folderName);

		console.log("creating:", folder[".."].join("/"), folderName, status);

		await updateFolderTree(dir.join("/"));
	};

	const changeViewMode = (event) => {
		event.preventDefault();

		// change the folder view index.
		setViewMode((viewMode + 1) % 2);
	};

	const toggleSelection = () => {
		setSelecting(!isSelecting);
	};

	const addToClipboard = () => {
		setClipboard(selection.slice());
		setSelecting(false);
	};

	const prepareCopy = () => {
		addToClipboard();
		setClipboardMode(1);
	};

	const prepareMove = () => {
		addToClipboard();
		setClipboardMode(2);
	};

	const beginPaste = async () => {
		// get the destination path.
		const destinationPath = "/" + dir.join("/") + "/";

		// perform the specified action.
		let map;
		switch (clipboardMode) {
			default:
			case 1:
				map = copyItem;
				break;
			case 2:
				map = moveItem;
				break;
		}

		// copy each item on the clipboard to the new destination.
		const promises = clipboard.map((itemPath) => {
			const itemName = itemPath.endsWith("/")
				? ""
				: itemPath.split("/").at(-1);
			return map(itemPath, destinationPath + itemName);
		});

		// await all responses.
		await Promise.allSettled(promises);

		// clear the clipboard.
		setClipboard([]);
		setClipboardMode(0);
		await updateFolderTree(dir.join("/"));
	};

	const beginDelete = async () => {
		//confirm the deletion.
		if (
			!confirm(
				`Are you sure you want to delete ${selection.length} item(s)`
			)
		)
			return;

		// copy each item on the clipboard to the new destination.
		const promises = selection.map((itemPath) => {
			return deleteItem(itemPath);
		});

		// await all responses.
		await Promise.allSettled(promises);

		setSelecting(false);
		await updateFolderTree(dir.join("/"));
	};

	const beginRename = async () => {
		// copy each item on the clipboard to the new destination.
		const promises = selection.map((itemPath) => {
			const fileName = itemPath.split("/").at(-1);
			const newFileName = prompt(`Rename ${fileName} to:`, fileName);
			return (
				fileName != newFileName &&
				moveItem(itemPath, "/" + dir.join("/") + "/" + newFileName)
			);
		});

		// await all responses.
		await Promise.allSettled(promises);

		setSelecting(false);
		await updateFolderTree(dir.join("/"));
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
				<label
					htmlFor="file-upload"
					className={styles.header_button}
					title={"Upload Files"}
				>
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
					title={"Create Folder"}
				>
					🗀+
				</div>
				<div
					className={styles.header_button}
					onClick={changeViewMode}
					title={"Change View"}
				>
					👁{getIcon(viewMode)}
				</div>
				<div
					className={styles.header_button}
					onClick={toggleSelection}
					title={"Select"}
				>
					{isSelecting ? "☒" : "☐"}
				</div>
				<div
					className={styles.header_button}
					onClick={beginDelete}
					title={"Delete"}
				>
					🗑
				</div>
				<div
					className={styles.header_button}
					onClick={beginRename}
					title={"Rename"}
				>
					Rename
				</div>

				{clipboardMode == 0 ? (
					<>
						<div
							className={styles.header_button}
							onClick={prepareCopy}
							title={"Copy"}
						>
							🗎🗎
						</div>
						<div
							className={styles.header_button}
							onClick={prepareMove}
							title={"Cut"}
						>
							✄
						</div>
					</>
				) : (
					<div
						className={styles.header_button}
						onClick={beginPaste}
						title={"Paste"}
					>
						Paste
					</div>
				)}
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
							<FolderIcon
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
