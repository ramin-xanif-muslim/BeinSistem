import React, { useState } from "react";
import { toast } from "react-toastify";
import sendRequest from "../config/sentRequest";

export function useNotification() {

	const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState();

	const fetchNotificationCount = async () => {
		let res = await sendRequest("notifications/get.php", {});
		if (res.Notifications[0]) {
            setNotificationsCount(res.Notifications.length)
            setNotifications(res.Notifications);
        }
	};

	const getNotification = async () => {
		if (notifications[0]) {
            setNotificationsCount(notifications.length)
            for (let item of notifications) {
                if(item.NotType === 1){
                    toast.info(item.Message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        })
                        setNotificationsCount(0)
                }
                if(item.NotType === 2){
                    toast.success(item.Message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        })
                        setNotificationsCount(0)
                }
                if(item.NotType === 3){
                    toast.warn(item.Message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        })
                        setNotificationsCount(0)
                }
                if(item.NotType === 4){
                    toast.error(item.Message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        });
                        setNotificationsCount(0)
                    // toast.error(item.Message)
                }
            }
        }
	};
	return { getNotification, notifications, notificationsCount, fetchNotificationCount };
}
