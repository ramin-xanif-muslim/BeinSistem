import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import {
	fetchPage,
	fecthFastPage,
	fetchFilterPage,
	fetchCustomers,
} from "../api";

import { Table } from "antd";
import { Link, Redirect } from "react-router-dom";
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
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { SettingOutlined } from "@ant-design/icons";
import SearchByDate from "../components/SearchByDate";
import sendRequest from "../config/sentRequest";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { isObject } from "../config/function/findadditionals";
import FilterButton from "../components/FilterButton";
import MoneytransferButton from "../components/MoneytransferButton";
import { useFilterContext } from "../contexts/FilterContext";
const { Text } = Typography;

export default function Moneytransfer() {
	const {
		isOpenMoneytransferFilter,
		setIsOpenMoneytransferFilter,
		advacedMoneytransfer,
		setAdvaceMoneytransfer,
		formMoneytransfer,
		setFormMoneytransfer,
	} = useFilterContext();
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [redirectMoneytransferIn, setRedirectMoneytransferIn] =
		useState(false);
	const [redirectMoneytransferOut, setRedirectMoneytransferOut] =
		useState(false);
	const [direction, setDirection] = useState(1);
	const [defaultdr, setDefaultDr] = useState("descend");
	const [initialSort, setInitialSort] = useState("Moment");
	const [fieldSort, setFieldSort] = useState("Moment");
	const [allinsum, setallinsum] = useState(0);
	const [alloutsum, setalloutsum] = useState(0);
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
		setMarkLocalStorage,
		setMark,
		isFilter,
		setCustomersLocalStorage,
		setCustomers,
		advancedPage,
		setAdvancedPage,
		doSearch,
		search,
	} = useTableCustom();

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		[
			"moneytransfers",
			page,
			direction,
			fieldSort,
			doSearch,
			search,
			advacedMoneytransfer,
		],
		() => {
			return advacedMoneytransfer[0]
				? fetchFilterPage(
						"moneytransfers",
						advancedPage,
						advacedMoneytransfer,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("moneytransfers", page, search)
				: !advacedMoneytransfer[0] && !doSearch
				? fetchPage("moneytransfers", page, direction, fieldSort)
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

	console.log(initialSort);
	const columns = useMemo(() => {
		return [
			{
				title: "№",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 100 * advancedPage,
			},
			{
				dataIndex: "Moment",
				title: "Tarix",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Moment"
					  ).show
					: true,
				defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Moment" ? "activesort" : "",
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
				className:
					initialSort === "CustomerName"
						? "linkedColumns activesort"
						: "linkedColumns",
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
						// return row.Amount;
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
					: true,
				sorter: (a, b) => null,
				className: initialSort === "Description" ? "activesort" : "",
			},
			{
				dataIndex: "Mark",
				title: "Status",
				className: initialSort === "Mark" ? "activesort" : "",
				defaultSortOrder: initialSort === "Mark" ? defaultdr : null,
				show: initial
					? Object.values(initial).find((i) => i.dataIndex === "Mark")
							.show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return (
						<span
							className="status_label"
							style={{
								backgroundColor: markObject.find(
									(m) => m.Id === value
								)
									? markObject.find((m) => m.Id === value)
											.Color
									: null,
							}}
						>
							{markObject.find((m) => m.Id === value)
								? markObject.find((m) => m.Id === value).Name
								: null}
						</span>
					);
				},
			},
			{
				dataIndex: "Modify",
				title: "Dəyişmə tarixi",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Modify"
					  ).show
					: false,
				defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Modify" ? "activesort" : "",
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);

	const getCustomers = async () => {
		const customerResponse = await fetchCustomers();
		if (!customerResponse.Body === "İcazə yoxdur") {
			setCustomers(customerResponse.Body.List);
			setCustomersLocalStorage(customerResponse.Body.List);
		}
	};

	const filters = useMemo(() => {
		return [
			{
				key: "1",
				label: "Sənəd №",
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
				name: "spendItem",
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

	useEffect(() => {
		setInitial(columns);
		setInitialFilter(filters);

		getCustomers();
	}, []);

	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
				setDocumentList(data.Body.List);
				setallinsum(data.Body.InSum);
				setalloutsum(data.Body.OutSum);
				setPageCount(data.Body.Count);
				setLimitCount(data.Body.Limit);
			}
		} else {
			setDocumentList([]);
			setPageCount(null);
			setLimitCount(null);
		}
	}, [isFetching]);

	const editPage = (id, row) => {
		if (row.Type === 1) {
			setRedirectMoneytransferIn(true);
		}
		if (row.Type === 2) {
			setRedirectMoneytransferOut(true);
		}
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
	const getSearchObjByDate = async (ob) => {
		setFetchSearchByDate(true);
		let res = await sendRequest("moneytransfers/get.php", ob);
		setDocumentList(res.List);
		setallinsum(res.InSum);
		setalloutsum(res.OutSum);
		setFetchSearchByDate(false);
	};

	if (error) return "An error has occurred: " + error.message;
	if (redirectMoneytransferIn)
		return <Redirect push to={`/editMoneytransfer/${editId}`} />;
	if (redirectMoneytransferOut)
		return <Redirect push to={`/editMoneytransfer/${editId}`} />;

	if (!isLoading && !isObject(data.Body))
		return (
			<>
				Xəta:
				<span style={{ color: "red" }}>{data}</span>
			</>
		);
	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Pul transfer</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<MoneytransferButton />
							<FilterButton
								display={isOpenMoneytransferFilter}
								setdisplay={setIsOpenMoneytransferFilter}
							/>
							<FastSearch className="search_header" />
							<SearchByDate
								getSearchObjByDate={getSearchObjByDate}
							/>
						</div>
						<div>{tableSettings}</div>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
						settings={filterSetting}
						cols={filters}
						display={isOpenMoneytransferFilter}
                        advanced={advacedMoneytransfer}
                        setAdvance={setAdvaceMoneytransfer}
                        initialFilterForm={formMoneytransfer}
                        setInitialFilterForm={setFormMoneytransfer}
					/>
				</Col>
			</Row>
			{isFetchSearchByDate && <Spin />}
			<Table
				className="main-table"
				loading={isLoading || isFetchSearchByDate}
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
										{c.dataIndex === "Name"
											? "Cəm"
											: c.dataIndex === "PaymentIn"
											? ConvertFixedTable(allinsum) + " ₼"
											: c.dataIndex === "PaymentOut"
											? ConvertFixedTable(alloutsum) +
											  " ₼"
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
				onRow={(r) => ({
					onClick: (e) => editPage(r.Id, r),
				})}
			/>
		</div>
	);
}
