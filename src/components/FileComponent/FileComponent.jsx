import { getFilePath } from "../../utils";
import styles from "./FileComponent.module.scss";

function FileComponent({ name, path, onClick }) {
	console.log(path);

	const imagePreview = name.toLowerCase().match(/.[jpg|gif|png]$/i) ? (
		<img
			className={styles.file__image}
			src={getFilePath(path)}
			title={name}
		></img>
	) : (
		false
	);

	return (
		<button className={styles.file} onClick={onClick}>
			{imagePreview || name}
		</button>
	);
}

export default FileComponent;
