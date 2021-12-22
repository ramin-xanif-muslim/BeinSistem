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
import CustomerDrawer from "../../components/CustomerDrawer";
import { fetchCustomers, fetchPriceTypesRate } from "../../api";
import { Tab } from "semantic-ui-react";
import { ConvertFixedPosition } from "../../config/function/findadditionals";
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
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";
import { fetchPriceTypes } from "../../api";
import {
	FindAdditionals,
	FindCofficient,
	ConvertFixedTable,
} from "../../config/function/findadditionals";
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function NewDemand() {
	const [form] = Form.useForm();
	const myRefDescription = useRef(null);
	const myRefConsumption = useRef(null);
	const queryClient = useQueryClient();
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

		setChangedInnerTable,
		changedInnerTable,
		disable,
		setDisable,
		prices,
		setPrices,
		setPricesLocalStorage,
		setPriceChanged,
		pricechanged,
	} = useTableCustom();
	const {
		docstock,
		setDocStock,
		docmark,
		setDocMark,
		setLoadingForm,
		setStockDrawer,
		setCustomerDrawer,
		customerDrawer,
		stockDrawer,
		createdStock,
		createdCustomer,
		setCreatedStock,
		setCreatedCustomer,
		setProductModal,
		productModal,

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
	const handleDelete = (key) => {
		const dataSource = [...outerDataSource];
		setOuterDataSource(dataSource.filter((item) => item.key !== key));
		setPositions(dataSource.filter((item) => item.key !== key));
	};

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
	const onChangeConsumption = (e) => {
		setHasConsumption(true);
		setConsumption(e.target.value);
	};

	useEffect(() => {
		setDisable(true);
		getPrices();
		return () => {
			setDisable(true);
		};
	}, []);

	const getPrices = async () => {
		const priceResponse = await fetchPriceTypes();
		setPrices(priceResponse.Body.List);
		setPricesLocalStorage(priceResponse.Body.List);
	};
	const onSelect = (e, record) => {
		const dataSource = [...outerDataSource];
		const index = dataSource.findIndex((item) => record.key === item.key);
		const item = dataSource[index];
		if (e.value === "pack") {
			item.TotalPrice = item.PackPrice * item.Quantity;
			item.Price = parseFloat(
				item.TotalPrice / item.ChangePackQuantity
			).toFixed(4);
			item.ShowPacket = true;
			dataSource.splice(index, 1, { ...item, ...dataSource });
			var datas = [...dataSource];
			setOuterDataSource(datas);
		} else if (e.value === "pc") {
			item.Price = item.SellPrice;
			item.TotalPrice = item.Price * item.Quantity;
			item.ShowPacket = false;
			dataSource.splice(index, 1, { ...item, ...dataSource });
			var datas = [...dataSource];
			setOuterDataSource(datas);
		}
		setChangedInnerTable(true);
	};

	function handleClick(e) {
		e.preventDefault();
		e.stopPropagation();
	}
	const handleVisibleChange = (flag) => {
		setVisibleMenuSettings(flag);
	};

	var priceTypes;
	prices
		? (priceTypes = prices)
		: (priceTypes = JSON.parse(localStorage.getItem("prices")));
	const priceOptions = Object.values(priceTypes).map((c) => (
		<Option key={c.Id} value={c.Id}>
			{c.Name}
		</Option>
	));

	const handleClearPrices = () => {
		setLoadingForm(true);

		const prevdatasource = [...outerDataSource];
		Object.values(prevdatasource).map((item) => {
			item.Price = item.SellPrice;
			item.TotalPrice = item.Price * item.Quantity;
		});
		setLoadingForm(false);
	};

	const handlePriceSelect = async (e) => {
		setLoadingForm(true);

		if (e != "0000") {
			const datasource = [...outerDataSource];
			Object.values(datasource).map((item) => {
				item.Price = 0;
				item.TotalPrice = item.Price * item.Quantity;
			});
			var datas = [...datasource];
			setOuterDataSource(datas);
			var getAllPricesFilter = {};
			var productsId = [];
			getAllPricesFilter.pricetype = e;
			Object.values(datas).map((d) => productsId.push(d.ProductId));
			getAllPricesFilter.products = productsId;

			const res = await fetchPriceTypesRate(getAllPricesFilter);
			res.Body.List.map((i) => {
				Object.values(datas).map((item) => {
					if (item.ProductId === i.ProductId) {
						item.Price = i.Price;
						item.TotalPrice = i.Price * item.Quantity;
					}
				});
			});

			var newdatas = datas;
			setOuterDataSource(newdatas);
			setPriceChanged(true);
			setLoadingForm(false);
		} else {
			setPriceChanged(true);
			handleClearPrices();
		}
	};

	const pricetypeselect = (
		<Select
			showSearch
			style={{ width: "100%" }}
			showArrow={false}
			defaultValue="0000"
			filterOption={false}
			className="customSelect"
			onSelect={handlePriceSelect}
			allowClear={true}
		>
			<Option key={"0000"} value={"0000"}>
				Satış qiyməti
			</Option>
			{priceOptions}
		</Select>
	);
	const columns = useMemo(() => {
		return [
			{
				title: "№",
				dataIndex: "Order",
				className: "orderField",
				editable: false,
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Order"
					  ).isVisible
					: true,
				render: (text, record, index) => index + 1 + 100 * docPage,
			},
			{
				title: "Adı",
				dataIndex: "Name",
				className: "max_width_field_length",
				editable: false,
				isVisible: initial
					? Object.values(initial).find((i) => i.dataIndex === "Name")
							.isVisible
					: true,

				sorter: (a, b) => a.Name.localeCompare(b.Name),
			},
			{
				title: "Barkodu",
				dataIndex: "BarCode",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "BarCode"
					  ).isVisible
					: true,
				className: "max_width_field_length",
				editable: false,
				sortDirections: ["descend", "ascend"],
				sorter: (a, b) => a.BarCode - b.BarCode,
			},
			{
				title: "Miqdar",
				dataIndex: "Quantity",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Quantity"
					  ).isVisible
					: true,
				className: "max_width_field",
				editable: true,
				sortDirections: ["descend", "ascend"],
				render: (value, row, index) => {
					// do something like adding commas to the value or prefix
					{
						console.log(row);
					}
					return row.IsPack === 1 || row.IsPack === true ? (
						<div className="packOrQuantityWrapper">
							{row.ShowPacket
								? `${ConvertFixedPosition(
										row.Quantity
								  )}  (${ConvertFixedPosition(
										row.ChangePackQuantity
								  )})`
								: ConvertFixedPosition(row.Quantity)}
							<Select
								labelInValue
								style={{ width: 120 }}
								value={{
									value: row.ShowPacket ? "pack" : "pc",
								}}
								defaultValue={{ value: "pc" }}
								onSelect={(e) => onSelect(e, row)}
								onClick={handleClick}
							>
								<Option value="pc">Əd</Option>
								<Option value="pack">Paket</Option>
							</Select>
						</div>
					) : (
						<div className="packOrQuantityWrapper">
							{ConvertFixedPosition(row.Quantity)}{" "}
							<Select
								className="disabledPacket"
								labelInValue
								showArrow={false}
								defaultValue={{ value: "pc" }}
								disabled={true}
								style={{ width: 120 }}
							>
								<Option value="pc">Əd</Option>
							</Select>
						</div>
					);
				},
			},
			{
				title: pricetypeselect,
				dataIndex: "Price",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Price"
					  ).isVisible
					: true,

				className: "max_width_field",
				editable: true,
				sortDirections: ["descend", "ascend"],
				render: (value, row, index) => {
					// do something like adding commas to the value or prefix
					return value;
				},
			},
			{
				title: "Məbləğ",
				dataIndex: "TotalPrice",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "TotalPrice"
					  ).isVisible
					: true,
				className: "max_width_field",
				editable: true,
				sortDirections: ["descend", "ascend"],
				render: (value, row, index) => {
					// do something like adding commas to the value or prefix
					return value;
				},
			},
			{
				title: "Qalıq",
				dataIndex: "StockQuantity",
				className: "max_width_field",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "StockQuantity"
					  ).isVisible
					: true,
				editable: false,
				sortDirections: ["descend", "ascend"],
				render: (value, row, index) => {
					// do something like adding commas to the value or prefix
					return value;
				},
			},

			{
				title: "Sil",
				className: "orderField printField",
				dataIndex: "operation",
				isVisible: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "operation"
					  ).isVisible
					: true,
				editable: false,
				render: (_, record) => (
					<Typography.Link>
						<Popconfirm
							title="Silməyə əminsinizmi?"
							okText="Bəli"
							cancelText="Xeyr"
							onConfirm={() => handleDelete(record.key)}
						>
							<a className="deletePosition">Sil</a>
						</Popconfirm>
					</Typography.Link>
				),
			},
		];
	}, [consumption, outerDataSource, docSum, columnChange, prices]);

	useEffect(() => {
		setInitial(columns);
	}, []);

	useEffect(() => {
		setColumnChange(false);
	}, [columnChange]);
	const onChangeMenu = (e) => {
		var initialCols = initial;
		var findelement;
		var findelementindex;
		var replacedElement;
		findelement = initialCols.find((c) => c.dataIndex === e.target.id);
		console.log(findelement);
		findelementindex = initialCols.findIndex(
			(c) => c.dataIndex === e.target.id
		);
		findelement.isVisible = e.target.checked;
		replacedElement = findelement;
		initialCols.splice(findelementindex, 1, {
			...findelement,
			...replacedElement,
		});
		setColumnChange(true);
	};
	const menu = (
		<Menu>
			<Menu.ItemGroup title="Sutunlar">
				{Object.values(columns).map((d) => (
					<Menu.Item key={d.dataIndex}>
						<Checkbox
							id={d.dataIndex}
							disabled={
								columns.length === 3 && d.isVisible === true
									? true
									: false
							}
							isVisible={d.isVisible}
							onChange={(e) => onChangeMenu(e)}
							defaultChecked={d.isVisible}
						>
							{d.title}
						</Checkbox>
					</Menu.Item>
				))}
			</Menu.ItemGroup>
		</Menu>
	);
	useEffect(() => {
		if (createdStock) {
			getStocksAgain();
		}
	}, [createdStock]);

	useEffect(() => {
		if (createdCustomer) {
			getCustomersAgain();
		}
	}, [createdCustomer]);

	const getCustomersAgain = async () => {
		const customerResponse = await fetchCustomers();
		setCustomers(customerResponse.Body.List);
		form.setFieldsValue({
			customerid: createdCustomer.id,
		});
		setCreatedCustomer(null);
	};
	const getStocksAgain = async () => {
		const stockResponse = await fetchStocks();
		setStock(stockResponse.Body.List);
		setStockLocalStorage(stockResponse.Body.List);
		form.setFieldsValue({
			stockid: createdStock.id,
		});
		setCreatedStock(null);
	};
	useEffect(() => {
		form.setFieldsValue({
			moment: moment(),
		});
		setLoadingForm(false);
	}, []);

	const getDocName = async (docname) => {
		const attrResponse = await fetchDocName(docname, "demands");
		return attrResponse;
	};

	const handleChanged = () => {
		if (disable) {
			setDisable(false);
		}
	};
	const handleFinish = async (values) => {
		setDisable(true);

		values.positions = outerDataSource;
		values.mark = docmark;
		values.moment = values.moment._i;
		values.description =
			myRefDescription.current.resizableTextArea.props.value;
		values.status = status;

		message.loading({ content: "Loading...", key: "doc_update" });
		const nameres = await getDocName(values.name);
		values.name = nameres.Body.ResponseService;

		values.positions.forEach((p) => {
			if (p.ShowPacket) {
				p.Quantity = p.ChangePackQuantity;
			}
		});
		const res = await saveDoc(values, "demands");
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

	var objCustomers;
	customers
		? (objCustomers = customers)
		: (objCustomers = JSON.parse(localStorage.getItem("customers")));
	const customerOptions = Object.values(objCustomers).map((c) => (
		<Option key={c.Id} value={c.Id}>
			{c.Name}
		</Option>
	));

	var objOwner;
	owners
		? (objOwner = owners)
		: (objOwner = JSON.parse(localStorage.getItem("owners")));
	const ownersOptions = Object.values(objOwner).map((c) => (
		<Option key={c.Id} value={c.Id}>
			{c.Name}
		</Option>
	));

	var objDep;
	departments
		? (objDep = departments)
		: (objDep = JSON.parse(localStorage.getItem("departments")));

	const depOptions = Object.values(objDep).map((c) => (
		<Option key={c.Id}>{c.Name}</Option>
	));

	var objStock;
	stocks
		? (objStock = stocks)
		: (objStock = JSON.parse(localStorage.getItem("stocks")));

	const options = objStock.map((m) => (
		<Option key={m.Id} value={m.Id}>
			{m.Name}
		</Option>
	));

	//#endregion OwDep

	const onChange = (stock) => {
		setDocStock(stock);
	};

	const panes = [
		{
			menuItem: "Əsas",
			render: () => (
				<Tab.Pane attached={false}>
					<Row style={{ justifyContent: "space-between" }}>
						<Col
							xs={24}
							md={24}
							xl={9}
							style={{ maxWidth: "none", flex: "0.5", zIndex: 1 }}
						>
							<div className="addProductInputIcon">
								<AddProductInput className="newProInputWrapper" />
								<PlusOutlined
									onClick={() => setProductModal(true)}
									className="addNewProductIcon"
								/>
							</div>
						</Col>
						<Dropdown
							overlay={menu}
							onVisibleChange={handleVisibleChange}
							visible={visibleMenuSettings}
						>
							<Button className="flex_directon_col_center">
								{" "}
								<SettingOutlined />
							</Button>
						</Dropdown>
						<Col
							xs={24}
							md={24}
							xl={24}
							style={{ paddingTop: "1rem", zIndex: "0" }}
						>
							<DocTable
								headers={columns.filter(
									(c) => c.isVisible == true
								)}
								datas={positions}
							/>
						</Col>
					</Row>
				</Tab.Pane>
			),
		},
		{
			menuItem: "Əlaqəli sənədlər",
			render: () => <Tab.Pane attached={false}></Tab.Pane>,
		},
	];

	if (redirect) return <Redirect to={`/editDemand/${editId}`} />;
	return (
		<div className="doc_wrapper">
			<div className="doc_name_wrapper">
				<h2>Satış</h2>
			</div>
			<DocButtons editid={null} closed={"p=demand"} />
			<div className="formWrapper">
				<Form
					form={form}
					id="myForm"
					className="doc_forms"
					name="basic"
					initialValues={{
						status: true,
					}}
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					onFinish={handleFinish}
					onFieldsChange={handleChanged}
					layout="horizontal"
				>
					<Row>
						<Col xs={24} md={24} xl={6}>
							<Form.Item
								label="Satış №"
								name="name"
								className="doc_number_form_item"
								style={{ width: "100%" }}
							>
								<Input
									size="small"
									allowClear
									style={{ width: "100px" }}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={24} xl={3}></Col>
						<Col xs={24} md={24} xl={6}></Col>
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
									onClick={() => setStockDrawer(true)}
								/>
							</Button>
							<Form.Item
								label="Anbar"
								name="stockid"
							>
								<Select
									size="small"
									showSearch
									showArrow={false}
									filterOption={false}
									onChange={onChange}
									className="customSelect"
									allowClear={true}
								>
									{options}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={24} xl={3}></Col>
						<Col xs={24} md={24} xl={6}>
							<Button className="add-stock-btn">
								<PlusOutlined 
									onClick={() =>setCustomerDrawer(true)} 
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
												{ownersOptions}
											</Select>
										</Form.Item>
									</Col>
									<Col xs={24} md={24} xl={3}></Col>
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
												{depOptions}
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
								</Row>
								<Row>
									<Col xs={24} md={24} xl={6}>
										<Form.Item
											label="Status"
											name="mark"
											style={{ width: "100%" }}
										>
											<StatusSelect />
										</Form.Item>
									</Col>
									<Col xs={24} md={24} xl={3}></Col>
									<Col xs={24} md={24} xl={6}></Col>
									<Col xs={24} md={24} xl={3}></Col>
									<Col xs={24} md={24} xl={6}></Col>
								</Row>
							</Panel>
						</Collapse>
					</Row>
				</Form>

				<Row>
					<Col xs={24} md={24} xl={24}>
						<Tab
							className="custom_table_wrapper_tab"
							panes={panes}
						/>
					</Col>
					<Col xs={24} md={24} xl={24}>
						<Row className="bottom_tab">
							<Col xs={24} md={24} xl={9}>
								<div>
									<Form.Item name="description">
										<TextArea
											ref={myRefDescription}
											placeholder={"Şərh..."}
											rows={3}
										/>
									</Form.Item>
								</div>
							</Col>
							<Col xs={24} md={24} xl={12}>
								<div className="static_wrapper">
									<Statistic
										groupSeparator=" "
										className="doc_info_text total"
										title=""
										value={docSum}
										prefix={"Yekun məbləğ: "}
										suffix={"₼"}
									/>
									<Statistic
										groupSeparator=" "
										className="doc_info_text doc_info_secondary quantity"
										title=""
										value={docCount}
										prefix={"Miqdar: "}
										suffix={"əd"}
									/>

									<Divider
										style={{ backgroundColor: "grey" }}
									/>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>

			<StockDrawer />
			<ProductModal />
			<CustomerDrawer />
		</div>
	);
}

export default NewDemand;
