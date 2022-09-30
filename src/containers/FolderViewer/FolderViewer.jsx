import FileComponent from "../../components/FileComponent/FileComponent";
import FolderComponent from "../../components/FolderComponent/FolderComponent";
import { downloadFile, getFilePath } from "../../utils";
import styles from "./FolderViewer.module.scss";

function FolderViewer({ children, folder, viewMode, navigateToFolder }) {
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

	// download a specified file.
	const beginFileDownload = (filepath, filename) => {
		downloadFile(filepath, filename);
	};

	// generate folder icons, remove hidden folders.
	const folders = Object.keys(folder)
		.filter((dir) => !dir.startsWith("."))
		.map((e, index) => {
			return (
				<FolderComponent
					key={index}
					name={e}
					onClick={() => navigateToFolder(e)}
				/>
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
					onClick={() => beginFileDownload(filepath, e)}
					isPreview={isPreview}
				/>
			);
		});

	return (
		<div className={classes}>
			{children}
			{folders}
			{files}
		</div>
	);
}

export default FolderViewer;
