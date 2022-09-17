export const getFileTree = async (filepath = "./share") => {
	const res = await fetch("http://localhost/files");
	return await res.json();
};

export const getFilePath = (root, filename) => root + "/" + filename;

export const getFileURL = (filepath) => "http://localhost/files/get" + filepath;
export const postFileURL = (filepath) =>
	"http://localhost/files/upload" + filepath;

export const downloadFile = async (filepath, filename) => {
	const res = await fetch(getFileURL(filepath));

	const blob = await res.blob();

	let url = window.URL.createObjectURL(blob);
	let a = document.createElement("a");
	a.href = url;
	console.log(filename);
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
};

export const sendFile = async (root, { name, type }, data) => {
	// format the filepath.
	const file_path = getFilePath(root, name);
	const file_url = postFileURL(file_path);

	// post the data.
	const res = await fetch(file_url, {
		method: "POST",
		/* mode: "no-cors", */
		headers: { "Content-Type": type },
		body: data,
	});

	console.log("status:", res.status);

	// check the status of the request.
	if (res.status != 202) {
		alert("error while uploading file.");
	} else {
		alert("success.");
	}
};

export const uploadFile = async (filepath, file) => {
	// read the file.
	const reader = new FileReader();
	reader.onload = () => {
		sendFile(filepath, file, reader.result);
	};
	reader.readAsArrayBuffer(file);
};
