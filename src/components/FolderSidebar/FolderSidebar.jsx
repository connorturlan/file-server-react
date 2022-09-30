import styles from "./FolderSidebar.module.scss";

function FolderSidebar({ folderTree, currentFolder, setFolder }) {
	return (
		<div className={styles.FolderSidebar}>
			<details>
				<summary>Hello, World!</summary>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Eligendi, quibusdam delectus. Id obcaecati ea quia dicta
					fugit eum quas, eveniet accusamus, voluptates tempora in
					porro quae voluptatibus, ratione quam vero?
				</p>
			</details>
		</div>
	);
}

export default FolderSidebar;
