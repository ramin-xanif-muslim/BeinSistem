import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocId, sendRequest } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTableCustom } from "../../contexts/TableContext";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
	Form,
	Alert,
	Input,
	Checkbox,
	DatePicker,
	Select,
	Spin,
	Row,
	Col,
	Collapse,
} from "antd";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { updateDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import ok from "../../audio/ok.mp3";
import { ConvertFixedTable } from "../../config/function/findadditionals";

const audio = new Audio(ok);
const { Option } = Select;
const { TextArea } = Input;
function MoneytransferDetail() {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	const { outerDataSource, setDisable, disable } = useTableCustom();
	const {
		setLoadingForm,

		saveFromModal,
		setRedirectSaveClose,
	} = useCustomForm();
	const [positions, setPositions] = useState([]);
	const { doc_id } = useParams();
	const [status, setStatus] = useState(false);
	const [expeditors, setExpeditors] = useState([]);
	const [expeditor, setExpeditor] = useState();
	const [type, setType] = useState();
    const [balance, setBalance] = useState();
	const [isSpin, setIsSpin] = useState(false);

    const fetchBalance = async (id) => {
        if(id) {
            setIsSpin(true)
            let res = await sendRequest('expeditors/getbalance.php',{expeditorid: id});
            setBalance(ConvertFixedTable(res.Balance));
            setIsSpin(false)
        }
    };

	const { isLoading, error, data, isFetching } = useQuery(
		["moneytransfers", doc_id],
		() => fetchDocId(doc_id, "moneytransfers")
	);
	useEffect(() => {
		if (JSON.stringify(positions) !== JSON.stringify(outerDataSource)) {
			setDisable(false);
		}
	}, [outerDataSource]);
	useEffect(() => {
		if (!isFetching) {
			setExpeditor({
				Name: data.Body.List[0].ExpeditorName,
				Id: data.Body.List[0].ExpeditorId,
				StockId: data.Body.List[0].StockToId,
			});
            fetchBalance(data.Body.List[0].ExpeditorId)
			setType(data.Body.List[0].Type);
			setLoadingForm(false);
			setStatus(data.Body.List[0].Status);
		}
	}, [isFetching]);

	useEffect(() => {
		setDisable(true);

		return () => {
			setDisable(true);
		};
	}, []);

	const onClose = () => {
		message.destroy();
	};

	const updateMutation = useMutation(updateDoc, {
		refetchQueris: ["moneytransfers", doc_id],
	});

	useEffect(async () => {
		let res = await sendRequest("expeditors/get.php", {});
		setExpeditors(res.List);
	}, []);
	const expeditorsOptions = Object.values(expeditors).map((c) => {
		return (
			<Option key={c.Id} value={JSON.stringify(c)}>
				{c.Name}
			</Option>
		);
	});

	if (isLoading)
		return (
			<Spin className="fetchSpinner" tip="Yüklənir...">
				<Alert />
			</Spin>
		);

	if (error) return "An error has occurred: " + error.message;

	const handleChanged = () => {
		if (disable) {
			setDisable(false);
		}
	};
	const handleFinish = async (values) => {
		setDisable(true);

		if (expeditor) {
			values.expeditorname = expeditor.Name;
			values.expeditorid = expeditor.Id;
		}
		values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
		values.status = status;
		values.type = type;

		message.loading({ content: "Yüklənir...", key: "doc_update" });
		updateMutation.mutate(
			{ id: doc_id, controller: "moneytransfers", filter: values },
			{
				onSuccess: (res) => {
					if (res.Headers.ResponseStatus === "0") {
						message.success({
							content: "Dəyişikliklər yadda saxlanıldı",
							key: "doc_update",
							duration: 2,
						});
						queryClient.invalidateQueries("moneytransfers", doc_id);
						audio.play();
						if (saveFromModal) {
							setRedirectSaveClose(true);
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
				},
				onError: (e) => {
					console.log(e);
				},
			}
		);
	};
    function onSelectExpeditor(exp) {
        let id = JSON.parse(exp).Id
        fetchBalance(id)
        setExpeditor(JSON.parse(exp))
    }

	return (
		<div className="doc_wrapper">
			<div className="doc_name_wrapper">
				<h2>Pul transferi</h2>
			</div>
			<DocButtons
				additional={"none"}
				editid={doc_id}
				controller={"moneytransfers"}
				closed={"p=moneytransfer"}
				from={"moneytransfers"}
			/>
			<div className="formWrapper">
				<Form
					id="myForm"
					form={form}
					className="doc_forms"
					name="basic"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					initialValues={{
						amount: ConvertFixedTable(data.Body.List[0].Amount),
						moment: moment(data.Body.List[0].Moment),
						expeditorname: data.Body.List[0].ExpeditorName,
						description: data.Body.List[0].Description,
						status: data.Body.List[0].Status === 1 ? true : false,
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
								name="expeditorname"
								rules={[
									{
										required: true,
										message:
											"Zəhmət olmasa, qarşı tərəfi seçin",
									},
								]}
							>
								<Select
                                    onClear={() => setBalance(null)}
                                    onChange={onSelectExpeditor}
									showSearch
									showArrow={false}
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
                            {isSpin ? <Spin /> : 
							<p
								className="customer-debt"
								style={balance < 0 ? { color: "red" } : {}}
							>
								<span style={{ color: "red" }}>Balans:</span>
								{balance} ₼
							</p>
                            }
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
		</div>
	);
}

export default MoneytransferDetail;
