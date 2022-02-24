import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import { Alert, Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";

import Buttons from "../components/Button";
import { Button } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import { SettingOutlined } from "@ant-design/icons";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { isObject } from "../config/function/findadditionals";
import SearchByDate from "../components/SearchByDate";
import sendRequest from "../config/sentRequest";
import FilterButton from "../components/FilterButton";
import { useFilterContext } from "../contexts/FilterContext";

const { Text } = Typography;
export default function Enter() {
	const {
		isOpenEnterFilter,
		setIsOpenEnterFilter,
		advacedEnter,
		setAdvaceEnter,
        formEnter,
        setFormEnter,
	} = useFilterContext();
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState(1);
	const [defaultdr, setDefaultDr] = useState("descend");
	const [initialSort, setInitialSort] = useState("Moment");
	const [fieldSort, setFieldSort] = useState("Moment");
	const [allsum, setallsum] = useState(0);
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
		// advanced,
	} = useTableCustom();
	const { setSaveFromModal, setRedirectSaveClose } = useCustomForm();

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		["enters", page, direction, fieldSort, doSearch, search, advacedEnter],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"enters",
						advancedPage,
						advacedEnter,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("enters", page, search)
				: !isFilter && !doSearch
				? fetchPage("enters", page, direction, fieldSort)
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
				dataIndex: "Name",
				title: "Daxilolma №",
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Name").show
					: true,
				defaultSortOrder: initialSort === "Name" ? defaultdr : null,
				sorter: (a, b) => null,
				className:
					initialSort === "Name"
						? "linkedColumns activesort"
						: "linkedColumns",
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
				dataIndex: "StockName",
				title: "Anbar",
				sort: true,
				defaultSortOrder:
					initialSort === "StockName" ? defaultdr : null,
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "StockName").show
					: true,
				sorter: (a, b) => null,
				className: initialSort === "StockName" ? "activesort" : "",
			},

			{
				dataIndex: "Amount",
				title: "Məbləğ",
				sort: true,
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Amount").show
					: true,
				showFooter: true,
				footerName: "Amount",
				priceFormat: true,
				defaultSortOrder: initialSort === "Amount" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Amount" ? "activesort" : "",
				render: (value, row, index) => {
					return ConvertFixedTable(value);
				},
			},

			{
				dataIndex: "Mark",
				title: "Status",
				defaultSortOrder: initialSort === "Mark" ? defaultdr : null,
				className: initialSort === "Mark" ? "activesort" : "",

				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Mark").show
					: true,
				sorter: (a, b) => null,
				render: (value, row, index) => {
					return (
						<span
							className="status_label"
							style={{
								backgroundColor: markObject
									? markObject.find((m) => m.Id === value)
										? markObject.find((m) => m.Id === value)
												.Color
										: null
									: null,
							}}
						>
							{markObject
								? markObject.find((m) => m.Id === value)
									? markObject.find((m) => m.Id === value)
											.Name
									: null
								: null}
						</span>
					);
				},
			},
			{
				dataIndex: "Description",
				title: "Şərh",
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Description").show
					: true,
				defaultSortOrder:
					initialSort === "Description" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Description" ? "activesort" : "",
			},
			{
				dataIndex: "Modify",
				title: "Dəyişmə tarixi",
				show: JSON.parse(localStorage.getItem("entercolumns"))
					? Object.values(
							JSON.parse(localStorage.getItem("entercolumns"))
					  ).find((i) => i.dataIndex === "Modify").show
					: false,
				defaultSortOrder: initialSort === "Modify" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Modify" ? "activesort" : "",
			},

			{
				dataIndex: "Consumption",
				title: "Əlavə xərc",
				show:
					JSON.parse(localStorage.getItem("entercolumns")) &&
					Object.values(
						JSON.parse(localStorage.getItem("entercolumns"))
					).find((i) => i.dataIndex === "Consumption")
						? Object.values(
								JSON.parse(localStorage.getItem("entercolumns"))
						  ).find((i) => i.dataIndex === "Consumption").show
						: true,
				defaultSortOrder:
					initialSort === "Consumption" ? defaultdr : null,
				sorter: (a, b) => null,
				className: initialSort === "Consumption" ? "activesort" : "",
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
				label: "Daxilolma №",
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
				key: "6",
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
				key: "7",
				label: "Dəyişmə tarixi",
				name: "modifedDate",
				type: "dateOfChange",
				dataIndex: "modifedDate",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "modifedDate"
					  ).show
					: true,
			},
			{
				key: "8",
				label: "Məbləğ",
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
				key: "9",
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
		];
	}, [filterChanged]);

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
				setPageCount(data.Body.Count);
				setLimitCount(data.Body.Limit);

				setallsum(data.Body.AllSum);
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
	const editClickPage = (e, id) => {
		if (e.target.className.includes("linkedColumns")) {
			setRedirect(true);
			setEditId(id);
		}
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
		var initialCols = JSON.parse(localStorage.getItem("entercolumns"));
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
		localStorage.setItem("entercolumns", JSON.stringify(initialCols));
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
		let res = await sendRequest("enters/get.php", ob);
		setDocumentList(res.List);
		setallsum(res.AllSum);
		setFetchSearchByDate(false);
	};
	if (error) return "An error has occurred: " + error.message;

	if (redirect) return <Redirect push to={`/editEnter/${editId}`} />;

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
						<h2>Daxilolma</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<Buttons
								text={"Yeni daxilolma"}
								redirectto={"/newenter"}
							/>
							<FilterButton
								display={isOpenEnterFilter}
								setdisplay={setIsOpenEnterFilter}
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
						display={isOpenEnterFilter}
                        advanced={advacedEnter}
                        setAdvance={setAdvaceEnter}
                        initialFilterForm={formEnter}
                        setInitialFilterForm={setFormEnter}
					/>
				</Col>
			</Row>
			<Row>
				<Col
					xs={24}
					md={24}
					xl={24}
					className="setting_button_wrapper"
				></Col>
			</Row>
			<Table
				className="main-table"
				loading={isLoading || isFetchSearchByDate}
				loadin
				rowKey="Name"
				columns={columns.filter((c) => c.show == true)}
				rowClassName={(record, index) =>
					record.Status === 0 ? "unchecked" : ""
				}
				onChange={onChange}
				dataSource={documentList}
				summary={() => (
					<Table.Summary.Row>
						{columns
							.filter((c) => c.show === true)
							.map((c) => (
								<Table.Summary.Cell className="table-summary">
									<Text type="">
										{c.dataIndex === "Name"
											? "Cəm"
											: c.dataIndex === "Amount"
											? ConvertFixedTable(allsum) + " ₼"
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
					onClick: (e) => editPage(r.Id),
				})}
			/>
		</div>
	);
}
