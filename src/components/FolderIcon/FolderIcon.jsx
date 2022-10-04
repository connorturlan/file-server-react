import IconComponent from "../IconComponent/IconComponent";
import styles from "./FolderIcon.module.scss";

function FolderIcon({ name, onClick }) {
	return (
		<IconComponent className={styles.folder} onClick={onClick}>
			{name}
		</IconComponent>
	);
}

export default FolderIcon;
