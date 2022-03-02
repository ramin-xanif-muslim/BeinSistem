import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import { Table } from "antd";
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
import {
	SettingOutlined,
	DownOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	DownloadOutlined,
} from "@ant-design/icons";

import { isObject } from "../config/function/findadditionals";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { ConvertFixedTable } from "../config/function/findadditionals";
import MyFastSearch from "../components/MyFastSearch";
import sendRequest from "../config/sentRequest";
import { downloadFile } from "../config/function";
import FilterButton from "../components/FilterButton";
import { useFilterContext } from "../contexts/FilterContext";

const { Text } = Typography;
export default function StockBalance() {
	const {
		isOpenStockBalanceFilter,
		setIsOpenStockBalanceFilter,
		advacedStockBalance,
		setAdvaceStockBalance,
		formStockBalance,
		setFormStockBalance,
	} = useFilterContext();
	const [count, setCount] = useState(1);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(0);
	const [defaultdr, setDefaultDr] = useState("ascend");
	const [filterChanged, setFilterChanged] = useState(false);
	const [initialSort, setInitialSort] = useState("Quantity");
	const [fieldSort, setFieldSort] = useState("Quantity");
	const [allsum, setallsum] = useState(0);
	const [allquantity, setallquantity] = useState(0);
	const [allcost, setallcost] = useState(0);
	const [editId, setEditId] = useState("");
	const [page, setPage] = useState(0);
	const [filtered, setFiltered] = useState(false);
	const [columnChange, setColumnChange] = useState(false);
	const [initial, setInitial] = useState(null);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const [initialfilter, setInitialFilter] = useState(null);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
		useState(false);
	const {
		stockbalanceSearchTerm,
		setStockbalanceSearchTerm,
		marks,
		isFilter,
		setIsFilter,
		advancedPage,
		setAdvancedPage,
		doSearch,
		search,
	} = useTableCustom();

	const searchFunc = async (value) => {
		setIsLoadingSearch(true);
		setStockbalanceSearchTerm(value);
		let obj = {
			quick: value,
			lm: 100,
		};
		let res = await sendRequest("stockbalance/get.php", obj);
		setDocumentList(res.List);
		setallsum(res.SaleSum);
		setallcost(res.CostSum);
		setallquantity(res.QuantitySum);
		setCount(res.Count);
		setPageCount(res.Count);
		setLimitCount(res.Limit);
		setIsLoadingSearch(false);
	};

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		[
			"stockbalance",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advacedStockBalance,
		],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"stockbalance",
						advancedPage,
						advacedStockBalance,
						direction,
						fieldSort,
						null,
						3,
						0
				  )
				: doSearch
				? fecthFastPage("stockbalance", page, search)
				: !isFilter && !doSearch
				? fetchPage(
						"stockbalance",
						page,
						direction,
						fieldSort,
						advacedStockBalance.gp,
						3,
						0
				  )
				: null;
		}
	);
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
				title: "Məhsulun adı",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "ProductName"
					  ).show
					: true,
				defaultSortOrder:
					initialSort === "ProductName" ? defaultdr : null,
				sorter: (a, b) => null,
				className:
					initialSort === "ProductName"
						? "linkedColumns activesort"
						: "linkedColumns",
			},
			{
				dataIndex: "BarCode",
				title: "Barkodu",
				defaultSortOrder: initialSort === "BarCode" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "BarCode"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "BarCode" ? "activesort" : "",
			},
			// {
			//     dataIndex: "StockName",
			//     title: "Yerləşdiyi Anbar",
			//     sort: true,
			//     defaultSortOrder: initialSort === "StockName" ? defaultdr : null,
			//     show: initial
			//         ? Object.values(initial).find(
			//               (i) => i.dataIndex === "StockName"
			//           ).show
			//         : true,
			//     sorter: (a, b) => null,
			//     className: initialSort === "StockName" ? "activesort" : "",
			// },
			{
				dataIndex: "ArtCode",
				title: "Artkodu",
				sort: true,
				defaultSortOrder: initialSort === "ArtCode" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "ArtCode"
					  ).show
					: false,
				sorter: (a, b) => null,
				className: initialSort === "ArtCode" ? "activesort" : "",
			},

			{
				dataIndex: "Quantity",
				title: "Miqdar",
				defaultSortOrder: initialSort === "Quantity" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Quantity"
					  ).show
					: true,
				className: initialSort === "Quantity" ? "activesort" : "",
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "CostPrice",
				title: "Maya qiyməti",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "CostPrice"
					  ).show
					: true,
				defaultSortOrder:
					initialSort === "CostPrice" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "CostPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Amount",
				title: "Cəm Maya",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Amount"
					  ).show
					: false,
				defaultSortOrder: initialSort === "Amount" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Amount" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Price",
				title: "Satış qiyməti",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Price"
					  ).show
					: true,
				defaultSortOrder: initialSort === "Price" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Price" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "SalePrice",
				title: "Cəm Satış",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SalePrice"
					  ).show
					: false,
				defaultSortOrder:
					initialSort === "SalePrice" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "SalePrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "BuyPrice",
				title: "Alış qiyməti",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "BuyPrice"
					  ).show
					: false,
				defaultSortOrder: initialSort === "BuyPrice" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "BuyPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "Moment",
				title: "Tarixi",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Moment"
					  ).show
					: false,
				defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Moment" ? "activesort" : "",
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);

	const filters = useMemo(() => {
		return [
			{
				key: "1",
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
				key: "2",
				label: "Məhsul (Ad, artkod, barkod, şərh)",
				name: "productName",
				type: "text",
				dataIndex: "productName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "productName"
					  ).show
					: true,
			},
			{
				key: "3",
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
				key: "4",
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
				key: "5",
				label: "Satış qiyməti",
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
				key: "6",
				label: "Anbar qalığı",
				name: "docPriceBlnc",
				start: "blncb",
				end: "blnce",
				type: "range",
				dataIndex: "docPriceBlnc",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "docPriceBlnc"
					  ).show
					: true,
			},
			{
				key: "7",
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
				key: "8",
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
				key: "9",
				label: "Siyahı",
				name: "zeros",
				controller: "yesno",
				default: 3,
				type: "selectDefaultZeros",
				hidden: false,
				dataIndex: "zeros",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "zeros"
					  ).show
					: true,
			},
			{
				key: "10",
				label: "Tarixi",
				name: "createdDate",
				type: "datePicker",
				dataIndex: "createdDate",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "createdDate"
					  ).show
					: true,
			},
		];
	}, [filterChanged]);

	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);
	}, []);

	useEffect(() => {
		if (!isFetching) {
			setDocumentList(data.Body.List);
			setallsum(data.Body.SaleSum);
			setallcost(data.Body.CostSum);
			setallquantity(data.Body.QuantitySum);
			// setIsFilter(false);
			setCount(data.Body.Count);
			setPageCount(data.Body.Count);
			setLimitCount(data.Body.Limit);
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
	const onChangeMenuFilter = (e) => {
		var initialCols = initialfilter;
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
		console.log(initialCols);
		setFilterChanged(true);
	};
	const menu = (
		<Menu>
			<Menu.ItemGroup title="Sutunlar">
				{initial
					? Object.values(initial).map((d) => (
							<Menu.Item key={d.dataIndex}>
								<Checkbox
									id={d.dataIndex}
									onChange={(e) => onChangeMenu(e)}
									defaultChecked={
										Object.values(columns).find(
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
	const filtermenus = (
		<Menu>
			<Menu.ItemGroup title="Sutunlar">
				{initialfilter
					? Object.values(initialfilter).map((d) => (
							<Menu.Item key={d.dataIndex}>
								<Checkbox
									id={d.dataIndex}
									onChange={(e) => onChangeMenuFilter(e)}
									defaultChecked={
										Object.values(filters).find(
											(e) => e.dataIndex === d.dataIndex
										).show
									}
								>
									{d.label}
								</Checkbox>
							</Menu.Item>
					  ))
					: null}
			</Menu.ItemGroup>
		</Menu>
	);
	const tableSettings = (
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
	);

	const filterSetting = (
		<Dropdown
			trigger={["click"]}
			overlay={filtermenus}
			onVisibleChange={handleVisibleChangeFilter}
			visible={visibleMenuSettingsFilter}
		>
			<button className="new-button">
				<SettingOutlined />
			</button>
		</Dropdown>
	);

	const printMenu = (
		<Menu>
			<Menu.Item
				className="icon-excel"
				key="1"
				icon={<FileExcelOutlined />}
				onClick={() => downloadFile(advacedStockBalance, "xlsx", "stockbalance")}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				className="icon-pdf"
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() => downloadFile(advacedStockBalance, "pdf", "stockbalance")}
			>
				PDF
			</Menu.Item>
		</Menu>
	);

	if (!isLoading && !isObject(data.Body))
		return (
			<>
				Xəta:
				<span style={{ color: "red" }}>{data}</span>
			</>
		);

	if (error) return "An error has occurred: " + error.message;
	// if (!data.Body) return "An error has occurred: " + data.Body;

	function numberWithSpaces(x) {
		var parts = x.toString().split(".");
		// parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		// return parts.join(".");
		return parts;
	}

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Anbar qalığı</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								from="stockbalance"
								display={isOpenStockBalanceFilter}
								setdisplay={setIsOpenStockBalanceFilter}
							/>
							<MyFastSearch
								searchFunc={searchFunc}
								setSearchTerm={setStockbalanceSearchTerm}
								searchTerm={stockbalanceSearchTerm}
								className="search_header"
							/>
						</div>

						<div style={{ display: "flex" }}>
							<Dropdown overlay={printMenu} trigger={"onclick"}>
								<button className="new-button">
									<DownloadOutlined />
									<span style={{ marginLeft: "5px" }}>
										Yüklə
									</span>
								</button>
							</Dropdown>

							{tableSettings}
						</div>
					</div>
				</Col>
			</Row>
			{isLoadingSearch && <Spin />}
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
						from="stockbalance"
						settings={filterSetting}
						cols={filters}
						display={isOpenStockBalanceFilter}
						advanced={advacedStockBalance}
						setAdvance={setAdvaceStockBalance}
						initialFilterForm={formStockBalance}
						setInitialFilterForm={setFormStockBalance}
					/>
				</Col>
			</Row>

			<Table
				className="main-table"
				loading={isLoading}
				rowKey="Name"
				columns={columns.filter((c) => c.show == true)}
				onChange={onChange}
				dataSource={documentList}
				rowClassName={(record, index) =>
					record.Status === 0 ? "unchecked" : ""
				}
				summary={() => (
					<Table.Summary.Row>
						{columns
							.filter((c) => c.show === true)
							.map((c) => (
								<Table.Summary.Cell className="table-summary">
									<Text type="">
										{c.dataIndex === "ProductName"
											? "Cəm"
											: c.dataIndex === "Price"
											? ConvertFixedTable(allsum) + " ₼"
											: c.dataIndex === "Quantity"
											? ConvertFixedTable(allquantity) +
											  "əd"
											: c.dataIndex === "CostPrice"
											? ConvertFixedTable(allcost) + " ₼"
											: null}
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
