import React, {useState} from 'react';
import {Modal, Button, Form, Input, Spin} from 'antd';
import { increaseBalance } from '../../api';

export const IncreaseBalance = props => {

  const [isLoading, setLoading] = useState (false);

  const handleOk = () => {};

  const handleCancel = () => {
    props.closeBalance()
  };

  const onFinish = async (values) => {
    setLoading(true)
    await increaseBalance(values);
    setLoading(false)
    handleCancel()
  };

  return (
    <div>
      <Modal
        visible={props.visible}
        title="Ödəmə"
        className="increasebalance"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Bağla
          </Button>,
          <Button
            htmlType="submit"
            form="balanceForm"
            type="primary"
            loading={isLoading}
            onClick={handleOk}
          >
            Artır
          </Button>,
        ]}
      >

        <Form id="balanceForm" onFinish={onFinish}>
          <Form.Item label={'Məbləğ'} name="amount">
            <Input
              type="number"
              step="any"
              addonAfter="₼"
              min={0}
            />
          </Form.Item>
        </Form>

      </Modal>

    </div>
  );
};

export default IncreaseBalance;
