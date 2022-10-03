import { useContext } from "react";
import { SelectionContext } from "../../contexts/SelectionContext";
import { getFileURL } from "../../utils";
import styles from "./FileComponent.module.scss";

function FileComponent({ name, path, onClick, isPreview }) {
	const { isSelecting } = useContext(SelectionContext);

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

	return isSelecting ? (
		<input type="selecting" className={styles.file}>
			{imagePreview || name}
		</input>
	) : (
		<div className={styles.file} onClick={onClick}>
			{imagePreview || name}
		</div>
	);
}

export default FileComponent;
