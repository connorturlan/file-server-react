import { useState } from "react";
import { useEffect } from "react";
import SidebarIcon from "./SidebarIcon/SidebarIcon";
import styles from "./FolderSidebar.module.scss";

function FolderSidebar({ folderTree, currentFolder, setFolder }) {
	const [sidebarTree, setSidebarTree] = useState(
		<SidebarIcon folderName={""}></SidebarIcon>
	);

	const renderSidebarFolders = (name = "Home", folders = {}) => {
		const children = Object.keys(folders)
			.filter((dir) => !dir.startsWith("."))
			.map((dir) => renderSidebarFolders(dir, folders[dir]));

		return (
			<SidebarIcon
				key={folders[".."] + name}
				folderName={name}
				className={styles.icon}
				onButtonPress={() => {
					const newDir = folders[".."] && folders[".."][0].split("/");
					setFolder(newDir[0] ? newDir : []);
				}}
			>
				{children}
			</SidebarIcon>
		);
	};

	useEffect(() => {
		setSidebarTree(renderSidebarFolders("Home", folderTree));
	}, [folderTree]);

	return <div className={styles.FolderSidebar}>{sidebarTree}</div>;
}

export default FolderSidebar;
