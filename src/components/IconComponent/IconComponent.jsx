import styles from "./IconComponent.module.scss";
import { useContext } from "react";
import { SelectionContext } from "../../contexts/SelectionContext";

function IconComponent({ styleClass, children, path, onClick }) {
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

	// construct the base class.
	const baseClass = styleClass
		? `${styles.icon} ${styleClass.base}`
		: styles.icon;

	// toggle the class depending on if this file is selected or not.
	const classList = selection.includes(path)
		? `${baseClass} ${styleClass.selected}`
		: baseClass;

	return (
		<button
			className={classList}
			onClick={isSelecting ? beginSelect : onClick}
		>
			{children}
		</button>
	);
}

export default IconComponent;
