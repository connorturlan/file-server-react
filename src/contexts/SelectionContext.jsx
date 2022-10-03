import { createContext } from "react";

export const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
	const [isSelecting, setSelecting] = useState(false);

	const context = { isSelecting, setSelecting };

	return (
		<SelectionContext.Provider value={context}>
			{children}
		</SelectionContext.Provider>
	);
};

export default SelectionProvider;
