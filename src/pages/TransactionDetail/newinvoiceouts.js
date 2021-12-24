import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import ProductModal from "../../components/ProductModal";
import { Tab } from "semantic-ui-react";
import {
	FindAdditionals,
	FindCofficient,
	ConvertFixedTable,
} from "../../config/function/findadditionals";
import {
	DeleteOutlined,
	PlusOutlined,
	EditOutlined,
	SettingOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import {
	Form,
	Input,
	Button,
	InputNumber,
	TreeSelect,
	Checkbox,
	Dropdown,
	DatePicker,
	Switch,
	Select,
	Spin,
	Tag,
	Divider,
	Menu,
	Drawer,
	Typography,
	Statistic,
	Popconfirm,
	Row,
	Col,
	Collapse,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import {
	saveDoc,
	fetchSpendItems,
	getCustomerFastFilter,
	fetchCustomers,
} from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;

function NewInvoiceOuts() {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	const myRefDescription = useRef(null);
	const myRefConsumption = useRef(null);
	const {
		docPage,
		docCount,
		docSum,
		outerDataSource,
		setOuterDataSource,
		departments,
		owners,
		stocks,
		setStock,
		setStockLocalStorage,
		customers,
		setCustomers,
		spenditems,
		setSpendItems,
		setSpendsLocalStorage,
		setDisable,
		disable,
	} = useTableCustom();
	const {
		docstock,
		setDocStock,
		docmark,
		setDocMark,
		setLoadingForm,
		setStockDrawer,
		stockDrawer,
		createdStock,
		setCreatedStock,
		setProductModal,

		saveFromModal,
		setRedirectSaveClose,
	} = useCustomForm();
	const [positions, setPositions] = useState([]);
	const [redirect, setRedirect] = useState(false);
	const [editId, setEditId] = useState(null);
	const [docname, setDocName] = useState(null);
	const [newStocksLoad, setNewStocksLoad] = useState(null);
	const [hasConsumption, setHasConsumption] = useState(false);
	const [consumption, setConsumption] = useState(0);
	const [status, setStatus] = useState(true);
	const [initial, setInitial] = useState(null);
	const [tablecolumns, setTableColumns] = useState([]);
	const [columnChange, setColumnChange] = useState(false);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const [spends, setSpends] = useState(false);

	useEffect(() => {
		setDisable(true);
		setPositions([]);
		setOuterDataSource([]);

		return () => {
			setDisable(true);
			setPositions([]);
			setOuterDataSource([]);
		};
	}, []);

	useEffect(() => {
		if (JSON.stringify(positions) !== JSON.stringify(outerDataSource)) {
			setDisable(false);
		}
	}, [outerDataSource]);

	const onClose = () => {
		message.destroy();
	};

	useEffect(() => {
		form.setFieldsValue({
			moment: moment(),
		});
		setLoadingForm(false);
		getSpendItems();
	}, []);
	const getSpendItems = async () => {
		setSpends(false);
		const itemResponse = await fetchSpendItems();
		setSpendItems(itemResponse.Body.List);
		setSpendsLocalStorage(itemResponse.Body.List);
		setSpends(true);
	};
	const getCustomers = async () => {
		const customerResponse = await fetchCustomers();
		setCustomers(customerResponse.Body.List);
	};
	const doSearch = async (value) => {
		const customerResponse = await getCustomerFastFilter(value);
		setCustomers(customerResponse.Body.List);
	};
	const getDocName = async (docname) => {
		const attrResponse = await fetchDocName(docname, "invoiceouts");
		return attrResponse;
	};

	var objCustomers;
	customers
		? (objCustomers = customers)
		: (objCustomers = JSON.parse(localStorage.getItem("customers")));
	const customerOptions = Object.values(objCustomers).map((c) => (
		<Option key={c.Id} value={c.Id}>
			{c.Name}
		</Option>
	));

	const onChange = (value, option) => {
		if (value === "00000000-0000-0000-0000-000000000000") {
			form.setFieldsValue({
				spenditem: spenditems.find((s) => s.StaticName === "correct")
					.Id,
			});
		} else {
			form.setFieldsValue({
				spenditem: spenditems.find((s) => s.StaticName === "buyproduct")
					.Id,
			});
		}
	};
	const onChangeSpendItem = (value, option) => {
		console.log(value, option);
		if (option.staticname === "correct") {
			form.setFieldsValue({
				customerid: "00000000-0000-0000-0000-000000000000",
			});
		} else {
			if (
				form.getFieldsValue().customerid ===
				"00000000-0000-0000-0000-000000000000"
			) {
				form.setFieldsValue({
					customerid: "",
				});
			}
		}
	};

	const handleChanged = () => {
		if (disable) {
			setDisable(false);
		}
	};
	const handleFinish = async (values) => {
		setDisable(true);
		values.moment = values.moment._i;
		values.status = status;
		values.mark = docmark;

		message.loading({ content: "Loading...", key: "doc_update" });

		try {
			const nameres = await getDocName(values.name);
			values.name = nameres.Body.ResponseService;
		} catch (error) {
			message.error({
				content: (
					<span className="error_mess_wrap">
						Saxlanılmadı... {error.message}{" "}
						{<CloseCircleOutlined onClick={onClose} />}
					</span>
				),
				key: "doc_update",
				duration: 0,
			});
		}

		const res = await saveDoc(values, "invoiceouts");
		if (res.Headers.ResponseStatus === "0") {
			message.success({
				content: "Saxlanildi",
				key: "doc_update",
				duration: 2,
			});
			setEditId(res.Body.ResponseService);

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

	//#region OwDep

	//#endregion OwDep
	if (redirect) return <Redirect to={`/editInvoiceOut/${editId}`} />;

	if (!spends) return <div>Loading....</div>;
	if (spends)
		return (
			<div className="doc_wrapper">
				<div className="doc_name_wrapper">
					<h2>Məxaric (nağdsız)</h2>
				</div>
				<DocButtons
					additional={"none"}
					editid={null}
					closed={"p=transactions"}
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
							spenditem: spenditems.find(
								(s) => s.StaticName === "buyproduct"
							).Id,
						}}
						onFinish={handleFinish}
						onFieldsChange={handleChanged}
						layout="horizontal"
					>
						<Row>
							<Col xs={24} md={24} xl={6}>
								<Form.Item
									label="Məxaric №"
									name="name"
									className="doc_number_form_item"
									style={{ width: "100%" }}
								>
									<Input
										placeholder="0000"
										size="small"
										allowClear
										style={{ width: "100px" }}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6}>
								<Form.Item
									label="Məbləğ"
									name="amount"
									className="doc_number_form_item"
								>
									<Input
										size="small"
										type="number"
										step="any"
										placeholder="₼"
										allowClear
										min={0}
										style={{ width: "100px" }}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6}></Col>
						</Row>

						<Row>
							<Col xs={24} md={24} xl={6}>
								<Form.Item
									label="Tarix"
									name="moment"
									style={{ width: "100%" }}
								>
									<DatePicker
										style={{ width: "100%" }}
										size="small"
										showTime={{ format: "HH:mm:ss" }}
										format="YYYY-MM-DD HH:mm:ss"
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6} >
								<Button className="add-stock-btn">
									<PlusOutlined 
										// onClick={() =>setCustomerDrawer(true)} 
									/>
								</Button>
								<Form.Item
									label="Qarşı-tərəf"
									name="customerid"
								>
									<Select
										size="small"
										showSearch
										showArrow={false}
										filterOption={false}
										className="customSelect"
										allowClear={true}
									>
										{customerOptions}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6}></Col>
						</Row>

						<Row>
							<Col xs={24} md={24} xl={6}>
								<Form.Item
									label="Şərh"
									name="description"
									style={{ margin: "0", width: "100%"}}
								>
									<TextArea 
										size="small" 
										showCount
										maxLength={100} 
										style={{ width: "100%" }} 
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6}>
								<Button className="add-stock-btn">
									<PlusOutlined 
										// onClick={() =>setCustomerDrawer(true)} 
									/>
								</Button>
								<Form.Item
									label="Xərc maddəsi"
									name="spenditem"
								>
									<Select
										size="small"
										showSearch
										showArrow={false}
										className="customSelect"
										notFoundContent={
											<Spin size="small" />
										}
										onChange={
											onChangeSpendItem
										}
										allowClear={true}
										filterOption={(
											input,
											option
										) =>
											option.children
												.toLowerCase()
												.indexOf(
													input.toLowerCase()
												) >= 0
										}
									>
										{spends
											? Object.values(
													spenditems
											  )
													.filter(
														(
															item
														) =>

															item.StaticName ===
																"buyproduct" ||
															item.StaticName ===
																"correct"
													)
													.map(
														(c) => (
															<Option
																staticname={
																	c.StaticName
																}
																key={
																	c.Id
																}
																value={
																	c.Id
																}
															>
																{
																	c.Name
																}
															</Option>
														)
													)
											: null}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} xl={3}></Col>
							<Col xs={24} md={24} xl={6}></Col>
						</Row>

						<Row>
							<Collapse ghost style={{ width: "100%" }}>
								<Panel
									className="custom_panel_header"
									header="Təyinat"
									key="1"
								>
									<Row>
										<Col xs={24} md={24} xl={6}>
											<Form.Item
												label="Cavabdeh"
												name="ownerid"
												style={{ margin: "0" }}
												style={{ width: "100%" }}
											>
												<Select
													size="small"
													showSearch
													placeholder=""
													notFoundContent={
														<Spin size="small" />
													}
													filterOption={(input, option) =>
														option.children
															.toLowerCase()
															.indexOf(
																input.toLowerCase()
															) >= 0
													}
												>
													{/* {ownersOptions} */}
												</Select>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} xl={3}></Col>
										<Col xs={24} md={24} xl={6}>
											<Form.Item
												label="Keçirilib"
												className="docComponentStatus"
												name="status"
												valuePropName="checked"
												style={{ width: "100%" }}
											>
												<Checkbox
													size="small"
													name="status"
												></Checkbox>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} xl={3}></Col>
										<Col xs={24} md={24} xl={6}></Col>
									</Row>
									<Row>
										<Col xs={24} md={24} xl={6}>
											<Form.Item
												label="Şöbə"
												name="departmentid"
												style={{ margin: "0" }}
												style={{ width: "100%" }}
											>
												<Select
													size="small"
													showSearch
													placeholder=""
													notFoundContent={
														<Spin size="small" />
													}
													filterOption={(input, option) =>
														option.children
															.toLowerCase()
															.indexOf(
																input.toLowerCase()
															) >= 0
													}
												>
													{/* {depOptions} */}
												</Select>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} xl={3}></Col>
										<Col xs={24} md={24} xl={6}>
											<Form.Item
												label="Status"
												name="mark"
												style={{ width: "100%", margin: "0"}}
											>
												<StatusSelect />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} xl={3}></Col>
										<Col xs={24} md={24} xl={6}></Col>
									</Row>
								</Panel>
							</Collapse>
						</Row>
					</Form>
				</div>
			</div>
		);
}

export default NewInvoiceOuts;
