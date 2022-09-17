import { getFileURL } from "../../utils";
import styles from "./FileComponent.module.scss";

function FileComponent({ name, path, onClick }) {
	const imagePreview = /.(jpe?g|gif|png|webp|webm)$/i.test(
		name.toLowerCase()
	) ? (
		<img
			className={styles.file__image}
			src={getFileURL(path)}
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
