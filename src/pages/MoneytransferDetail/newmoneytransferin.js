import React from "react";
import { api, fetchDocName, sendRequest } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
	Form,
	Input,
	Button,
	Checkbox,
	DatePicker,
	Select,
	Row,
	Col,
	Alert,
	Collapse,
} from "antd";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import CustomerDrawer from "../../components/CustomerDrawer";
import ok from "../../audio/ok.mp3";
import { useBalance } from "../../hooks/useBalance";

const audio = new Audio(ok);

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;
function NewMoneytransfersIn() {
	const [form] = Form.useForm();
	const {
		setDisable,
		disable,
	} = useTableCustom();
	const {
		docmark,
		setLoadingForm,
		setCustomerDrawer,

		saveFromModal,
		setRedirectSaveClose,
	} = useCustomForm();
	const [redirect, setRedirect] = useState(false);
	const [editId, setEditId] = useState(null);
	const [status, setStatus] = useState(true);
	const [expeditors, setExpeditors] = useState([]);
    const [ balanceComponent, fetchBalance, setBalance ] = useBalance()

	useEffect(() => {
		setDisable(true);

		return () => {
			setDisable(true);
		};
	}, []);

	const onClose = () => {
		message.destroy();
	};

	useEffect(() => {
		form.setFieldsValue({
			moment: moment(),
		});
		setLoadingForm(false);
	}, []);
	useEffect(async () => {
		let res = await sendRequest("expeditors/get.php", {});
		setExpeditors(res.List);
	}, []);
	const expeditorsOptions = Object.values(expeditors).map((c) => {
		return (
			<Option key={c.Id} value={c.Id}>
				{c.Name}
			</Option>
		);
	});
	const handleChanged = () => {
		if (disable) {
			setDisable(false);
		}
	};
    const onSelectExpeditor = (id) => {
        fetchBalance(id)
    }
	const handleFinish = async (values) => {
		setDisable(true);
		values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
		values.status = status;
		message.loading({ content: "Yüklənir...", key: "doc_update" });

		Object.assign(values, { type: 2 });
		const res = await saveDoc(values, "moneytransfers");
		if (res.Headers.ResponseStatus === "0") {
			message.success({
				content: "Saxlanıldı",
				key: "doc_update",
				duration: 2,
			});
			setEditId(res.Body.ResponseService);
			audio.play();

			if (saveFromModal) {
				setRedirectSaveClose(true);
			} else {
				setRedirect(true);
			}
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
	};
	if (redirect) return <Redirect to={`/editMoneytransfer/${editId}`} />;
	return (
		<div className="doc_wrapper">
			<div className="doc_name_wrapper">
				<h2>Pul mədaxil</h2>
			</div>
			<DocButtons
				additional={"none"}
				editid={null}
				closed={"p=moneytransfer"}
			/>
			<div className="formWrapper">
				<Form
					form={form}
					id="myForm"
					className="doc_forms"
					name="basic"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					initialValues={{
						status: true,
					}}
					onFinish={handleFinish}
					onFieldsChange={handleChanged}
					layout="horizontal"
				>
					<Row>
						<Col xs={6} sm={6} md={6} xl={6}>
							<Form.Item
								label="Məbləğ"
								name="amount"
								className="doc_number_form_item"
							>
								<Input
									style={{ width: "100px" }}
									className="detail-input"
									type="number"
									step="any"
									placeholder="₼"
									allowClear
									min={0}
								/>
							</Form.Item>
						</Col>
						<Col xs={3} sm={3} md={3} xl={3}></Col>
						<Col xs={6} sm={6} md={6} xl={6}></Col>
					</Row>

					<Row>
						<Col xs={6} sm={6} md={6} xl={6}>
							<Form.Item
								label="Tarix"
								name="moment"
								style={{ width: "100%" }}
							>
								<DatePicker
									className="detail-input"
									showTime={{ format: "HH:mm:ss" }}
									format="YYYY-MM-DD HH:mm:ss"
								/>
							</Form.Item>
						</Col>
						<Col xs={3} sm={3} md={3} xl={3}></Col>
						<Col xs={6} sm={6} md={6} xl={6}>
							<Form.Item
								style={{ margin: "0" }}
								label="Qarşı-tərəf"
								name="expeditorid"
								rules={[
									{
										required: true,
										message:
											"Zəhmət olmasa, qarşı tərəfi seçin",
									},
								]}
							>
								<Select
									showSearch
									showArrow={false}
                                    onClear={() => setBalance(null)}
                                    onChange={onSelectExpeditor}
									className="customSelect detail-select"
									allowClear={true}
									filterOption={(input, option) =>
										option.children
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
								>
									{expeditorsOptions}
								</Select>
							</Form.Item>
                            { balanceComponent }
						</Col>
						<Col xs={3} sm={3} md={3} xl={3}></Col>
						<Col xs={6} sm={6} md={6} xl={6}></Col>
					</Row>

					<Row>
						<Col xs={6} sm={6} md={6} xl={6}>
							<Form.Item
								label="Şərh"
								name="description"
								style={{ margin: "0", width: "100%" }}
							>
								<TextArea
									showCount
									maxLength={100}
									style={{ width: "100%" }}
								/>
							</Form.Item>
						</Col>
						<Col xs={3} sm={3} md={3} xl={3}></Col>
						<Col xs={6} sm={6} md={6} xl={6}>
							<Form.Item
								label="Keçirilib"
								className="docComponentStatus"
								onChange={(e) => setStatus(e.target.checked)}
								name="status"
								valuePropName="checked"
								style={{ width: "100%" }}
							>
								<Checkbox name="status"></Checkbox>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>

			<CustomerDrawer />
		</div>
	);
}

export default NewMoneytransfersIn;
