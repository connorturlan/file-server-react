import styles from "./FileIcon.module.scss";
import { getFileURL } from "../../utils";
import IconComponent from "../IconComponent/IconComponent";

function FileIcon({ name, path, onClick, isPreview }) {
	const playVideo = (event) => {
		event.target.play();
	};

	const pauseVideo = (event) => {
		event.target.pause();
	};

	// generate the image preview if the file is an image.
	let imagePreview = false;
	if (isPreview) {
		if (/.(jpe?g|gif|png|webp)$/i.test(name.toLowerCase())) {
			imagePreview = (
				<img
					className={styles.base__image}
					src={getFileURL(path)}
					title={name}
				></img>
			);
		} else if (/.(mp4|webm|mov)$/i.test(name.toLowerCase())) {
			imagePreview = (
				<video
					className={styles.base__video}
					title={name}
					onMouseOver={playVideo}
					onMouseLeave={pauseVideo}
					preload="metadata"
					loop
				>
					<source src={getFileURL(path)} type="video/webm" />
					<source src={getFileURL(path)} type="video/mp4" />
				</video>
			);
		}
	}

	/* imagePreview.onMouseOver(() => {
		imagePreview.play;
	});
 */
	return (
		<IconComponent styleClass={styles} onClick={onClick} path={path}>
			{imagePreview || name}
		</IconComponent>
	);
}

export default FileIcon;
