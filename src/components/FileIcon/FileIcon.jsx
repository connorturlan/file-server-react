import styles from "./FileIcon.module.scss";
import { getFileURL } from "../../utils";
import IconComponent from "../IconComponent/IconComponent";

function FileIcon({ name, path, onClick, isPreview }) {
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

	return (
		<IconComponent styleClass={styles} onClick={onClick} path={path}>
			{imagePreview || name}
		</IconComponent>
	);
}

export default FileIcon;
