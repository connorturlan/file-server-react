import { useContext } from "react";
import { SelectionContext } from "../../contexts/SelectionContext";
import { getFileURL } from "../../utils";
import styles from "./FileComponent.module.scss";

function FileComponent({ name, path, onClick, isPreview }) {
	const { isSelecting, selection, setSelection } =
		useContext(SelectionContext);

	const imagePreview =
		/.(jpe?g|gif|png|webp|webm)$/i.test(name.toLowerCase()) && isPreview ? (
			<img
				className={styles.file__image}
				src={getFileURL(path)}
				title={name}
			></img>
		) : (
			false
		);

	const beginSelect = () => {
		console.log("selected:", path);

		let newSelection = selection;
		if (selection.includes(path)) {
			newSelection = newSelection.filter((item) => item != path);
		} else {
			newSelection.push(path);
		}

		console.log(selection, newSelection);
		setSelection(newSelection.slice());
	};

	const className = selection.includes(path)
		? `${styles.file} ${styles.file_selected}`
		: styles.file;

	return (
		<div
			className={className}
			onClick={isSelecting ? beginSelect : onClick}
		>
			{imagePreview || name}
		</div>
	);
}

export default FileComponent;
