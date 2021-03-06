import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { isObject } from "../config/function/findadditionals";
import {
	fetchPage,
	fecthFastPage,
	fetchFilterPage,
	fetchCustomers,
} from "../api";

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

import { Button } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { SettingOutlined } from "@ant-design/icons";
import sendRequest from "../config/sentRequest";
import SearchByDate from "../components/SearchByDate";
import { ConvertFixedTable } from "../config/function/findadditionals";
import FilterButton from "../components/FilterButton";
import { useFilterContext } from "../contexts/FilterContext";
const { Text } = Typography;
export default function Sale() {
	const {
		isOpenSaleFilter,
		setIsOpenSaleFilter,
		advacedSale,
		setAdvaceSale,
		formSale,
		setFormSale,
	} = useFilterContext();
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(1);
	const [defaultdr, setDefaultDr] = useState("descend");
	const [initialSort, setInitialSort] = useState("Moment");
	const [fieldSort, setFieldSort] = useState("Moment");
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
	const {
		marks,
		isFilter,
		advancedPage,
		setAdvancedPage,
		doSearch,
		search,
		setCustomersLocalStorage,
		setCustomers,
	} = useTableCustom();

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const today = true;
	const { isLoading, error, data, isFetching } = useQuery(
		["sales", page, direction, fieldSort, doSearch, search, advacedSale],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"sales",
						advancedPage,
						advacedSale,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("sales", page, search)
				: !isFilter && !doSearch
				? fetchPage("sales", page, direction, fieldSort)
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
				title: "???",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 100 * advancedPage,
			},
			{
				dataIndex: "Name",
				title: "Sat???? ???",
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Name")
							.show
					: true,
				defaultSortOrder: initialSort === "Name" ? defaultdr : null,
				sorter: (a, b) => null,
				className: "linkedColumns",
			},
			{
				dataIndex: "SalePointName",
				title: "Sat???? n??qt??si",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SalePointName"
					  ).show
					: true,
				defaultSortOrder:
					initialSort === "SalePointName" ? defaultdr : null,
				sorter: (a, b) => null,
			},
			{
				dataIndex: "Moment",
				title: "Tarix",
				defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Moment"
					  ).show
					: true,
				sorter: (a, b) => null,
			},
			{
				dataIndex: "CustomerName",
				title: "T??r??f-m??qabil",
				defaultSortOrder:
					initialSort === "CustomerName" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "CustomerName"
					  ).show
					: true,
				sorter: (a, b) => null,
				className: "linkedColumns",
			},
			{
				dataIndex: "Amount",
				title: "Na??d",
				defaultSortOrder: initialSort === "Amount" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Amount"
					  ).show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Bank",
				title: "Na??ds??z",
				defaultSortOrder: initialSort === "Bank" ? defaultdr : null,
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Bank")
							.show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "UseBonus",
				title: "Bonus",
				defaultSortOrder: initialSort === "UseBonus" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "UseBonus"
					  ).show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "Credit",
				title: "Borca",
				defaultSortOrder: initialSort === "Credit" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Credit"
					  ).show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},
			{
				dataIndex: "SumMoney",
				title: "Yekun m??bl????",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SumMoney"
					  ).show
					: true,
				render: (value, row, index) => {
					return parseFloat(
						row.Amount + row.Bank + row.Credit + row.UseBonus
					);
				},
			},
			{
				dataIndex: "StockName",
				title: "Anbar ad??",
				defaultSortOrder:
					initialSort === "StockName" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "StockName"
					  ).show
					: true,
				sorter: (a, b) => null,
			},
			{
				dataIndex: "Profit",
				title: "Qazanc",
				defaultSortOrder: initialSort === "Profit" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Profit"
					  ).show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "Discount",
				title: "Endirim",
				defaultSortOrder: initialSort === "Discount" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Discount"
					  ).show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					let discount = ConvertFixedTable(value) + " %";
					return discount;
				},
			},

			{
				dataIndex: "Description",
				title: "????rh",
				defaultSortOrder:
					initialSort === "Description" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Description"
					  ).show
					: false,
				sorter: (a, b) => null,
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);

	const getCustomers = async () => {
		const customerResponse = await fetchCustomers();
		setCustomers(customerResponse.Body.List);
		setCustomersLocalStorage(customerResponse.Body.List);
	};

	const filters = useMemo(() => {
		return [
			{
				key: "1",
				label: "Sat???? ???",
				name: "docNumber",
				type: "text",
				dataIndex: "docNumber",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "docNumber"
					  ).show
					: true,
			},
			{
				key: "2",
				label: "M??hsul (Ad, artkod, barkod, ????rh)",
				name: "productName",
				type: "selectModal",
				controller: "products",
				dataIndex: "productName",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "productName"
					  ).show
					: true,
			},
			{
				key: "3",
				label: "Qar????-t??r??f",
				name: "customerName",
				type: "selectModal",
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
				label: "D??yi??m?? tarixi",
				name: "modifedDate",
				type: "dateOfChange",
				dataIndex: "modifedDate",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "modifedDate"
					  ).show
					: false,
			},
			{
				key: "5",
				label: "M??nf????t",
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
				label: "Sat???? n??qt??si",
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
				label: "????b??",
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
				label: "M??bl????",
				name: "docPrice",
				start: "amb",
				end: "ame",
				type: "range",
				dataIndex: "docPrice",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "docPrice"
					  ).show
					: true,
			},
			{
				key: "11",
				label: "??d??ni?? n??v??",
				name: "paytype",
				controller: "yesno",
				default: "",
				type: "selectPayType",
				hidden: false,
				dataIndex: "paytype",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "paytype"
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
                    from: "sales",
			},
		];
	}, [filterChanged]);

	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);

		getCustomers();
	}, []);
	useEffect(() => {
		if (!isFetching) {
			setDocumentList(data.Body.List);
			setallsum(data.Body.AllSum);
			setallprofit(data.Body.AllProfit);
			setallbonus(data.Body.BonusSum);
			setallbank(data.Body.BankSum);
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
	const getSearchObjByDate = async (ob) => {
		setFetchSearchByDate(true);
		let res = await sendRequest("sales/get.php", ob);
		setDocumentList(res.List);
		setallsum(res.AllSum);
		setallprofit(res.AllProfit);
		setallbonus(res.BonusSum);
		setallbank(res.BankSum);
		setFetchSearchByDate(false);
	};

	if (!isLoading && !isObject(data.Body))
		return (
			<>
				X??ta:
				<span style={{ color: "red" }}>{data}</span>
			</>
		);

	if (error) return "An error has occurred: " + error.message;
	if (redirect) return <Redirect push to={`/editSale/${editId}`} />;
	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Sat????lar</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								display={isOpenSaleFilter}
								setdisplay={setIsOpenSaleFilter}
							/>
							<FastSearch className="search_header" />
							{/* <SearchByDate
								from="sales"
								getSearchObjByDate={getSearchObjByDate}
							/> */}
						</div>
						<div>{tableSettings}</div>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
						from="sales"
						settings={filterSetting}
						cols={filters}
						display={isOpenSaleFilter}
						advanced={advacedSale}
						setAdvance={setAdvaceSale}
						initialFilterForm={formSale}
						setInitialFilterForm={setFormSale}
					/>
				</Col>
			</Row>
			{isFetchSearchByDate && <Spin />}

			<Table
				className="main-table"
				loading={isLoading || isFetchSearchByDate}
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
										{c.dataIndex === "Name"
											? "C??m"
											: c.dataIndex === "Amount"
											? ConvertFixedTable(allsum) + " ???"
											: c.dataIndex === "Profit"
											? ConvertFixedTable(allprofit) +
											  " ???"
											: c.dataIndex === "Bank"
											? ConvertFixedTable(allbank) + " ???"
											: c.dataIndex === "UseBonus"
											? ConvertFixedTable(allbonus)
											: c.dataIndex === "SumMoney"
											? ConvertFixedTable(
													allsum + allbank + allbonus
											  ) + " ???"
											: null}
									</Text>
								</Table.Summary.Cell>
							))}
					</Table.Summary.Row>
				)}
				locale={{ emptyText: isFetching ? <Spin /> : "C??dv??l bo??dur" }}
				pagination={{
					current: advancedPage + 1,
					total: pageCount,
					onChange: handlePagination,
					defaultPageSize: 100,
					showSizeChanger: false,
				}}
				size="small"
				onRow={(r) => ({
					onClick: (e) => editPage(r.Id),
				})}
			/>
		</div>
	);
}
