import IconComponent from "../IconComponent/IconComponent";
import styles from "./FolderIcon.module.scss";

function FolderIcon({ name, path, onClick }) {
	return (
		<IconComponent styleClass={styles} onClick={onClick} path={path}>
			{name}
		</IconComponent>
	);
}

export default FolderIcon;
