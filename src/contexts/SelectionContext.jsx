import { useEffect } from "react";
import { createContext, useState } from "react";

export const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
	const [isSelecting, setSelecting] = useState(false);
	const [selection, setSelection] = useState([]);

	const context = { isSelecting, setSelecting, selection, setSelection };

	useEffect(() => {
		if (!isSelecting) {
			setSelection([]);
		}
	}, [isSelecting]);

	return (
		<SelectionContext.Provider value={context}>
			{children}
		</SelectionContext.Provider>
	);
};

export default SelectionProvider;
