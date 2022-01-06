import React, { useState } from "react";
import { toast } from "react-toastify";
import sendRequest from "../config/sentRequest";

export function useNotification() {

	const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState();
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);

	const getNotification = async () => {
		let res = await sendRequest("notifications/get.php", {});
		if (notifications[0]) {
            setNotifications(res.Notifications);
            setNotificationsCount(notifications.length)
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
                        autoClose: false,
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
	return { getNotification, notifications, notificationsCount, isNotificationModalVisible , setIsNotificationModalVisible };
}
