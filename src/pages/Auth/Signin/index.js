import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { fetchSettings, putLogin } from "../../../api";
import "../../Auth/Login.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useTableCustom } from "../../../contexts/TableContext";
import { fetchMarks, fetchStocks, sendRegisterPhp } from "../../../api";
import { MaskedInput } from "antd-mask-input";
import { useParams } from "react-router-dom";

var pat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
var patName = /^([a-zA-Z]{4,})?$/;

export default function SignIn() {
	const { settingsObj } = useTableCustom();
	const { login, setToken, setParamsToken } = useAuth();
	const inputMaskRef = useRef(null);

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [value, setValue] = useState("");
	const [objectReg, setobjectReg] = useState(null);
	const [loadingfirst, setLoadingfirst] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setToken(null);
	}, []);

	async function register(values, val, logdata) {
		const regResponse = await sendRegisterPhp(values, val);
		setVisible(false);

		signin(logdata);
	}

	async function signin(values) {
		const loginResponse = await putLogin(values);
		if (loginResponse.Headers.ResponseStatus === "0") {
			login(loginResponse);
			setLoading(false);
			fetchSettings(settingsObj);
		}
		if (loginResponse.Headers.ResponseStatus !== "0") {
			alert(loginResponse.Body);
			setLoading(false);
		}
	}
	const onFinish = (values) => {
		setLoading(true);
		signin(values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("errorInfo", errorInfo);
	};
	const handleOk = () => {
		setLoading(true);
		var logdata = {};
		logdata.Login = "admin@" + objectReg.Login;
		logdata.Password = objectReg.password;
		register(objectReg, value, logdata);
	};

	const onChange = (e) => {
		setValue(e.target.value);
	};

	const handleCancel = () => {
		setVisible(false);
		setValue("");
		setLoading(false);
	};
	return (
		<div className="login_page">
			<div className="lofin_form_wrapper">
				<h1 className="login_word_header">Giri??</h1>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						name="Login"
						rules={[
							{
								required: true,
								message: "Z??hm??t olmasa login daxil edin!",
							},
						]}
					>
						<Input
							prefix={
								<UserOutlined className="site-form-item-icon" />
							}
							placeholder="Login"
						/>
					</Form.Item>

					<Form.Item
						name="Password"
						rules={[
							{
								required: true,
								message: "Z??hm??t olmasa parolu daxil edin!",
							},
						]}
					>
						<Input
							prefix={
								<LockOutlined className="site-form-item-icon" />
							}
							type="password"
							placeholder="Parol"
						/>
					</Form.Item>

					<Form.Item className="login_bottom_side">
						<div onClick={() => setVisible(true)}>
							<p style={{ color: "blue" }}>Parolu unutmu??am</p>
						</div>

						<Link to={{ pathname: "/registration" }}>
							Qeydiyyatdan ke??
						</Link>
					</Form.Item>

					<Modal
						visible={visible}
						className="reg_modal"
						title="Parolu yenile"
						onOk={handleOk}
						onCancel={handleCancel}
						footer={[
							<Button key="back" onClick={handleCancel}>
								Geri
							</Button>,
							<Button
								key="submit"
								type="primary"
								loading={loading}
								onClick={handleOk}
							>
								Davam et
							</Button>,
						]}
					>
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
						>
							<Form.Item
								name="password"
								label="??ifr??"
								rules={[
									{
										required: true,
										message:
											"Z??hm??t olmasa, ??ifr??nizi daxil edin",
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || pat.test(value)) {
												return Promise.resolve();
											}

											return Promise.reject(
												new Error(
													"??ifr??nizd?? 6 v?? ya daha ??ox simvol v?? ??n az?? bir r??q??m olmal??d??r.X??susi simvollara (#,@,#,!,$,_,-,+,*) icaz?? verilmir"
												)
											);
										},
									}),
								]}
								hasFeedback
							>
								<Input.Password />
							</Form.Item>

							<Form.Item
								name="confirm"
								label="??ifr??ni t??krarla"
								hasFeedback
								rules={[
									{
										required: true,
										message: "??ifr??ni t??krarla",
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue("password") ===
													value
											) {
												return Promise.resolve();
											}

											return Promise.reject(
												new Error("??ifr??l??r eyni deyil")
											);
										},
									}),
								]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item
								label="Mobil n??mr??si"
								name="mobile"
								rules={[
									{
										required: true,
										message:
											"Z??hm??t olmasa, mobil n??mr??nizi daxil edin",
									},
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
												new Error(
													"D??zg??n n??mr?? daxil edin..."
												)
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
								className="login_bottom_side login"
								style={{ alignContent: "center" }}
							>
								<Button
									loading={loadingfirst}
									type="primary"
									htmlType="submit"
									className="login-form-button"
								>
									Qydiyyatdan ke??
								</Button>
							</Form.Item>
						</Form>
					</Modal>

					<Form.Item
						className="login_bottom_side login"
						style={{ alignContent: "center" }}
					>
						<Button
							loading={loading}
							type="primary"
							htmlType="submit"
							className="login-form-button"
						>
							Daxil ol
						</Button>
					</Form.Item>
				</Form>

				<p style={{ color: "red", display: error ? "block" : "none" }}>
					{error}
				</p>
			</div>
		</div>
	);
}
