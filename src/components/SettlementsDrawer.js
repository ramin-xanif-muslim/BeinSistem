import { useState, useEffect } from "react";
import { useCustomForm } from "../contexts/FormContext";
import { fetchDebt, fetchLinkedDoc, saveDoc } from "../api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTableCustom } from "../contexts/TableContext";
import { useMemo } from "react";
import { Table } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import FilterComponent from "../components/FilterComponent";

import {
	Form,
	Input,
	Button,
	InputNumber,
	TreeSelect,
	Checkbox,
	Dropdown,
	DatePicker,
	Switch,
	Select,
	Spin,
	Tag,
	Divider,
	Menu,
	Drawer,
	Typography,
	Statistic,
	Popconfirm,
	Row,
	Col,
	message,
	Collapse,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { ConvertFixedTable } from "../config/function/findadditionals";
import MyAntDate from "./MyAntDate";
import MyReactDate from "./MyReactDate";
const { Option } = Select;
const { TextArea } = Input;
function SettlementsDrawer() {
	const {
		docstock,
		setDocStock,
		docmark,
		setDocMark,
		setLoadingForm,
		setStockDrawer,
		stockDrawer,
		createdStock,
		setCreatedStock,
		visibleDrawer,
		setVisibleDrawer,
		cusid,
		setcusid,
	} = useCustomForm();
	const {
		productGroups,
		setAttrLoading,
		setAttributes,
		attributes,
		setAttrLocalStorage,
		setPrices,
		prices,
		setPricesLocalStorage,
		setRefList,
		search,
		setFastSearch,
		doSearch,
		setDoSearch,
		isFilter,
		setIsFilter,
		advanced,
		setAdvance,
		advancedPage,
		setAdvancedPage,
		productcols,
		setproductcols,
		productcolsinitials,
		setproductcolsinitials,
		searchGr,
		setSearchGr,
	} = useTableCustom();
	const { stocks, setStockLocalStorage } = useTableCustom();
	const [documentList, setDocumentList] = useState([]);
	const [page, setPage] = useState(0);

	const { isLoading, error, data, isFetching } = useQuery(
		["linkedDoc", cusid, page, visibleDrawer],
		() => (visibleDrawer ? fetchLinkedDoc(cusid, page) : null)
	);
	const onClose = () => {
		setVisibleDrawer(false);
		setDocumentList([]);
		setcusid(null);
	};

	const columns = useMemo(() => {
		return [
			{
				dataIndex: "Order",
				title: "№",
				show: true,
				render: (text, record, index) => index + 1 + 15 * page,
			},
			{
				dataIndex: "Name",
				title: "Adı",
			},
			{
				dataIndex: "DocType",
				title: "Sənədin növü",
				render: (value, row, index) => {
					switch (value) {
						case "Return":
							return "Pərakəndə Qaytarma";
						case "Sale":
							return "Pərakəndə Satış";
						case "PaymentOut":
							return "Məxaric nəğd";
						case "PaymentIn":
							return "Mədaxil nəğd";
						case "Supply":
							return "Alış";
						case "Demand":
							return "Satış";
						default:
							break;
					}
				},
			},
			{
				dataIndex: "Moment",
				title: "Tarix",
			},
			{
				dataIndex: "Amount",
				title: "Məbləğ",
			},
			{
				dataIndex: "SalePointName",
				title: "Satış nöqtəsi",
			},
		];
	}, [page]);
	const handlePagination = (pg) => {
		setPage(pg - 1);
	};
	useEffect(() => {
		if (!isFetching) {
			console.log(data.Body.List);
			setDocumentList(data.Body.List);
		} else {
			setDocumentList([]);
		}
	}, [isFetching]);
	if (error) return "An error has occurred: " + error.message;

	return (
		<Drawer
			title="Əlaqəli sənədlər"
			placement="right"
			width={1200}
			onClose={onClose}
			visible={visibleDrawer}
		>
			{isLoading ? (
				"Loading..."
			) : error ? (
				`error occured ${error.message}`
			) : (
				<div>
					<RowAnderTable
						document={documentList ? documentList : ""}
					/>
					<Table
						rowKey="Id"
						columns={columns}
						className="drawertable"
						dataSource={documentList}
						locale={{ emptyText: <Spin /> }}
						pagination={{
							current: page + 1,
							total: data.Body.Count,
							onChange: handlePagination,
							defaultPageSize: data.Body.Limit,
							showSizeChanger: false,
						}}
						size="small"
					/>
				</div>
			)}
		</Drawer>
	);
}

export default SettlementsDrawer;

const RowAnderTable = (props) => {
	const [debt, setDebt] = useState();
    const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
      useState(true);

	const filters = [
		{
			key: "1",
			label: "Tarixi",
			name: "createdDate",
			type: "date",
			dataIndex: "createdDate",
		},
	];
    const handleVisibleChangeFilter = (flag) => {
      setVisibleMenuSettingsFilter(flag);
    };

	const onChangeMenuFilter = (e) => {
		var initialCols = filters;
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
	};
	const filtermenus = (
		<Menu>
			<Menu.ItemGroup title="Sutunlar">
				{filters
					? Object.values(filters).map((d) => (
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
			<Button className="flex_directon_col_center">
				{" "}
				<SettingOutlined />
			</Button>
		</Dropdown>
	);
	if (props.document[0]) {
		const fetchDebtCustomer = async () => {
			let res = await fetchDebt(props.document[0].CustomerId);
			console.log(res.Body.Debt);
			setDebt(res.Body.Debt);
		};
		fetchDebtCustomer();
		return (
			<div style={{ display: "flex" }}>
				<div>Müştəri adı : {props.document[0].CustomerName}</div>
				<div>Qalıq borc : {ConvertFixedTable(debt)}</div>
				<div>
					<MyAntDate />
					{/* <MyReactDate /> */}
				</div>
				<button>Çap et</button>
			</div>
		);
	}
	return null;
};