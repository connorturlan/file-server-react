// get the entire folder tree.
export const getFolderTree = async (filepath = "./share") => {
	const res = await fetch("http://localhost/files/all");
	return await res.json();
};

// get a specified branch on the folder tree.
export const getFolderBranch = async (filepath = "./share") => {
	const res = await fetch("http://localhost/files/folder" + filepath);
	return await res.json();
};

// patch a branch within the folder tree at the folder path.
export const patchFolderTree = (folderpath, root, leaf) => {
	const node = folderpath
		.split("/")
		.reduce((node, path) => (path in node ? node[path] : root), root);
	node["."] = leaf["."];
	return { ...root };
};

// return the join filepath with the root.
export const getFilePath = (root, filename) => root + "/" + filename;

// return the corresponding http urls for a given filepath.
export const getFileURL = (filepath) => "http://localhost/files/get" + filepath;
export const postFileURL = (filepath) =>
	"http://localhost/files/upload" + filepath;

// download a specified file.
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
export const sendFile = async (root, { name, type }, data) => {
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
			resolve(await sendFile(filepath, file, reader.result));
		};

		// read the file.
		reader.readAsArrayBuffer(file);
	});
};
