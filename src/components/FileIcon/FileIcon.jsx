import styles from "./FileIcon.module.scss";
import { useContext } from "react";
import { SelectionContext } from "../../contexts/SelectionContext";
import { getFileURL } from "../../utils";
import IconComponent from "../IconComponent/IconComponent";

function FileIcon({ name, path, onClick, isPreview }) {
	/* const { isSelecting, selection, setSelection } =
		useContext(SelectionContext); */

	// generate the image preview if the file is an image.
	const imagePreview = /.(jpe?g|gif|png|webp|webm)$/i.test(
		name.toLowerCase()
	) &&
		isPreview && (
			<img
				className={styles.base__image}
				src={getFileURL(path)}
				title={name}
			></img>
		);

	/* // toggle this files selection on the clipboard.
	const beginSelect = () => {
		let newSelection = selection;
		if (selection.includes(path)) {
			newSelection = newSelection.filter((item) => item != path);
		} else {
			newSelection.push(path);
		}

		console.log(selection, newSelection);
		setSelection(newSelection.slice());
	};

	// toggle the class depending on if this file is selected or not.
	const classList = selection.includes(path)
		? `${styles.base} ${styles.selected}`
		: styles.base; */

	return (
		<IconComponent styleClass={styles} onClick={onClick} path={path}>
			{imagePreview || name}
		</IconComponent>
	);
}

export default FileIcon;
