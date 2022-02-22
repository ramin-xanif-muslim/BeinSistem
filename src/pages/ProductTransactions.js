import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage, sendRequest } from "../api";

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

import { Button, Icon } from "semantic-ui-react";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { isObject } from "../config/function/findadditionals";
import {
	SettingOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	DownloadOutlined,
} from "@ant-design/icons";
import { downloadFile } from "../config/function";
import FilterButton from "../components/FilterButton";
import SearchByDate from "../components/SearchByDate";
import { useFilterContext } from "../contexts/FilterContext";

const { Text } = Typography;
export default function ProductTransactions() {
    const { isOpenProductTransactionFilter, setIsOpenProductTransactionFilter } = useFilterContext() 
	const [count, setCount] = useState(1);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(0);
	const [defaultdr, setDefaultDr] = useState("ascend");
	const [filterChanged, setFilterChanged] = useState(false);
	const [initialSort, setInitialSort] = useState("Quantity");
	const [fieldSort, setFieldSort] = useState("Quantity");
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
		advanced,
		setdisplay,
		display,
	} = useTableCustom();

	const [tabls, setTables] = useState(null);

	const [demandreturns, setDemandreturns] = useState([]);
	const [demands, setDemands] = useState([]);
	const [enters, setEnters] = useState([]);
	const [losses, setLosses] = useState([]);
	const [moves, setMoves] = useState([]);
	const [returns, setReturns] = useState([]);
	const [sales, setSales] = useState([]);
	const [supplies, setSupplies] = useState([]);
	const [supplyreturns, setSupplyreturns] = useState([]);
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const { isLoading, error, data, isFetching } = useQuery(
		[
			"producttransactions",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advanced,
		],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"producttransactions",
						advancedPage,
						advanced,
						direction
				  )
				: doSearch
				? fecthFastPage("producttransactions", page, search)
				: !isFilter && !doSearch
				? fetchPage("producttransactions", page, direction)
				: null;
		}
	);
    const getSearchObjByDate = async (ob) => {
      setFetchSearchByDate(true);
      let res = await sendRequest("producttransactions/get.php", ob);
      if (!!res.demandreturns) {
          setDemandreturns([
              res.demandreturns,
              res.demandreturnsSum,
          ]);
      }
      if (!!res.demands) {
          setDemands([res.demands, res.demandsSum]);
      }
      if (!!res.enters) {
          setEnters([res.enters, res.entersSum]);
      }
      if (!!res.losses) {
          setLosses([res.losses, res.lossesSum]);
      }
      if (!!res.moves) {
          setMoves([res.moves, res.movesSum]);
      }
      if (!!res.returns) {
          setReturns([res.returns, res.returnsSum]);
      }
      if (!!res.sales) {
          setSales([res.sales, res.salesSum]);
      }
      if (!!res.supplies) {
          setSupplies([res.supplies, res.suppliesSum]);
      }
      if (!!res.supplyreturns) {
          setSupplyreturns([
              res.supplyreturns,
              res.supplyreturnsSum,
          ]);
      }
      setFetchSearchByDate(false);
    };
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
				dataIndex: "Name",
				title: "Məhsulun adı",
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Name")
							.show
					: true,
				defaultSortOrder: initialSort === "Name" ? defaultdr : null,
				sorter: (a, b) => null,
				className:
					initialSort === "Name"
						? "linkedColumns activesort"
						: "linkedColumns",
			},
			{
				dataIndex: "Barcode",
				title: "Barkodu",
				defaultSortOrder: initialSort === "Barcode" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Barcode"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "Barcode" ? "activesort" : "",
			},
			{
				dataIndex: "Moment",
				title: "Tarix",
				defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Moment").show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "Moment" ? "activesort" : "",
			},

			{
				dataIndex: "sQuantity",
				title: "Miqdar",
				defaultSortOrder:
					initialSort === "sQuantity" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "sQuantity"
					  ).show
					: true,
				className: initialSort === "sQuantity" ? "activesort" : "",
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
				className: initialSort === "Price" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "sPrice",
				title: "Məbləg",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "sPrice"
					  ).show
					: true,
				defaultSortOrder: initialSort === "sPrice" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "sPrice" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
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
				label: "Məhsul adı",
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
				key: "4",
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
				key: "5",
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
				key: "8",
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
				key: "9",
				label: "Sənəd tipi",
				name: "documentType",
				type: "selectDocumentType",
				dataIndex: "documentType",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "documentType"
					  ).show
					: true,
			},
		];
	}, [filterChanged]);

	useEffect(() => {
		setTables([
			{
				title: "Daxilolma",
				documentList: enters[0],
				allSum: enters[1],
			},
			{
				title: "Silinmə",
				documentList: losses[0],
				allSum: losses[1],
			},
			{
				title: "Yerdəyişmə",
				documentList: moves[0],
				allSum: moves[1],
			},
			{
				title: "Alış",
				documentList: supplies[0],
				allSum: supplies[1],
			},
			{
				title: "Alıcıların qaytarmaları",
				documentList: supplyreturns[0],
				allSum: supplyreturns[1],
			},
			{
				title: "Topdan satışlar",
				documentList: demands[0],
				allSum: demands[1],
			},
			{
				title: "Satışların geriqaytarmaları",
				documentList: demandreturns[0],
				allSum: demandreturns[1],
			},
            {
                title: "Pərakəndə satışlar",
                documentList: sales[0],
                allSum: sales[1],
            },
			{
				title: "Qaytarmalar",
				documentList: returns[0],
				allSum: returns[1],
			},
		]);
	}, [
		demandreturns[0],
		demands[0],
		enters[0],
		losses[0],
		moves[0],
		supplies[0],
		supplyreturns[0],
		returns[0],
		sales[0],
	]);
	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);
	}, []);

	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
                setDemandreturns([])
                setDemands([])
                setEnters([])
                setLosses([])
                setMoves([])
                setReturns([])
                setSales([])
                setSupplies([])
                setSupplyreturns([])

				if (!!data.Body.demandreturns) {
					setDemandreturns([
						data.Body.demandreturns,
						data.Body.demandreturnsSum,
					]);
				}
				if (!!data.Body.demands) {
					setDemands([data.Body.demands, data.Body.demandsSum]);
				}
				if (!!data.Body.enters) {
					setEnters([data.Body.enters, data.Body.entersSum]);
				}
				if (!!data.Body.losses) {
					setLosses([data.Body.losses, data.Body.lossesSum]);
				}
				if (!!data.Body.moves) {
					setMoves([data.Body.moves, data.Body.movesSum]);
				}
				if (!!data.Body.returns) {
					setReturns([data.Body.returns, data.Body.returnsSum]);
				}
				if (!!data.Body.sales) {
					setSales([data.Body.sales, data.Body.salesSum]);
				}
				if (!!data.Body.supplies) {
					setSupplies([data.Body.supplies, data.Body.suppliesSum]);
				}
				if (!!data.Body.supplyreturns) {
					setSupplyreturns([
						data.Body.supplyreturns,
						data.Body.supplyreturnsSum,
					]);
				}
				setIsFilter(false);
			}
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
	useEffect(() => {
		setdisplay("block");
	}, []);
	let tablesComponents;
	if (tabls) {
		tablesComponents = tabls.map((table) => {
			const { title, documentList, allSum } = table;
			if (documentList && documentList[0]) {
				return (
					<div>
						<h4 className="producttransactions-header">{title}</h4>
						<Table
				            loading={isLoading || isFetchSearchByDate}
							className="main-table"
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
													{c.dataIndex ===
													"ProductName"
														? "Cəm"
														: c.dataIndex ===
														  "sPrice"
														? ConvertFixedTable(
																allSum
														  ) + " ₼"
														: null}
												</Text>
											</Table.Summary.Cell>
										))}
								</Table.Summary.Row>
							)}
							locale={{
								emptyText: isFetching ? (
									<Spin />
								) : (
									"Cədvəl boşdur"
								),
							}}
							pagination={{
								current: advancedPage + 1,
								total: 100,
								onChange: handlePagination,
								defaultPageSize: 1000,
								showSizeChanger: false,
							}}
							size="small"
						/>
					</div>
				);
			} else return null;
		});
	}

	const printMenu = (
		<Menu>
			<Menu.Item
				className="icon-excel"
				key="1"
				icon={<FileExcelOutlined />}
				onClick={() =>
					downloadFile(advanced, "xlsx", "producttransactions")
				}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				className="icon-pdf"
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() =>
					downloadFile(advanced, "pdf", "producttransactions")
				}
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

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Dövriyyə</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton display={isOpenProductTransactionFilter} setdisplay={setIsOpenProductTransactionFilter} />
							<SearchByDate
								getSearchObjByDate={getSearchObjByDate}
                                defaultCheckedDate={1}
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
						from="producttransactions"
						settings={filterSetting}
						cols={filters}
                        display={isOpenProductTransactionFilter}
					/>
				</Col>
			</Row>

			{tablesComponents && tablesComponents}
		</div>
	);
}
