import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage, fetchStocks } from "../api";

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

import Buttons from "../components/Button";
import { useTableCustom } from "../contexts/TableContext";

import { SettingOutlined } from "@ant-design/icons";
import { ConvertFixedTable } from "../config/function/findadditionals";
const { Text } = Typography;

export default function SalePoint() {
    const [redirect, setRedirect] = useState(false);
    const [direction, setDirection] = useState(1);
    const [defaultdr, setDefaultDr] = useState("descend");
    const [initialSort, setInitialSort] = useState("");
    const [fieldSort, setFieldSort] = useState("");
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState(0);
    const [filtered, setFiltered] = useState(false);

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
        stocks,
        setStock,
        setStockLocalStorage,
    } = useTableCustom();

    const [documentList, setDocumentList] = useState([]);
    const { isLoading, error, data, isFetching } = useQuery(
        ["salepoints", page, direction, fieldSort, doSearch, search, advanced],
        () => {
            return isFilter === true
                ? fetchFilterPage(
                      "salepoints",
                      advancedPage,
                      advanced,
                      direction,
                      fieldSort
                  )
                : doSearch
                ? fecthFastPage("salepoints", page, search)
                : !isFilter && !doSearch
                ? fetchPage("salepoints", page, direction, fieldSort)
                : null;
        }
    );
    useEffect(() => {
        setColumnChange(false);
        if (filtered) setFiltered(false);
    }, [columnChange, filtered]);

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
                title: "Sat???? n??qt??si",
                show: initial
                    ? Object.values(initial).find((i) => i.dataIndex === "Name")
                          .show
                    : true,
                defaultSortOrder: initialSort === "Name" ? defaultdr : null,
                sorter: (a, b) => null,
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
                    : true,
                sorter: (a, b) => null,
            },

            {
                dataIndex: "StockName",
                title: "Anbar ad??",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "StockName"
                      ).show
                    : true,
                render: (value, row, index) => {
                    if (Array.isArray(stocks)) {
                        return stocks.findIndex((s) => s.Id === row.StockId) !==
                            -1
                            ? stocks.find((s) => s.Id === row.StockId).Name
                            : "";
                    } else {
                        return "";
                    }
                },
            },
            {
                dataIndex: "CashBalance",
                title: "Kassa balans??",
                defaultSortOrder:
                    initialSort === "CashBalance" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "CashBalance"
                      ).show
                    : true,
                sorter: (a, b) => null,
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
        ];
    }, [defaultdr, initialSort, filtered, marks, advancedPage, stocks]);

    const getStocks = async () => {
        const stockResponse = await fetchStocks();
        setStock(stockResponse.Body.List);
        setStockLocalStorage(stockResponse.Body.List);
    };

    useEffect(() => {
        getStocks();
        setInitial(columns);
    }, []);
    useEffect(() => {
        if (!isFetching) {
            setDocumentList(data.Body.List);
        } else {
            setDocumentList([]);
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

    useEffect(() => {
        setdisplay("none");
    }, []);

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
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;
    if (redirect) return <Redirect push to={`/editSalePoint/${editId}`} />;

    return (
        <div className="custom_display">
            <Row className="header_row">
                <Col xs={24} md={24} xl={4}>
                    <div className="page_heder_left">
                        <h2>Sat???? n??qt??l??ri</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <Buttons
                                text={"Yeni sat???? n??qt??si"}
                                redirectto={"/newsalepoint"}
                                animate={"Yarat"}
                            />
                        </div>
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
                    </div>
                </Col>
            </Row>

            <Table
                className="main-table"
                rowKey="Name"
                columns={columns.filter((c) => c.show == true)}
                onChange={onChange}
                dataSource={documentList}
                rowClassName={(record, index) =>
                    record.Status === 0 ? "unchecked" : ""
                }
                locale={{ emptyText: isFetching ? <Spin /> : "C??dv??l bo??dur" }}
                pagination={{
                    current: advancedPage + 1,
                    total: data.Body.Count,
                    onChange: handlePagination,
                    defaultPageSize: data.Body.Limit,
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
