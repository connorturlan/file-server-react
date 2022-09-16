import { useEffect, useState } from "react";
import styles from "./NavigationBar.module.scss";

function NavigationBar({ children }) {
	const hide = () => {
		document.getElementById("navbarToggle").checked = false;
	};

	return (
		<nav className={styles.NavigationBar}>
			<input
				id="navbarToggle"
				type="checkbox"
				className={styles.NavigationBar__Toggle}
			/>
			<label
				className={styles.NavigationBar__ToggleLabel}
				htmlFor="NavigationBar__Menu"
			></label>
			<h1 className={styles.NavigationBar__Icon}>Connor Turlan</h1>
			<div onClick={hide} className={styles.NavigationBar__Buttons}>
				{children}
			</div>
		</nav>
	);
}

export default NavigationBar;
