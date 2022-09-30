import styles from "./FolderViewer.module.scss";

function FolderViewer({ folder, viewMode }) {
	// evaluate the view class.
	const classList = [styles.files];
	let isPreview = false;
	switch (viewMode) {
		default:
		case 0:
			classList.push(styles.grid);
			isPreview = true;
			break;
		case 1:
			classList.push(styles.list);
			break;
	}
	const classes = classList.join(" ");

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
			<button onClick={changeView}>views</button>
			{/* supply a file to upload */}
			<input type="file" onChange={upload} />
			{/* go back one folder */}
			<FolderComponent name={"←"} onClick={() => goBack()} />
			{folders}
			{files}
		</div>
	);
}

export default FolderViewer;
