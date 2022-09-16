import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import FilesContainer from "./containers/FilesContainer/FilesContainer";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<FilesContainer />
		</div>
	);
}

export default App;
