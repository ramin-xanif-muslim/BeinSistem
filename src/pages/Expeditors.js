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

const { Text } = Typography;

const SettlementsDrawer = React.lazy(() =>
	import("../components/SettlementsDrawer")
);
export default function Expeditors() {
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
		advanced,
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
		["expeditors", page, direction, fieldSort, doSearch, search, advanced],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"expeditors",
						advancedPage,
						advanced,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("expeditors", page, search)
				: !isFilter && !doSearch
				? fetchPage("expeditors", page, direction, fieldSort)
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
				title: "???",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 100 * advancedPage,
			},
			{
				dataIndex: "Name",
				title: "Komisyon??u",
				defaultSortOrder:
					initialSort === "Name" ? defaultdr : null,
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Name"
					  ).show
					: true,
				sorter: (a, b) => null,
			},
			{
				dataIndex: "StockBalance",
				title: "Anbar qal??????",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "StockBalance"
					  ).show
					: true,
				render: (value, row, index) => {
						return ConvertFixedTable(row.StockBalance);
				},
			},
			{
				dataIndex: "Balance",
				title: "Balans",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Balance"
					  ).show
					: true,
				render: (value, row, index) => {
						return ConvertFixedTable(row.Balance);
				},
			},
			{
				dataIndex: "Settlements",
				title: "Borclar",
				show: initial
					? Object.values(initial).find(
							(i) => i.dataIndex === "Settlements"
					  ).show
					: true,
				render: (value, row, index) => {
					return ConvertFixedTable(row.Settlements);
				},
			},
		];
	}, [defaultdr, initialSort, marks, advancedPage]);

	useEffect(() => {
		setInitial(columns);
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

	const editPage = (r) => {
		console.log(r.Id);
		setcusid(r.Id);
		setVisibleDrawer(true);
	};

	const handlePagination = (pg) => {
		setPage(pg - 1);
		setAdvancedPage(pg - 1);
	};
	function onChange( sorter, extra) {
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
				onClick={() => downloadFile(advanced, "xlsx", "expeditors")}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				className="icon-pdf"
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() => downloadFile(advanced, "pdf", "expeditors")}
			>
				PDF
			</Menu.Item>
		</Menu>
	);

    if (!isLoading && !isObject(data.Body))
      return (
        <>
          X??ta:
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
						<h2>Komisyon??ular</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={19}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FastSearch className="search_header" />
						</div>

						<div style={{ display: "flex" }}>
							<Dropdown overlay={printMenu} trigger={"onclick"}>
								<button className="new-button">
									<DownloadOutlined />
									<span style={{ marginLeft: "5px" }}>
										Y??kl??
									</span>
								</button>
							</Dropdown>

							{tableSettings}
						</div>
					</div>
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
											<span>C??m</span>
										) : c.dataIndex === "PayIn" ? (
											<span>
												{ConvertFixedTable(allinsum)}
												<sup>???</sup>
											</span>
										) : c.dataIndex === "PayOut" ? (
											<span>
												{ConvertFixedTable(alloutsum)}
												<sup>???</sup>
											</span>
										) : c.dataIndex === "Current" ? (
											<span>
												{ConvertFixedTable(
													allcurrentsum
												)}
												<sup>???</sup>
											</span>
										) : null}
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
					onClick: (e) => editPage(r),
					// onClick: (e) => editPage(r.CustomerId),
				})}
			/>
			{visibleDrawer ? <SettlementsDrawer /> : null}
		</div>
	);
}
