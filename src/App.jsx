import SelectionProvider from "./contexts/SelectionContext";
import FileServer from "./FileServer";

function App() {
	return (
		<SelectionProvider>
			<FileServer />
		</SelectionProvider>
	);
}

export default App;
