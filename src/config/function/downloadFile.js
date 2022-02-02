import axios from "axios";
import { API_BASE } from "../../api";

export const downloadFile = async (sendData, fileIndex, controllers) => {
	Object.assign(sendData, {
		requesttype: 1,
		printtype: fileIndex,
	});
    
	sendData.token = localStorage.getItem("access-token");

	await axios({
        method: 'post',
        url: API_BASE + `/controllers/` + controllers + "/get.php",
        data: sendData,
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.${fileIndex}`);
        document.body.appendChild(link);
        link.click();
    });
};
