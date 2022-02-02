import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Alert } from "antd";
import "semantic-ui-css/semantic.min.css";
import { PrinterOutlined } from "@ant-design/icons";

import ProductGroup from "../components/ProductGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import { Button } from "semantic-ui-react";
import {
	SettingOutlined,
	DownloadOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
} from "@ant-design/icons";
import {
	ConvertFixedTable,
	isObject,
} from "../config/function/findadditionals";
import MyFastSearch from "../components/MyFastSearch";
import sendRequest from "../config/sentRequest";
import { downloadFile } from "../config/function";
import FilterButton from "../components/FilterButton";

export default function Product() {
	const [count, setCount] = useState(1);
	const [redirect, setRedirect] = useState(false);
	const [editId, setEditId] = useState("");
	const [page, setPage] = useState(0);
	const [productList, setProdutcList] = useState([]);
	const [initialfilter, setInitialFilter] = useState(null);
	const [filterChanged, setFilterChanged] = useState(false);
	const [filterChange, setFilterChange] = useState(false);
	const [filterColumns, setFilterColumns] = useState([]);

	const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
		useState(false);

	const [otherColumns, setOtherColumns] = useState([]);
	const [filtered, setFiltered] = useState(false);
	const [direction, setDirection] = useState(0);
	const [defaultdr, setDefaultDr] = useState("ascend");
	const [initialSort, setInitialSort] = useState("Name");
	const [fieldSort, setFieldSort] = useState("Name");
	const [columnChange, setColumnChange] = useState(false);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const [initial, setInitial] = useState(
		localStorage.getItem("procolumns")
			? JSON.parse(localStorage.getItem("procolumns"))
			: null
	);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const {
		productSearchTerm,
		setProductSearchTerm,
		setAttributes,
		setAttrLocalStorage,
		setPrices,
		setPricesLocalStorage,
		setRefList,
		search,
		doSearch,
		isFilter,
		advanced,
		advancedPage,
		setAdvancedPage,
		searchGr,
		attributes,
		setdisplay,
		display,
	} = useTableCustom();

	const searchFunc = async (value) => {
		setIsLoadingSearch(true);
		setProductSearchTerm(value);
		let obj = {
			ar: 0,
			dr: 1,
			fast: value,
			gp: "",
			pg: 0,
			lm: 100,
		};
		let res = await sendRequest("products/getfast.php", obj);
		setCount(res.Count);
		setProdutcList(res.List);
		setIsLoadingSearch(false);
	};

	const filters = useMemo(() => {
		return [
			{
				key: "1",
				label: "Adı",
				name: "productname",
				type: "text",
				dataIndex: "productname",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "productname"
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
				label: "Alş qiyməti",
				name: "buyPrice",
				start: "bprb",
				end: "bpre",
				type: "range",
				dataIndex: "buyPrice",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "buyPrice"
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
				key: "6",
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
		];
	}, [filterChanged]);

	useEffect(() => {
		if (!localStorage.getItem("tempdesign")) {
			console.log("App.js", localStorage.getItem("tempdesign"));
			localStorage.setItem("tempdesign", "4x2_1.css");
			localStorage.setItem(
				"temppath",
				JSON.stringify(["4x2", "4x2_1.css"])
			);
		}
	}, []);

	let newfilters = [];

	useEffect(() => {
		if (attributes) {
			Object.values(attributes).forEach((c) => {
				let otherColumn = {
					key: c.ReferenceTypeId,
					label: c.Title,
					name: c.ValueType === "string" ? "colt--" + c.Name : "",
					type: c.ReferenceTypeId ? "selectMod" : "text",
					controller: c.ReferenceTypeId ? "selectMod" : "textMod",
					dataIndex: c.Name,

					show: localStorage.getItem("procolumns")
						? Object.values(
								JSON.parse(localStorage.getItem("procolumns"))
						  ).find((i) => i.dataIndex === c.Name).show
						: true,
				};
				newfilters = [...newfilters, otherColumn];
			});
			setFilterColumns(newfilters);
			setFilterChange(true);
		}
	}, [attributes]);

	const handleVisibleChangeFilter = (flag) => {
		setVisibleMenuSettingsFilter(flag);
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
		setFilterChanged(true);
	};

	const filtersnew = useMemo(
		() => [...filters, ...filterColumns],
		[filterChange]
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
										Object.values(filtersnew).find(
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

	const columns = useMemo(() => {
		return [
			{
				dataIndex: "Order",
				title: "№",
				show: true,
				render: (text, record, index) => index + 1 + 100 * advancedPage,
			},
			{
				dataIndex: "Name",
				title: "Məhsulun adı",
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Name")
							.show
					: true,
				defaultSortOrder: initialSort === "Name" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Name" ? "activesort" : "",
			},
			{
				dataIndex: "BarCode",
				title: "Barkod",
				defaultSortOrder: initialSort === "BarCode" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "BarCode"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "BarCode" ? "activesort" : "",
			},
			{
				dataIndex: "ArtCode",
				title: "Artkod",
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
				dataIndex: "GroupName",
				title: "Qrup",
				defaultSortOrder:
					initialSort === "GroupName" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "GroupName"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "GroupName" ? "activesort" : "",
			},
			{
				dataIndex: "BuyPrice",
				title: "Alış qiyməti",
				defaultSortOrder: initialSort === "BuyPrice" ? defaultdr : null,

				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "BuyPrice"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "BuyPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Price",
				title: "Satış qiyməti",
				defaultSortOrder: initialSort === "Price" ? defaultdr : null,

				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Price"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "Price" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "MinPrice",
				title: "Minimum qiymət",
				defaultSortOrder: initialSort === "MinPrice" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "MinPrice"
					  ).show
					: false,
				sorter: (a, b) => null,
				className: initialSort === "MinPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "Description",
				defaultSortOrder:
					initialSort === "Description" ? defaultdr : null,
				title: "Şərh",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Description"
					  ).show
					: false,
				sorter: (a, b) => null,
				className: initialSort === "Description" ? "activesort" : "",
			},
			{
				dataIndex: "StockBalance",
				title: "Anbar qalığı",
				default: 0,
				defaultSortOrder:
					initialSort === "StockBalance" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "StockBalance"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "StockBalance" ? "activesort" : "",
			},

			{
				dataIndex: "PackPrice",
				title: "Paket qiyməti",
				defaultSortOrder:
					initialSort === "PackPrice" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PackPrice"
					  ).show
					: false,
				sorter: (a, b) => null,
				className: initialSort === "PackPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "PackQuantity",
				title: "Paket miqdarı",
				defaultSortOrder:
					initialSort === "PackQuantity" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PackQuantity"
					  ).show
					: false,
				sorter: (a, b) => null,
				className: initialSort === "PackQuantity" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "PrintBarcode",
				title: "Print",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PrintBarcode"
					  ).show
					: true,
				className: initialSort === "PrintBarcode" ? "activesort" : "",
				render: (value, row, index) => {
					return (
						<span
							style={{ color: "#1164B1" }}
							onClick={getProductPrint(
								row.ProductId,
								row.BarCode,
								row.IsPack === 1 ? row.PackPrice : row.Price,
								row.Name
							)}
						>
							<PrinterOutlined />
						</span>
					);
				},
			},
		];
	}, [direction, fieldSort, filtered, advancedPage]);

	const getProductPrint = (id, br, pr, nm) => (e) => {
		e.preventDefault();
		e.stopPropagation();
		let price = Number(pr).toFixed(2);
		if (localStorage.getItem("tempdesign") === "4x2_3.css") {
			window.open(`/bc.php?bc=${br}&pr=${price}&nm=${nm}&r=4`);
		} else {
			window.open(`/bc.php?bc=${br}&pr=${price}&nm=${nm}`);
		}
	};
	let newcols = [];
	useEffect(() => {
		setOtherColumns([]);

		if (attributes) {
			Object.values(attributes).forEach((c) => {
				let otherColumn = {
					dataIndex: c.Name,
					title: c.Title,
					show: initial
						? Object.values(initial).find(
								(i) => i.dataIndex === c.Name
						  )
							? Object.values(initial).find(
									(i) => i.dataIndex === c.Name
							  ).show
							: false
						: false,
					defaultSortOrder: initialSort === c.Name ? defaultdr : null,
					sorter: (a, b) => null,
					className: initialSort === c.Name ? "activesort" : "",
				};
				newcols = [...newcols, otherColumn];
			});
			setOtherColumns(newcols);
			setColumnChange(true);
		}
	}, [attributes, initialSort]);

	const [cols, setCols] = useState([]);

	const { isLoading, error, data, isFetching } = useQuery(
		[
			"products",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advanced,
			searchGr,
		],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"products",
						advancedPage,
						advanced,
						direction,
						fieldSort,
						searchGr,
						null,
						0
				  )
				: doSearch
				? fecthFastPage("products", advancedPage, search, searchGr)
				: !isFilter && !doSearch
				? fetchPage(
						"products",
						advancedPage,
						direction,
						fieldSort,
						searchGr,
						null,
						0
				  )
				: null;
		}
	);

	useEffect(() => {
		setdisplay("none");
	}, []);

	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
				setProdutcList(data.Body.List);
				setCount(data.Body.Count);
			}
		} else {
			setProdutcList([]);
		}
	}, [isFetching]);

	useEffect(() => {
		setRefList([]);
		getAttributes();
		getPrices();
	}, []);

	const getAttributes = async () => {
		const attrResponse = await fetchAttributes();
		if (attrResponse) {
			setAttributes(attrResponse.Body.List);
			setAttrLocalStorage(attrResponse.Body.List);
		}
	};
	const getPrices = async () => {
		const priceResponse = await fetchPriceTypes();
		setPrices(priceResponse.Body.List);
		setPricesLocalStorage(priceResponse.Body.List);
	};

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

	const handleVisibleChange = (flag) => {
		if (!flag) {
			localStorage.setItem("procolumns", JSON.stringify(columnsnew));
		}
		setVisibleMenuSettings(flag);
	};

	useEffect(() => {
		if (filterChange) {
			setInitialFilter(filtersnew);
		}
		if (filterChanged) setFilterChanged(false);
	}, [filterChange, filterChanged]);

	useEffect(() => {
		if (filtered) setFiltered(false);
		if (columnChange) {
			setInitial(columnsnew);
		}
	}, [columnChange, filtered]);

	const columnsnew = useMemo(
		() => [...columns, ...otherColumns],
		[columnChange, direction, fieldSort, advancedPage, otherColumns]
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
										Object.values(columnsnew).find(
											(e) => e.dataIndex === d.dataIndex
										)
											? Object.values(columnsnew).find(
													(e) =>
														e.dataIndex ===
														d.dataIndex
											  ).show
											: null
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
				key="1"
				icon={<FileExcelOutlined />}
				onClick={() => downloadFile(advanced, "xlsx", "products")}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() => downloadFile(advanced, "pdf", "products")}
			>
				PDF
			</Menu.Item>
		</Menu>
	);
	if (isLoading)
		return (
			<Spin className="fetchSpinner" tip="Yüklənir...">
				<Alert />
			</Spin>
		);

	if (error) return "An error has occurred: " + error.message;

	if (redirect) return <Redirect to={`/editProduct/${editId}`} />;

	if (!data.Body) return data;

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Məhsullar</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<Buttons
								text={"Yeni Mehsul"}
								redirectto={"/newproduct"}
								animate={"Yarat"}
							/>
							<Buttons
								text={"Yeni Qrup"}
								redirectto={"/newprogroup"}
								animate={"Yarat"}
							/>
							<FilterButton from="product" />
							<MyFastSearch
								searchFunc={searchFunc}
								setSearchTerm={setProductSearchTerm}
								searchTerm={productSearchTerm}
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
						from={"products"}
						settings={filterSetting}
						cols={filtersnew}
					/>
				</Col>
			</Row>{" "}
			<Row>
				<Col xs={24} md={24} xl={5}>
					<ProductGroup />
				</Col>
				<Col xs={24} md={24} xl={19}>
					<Table
						className="main-table"
						rowKey="Id"
						columns={columnsnew.filter((c) => c.show === true)}
						dataSource={productList}
						onChange={onChange}
						locale={{
							emptyText: isFetching ? <Spin /> : "Cədvəl boşdur",
						}}
						pagination={{
							current: advancedPage + 1,
							total: count,
							onChange: handlePagination,
							defaultPageSize: data.Body.Limit,
							showSizeChanger: false,
						}}
						size="small"
						onRow={(r) => ({
							onClick: () => editPage(r.Id),
						})}
					/>
				</Col>
			</Row>
		</div>
	);
}
