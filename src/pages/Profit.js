import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import { Alert, Table } from "antd";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";

import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { SettingOutlined } from "@ant-design/icons";
import sendRequest from "../config/sentRequest";
import SearchByDate from "../components/SearchByDate";
import FilterButton from "../components/FilterButton";
import { isObject } from "../config/function/findadditionals";
import { useDownload } from "../hooks/useDownload";
import { useFilterContext } from "../contexts/FilterContext";
const { Text } = Typography;

export default function Profit() {
	const {
		isOpenProfitFilter,
		setIsOpenProfitFilter,
		advacedProfit,
		setAdvaceProfit,
		formProfit,
		setFormProfit,
	} = useFilterContext();
	const [isFetchSearchByDate, setFetchSearchByDate] = useState(false);
	const [direction, setDirection] = useState(1);
	const [defaultdr, setDefaultDr] = useState("");
	const [initialSort, setInitialSort] = useState("");
	const [fieldSort, setFieldSort] = useState("");
	const [page, setPage] = useState(0);
	const [filtered, setFiltered] = useState(false);
	const [initialfilter, setInitialFilter] = useState(null);

	const [filterChanged, setFilterChanged] = useState(false);
	const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
		useState(false);

	const { marks, isFilter, advancedPage, doSearch, search } =
		useTableCustom();

	const [downloadButton] = useDownload(advacedProfit, "profit");

	const handleVisibleChangeFilter = (flag) => {
		setVisibleMenuSettingsFilter(flag);
	};

	const [documentList, setDocumentList] = useState([]);
	const [pageCount, setPageCount] = useState(null);
	const [limitCount, setLimitCount] = useState(null);
	const [document, setDocument] = useState({});
	const { isLoading, error, data, isFetching } = useQuery(
		["profits", page, direction, fieldSort, doSearch, search, advacedProfit],
		() => {
			return isFilter === true
				? fetchFilterPage(
						"profit",
						advancedPage,
						advacedProfit,
						direction,
						fieldSort
				  )
				: doSearch
				? fecthFastPage("profit", page, search)
				: !isFilter && !doSearch
				? fetchPage("profit", page, direction, fieldSort)
				: null;
		}
	);

	var markObject;
	marks
		? (markObject = marks)
		: (markObject = JSON.parse(localStorage.getItem("marks")));
	const columns = useMemo(() => {
		return [
			{
				dataIndex: "Name",
				title: "Madd??",
			},
			{
				dataIndex: "Profit",
				title: "M??nf????t/Z??r??r",
			},
		];
	}, [defaultdr, initialSort, filtered, marks, advancedPage]);
	useEffect(() => {
		if (!isFetching) {
			if (isObject(data.Body)) {
				setDocument(data.Body);
				setPageCount(data.Body.Count);
				setLimitCount(data.Body.Limit);
			}
		} else {
			setDocument([]);
			setPageCount(null);
			setLimitCount(null);
		}
	}, [isFetching]);

	useEffect(() => {
		if (Object.keys(document).length > 0) {
			var childrenArray = [];
			var spendItemsSum = 0;
			document.SpendItems.forEach((d) => {
				spendItemsSum += parseFloat(d.Amount);
			});
			document.SpendItems.forEach((d) => {
				childrenArray.push({
					key: d.Id,
					Name: d.Name,
					Profit: ConvertFixedTable(d.Amount),
				});
			});
			var clearProfit = isNaN(
				ConvertFixedTable(
					document.SaleSum - document.CostSum - spendItemsSum
				)
			)
				? "0"
				: ConvertFixedTable(
						document.SaleSum - document.CostSum - spendItemsSum
				  );
			var cycleProfit = isNaN(
				ConvertFixedTable(document.SaleSum - document.CostSum)
			)
				? "0"
				: ConvertFixedTable(document.SaleSum - document.CostSum);
			var datas = [
				{
					key: 1,
					Name: <span className="boldContent">Sat???? d??vr??yy??si</span>,
					Profit: (
						<span className="boldContent">
							{ConvertFixedTable(document.SaleSum)}
							<sup>???</sup>
						</span>
					),
				},
				{
					key: 2,
					Name: "Mayas??",
					Profit: ConvertFixedTable(document.CostSum),
				},
				{
					key: 3,
					Name: (
						<span className="boldContent">D??vr??yy?? m??nf????ti</span>
					),
					Profit: (
						<span className="boldContent">
							{cycleProfit}
							<sup>???</sup>
						</span>
					),
				},
				{
					key: 4,
					Name: "X??rcl??r (toplam)",
					Profit: ConvertFixedTable(spendItemsSum),
					children: childrenArray,
				},
				{
					key: 5,
					Name: <span className="boldContent">T??miz m??nf????t</span>,
					Profit: (
						<span
							className="boldContent"
							style={{
								color: clearProfit < 0 ? "red" : "initial",
							}}
						>
							{ConvertFixedTable(clearProfit)}
							<sup>???</sup>
						</span>
					),
				},
			];

			setDocumentList(datas);
		} else {
			setDocumentList([]);
		}
	}, [document]);

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

	const filters = useMemo(() => {
		return [
			{
				key: "8",
				label: "Tarixi",
				name: "createdDate",
				type: "date",
				dataIndex: "createdDate",
				show: initialfilter
					? Object.values(initialfilter).find(
							(i) => i.dataIndex === "createdDate"
					  ).show
					: true,
                    from: "profit",
			},
		];
	}, [filterChanged]);

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
	const getSearchObjByDate = async (ob) => {
		setFetchSearchByDate(true);
		let res = await sendRequest("profit/get.php", ob);
		setDocument(res);
		setFetchSearchByDate(false);
	};

	if (error) return "An error has occurred: " + error.message;

	if (!isLoading && !isObject(data.Body))
		return (
			<>
				X??ta:
				<span style={{ color: "red" }}>{data}</span>
			</>
		);

	return (
		<div className="custom_display">
			<Row className="header_row">
				<Col xs={24} md={24} xl={4}>
					<div className="page_heder_left">
						<h2>M??nf????t v?? Z??r??r</h2>
					</div>
				</Col>
				<Col xs={24} md={24} xl={20}>
					<div className="page_heder_right">
						<div className="buttons_wrapper">
							<FilterButton
								display={isOpenProfitFilter}
								setdisplay={setIsOpenProfitFilter}
							/>
							<FastSearch className="search_header" />
							{/* <SearchByDate
								from="profit"
								getSearchObjByDate={getSearchObjByDate}
								defaultCheckedDate={3}
							/> */}
							<div>{downloadButton}</div>
						</div>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={24}>
					<FilterComponent
								from="profit"
						settings={filterSetting}
						cols={filters}
						display={isOpenProfitFilter}
                        advanced={advacedProfit}
                        setAdvance={setAdvaceProfit}
                        initialFilterForm={formProfit}
                        setInitialFilterForm={setFormProfit}
					/>
				</Col>
			</Row>
			{isFetchSearchByDate && <Spin />}
			<Table
				id="profit-table"
				loading={isLoading || isFetchSearchByDate}
				className="short-table"
				columns={columns}
				pagination={false}
				dataSource={documentList}
				locale={{ emptyText: isFetching ? <Spin /> : "C??dv??l bo??dur" }}
			/>
		</div>
	);
}
