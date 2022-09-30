import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import FolderComponent from "./components/FolderComponent/FolderComponent";
import FolderSidebar from "./components/FolderSidebar/FolderSidebar";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import FolderViewer from "./containers/FolderViewer/FolderViewer";
import {
	downloadFile,
	getFilePath,
	getFolderTree,
	getFolderBranch,
	patchFolderTree,
	uploadFile,
} from "./utils";

function App() {
	const [loading, setLoading] = useState(true);
	const [elements, setElements] = useState({ "..": [], ".": [] });
	const [dir, setDir] = useState([]);
	const [viewMode, setViewMode] = useState(0);

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

	const navigateToFolder = (path) => {
		// add the selected folder to the history.
		setDir([...dir, path]);
	};

	const navigateFrom = () => {
		// remove the last history entry.
		const newDir = [...dir];
		newDir.pop();
		setDir(newDir);
	};

	// get the folder to view.
	const folder =
		dir.length == 0
			? elements
			: dir.reduce(
					(curr_folder, path) =>
						path in curr_folder ? curr_folder[path] : elements,
					elements
			  );

	return (
		<div className={styles.App}>
			<header className={styles.header}>
				<NavigationBar></NavigationBar>
			</header>
			<main className={styles.main}>
				<FolderSidebar folderTree={elements} currentFolder={dir} />
				{loading ? (
					<LoadingScreen />
				) : (
					<FolderViewer
						folder={folder}
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

export default App;
