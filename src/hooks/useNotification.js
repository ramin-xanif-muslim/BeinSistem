import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendRequest from "../config/sentRequest";

export function useNotification() {
	const [notifications, setNotifications] = useState([]);
	const getNotification = async () => {
		let res = await sendRequest("notifications/get.php", {});
		setNotifications(res.Notifications);
		if (notifications[0]) {
            for (let item of notifications) {
                if(item.NotType === 1){
                    toast.info(item.Message)
                }
                if(item.NotType === 2){
                    toast.success(item.Message)
                }
                if(item.NotType === 3){
                    toast.warn(item.Message)
                }
                if(item.NotType === 4){
                    toast.error(item.Message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        });
                    // toast.error(item.Message)
                }
            }
        }
	};
	return { getNotification, notifications };
}
