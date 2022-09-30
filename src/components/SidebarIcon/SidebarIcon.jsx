import styles from "./SidebarIcon.module.scss";

function SidebarIcon({ folderName, children, onButtonPress }) {
	return (
		<details className={styles.icon__details}>
			<summary className={styles.icon__summary}>
				{folderName}
				<button className={styles.button} onClick={onButtonPress}>
					O
				</button>
			</summary>
			{children}
		</details>
	);
}

export default SidebarIcon;
