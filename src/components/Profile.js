import React, { useRef } from "react";
import { Divider } from "antd";
import MaskedInput from "antd-mask-input";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { fetchCompany, updateCompany } from "../api";
var pat = /^[a-zA-Z0-9]+$/;
const deviderStyle = {
	width: "100%",
	background: "#d2d2d2",
	height: "1px",
};
function Profile() {
	const inputMaskRef = useRef(null);

	const queryClient = useQueryClient();

	const { isLoading, error, data, isFetching } = useQuery(["company"], () =>
		fetchCompany()
	);
	const updateMutation = useMutation(updateCompany, {
		refetchQueris: ["company"],
	});

	const onClose = () => {
		message.destroy();
	};

	const onFinish = async (values) => {
		message.loading({ content: "Yüklənir...", key: "doc_update" });
		updateMutation.mutate(
			{ filter: values },
			{
				onSuccess: (res) => {
					if (res.Headers.ResponseStatus === "0") {
						message.success({
							content: "Dəyişildi",
							key: "doc_update",
							duration: 2,
						});
						queryClient.invalidateQueries("company");
					} else {
						message.error({
							content: (
								<span className="error_mess_wrap">
									Saxlanılmadı... {res.Body}{" "}
									{<CloseCircleOutlined onClick={onClose} />}
								</span>
							),
							key: "doc_update",
							duration: 0,
						});
					}
				},
				onError: (e) => {
					console.log(e);
				},
			}
		);
	};
	const validateMessages = {
		required: "${label} is required!",
		types: {
			email: "${label} düzgün formatda deyil!",
			number: "${label} is not a valid number!",
		},
		number: {
			range: "${label} must be between ${min} and ${max}",
		},
	};
	if (isLoading) return "Yüklənir...";

	if (error) return "An error has occurred: " + error.message;

	return (
		<div>
			<div
				style={{
					display: "flex",
					alignItems: "flex-end",
					marginBottom: "1rem",
				}}
			>
				<UserOutlined
					style={{
						fontSize: "1.5em",
						color: "#0288d1",
						marginRight: "1rem",
					}}
				/>
				<h3 style={{ marginTop: "0", fontWeight: "600" }}>
					{JSON.parse(localStorage.getItem("user")).Login}
				</h3>
			</div>
			<Form
				id="myForm"
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				initialValues={{
					email: data.Body.Email,
					companyname: data.Body.CompanyName,
					accountnumber: data.Body.AccountNumber,
					mobile: data.Body.Mobile,
					voin: data.Body.Voin,
					cashback: data.Body.CashBack,
				}}
				onFinish={onFinish}
				validateMessages={validateMessages}
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							type: "email",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Hesab nömrəsi"
					name="accountnumber"
					rules={[
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || pat.test(value)) {
									return Promise.resolve();
								}

								return Promise.reject(
									new Error(
										"Hesab nömrəsi yalnız hərflərdən və rəqəmlərdən ibarət olmalıdır"
									)
								);
							},
						}),
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="VÖEN"
					name="voin"
					rules={[
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || pat.test(value)) {
									return Promise.resolve();
								}

								return Promise.reject(
									new Error(
										"VÖEN yalnız hərflərdən və rəqəmlərdən ibarət olmalıdır"
									)
								);
							},
						}),
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="Şirkət adı" name="companyname">
					<Input />
				</Form.Item>
				<Form.Item
					label="Mobil nömrəsi"
					name="mobile"
					rules={[
						({ getFieldValue }) => ({
							validator(_, value) {
								if (
									!value ||
									value.slice(7, 9) == "55" ||
									value.slice(7, 9) == "60" ||
									value.slice(7, 9) == "99" ||
									value.slice(7, 9) == "51" ||
									value.slice(7, 9) == "10" ||
									value.slice(7, 9) == "50" ||
									value.slice(7, 9) == "70" ||
									value.slice(7, 9) == "77"
								) {
									return Promise.resolve();
								}

								return Promise.reject(
									new Error("Düzgün nömrə daxil edin...")
								);
							},
						}),
					]}
				>
					<MaskedInput
						ref={inputMaskRef}
						mask="(+994) 11-111-11-11"
						placeholderChar={"_"}
					/>
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Yadda saxla
					</Button>
				</Form.Item>
				<Divider style={deviderStyle} type="vertical" />
				<Form.Item label="Cash Back" name="cashback">
					<Input />
				</Form.Item>
			</Form>
		</div>
	);
}

export default Profile;
