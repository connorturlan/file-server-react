import styles from "./IconComponent.module.scss";
import { useContext } from "react";
import { SelectionContext } from "../../contexts/SelectionContext";

function IconComponent({ className, children, onClick }) {
	const { isSelecting, selection, setSelection } =
		useContext(SelectionContext);

	// toggle this files selection on the clipboard.
	const beginSelect = () => {
		let newSelection = selection;
		if (selection.includes(path)) {
			newSelection = newSelection.filter((item) => item != path);
		} else {
			newSelection.push(path);
		}

		console.log(selection, newSelection);
		setSelection(newSelection.slice());
	};

	const classList = className ? `${styles.icon} ${className}` : styles.icon;

	return (
		<button className={classList} onClick={onClick}>
			{children}
		</button>
	);
}

export default IconComponent;
