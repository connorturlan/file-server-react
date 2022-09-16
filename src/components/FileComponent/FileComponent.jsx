import styles from "./FileComponent.module.scss";

function FileComponent({ name, onClick }) {
	return (
		<button className={styles.FileComponent} onClick={onClick}>
			{name}
		</button>
	);
}

export default FileComponent;
