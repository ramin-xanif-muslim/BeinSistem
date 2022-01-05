import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNotification } from '../hooks';

const NatificationModal = () => {
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const { notifications } = useNotification()
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
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Basic Modal" visible={isNotificationModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default NatificationModal