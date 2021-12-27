import React from "react";
import { Form, Input, Button, Modal } from "antd";
import sendRequest from "../config/sentRequest";
export default function Expenditure({ show, setShow }) {
	const handleOk = () => {
		// this.setState({ visible: false });
	};

	const handleCancel = () => {
		setShow(false);
	};

	const onFinish = async (values) => {
		console.log("alindi");
		let res = await sendRequest("spenditems/put.php", values);
		setShow(false);
	};

	return (
		<div>
			<Modal
				visible={show}
				title="Xərc maddəsi"
				onOk={handleOk}
				destroyOnClose={true}
				onCancel={handleCancel}
				footer={[
					<Button danger key="back" onClick={handleCancel}>
						Bağla
					</Button>,
					<Button
						key="submit"
						htmlType="submit"
						className="customsavebtn"
						form="spendItemForm"
						onClick={handleOk}
					>
						Yadda saxla
					</Button>,
				]}
			>
				<Form
					id="spendItemForm"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					layout="horizontal"
					onFinish={onFinish}
				>
					<Form.Item name="name" label="Xərc maddəsi">
						<Input />
					</Form.Item>
					<Form.Item hidden={true} name="id" label="id">
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
