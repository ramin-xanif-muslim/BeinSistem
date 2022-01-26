import sendRequest from "../sentRequest";

export const downloadFile = async (advanced, fileIndex, controllers) => {
    console.log(advanced)
    console.log(fileIndex)
	Object.assign(advanced, {
		requesttype: 1,
		printtype: fileIndex,
	});
	let res = await sendRequest(controllers + "/get.php", advanced);
	const url = window.URL.createObjectURL(new Blob([res.data]));
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", `${Date.now()}.xlsx`);
	document.body.appendChild(link);
	link.click();
};
