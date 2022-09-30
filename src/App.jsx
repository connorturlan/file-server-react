import { useState } from "react";
import styles from "App.module.scss";

function App() {
	const [loading, setLoading] = useState(true);
	const [elements, setElements] = useState({ "..": [], ".": [] });
	const [dir, setDir] = useState();
	const [viewMode, setViewMode] = useState(0);

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
				<navbar></navbar>
			</header>
			<main className={styles.main}>
				{loading ? (
					<LoadingScreen />
				) : (
					<FolderViewer folder={folder} viewMode={viewMode} />
				)}
			</main>
		</div>
	);
}

export default App;
