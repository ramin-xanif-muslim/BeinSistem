import React, { useState, useEffect } from "react";
import locale from "antd/es/date-picker/locale/az_AZ";
import { Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { API_BASE, fetchRefList } from "../api";
import { Form, Row, Col, Input, Select, DatePicker } from "antd";
import { useTableCustom } from "../contexts/TableContext";
import { useSelectModal } from "../hooks";
import { convertCamelCaseTextToText } from "../config/function/convert";
import '../Page.css'


const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

moment.locale("az");
function FilterComponent({
	from,
	settings,
	cols,
	display,
	advanced,
	setAdvance,
	initialFilterForm,
	setInitialFilterForm,
}) {
	const [selectDate, setSelectDate] = useState();
	const [loading, setLoading] = useState(false);
	const [rangeFilter, setRangeFilter] = useState({});
	const [dropdown, setDropdown] = useState([]);
	const [changed, setChanged] = useState(false);
	const [initial, setinitial] = useState({});
	const [doSearchId, setdoSearchId] = useState();
	const [doSearchFast, setdoSearchFast] = useState("");
	const {
		setIsFilter,
		setAdvancedPage,
		selectedDateId,
        setSelectedDateId,
		setIsEnterFilterValue,
	} = useTableCustom();
	const [form] = Form.useForm();

	const getData = (id, ref) => async (e, key) => {
		setDropdown([]);

		setLoading(true);
		if (id === "selectMod") {
			const res = await fetchRefList(ref);
			setDropdown(res);
			setLoading(false);
		} else {
			const res = await getDataFilter(id);
			setDropdown(res.Body.List);
			setLoading(false);
		}
	};

	const rangeConfig = {
		rules: [
			{
				type: "array",
				message: "Please select time!",
			},
		],
	};
	const getDataFilter = async (id, fast) => {
		var dataFilter = {
			token: localStorage.getItem("access-token"),
		};
		if (fast) {
			dataFilter.fast = fast;
		}
		const { data } = await axios.post(
			`${API_BASE}/controllers/${id}/get.php`,
			dataFilter
		);

		return data;
	};
	const getDataFastFilter = async (id, fast) => {
		setLoading(true);
		setDropdown([]);
		var dataFilter = {
			lm: 100,
			token: localStorage.getItem("access-token"),
			fast: fast,
		};
		const { data } = await axios.post(
			`${API_BASE}/controllers/${id}/getfast.php`,
			dataFilter
		);
		setDropdown(data.Body.List);
		setLoading(false);

		return data;
	};
	const doSearch = async (val, key) => {
		if (key === "products" || key === "customers") {
			setdoSearchId(key);
			setdoSearchFast(val);
		}
	};
	useEffect(() => {
		if (doSearchFast) {
			const timer = setTimeout(() => {
				getDataFastFilter(doSearchId, doSearchFast);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [doSearchFast]);

	const allClear = () => {
		// setChanged(true);
        setSelectedDateId({...selectedDateId, [from]: null});
		form.resetFields();
        setSelectDate([])
		setIsFilter(true);
		setAdvancedPage(0);
		setAdvance({});
		setInitialFilterForm({});
		setIsEnterFilterValue(false);
		form.setFieldsValue({});
	};
	function handleClear(id) {
		delete initialFilterForm[`${id}`];
		delete initialFilterForm[`${id}_id`];

		setInitialFilterForm(initialFilterForm);
		setChanged(true);
	}
	function handleChange(value, option) {
		if (option) {
			Object.assign(initialFilterForm, {
				[option.nm]: option.children ? option.children : null,
				[`${option.nm}_id`]: option.key,
			});
			setInitialFilterForm(initialFilterForm);
		}
	}
	const documentNames = [
		{ ad: "Daxilolma", name: "enters" },
		{ ad: "Silinmə", name: "losses" },
		{ ad: "Yerdəyişmə", name: "moves" },
		{ ad: "Alış", name: "supplies" },
		{ ad: "Alıcıların qaytarmaları", name: "supplyreturns" },
		{ ad: "Topdan satışlar", name: "demands" },
		{ ad: "Satışların geriqaytarmaları", name: "demandreturns" },
		{ ad: "Pərakəndə satışlar", name: "sales" },
		{ ad: "Qaytarmalar", name: "returns" },
	];

	const onChange = (e) => {
		var n = e.target.name;
		var v = e.target.value;
		Object.assign(rangeFilter, { [n]: v });
		setRangeFilter(rangeFilter);
		Object.assign(initialFilterForm, { [n]: v });
		setInitialFilterForm(initialFilterForm);
	};
	const onChangeDatePicker = (date, dateString) => {
		setInitialFilterForm({ ...initialFilterForm, moment: dateString });
	};
	const onOpenChange = (open) => {
		//   setIsOpen(open);
	};
	useEffect(() => {
		if (selectedDateId[from] === 1) {
			setSelectDate([moment().startOf("day"), moment().endOf("day")]);
		}
		if (selectedDateId[from] === 2) {
			setSelectDate([
				moment().subtract(1, "day").startOf("day"),
				moment().subtract(1, "day").endOf("day"),
			]);
		}
		if (selectedDateId[from] === 3) {
			setSelectDate([moment().startOf("month"), moment().endOf("month")]);
		}
		if (selectedDateId[from] === 4) {
			setSelectDate([
				moment().subtract(1, "month").startOf("month"),
				moment().subtract(1, "month").endOf("month"),
			]);
		}
		if (!selectedDateId[from]) {
			setSelectDate([]);
		}
	}, [selectedDateId]);

	const {
		selectModal,
		selectedItem,
		nameInput,
        onClickSelectModal,
	} = useSelectModal();
    
	useEffect(() => {
		if (selectedItem) {
            let convertedNameInput = convertCamelCaseTextToText(nameInput) 
			Object.assign(initialFilterForm, {
				[nameInput]: selectedItem.Name,
				[convertedNameInput.split(' ')[0].toLowerCase() + 'Id']: selectedItem.Id,
			});
			setInitialFilterForm(initialFilterForm);
			form.setFieldsValue(initialFilterForm);
		}
	}, [selectedItem]);

	const getFields = () => {
		const children = [];

		cols = cols.filter((c) => c.show == true);

		for (let i = 0; i < cols.length; i++) {
			children.push(
				<Col
					xs={8}
					sm={8}
					md={8}
					xl={6}
					key={i}
					className={
						initialFilterForm[cols[i].name]
							? "active-search-item"
							: null
					}
				>
					<Form.Item
						className="filter-input"
						name={cols[i].name}
						labelCol={{ span: 24 }}
						wrapperCol={{ span: 24 }}
						label={cols[i].label}
					>
						{cols[i].type === "text" ? (
							<Input
								className="detail-input"
								onChange={onChange}
								name={cols[i].name}
								placeholder={cols[i].label}
							/>
						) : cols[i].type === "selectModal" ? (
							<Input
								autoComplete="off"
								className="detail-input"
								onClick={() => onClickSelectModal(cols[i])}
								readOnly
								name={cols[i].name}
								placeholder={cols[i].label}
							/>
						) : cols[i].type === "select" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								id={cols[i].controller}
								onSearch={(e) =>
									doSearch(e, cols[i].controller)
								}
								onFocus={getData(cols[i].controller)}
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								notFoundContent={<Spin size="small" />}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								{Object.values(dropdown).map((r) => (
									<Option
										key={r.Id}
										nm={cols[i].name}
										// value={cols[i].name === "productName" ? r.name : r.id}
										value={r.Id}
									>
										{r.Name}
									</Option>
								))}
							</Select>
						) : cols[i].type === "selectMod" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								id={cols[i].controller}
								onFocus={getData(
									cols[i].controller,
									cols[i].key
								)}
								onChange={handleChange}
								onClear={() =>
									handleClear("colt--" + cols[i].dataIndex)
								}
								notFoundContent={<Spin size="small" />}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								{Object.values(dropdown).map((r) => (
									<Option
										key={r.Id}
										nm={cols[i].name}
										value={r.Id}
									>
										{r.Name}
									</Option>
								))}
							</Select>
						) : cols[i].type === "selectPayType" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={"p"} value={"p"}>
									Nəğd
								</Option>
								<Option nm={cols[i].name} key={"i"} value={"i"}>
									Köçürmə
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Hamısı
								</Option>
							</Select>
						) : cols[i].type === "selectPayDir" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={"i"} value={"i"}>
									Mədaxil
								</Option>
								<Option nm={cols[i].name} key={"o"} value={"o"}>
									Məxaric
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Hamısı
								</Option>
							</Select>
						) : cols[i].type === "selectSales" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option
									nm={cols[i].name}
									key={"retail"}
									value={"retail"}
								>
									Pərakəndə
								</Option>
								<Option
									nm={cols[i].name}
									key={"wholesale"}
									value={"wholesale"}
								>
									Topdan satış
								</Option>
								<Option
									nm={cols[i].name}
									key={"all"}
									value={"all"}
								>
									Hamısı
								</Option>
							</Select>
						) : cols[i].type === "selectDefaultYesNo" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={1} value={1}>
									Bəli
								</Option>
								<Option nm={cols[i].name} key={0} value={0}>
									Xeyr
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Hamısı
								</Option>
							</Select>
						) : cols[i].type === "selectDocumentType" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								{documentNames.map((d) => {
									return (
										<Option
											nm={cols[i].name}
											key={d.name}
											value={d.name}
										>
											{d.ad}
										</Option>
									);
								})}
							</Select>
						) : cols[i].type === "number" ? (
							<Input
								className="detail-input"
								type="number"
								allowClear
								placeholder={cols[i].label}
							/>
						) : cols[i].type === "range" ? (
							<Input.Group
								className="custom_range_filter_inputs"
								compact
							>
								<Input
									className="detail-input"
									child={cols[i].start}
									onChange={onChange}
									defaultValue={
										Object.keys(initialFilterForm).length >
										0
											? initialFilterForm[
													`${Object.keys(
														initialFilterForm
													).find(
														(c) =>
															c === cols[i].start
													)}`
											  ]
											: null
									}
									name={cols[i].start}
									style={{ width: 100, textAlign: "center" }}
									placeholder="Min"
								/>
								<Input
									className="site-input-split detail-input"
									style={{
										width: 30,
										borderLeft: 0,
										borderRight: 0,
										pointerEvents: "none",
									}}
									placeholder="~"
									disabled
								/>
								<Input
									className="site-input-right detail-input"
									child={cols[i].start}
									name={cols[i].end}
									onChange={onChange}
									defaultValue={
										Object.keys(initialFilterForm).length >
										0
											? initialFilterForm[
													`${Object.keys(
														initialFilterForm
													).find(
														(c) => c === cols[i].end
													)}`
											  ]
											: null
									}
									style={{
										width: 100,
										textAlign: "center",
									}}
									placeholder="Max"
								/>
							</Input.Group>
						) : cols[i].type === "date" ? (
							<div>
								<RangePicker
									className="detail-input"
									showTime={{ format: "HH:mm:ss" }}
									locale={locale}
									onChange={(date, dateString) =>
										setSelectDate(date)
									}
									{...rangeConfig}
									value={selectDate}
									onOpenChange={onOpenChange}
									format="DD-MM-YYYY HH:mm:ss"
									ranges={{
										"Bu gün": [
											moment().startOf("day"),
											moment().endOf("day"),
										],
										Dünən: [
											moment()
												.subtract(1, "day")
												.startOf("day"),
											moment()
												.subtract(1, "day")
												.endOf("day"),
										],
										"Bu ay": [
											moment().startOf("month"),
											moment().endOf("month"),
										],
										"Keçən ay": [
											moment()
												.subtract(1, "month")
												.startOf("month"),
											moment()
												.subtract(1, "month")
												.endOf("month"),
										],
									}}
								/>
							</div>
						) : cols[i].type === "datePicker" ? (
							<div>
								<DatePicker
									className="detail-input"
									format="DD-MM-YYYY HH:mm:ss"
									locale={locale}
									{...rangeConfig}
									onChange={onChangeDatePicker}
								/>
							</div>
						) : cols[i].type === "dateOfChange" ? (
							<div>
								<RangePicker
									className="detail-input"
									showTime={{ format: "HH:mm:ss" }}
									locale={locale}
									{...rangeConfig}
									format="DD-MM-YYYY HH:mm:ss"
									ranges={{
										"Bu gün": [
											moment().startOf("day"),
											moment().endOf("day"),
										],
										Dünən: [
											moment()
												.subtract(1, "day")
												.startOf("day"),
											moment()
												.subtract(1, "day")
												.endOf("day"),
										],
										"Bu ay": [
											moment().startOf("month"),
											moment().endOf("month"),
										],
										"Keçən ay": [
											moment()
												.subtract(1, "month")
												.startOf("month"),
											moment()
												.subtract(1, "month")
												.endOf("month"),
										],
									}}
								/>
							</div>
						) : cols[i].type === "selectDefaultZeros" ? (
							<Select
								className="deteail-select"
								showSearch
								// defaultValue={3}
								placeholder={cols[i].label}
								allowClear
								id={cols[i].controller}
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								filterOption={(input, option) =>
									option.label
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={4} value={4}>
									0 olanlar
								</Option>
								<Option nm={cols[i].name} key={3} value={3}>
									0 olmayanlar
								</Option>
								<Option nm={cols[i].name} key={2} value={2}>
									Mənfilər
								</Option>
								<Option nm={cols[i].name} key={1} value={1}>
									Müsbətlər
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Hamısı
								</Option>
							</Select>
						) : cols[i].type === "selectDefaultList" ? (
							<Select
								className="deteail-select"
								showSearch
								// defaultValue={3}
								placeholder={cols[i].label}
								allowClear
								id={cols[i].controller}
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								filterOption={(input, option) =>
									option.label
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={2} value={2}>
									Borc (verəcək)
								</Option>
								<Option nm={cols[i].name} key={1} value={1}>
									Borc (alacaq)
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Bütün borclar
								</Option>
							</Select>
						) : cols[i].type === "yesno" ? (
							<Select
								className="detail-select"
								showSearch
								placeholder={cols[i].label}
								allowClear
								onChange={handleChange}
								onClear={() => handleClear(cols[i].dataIndex)}
								id={cols[i].controller}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								notFoundContent={<Spin size="small" />}
							>
								<Option nm={cols[i].name} key={1} value={1}>
									Bəli
								</Option>
								<Option nm={cols[i].name} key={0} value={0}>
									Xeyr
								</Option>
								<Option nm={cols[i].name} key={""} value={""}>
									Hamısı
								</Option>
							</Select>
						) : null}
					</Form.Item>
				</Col>
			);
		}
		return children;
	};
	const onFinish = (values) => {
		setIsEnterFilterValue(true);
        let productName = ''
        let customerName = ''
        if(initialFilterForm.productName) {
            productName = initialFilterForm.productName
            initialFilterForm.productName = initialFilterForm.productId
        //    delete initialFilterForm.productId
        }
        if(initialFilterForm.customerName) {
            customerName = initialFilterForm.customerName
            initialFilterForm.customerName = initialFilterForm.customerId
            // delete initialFilterForm.customerId
        }
		// const rangeCreateValue = values["createdDate"];

		const rangeModifyValue = values["modifedDate"];
		const moment = values["moment"];
		const totalvalues = {
			...values,
			moment: moment ? moment.format("DD-MM-YYYY HH:mm:ss") : "",
			momb: selectDate[0]
				? selectDate[0].format("YYYY-MM-DD HH:mm:ss")
				: "",
			mome: selectDate[0]
				? selectDate[1].format("YYYY-MM-DD HH:mm:ss")
				: "",
			modb: rangeModifyValue
				? rangeModifyValue[0].format("YYYY-MM-DD HH:mm:ss")
				: "",
			mode: rangeModifyValue
				? rangeModifyValue[1].format("YYYY-MM-DD HH:mm:ss")
				: "",
		};

		Object.assign(totalvalues, initialFilterForm);
		Object.entries(totalvalues).forEach(([key, value]) => {
			if (key.includes("_id")) {
				var index = key.slice(0, key.indexOf("_id"));
				delete totalvalues[`${key}`];
				totalvalues[`${index}`] = value;
			}
			if (value === "") {
				delete totalvalues[`${key}`];
			}
		});
		setIsFilter(true);
		setAdvancedPage(0);
		setAdvance(totalvalues);
        if(productName) {
            initialFilterForm.productName = productName
        }
        if(customerName) {
            initialFilterForm.customerName = customerName
        }
	};
	useEffect(() => {
		if (from === "stockbalance") {
			Object.assign(initialFilterForm, {
				ar: 0,
				zeros: 3,
				// wg: "",
			});
			setInitialFilterForm(initialFilterForm);
			setinitial(initialFilterForm);
		} else if (from === "products" && initialFilterForm) {
			if (Object.keys(initialFilterForm).length === 0) {
				setInitialFilterForm(initialFilterForm);
			}

			setinitial({
				// wg: "",
				ar: 0,
			});

			form.setFieldsValue(initialFilterForm);
			// if (selectFilter.wg === "" || selectFilter.wg === undefined) {
			// 	form.setFieldsValue({
			// 		wg: "",
			// 	});
			// }
			if (
				initialFilterForm.ar === "" ||
				initialFilterForm.ar === undefined
			) {
				form.setFieldsValue({
					ar: 0,
				});
			}
		} else {
			if (
				initialFilterForm &&
				Object.keys(initialFilterForm).length === 0
			) {
				setInitialFilterForm(initialFilterForm)
				setinitial(initial)
			}
			form.setFieldsValue();
		}
		setChanged(false);
	}, [changed]);

	useEffect(() => {
		if (advanced) {
			if (advanced.momb && advanced.mome) {
				form.setFieldsValue({
					createdDate: [moment(advanced.momb), moment(advanced.mome)],
				});
			}
		}
	}, [advanced]);
	useEffect(() => {
        console.log(initialFilterForm)
	}, [initialFilterForm]);

	return (
		<div className="filter_wrapper" style={{ display: display }}>
			<Form
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={onFinish}
				initialValues={initialFilterForm}
			>
				<Row gutter={24} style={{ padding: "0.5rem 1rem 0" }}>
					{getFields()}
				</Row>
				<Row>
					<Col
						span={24}
						style={{
							textAlign: "left",
							display: "flex",
							margin: "22px 0",
							alignItems: "center",
						}}
					>
						<button
							className="new-button new-primary-button"
							htmlType="submit"
						>
							Axtar
						</button>
						<button
							className="new-button"
							style={{
								margin: "0 2rem",
							}}
							onClick={() => allClear()}
						>
							Təmizlə
						</button>
						{settings}
					</Col>
				</Row>
			</Form>
			{selectModal}
		</div>
	);
}

export default FilterComponent;
