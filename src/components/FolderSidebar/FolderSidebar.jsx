import { useState } from "react";
import { useEffect } from "react";
import SidebarIcon from "../SidebarIcon/SidebarIcon";
import styles from "./FolderSidebar.module.scss";

function FolderSidebar({ folderTree, currentFolder, setFolder }) {
	const [sidebarTree, setSidebarTree] = useState(
		<SidebarIcon folderName={"root"}></SidebarIcon>
	);

	const renderSidebarFolders = (name = "root", folders = {}) => {
		console.log("rendering", name, folders);

		console.log(
			"filtered",
			Object.keys(folders).filter((dir) => !dir.startsWith("."))
		);

		const children = Object.keys(folders)
			.filter((dir) => !dir.startsWith("."))
			.map((dir) => renderSidebarFolders(dir, folders[dir]));

		console.log(children);

		return (
			<SidebarIcon
				folderName={name}
				className={styles.icon}
				onButtonPress={() => {
					const newDir = folders[".."][0].slice(1).split("/");
					setFolder(newDir[0] ? newDir : []);
				}}
			>
				{children}
			</SidebarIcon>
		);
	};

	useEffect(() => {
		console.log("updating sidebar");
		setSidebarTree(renderSidebarFolders("root", folderTree));
	}, [folderTree]);

	return <div className={styles.FolderSidebar}>{sidebarTree}</div>;
}

export default FolderSidebar;
