import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useNotification } from '../hooks';

const NatificationModal = ({ isNotificationModalVisible, setIsNotificationModalVisible }) => {

    const [ notify, setNotify ] = useState([])
  const { notifications } = useNotification()

  useEffect(() => {
    setNotify(notifications)
  },[notifications])
  console.log(notifications)

  const showModal = () => {
    setIsNotificationModalVisible(true);
  };

  const handleOk = () => {
    setIsNotificationModalVisible(false);
  };

  const handleCancel = () => {
    setIsNotificationModalVisible(false);
  };

  return (
    <>
      <Modal title="Basic Modal" visible={isNotificationModalVisible} onOk={handleOk} onCancel={handleCancel}>
        { notify[0] && notify.map(n => {
            return(
                <p>{n.Message}</p>
            )
        })}
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default NatificationModal