import { useEffect, useState } from "react";
import styles from "./NavigationBar.module.scss";

function navbar({ children }) {
	const hide = () => {
		document.getElementById("navbarToggle").checked = false;
	};

	return (
		<nav className={styles.navbar}>
			<input
				id="navbarToggle"
				type="checkbox"
				className={styles.navbar__Toggle}
			/>
			<label
				className={styles.navbar__ToggleLabel}
				htmlFor="navbar__Menu"
			></label>
			<h1 className={styles.navbar__Icon}>Connor Turlan</h1>
			<div onClick={hide} className={styles.navbar__Buttons}>
				{children}
			</div>
		</nav>
	);
}

export default navbar;
