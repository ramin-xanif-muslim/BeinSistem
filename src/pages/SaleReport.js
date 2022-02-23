import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import {
	Spin,
	Row,
	Col,
	Menu,
	Checkbox,
	Dropdown,
	Typography,
	Alert,
} from "antd";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import enters from "../ButtonsNames/Enters/buttonsNames";

import { SettingOutlined } from "@ant-design/icons";
import { useCustomForm } from "../contexts/FormContext";

import { ConvertFixedTable } from "../config/function/findadditionals";
import { isObject } from "../config/function/findadditionals";
import SearchByDate from "../components/SearchByDate";
import sendRequest from "../config/sentRequest";
import style from "./SaleReport.module.css";
import MyFastSearch from "../components/MyFastSearch";
import FilterButton from "../components/FilterButton";
import { useDownload } from "../hooks/useDownload";
import { useFilterContext } from "../contexts/FilterContext";

const { Text } = Typography;

export default function SaleReport() {
	const {
		isOpenSaleReportFilter,
		setIsOpenSaleReportFilter,
		advacedSaleReport,
		setAdvaceSaleReport,
		formSaleReport,
		setFormSaleReport,
	} = useFilterContext();
	const [count, setCount] = useState(1);
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(0);
	const [defaultdr, setDefaultDr] = useState("ascend");
	const [initialSort, setInitialSort] = useState("ProductName");
	const [fieldSort, setFieldSort] = useState("ProductName");
	const [otherColumns, setOtherColumns] = useState([]);

	const [allsum, setallsum] = useState(0);
	const [allprofit, setallprofit] = useState(0);
	const [allbonus, setallbonus] = useState(0);
	const [allbank, setallbank] = useState(0);
	const [editId, setEditId] = useState("");
	const [page, setPage] = useState(0);
	const [filtered, setFiltered] = useState(false);

	const [filterChanged, setFilterChanged] = useState(false);
	const [columnChange, setColumnChange] = useState(false);
	const [initial, setInitial] = useState(null);
	const [initialfilter, setInitialFilter] = useState(null);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
		useState(false);

	const [allAmount, setAllAmount] = useState(0);
	const [allProfit, setAllProfit] = useState(0);
	const [allCost, setAllCost] = useState(0);
	const [retAllAmount, setRetAllAmount] = useState(0);
	const [retAllCost, setRetAllCost] = useState(0);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const [marja, setMarja] = useState();

	const {
		salereportsSearchTerm,
		setSalereportsSearchTerm,
		marks,
		isFilter,
		advancedPage,
		setAdvancedPage,
		doSearch,
		search,
	} = useTableCustom();

	const [downloadButton] = useDownload(advacedSaleReport, "salereports");

	const searchFunc = async (value) => {
		setIsLoadingSearch(true);
		setSalereportsSearchTerm(value);
		let obj = {
			nm: value,
			lm: 100,
			sr: "ProductName",
		};
		let res = await sendRequest("salereports/get.php", obj);
		setDocumentList(res.List);
		setAllAmount(res.AllAmount);
		setAllCost(res.AllCost);
		setAllProfit(res.AllProfit);
		setRetAllAmount(res.RetAllAmount);
		setRetAllCost(res.RetAllCost);
		setCount(res.Count);
		setPageCount(res.Count);
		setIsLoadingSearch(false);
	};

	const { setSaveFromModal, setRedirectSaveClose } = useCustomForm();

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		["salereports", page, direction, fieldSort, doSearch, search, advacedSaleReport],
		() => {
			return advacedSaleReport[0]
				? fetchFilterPage(
						"salereports",
						advancedPage,
						advacedSaleReport,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("salereports", page, search)
				: !advacedSaleReport[0] && !doSearch
				? fetchPage("salereports", page, direction, fieldSort)
				: null;
		}
	);

	useEffect(() => {
		setRedirectSaveClose(false);
		setSaveFromModal(false);
	}, []);

	useEffect(() => {
		setColumnChange(false);
		if (filtered) setFiltered(false);
		if (filterChanged) setFilterChanged(false);
	}, [columnChange, filtered, filterChanged]);

	var markObject;
	marks
		? (markObject = marks)
		: (markObject = JSON.parse(localStorage.getItem("marks")));
	const columns = useMemo(() => {
		return [
			{
				title: "№",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 100 * advancedPage,
			},
			{
				dataIndex: "ProductName",
				title: "Məhsul adı",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "ProductName"
					  ).show
					: true,
				defaultSortOrder:
					initialSort === "ProductName" ? defaultdr : null,
				sorter: (a, b) => null,
				className: "linkedColumns",
			},
			{
				dataIndex: "Quantity",
				title: "Miqdar",
				defaultSortOrder: initialSort === "Quantity" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Quantity"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "Quantity"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "SumCost",
				title: "Mayası",
				defaultSortOrder: initialSort === "SumCost" ? defaultdr : null,
				className: "",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SumCost"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "SumCost"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "SumPrice",
				title: "Satış məbləği",
				defaultSortOrder: initialSort === "SumPrice" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SumPrice"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "SumPrice"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "RetQuantity",
				title: "Qaytarma miqdarı",
				defaultSortOrder:
					initialSort === "RetQuantity" ? defaultdr : null,
				className: style.cellLeftBorder,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "RetQuantity"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "RetQuantity"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "RetSumCost",
				title: "Qaytarma mayası",
				defaultSortOrder:
					initialSort === "RetSumCost" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "RetSumCost"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "RetSumCost"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "RetSumPrice",
				title: "Qaytarma məbləği",
				defaultSortOrder:
					initialSort === "RetSumPrice" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "RetSumPrice"
					  )
						? Object.values(initial).find(
								(i) => i.dataIndex === "RetSumPrice"
						  ).show
						: true
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "Profit",
				title: "Qazanc",
				className: style.cellLeftBorder,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Profit"
					  ).show
					: true,
				defaultSortOrder: initialSort === "Profit" ? defaultdr : null,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Percent",
				title: "Marja",
				className: style.colorDarkBlue,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Profit"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.SumPrice - row.RetSumPrice === 0) {
						return "0 %";
					} else {
						if (!row.SumPrice) {
							let num =
								(parseFloat(row.Profit) * 100) /
								parseFloat(row.RetSumPrice);
							return ConvertFixedTable(num) + " %";
						} else if (row.RetSumPrice) {
							let num =
								(parseFloat(row.Profit) * 100) /
								parseFloat(row.SumPrice - row.RetSumPrice);
							return ConvertFixedTable(num) + " %";
						} else {
							let num =
								(parseFloat(row.Profit) * 100) /
								parseFloat(row.SumPrice);
							return ConvertFixedTable(num) + " %";
						}
					}
				},
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);

	useEffect(() => {
		setInitial(columns);
		setColumnChange(true);
	}, []);
	const filters = useMemo(() => {
		return [
			{
				key: "1",
				label: "Məhsul adı",
				name: "productName",
				type: "select",
				controller: "products",
				dataIndex: "productName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "productName"
					  ).show
					: true,
			},
			{
				key: "2",
				label: "Barkodu",
				name: "bc",
				type: "text",
				dataIndex: "bc",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "bc"
					  ).show
					: true,
			},

			{
				key: "3",
				label: "Qarşı-tərəf",
				name: "customerName",
				type: "select",
				controller: "customers",
				dataIndex: "customerName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "customerName"
					  ).show
					: true,
			},
			{
				key: "4",
				label: "Satış Qiyməti",
				name: "salePrice",
				start: "prb",
				end: "pre",
				type: "range",
				dataIndex: "salePrice",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "salePrice"
					  ).show
					: true,
			},
			{
				key: "5",
				label: "Mənfəət",
				name: "profit",
				start: "prfb",
				end: "prfe",
				type: "range",
				dataIndex: "profit",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "profit"
					  ).show
					: true,
			},
			{
				key: "6",
				label: "Anbar",
				name: "stockName",
				type: "select",
				controller: "stocks",
				dataIndex: "stockName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "stockName"
					  ).show
					: true,
			},
			{
				key: "7",
				label: "Satış nöqtəsi",
				name: "slpnt",
				type: "select",
				controller: "salepoints",
				dataIndex: "slpnt",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "slpnt"
					  ).show
					: true,
			},
			{
				key: "8",
				label: "Şöbə",
				name: "departmentName",
				controller: "departments",
				type: "select",
				dataIndex: "departmentName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "departmentName"
					  ).show
					: true,
			},
			{
				key: "9",
				label: "Cavabdeh",
				name: "ownerName",
				controller: "owners",
				type: "select",
				dataIndex: "ownerName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "ownerName"
					  ).show
					: true,
			},
			{
				key: "10",
				label: "Arxivli",
				name: "ar",
				controller: "yesno",
				default: 0,
				type: "selectDefaultYesNo",
				dataIndex: "ar",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "ar"
					  ).show
					: true,
			},
			{
				key: "11",
				label: "Çəkili",
				name: "wg",
				controller: "yesno",
				default: "",
				type: "selectDefaultYesNo",
				dataIndex: "wg",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "wg"
					  ).show
					: true,
			},
			{
				key: "12",
				label: "Tarixi",
				name: "createdDate",
				type: "date",
				dataIndex: "createdDate",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "createdDate"
					  ).show
					: true,
			},
			{
				key: "13",
				label: "Maya dəyəri",
				name: "docPrice",
				start: "costprb",
				end: "costpre",
				type: "range",
				dataIndex: "docPrice",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "docPrice"
					  ).show
					: true,
			},
			{
				key: "14",
				label: "Məhsul Qrupu",
				name: "gp",
				controller: "productfolders",
				type: "select",
				dataIndex: "gp",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "gp"
					  ).show
					: true,
			},
			{
				key: "15",
				label: "Topdan satiş",
				name: "sales",
				type: "selectSales",
				controller: "products",
				dataIndex: "sales",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "sales"
					  ).show
					: true,
			},
		];
	});
	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);
		if (!localStorage.getItem("entercolumns")) {
			localStorage.setItem("entercolumns", JSON.stringify(columns));
		}
	}, []);

	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
				setDocumentList(data.Body.List);
				setAllAmount(data.Body.AllAmount);
				setAllCost(data.Body.AllCost);
				setAllProfit(data.Body.AllProfit);
				setRetAllAmount(data.Body.RetAllAmount);
				setRetAllCost(data.Body.RetAllCost);
				setCount(data.Body.Count);
				setMarja(data.Body.Margin);
				setPageCount(data.Body.Count);
				setLimitCount(data.Body.Limit);
			}
		} else {
			setDocumentList([]);
			setPageCount(null);
			setLimitCount(null);
		}
	}, [isFetching]);

	const editPage = (id) => {
		setRedirect(true);
		setEditId(id);
	};

	const handlePagination = (pg) => {
		setPage(pg - 1);
		setAdvancedPage(pg - 1);
	};
	function onChange(pagination, filters, sorter, extra) {
		setInitialSort(sorter.field);
		if (sorter.order === "ascend") {
			setDirection(0);
			setFieldSort(sorter.field);
			setDefaultDr("ascend");
		} else {
			setDirection(1);
			setFieldSort(sorter.field);
			setDefaultDr("descend");
		}
	}

	const handleVisibleChange = (flag) => {
		setVisibleMenuSettings(flag);
	};
	const handleVisibleChangeFilter = (flag) => {
		setVisibleMenuSettingsFilter(flag);
	};

	const onChangeMenu = (e) => {
		var initialCols = initial;
		var findelement;
		var findelementindex;
		var replacedElement;

		findelement = initialCols.find((c) => c.dataIndex === e.target.id);
		findelementindex = initialCols.findIndex(
			(c) => c.dataIndex === e.target.id
		);

		findelement.show = e.target.checked;
		replacedElement = findelement;
		initialCols.splice(findelementindex, 1, {
			...findelement,
			...replacedElement,
		});

		setFiltered(true);
	};

	useEffect(() => {
		if (filtered) setFiltered(false);
		setColumnChange(false);
	}, [filtered, columnChange]);
	const menu = (
		<Menu>
			<Menu.ItemGroup title="Sütunlar">
				{initial
					? Object.values(initial).map((d) => (
							<Menu.Item key={d.dataIndex}>
								<Checkbox
									id={d.dataIndex}
									onChange={(e) => onChangeMenu(e)}
									defaultChecked={
										Object.values(initial).find(
											(e) => e.dataIndex === d.dataIndex
										).show
									}
								>
									{d.title}
								</Checkbox>
							</Menu.Item>
					  ))
					: null}
			</Menu.ItemGroup>
		</Menu>
	);
	const getSearchObjByDate = async (ob) => {
		setFetchSearchByDate(true);
		let res = await sendRequest("salereports/get.php", ob);
		setDocumentList(res.List);
		setAllAmount(res.AllAmount);
		setAllCost(res.AllCost);
		setAllProfit(res.AllProfit);
		setRetAllAmount(res.RetAllAmount);
		setRetAllCost(res.RetAllCost);
		setMarja(res.Margin);
		setFetchSearchByDate(false);
	};

	if (!isLoading && !isObject(data.Body))
		return (
			<>
				Xəta:
				<span style={{ color: "red" }}>{data}</span>
			</>
		);

	if (error) return "An error has occurred: " + error.message;

	if (redirect) return <Redirect push to={`/editEnter/${editId}`} />;
	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Mənfəət</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={19}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								display={isOpenSaleReportFilter}
								setdisplay={setIsOpenSaleReportFilter}
							/>
							<MyFastSearch
								searchFunc={searchFunc}
								setSearchTerm={setSalereportsSearchTerm}
								searchTerm={salereportsSearchTerm}
								className="search_header"
							/>
							<SearchByDate
								getSearchObjByDate={getSearchObjByDate}
								defaultSort={"ProductName"}
								defaultCheckedDate={1}
							/>
							<div>{downloadButton}</div>
						</div>
					</div>
				</Col>
				<Col xs={24} md={24} xl={1}>
					<Dropdown
						trigger={["click"]}
						overlay={menu}
						onVisibleChange={handleVisibleChange}
						visible={visibleMenuSettings}
					>
						<button className="new-button">
							<SettingOutlined />
						</button>
					</Dropdown>
				</Col>
			</Row>
			{isLoadingSearch && <Spin />}
			<Row>
				<Col xs={24} sm={24} md={24} xl={24}>
					<FilterComponent
						cols={filters}
						display={isOpenSaleReportFilter}
                        advanced={advacedSaleReport}
                        setAdvance={setAdvaceSaleReport}
                        initialFilterForm={formSaleReport}
                        setInitialFilterForm={setFormSaleReport}
					/>
				</Col>
			</Row>
			{isFetchSearchByDate && <Spin />}
			<Table
				className="main-table"
				loading={isLoading || isFetchSearchByDate}
				id="report-table"
				rowKey="Name"
				columns={columns.filter((c) => c.show == true)}
				bordered
				onChange={onChange}
				dataSource={documentList}
				title={(pageData) => (
					<Row>
						<Col
							xs={11}
							sm={11}
							md={11}
							xl={11}
							className="table-headers"
						>
							<h3>Satışlar</h3>
						</Col>
						<Col
							xs={8}
							sm={8}
							md={8}
							xl={8}
							className="table-headers"
						>
							<h3>Qaytarmalar</h3>
						</Col>
						<Col
							xs={5}
							sm={5}
							md={5}
							xl={5}
							className="table-headers"
						>
							<h3>Mənfəət</h3>
						</Col>
					</Row>
				)}
				summary={() => (
					<Table.Summary.Row>
						{columns
							.filter((c) => c.show === true)
							.map((c) => (
								<Table.Summary.Cell className="table-summary">
									<Text type="">
										{c.dataIndex === "Profit" ? (
											ConvertFixedTable(allProfit) + " ₼"
										) : c.dataIndex === "SumPrice" ? (
											ConvertFixedTable(allAmount) + " ₼"
										) : c.dataIndex === "SumCost" ? (
											ConvertFixedTable(allCost) + " ₼"
										) : c.dataIndex === "RetSumCost" ? (
											ConvertFixedTable(retAllCost) + " ₼"
										) : c.dataIndex === "Percent" ? (
											<div
												style={{
													fontWeight: "600",
													color: "var(--dark-blue)",
												}}
											>
												{ConvertFixedTable(marja) +
													" %"}
											</div>
										) : c.dataIndex === "RetSumPrice" ? (
											ConvertFixedTable(retAllAmount) +
											" ₼"
										) : null}
									</Text>
								</Table.Summary.Cell>
							))}
					</Table.Summary.Row>
				)}
				locale={{ emptyText: isFetching ? <Spin /> : "Cədvəl boşdur" }}
				pagination={{
					current: advancedPage + 1,
					total: pageCount,
					onChange: handlePagination,
					defaultPageSize: 100,
					showSizeChanger: false,
				}}
				size="small"
			/>
		</div>
	);
}
