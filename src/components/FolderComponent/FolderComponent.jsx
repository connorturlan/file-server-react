import styles from "./FolderComponent.module.scss";

function FolderComponent({ name, onClick }) {
	return (
		<button className={styles.FolderComponent} onClick={onClick}>
			{name}
		</button>
	);
}

export default FolderComponent;
