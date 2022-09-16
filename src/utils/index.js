export const getFileTree = async (filepath = "./share") => {
	const res = await fetch("http://localhost/files");
	return await res.json();
};

export const getFilePath = (filepath) =>
	"http://localhost/files/get" + filepath;

export const downloadFile = async (filepath, filename) => {
	const res = await fetch(getFilePath(filepath));

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
