import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import {
	fetchPage,
	fecthFastPage,
	fetchFilterPage,
	fetchCustomers,
} from "../api";

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

import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import FilterButton from "../components/FilterButton";
import { useTableCustom } from "../contexts/TableContext";
import { isObject } from "../config/function/findadditionals";

import { SettingOutlined } from "@ant-design/icons";
import sendRequest from "../config/sentRequest";
import SearchByDate from "../components/SearchByDate";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { useFilterContext } from "../contexts/FilterContext";
const { Text } = Typography;

export default function CreditTransaction() {
	const {
		isOpenCreditTransactionFilter,
		setIsOpenCreditTransactionFilter,
		advacedCreditTransaction,
		setAdvaceCreditTransaction,
		formCreditTransaction,
		setFormCreditTransaction,
	} = useFilterContext();
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [direction, setDirection] = useState(1);
	const [defaultdr, setDefaultDr] = useState("descend");
	const [initialSort, setInitialSort] = useState("Moment");
	const [fieldSort, setFieldSort] = useState("Moment");
	const [allinsum, setallinsum] = useState(0);
	const [alloutsum, setalloutsum] = useState(0);
	const [page, setPage] = useState(0);
	const [filtered, setFiltered] = useState(false);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);

	const [filterChanged, setFilterChanged] = useState(false);
	const [columnChange, setColumnChange] = useState(false);
	const [initial, setInitial] = useState(null);
	const [initialfilter, setInitialFilter] = useState(null);
	const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
	const {
		marks,
		isFilter,
		advancedPage,
		setCustomersLocalStorage,
		setCustomers,
		setAdvancedPage,
		doSearch,
		search,
	} = useTableCustom();

	const [documentList, setDocumentList] = useState([]);
	const { isLoading, error, data, isFetching } = useQuery(
		[
			"credittransactions",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advacedCreditTransaction,
		],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"credittransactions",
						advancedPage,
						advacedCreditTransaction,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("credittransactions", page, search)
				: !isFilter && !doSearch
				? fetchPage("credittransactions", page, direction, fieldSort)
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
				dataIndex: "Name",
				title: "Ödəniş №",
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Name")
							.show
					: false,
				defaultSortOrder: initialSort === "Name" ? defaultdr : null,
				sorter: (a, b) => null,
				className: "linkedColumns",
			},
			{
				dataIndex: "SalePoint",
				title: "Satış nöqtəsi",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "SalePoint"
					  ).show
					: true,
				defaultSortOrder:
					initialSort === "SalePoint" ? defaultdr : null,
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
				title: "Tərəf-müqabil",
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
				dataIndex: "CashInvoice",
				title: "Nağd/Köçürmə",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "CashInvoice"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.Type === "p") {
						return "Nağd";
					} else {
						return "Köçürmə";
					}
				},
			},
			{
				dataIndex: "PaymentIn",
				title: "Mədaxil",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PaymentIn"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.Direct === "i") {
						return ConvertFixedTable(row.Amount);
					} else {
						return "";
					}
				},
			},
			{
				dataIndex: "PaymentOut",
				title: "Məxaric",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PaymentOut"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.Direct === "o") {
						return ConvertFixedTable(row.Amount);
					} else {
						return "";
					}
				},
			},
			{
				dataIndex: "Description",
				title: "Şərh",
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

	const filters = useMemo(() => {
		return [
			{
				key: "1",
				label: "Ödəniş №",
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
				label: "Xərc maddələri",
				name: "spenditems",
				type: "select",
				controller: "spenditems",
				dataIndex: "spendItems",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "spendItems"
					  ).show
					: true,
			},
			{
				key: "3",
				label: "Qarşı-tərəf",
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
				label: "Ödəniş növü",
				name: "paytype",
				controller: "departments",
				type: "selectPayType",
				dataIndex: "paytype",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "paytype"
					  ).show
					: true,
			},
			{
				key: "5",
				label: "Əməliyyat",
				name: "paydir",
				controller: "transactions",
				type: "selectPayDir",
				dataIndex: "paydir",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "paydir"
					  ).show
					: true,
			},
			{
				key: "6",
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
				key: "7",
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
				key: "8",
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
		];
	}, [filterChanged]);

	const getCustomers = async () => {
		const customerResponse = await fetchCustomers();
		setCustomers(customerResponse.Body.List);
		setCustomersLocalStorage(customerResponse.Body.List);
	};

	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);

		getCustomers();
	}, []);

	useEffect(() => {
		if (!isFetching) {
			setDocumentList(data.Body.List);
			setallinsum(data.Body.InSum);
			setalloutsum(data.Body.OutSum);
            setPageCount(data.Body.Count);
            setLimitCount(data.Body.Limit);
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
	const getSearchObjByDate = async (ob) => {
		setFetchSearchByDate(true);
		let res = await sendRequest("credittransactions/get.php", ob);
		setDocumentList(res.List);
		setallinsum(res.InSum);
		setalloutsum(res.OutSum);
		setFetchSearchByDate(false);
	};

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
						<h2>Ödənişlər</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								display={isOpenCreditTransactionFilter}
								setdisplay={setIsOpenCreditTransactionFilter}
							/>
							<FastSearch className="search_header" />
							<SearchByDate
								from="credittransaction"
								getSearchObjByDate={getSearchObjByDate}
							/>
						</div>
						{tableSettings}
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
								from="credittransaction"
						cols={filters}
						display={isOpenCreditTransactionFilter}
                        advanced={advacedCreditTransaction}
                        setAdvance={setAdvaceCreditTransaction}
                        initialFilterForm={formCreditTransaction}
                        setInitialFilterForm={setFormCreditTransaction}
					/>
				</Col>
			</Row>
			{isFetchSearchByDate && <Spin />}
			<Table
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
										{c.dataIndex === "Name"
											? "Cəm"
											: c.dataIndex === "PaymentIn"
											? allinsum + " ₼"
											: c.dataIndex === "PaymentOut"
											? alloutsum + " ₼"
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
