import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

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
import FastSearch from "../components/FastSearch";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import {
	ConvertFixedTable,
	isObject,
} from "../config/function/findadditionals";
import {
	SettingOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	DownloadOutlined,
} from "@ant-design/icons";
import { downloadFile } from "../config/function";
import { useFilterContext } from "../contexts/FilterContext";
import { useFilter } from "../hooks";

const { Text } = Typography;

const SettlementsDrawer = React.lazy(() =>
	import("../components/SettlementsDrawer")
);
export default function ExpeditorStockBalance() {
	const {
		isOpenExpeditorStockBalanceFilter,
		setIsOpenExpeditorStockBalanceFilter,
		advacedExpeditorStockBalance,
		setAdvaceExpeditorStockBalance,
		formExpeditorStockBalance,
		setFormExpeditorStockBalance,
	} = useFilterContext();
	const [initialfilter, setInitialFilter] = useState(null);
	const [filterChanged, setFilterChanged] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(0);
	const [defaultdr, setDefaultDr] = useState("ascend");
	const [initialSort, setInitialSort] = useState("CustomerName");
	const [fieldSort, setFieldSort] = useState("CustomerName");
	const [allinsum, setallinsum] = useState(0);
	const [alloutsum, setalloutsum] = useState(0);
	const [allcurrentsum, setallcurrentsum] = useState(0);
	const [editId, setEditId] = useState("");
	const [page, setPage] = useState(0);
	const [columnChange, setColumnChange] = useState(false);
	const [initial, setInitial] = useState(null);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const {
		marks,
		isFilter,
		advancedPage,
		setAdvancedPage,
		doSearch,
		search,
		setdisplay,
		display,
	} = useTableCustom();
	const {
		visibleDrawer,
		setVisibleDrawer,
		setcusid,
		cusid,
		setSaveFromModal,
		setRedirectSaveClose,
	} = useCustomForm();
	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		[
			"expeditorstockbalance",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advacedExpeditorStockBalance,
		],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"expeditorstockbalance",
						advancedPage,
						advacedExpeditorStockBalance,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("expeditorstockbalance", page, search)
				: !isFilter && !doSearch
				? fetchPage("expeditorstockbalance", page, direction, fieldSort)
				: null;
		}
	);

	useEffect(() => {
		setRedirectSaveClose(false);
		setSaveFromModal(false);
	}, []);

	useEffect(() => {
		setColumnChange(false);
	}, [columnChange]);

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
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Price",
				title: "Qiyməti",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Price"
					  ).show
					: true,
				defaultSortOrder: initialSort === "Price" ? defaultdr : null,
				sorter: (a, b) => null,
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
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
		];
	}, [defaultdr, initialSort, marks, advancedPage]);

	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
				setDocumentList(data.Body.List);
				setallinsum(data.Body.AllInSum);
				setalloutsum(data.Body.AllOutSum);
				setallcurrentsum(
					parseFloat(data.Body.AllInSum + data.Body.AllOutSum)
				);
				setPageCount(data.Body.Count);
				setLimitCount(data.Body.Limit);
			}
		} else {
			setDocumentList([]);
			setPageCount(null);
			setLimitCount(null);
		}
	}, [isFetching]);

	const handlePagination = (pg) => {
		setPage(pg - 1);
		setAdvancedPage(pg - 1);
	};
	function onChange(sorter, extra) {
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
	};
	useEffect(() => {
		setdisplay("block");
	}, []);

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
				type: "selectModal",
				controller: "products",
				name: "nm",
				dataIndex: "nm",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "nm"
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
				label: "Tarix",
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
	}, []);

	const { filterComponent, filterButton } = useFilter(
		isOpenExpeditorStockBalanceFilter,
		setIsOpenExpeditorStockBalanceFilter,
		advacedExpeditorStockBalance,
		setAdvaceExpeditorStockBalance,
		formExpeditorStockBalance,
		setFormExpeditorStockBalance,
		initialfilter,
        setInitialFilter,
        filterChanged,
		setFilterChanged,
		filters,
	);

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

	const printMenu = (
		<Menu>
			<Menu.Item
				className="icon-excel"
				key="1"
				icon={<FileExcelOutlined />}
				onClick={() => downloadFile(advacedExpeditorStockBalance, "xlsx", "expeditors")}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				className="icon-pdf"
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() => downloadFile(advacedExpeditorStockBalance, "pdf", "expeditors")}
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

	if (redirect) return <Redirect push to={`/editEnter/${editId}`} />;

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Anbar qalığı</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={19}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							{filterButton}
							<FastSearch className="search_header" />
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
			{filterComponent}
			<Table
				// id="settlement-table"
				className="main-table"
				loading={isLoading}
				rowKey="Name"
				columns={columns.filter((c) => c.show === true)}
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
										{c.dataIndex === "CustomerName" ? (
											<span>Cəm</span>
										) : c.dataIndex === "PayIn" ? (
											<span>
												{ConvertFixedTable(allinsum)}
												<sup>₼</sup>
											</span>
										) : c.dataIndex === "PayOut" ? (
											<span>
												{ConvertFixedTable(alloutsum)}
												<sup>₼</sup>
											</span>
										) : c.dataIndex === "Current" ? (
											<span>
												{ConvertFixedTable(
													allcurrentsum
												)}
												<sup>₼</sup>
											</span>
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
			{visibleDrawer ? <SettlementsDrawer /> : null}
		</div>
	);
}
