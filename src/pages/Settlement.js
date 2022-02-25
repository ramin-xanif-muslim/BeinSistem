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
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import {
	ConvertFixedTable,
	isObject,
} from "../config/function/findadditionals";
import { SettingOutlined } from "@ant-design/icons";
import FilterButton from "../components/FilterButton";
import { useDownload } from "../hooks/useDownload";
import { useFilterContext } from "../contexts/FilterContext";

const { Text } = Typography;

const SettlementsDrawer = React.lazy(() =>
	import("../components/SettlementsDrawer")
);
export default function Settlement() {
	const {
		isOpenSettlementFilter,
		setIsOpenSettlementFilter,
		advacedSettlement,
		setAdvaceSettlement,
		formSettlement,
		setFormSettlement,
	} = useFilterContext();
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
        setSelectedDateId,
		doSearch,
		search,
	} = useTableCustom();
	const {
		visibleDrawer,
		setVisibleDrawer,
		setcusid,
		cusid,
		setSaveFromModal,
		setRedirectSaveClose,
	} = useCustomForm();

	const [downloadButton] = useDownload(advacedSettlement, "settlements");
	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const { isLoading, error, data, isFetching } = useQuery(
		["settlements", page, direction, fieldSort, doSearch, search, advacedSettlement],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"settlements",
						advancedPage,
						advacedSettlement,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("settlements", page, search)
				: !isFilter && !doSearch
				? fetchPage("settlements", page, direction, fieldSort)
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
			},
			{
				dataIndex: "PayIn",
				title: "Borc (alacaq)",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PayIn"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.Amount > 0) {
						return ConvertFixedTable(row.Amount);
					}
				},
			},
			{
				dataIndex: "PayOut",
				title: "Borc (verəcək)",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "PayOut"
					  ).show
					: true,
				render: (value, row, index) => {
					if (row.Amount < 0) {
						return ConvertFixedTable(row.Amount);
					}
				},
			},
			{
				dataIndex: "Current",
				title: "Cari vəziyyət",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Current"
					  ).show
					: false,
				render: (value, row, index) => {
					return ConvertFixedTable(row.Amount);
				},
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);
	const filters = useMemo(() => {
		return [
			{
				key: "1",
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
				key: "2",
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
				key: "3",
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
			{
				key: "4",
				label: "Siyahı",
				name: "zeros",
				controller: "yesno",
				default: 3,
				type: "selectDefaultList",
				hidden: false,
				dataIndex: "zeros",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "zeros"
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
		setSelectedDateId(null)
	}, []);

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

	const editPage = (id, r) => {
		setcusid(id);
		setVisibleDrawer(true);
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

	if (redirect) return <Redirect push to={`/editEnter/${editId}`} />;

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>Borclar</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={19}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								display={isOpenSettlementFilter}
								setdisplay={setIsOpenSettlementFilter}
							/>
							<FastSearch className="search_header" />
						</div>
						<div>{downloadButton}</div>
						<div>{tableSettings}</div>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
						cols={filters}
						display={isOpenSettlementFilter}
                        advanced={advacedSettlement}
                        setAdvance={setAdvaceSettlement}
                        initialFilterForm={formSettlement}
                        setInitialFilterForm={setFormSettlement}
					/>
				</Col>
			</Row>
			<Table
				id="settlement-table"
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
				onRow={(r) => ({
					onClick: (e) => editPage(r.CustomerId),
				})}
			/>
			{visibleDrawer ? <SettlementsDrawer /> : null}
		</div>
	);
}
