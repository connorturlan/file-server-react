console.log(import.meta.env);

const fileServerURL = `http://${import.meta.env.HOST_URL}:${
	import.meta.env.HOST_PORT
}/`;

// get the entire folder tree.
export const getFolderTree = async (filepath = "./share") => {
	const res = await fetch(fileServerURL + "files/all");
	return await res.json();
};

// get a specified branch on the folder tree.
export const getFolderBranch = async (filepath = "./share") => {
	const res = await fetch(fileServerURL + "files/folder" + filepath);
	return await res.json();
};

// patch a branch within the folder tree at the folder path.
export const patchFolderTree = (folderPath, root, leaf) => {
	console.log(folderPath, root, leaf);
	const node = folderPath
		.split("/")
		.reduce((node, path) => (path in node ? node[path] : root), root);
	node["."] = leaf["."];
	console.log(root);
	return { ...root };
};

// return the join filepath with the root.
export const getFilePath = (root, filename) => [...root, filename].join("/");

// return the corresponding http urls for a given filepath.
export const getFileURL = (filepath) => fileServerURL + "files/get/" + filepath;
const postFileURL = (filepath) => fileServerURL + "files/upload/" + filepath;
const postFolderURL = (filepath) => fileServerURL + "files/mkdir/" + filepath;
const patchCopyURL = (filepath) => fileServerURL + "files/copy/" + filepath;
const patchMoveURL = (filepath) => fileServerURL + "files/move/" + filepath;
const deleteItemURL = (filepath) => fileServerURL + "files/delete/" + filepath;

// force the browser to download a specified file.
export const downloadFile = async (filepath, filename) => {
	const res = await fetch(getFileURL(filepath));

	const blob = await res.blob();

	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
};

// send a file to the file server.
export const sendFileBytes = async (root, { name, type }, data) => {
	// format the filepath.
	const file_path = getFilePath(root, name);
	const file_url = postFileURL(file_path);

	// post the data.
	const res = await fetch(file_url, {
		method: "POST",
		headers: { "Content-Type": type },
		body: data,
	});

	console.log("file uploaded attempted with status:", res.status);

	// check the status of the request.
	if (res.status != 201) {
		alert(`error while uploading file. status code: ${res.status}`);
	} else {
		console.log("success.");
	}

	return res.status;
};

// upload a file and return a promise to the upload status.
export const uploadFile = (filepath, file, callback = () => {}) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		// when the file completes its read, read the file then resolve the upload promise.
		reader.onload = async () => {
			resolve(await sendFileBytes(filepath, file, reader.result));
		};

		// read the file.
		reader.readAsArrayBuffer(file);
	});
};

export const createNewFolder = async (root, name) => {
	// format the filepath.
	const folder_path = getFilePath(root, name);
	const folder_url = postFolderURL(folder_path);

	// post the data.
	const res = await fetch(folder_url, {
		method: "POST",
	});

	console.log("folder creation attempted with status:", res.status);

	// check the status of the request.
	if (res.status != 201) {
		alert(`error while creating folder. status code: ${res.status}`);
	} else {
		console.log("success.");
	}

	return res.status;
};

export const copyItem = async (src, dst) => {
	return new Promise(async (resolve, reject) => {
		const itemURL = patchCopyURL(src);

		const body = JSON.stringify({ destination: dst });

		const res = await fetch(itemURL, {
			method: "PATCH",
			body,
		});

		if (res.status != 201)
			reject(`Copy rejected with status: ${res.status}`);
		else resolve(`Copy accepted with status: ${res.status}`);
	});
};

export const moveItem = async (src, dst) => {
	return new Promise(async (resolve, reject) => {
		const itemURL = patchMoveURL(src);

		const body = JSON.stringify({ destination: dst });

		const res = await fetch(itemURL, {
			method: "PATCH",
			body,
		});

		if (res.status != 202)
			reject(`Move rejected with status: ${res.status}`);
		else resolve(`Move accepted with status: ${res.status}`);
	});
};

export const deleteItem = async (itemPath) => {
	return new Promise(async (resolve, reject) => {
		const itemURL = deleteItemURL(itemPath);

		const res = await fetch(itemURL, {
			method: "DELETE",
		});

		if (res.status != 204)
			reject(`Delete rejected with status: ${res.status}`);
		else resolve(`Delete accepted with status: ${res.status}`);
	});
};
