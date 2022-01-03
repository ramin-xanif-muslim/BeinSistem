import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

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
import { SettingOutlined } from "@ant-design/icons";
import MyFastSearch from "../components/MyFastSearch";
import sendRequest from "../config/sentRequest";

const { Text } = Typography;
export default function StockBalance() {
    const [count, setCount] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [direction, setDirection] = useState(0);
    const [defaultdr, setDefaultDr] = useState("ascend");
    const [filterChanged, setFilterChanged] = useState(false);
    const [initialSort, setInitialSort] = useState("Quantity");
    const [fieldSort, setFieldSort] = useState("Quantity");
    const [allsum, setallsum] = useState(0);
    const [allquantity, setallquantity] = useState(0);
    const [allcost, setallcost] = useState(0);
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState(0);
    const [filtered, setFiltered] = useState(false);
    const [columnChange, setColumnChange] = useState(false);
    const [initial, setInitial] = useState(null);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const [initialfilter, setInitialFilter] = useState(null);
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

    const searchFunc = async (value) => {
        setStockbalanceSearchTerm(value);
        let obj = {
            nm: value,
            lm: 25,
        };
        let res = await sendRequest("stockbalance/get.php", obj);
        setDocumentList(res.List);
        setallsum(res.SaleSum);
        setallcost(res.CostSum);
        setallquantity(res.QuantitySum);
        setCount(res.Count)
    };

    const [documentList, setDocumentList] = useState([]);
    const { isLoading, error, data, isFetching } = useQuery(
        [
            "stockbalance",
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
                      "stockbalance",
                      advancedPage,
                      advanced,
                      direction,
                      fieldSort,
                      null,
                      3,
                      0
                  )
                : doSearch
                ? fecthFastPage("stockbalance", page, search)
                : !isFilter && !doSearch
                ? fetchPage(
                      "stockbalance",
                      page,
                      direction,
                      fieldSort,
                      null,
                      3,
                      0
                  )
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
                render: (text, record, index) => index + 1 + 25 * advancedPage,
            },
            {
                dataIndex: "ProductName",
                title: "Məhsulun adı",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "ProductName"
                      ).show
                    : true,
                defaultSortOrder:
                    initialSort === "ProductName" ? defaultdr : null,
                sorter: (a, b) => null,
                className:
                    initialSort === "ProductName"
                        ? "linkedColumns activesort"
                        : "linkedColumns",
            },
            {
                dataIndex: "BarCode",
                title: "Barkodu",
                defaultSortOrder: initialSort === "BarCode" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "BarCode"
                      ).show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "BarCode" ? "activesort" : "",
            },
            // {
            //     dataIndex: "StockName",
            //     title: "Yerləşdiyi Anbar",
            //     sort: true,
            //     defaultSortOrder: initialSort === "StockName" ? defaultdr : null,
            //     show: initial
            //         ? Object.values(initial).find(
            //               (i) => i.dataIndex === "StockName"
            //           ).show
            //         : true,
            //     sorter: (a, b) => null,
            //     className: initialSort === "StockName" ? "activesort" : "",
            // },
            {
                dataIndex: "ArtCode",
                title: "Artkodu",
                sort: true,
                defaultSortOrder: initialSort === "ArtCode" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "ArtCode"
                      ).show
                    : false,
                sorter: (a, b) => null,
                className: initialSort === "ArtCode" ? "activesort" : "",
            },

            {
                dataIndex: "Quantity",
                title: "Miqdar",
                defaultSortOrder: initialSort === "Quantity" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Quantity"
                      ).show
                    : true,
                className: initialSort === "Quantity" ? "activesort" : "",
                sorter: (a, b) => null,
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },

            {
                dataIndex: "CostPrice",
                title: "Maya qiyməti",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "CostPrice"
                      ).show
                    : true,
                defaultSortOrder:
                    initialSort === "CostPrice" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "CostPrice" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                dataIndex: "Amount",
                title: "Cəm Maya",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Amount"
                      ).show
                    : true,
                defaultSortOrder: initialSort === "Amount" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "Amount" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                dataIndex: "Price",
                title: "Satış qiyməti",
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
                dataIndex: "SalePrice",
                title: "Cəm Satış",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "SalePrice"
                      ).show
                    : true,
                defaultSortOrder:
                    initialSort === "SalePrice" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "SalePrice" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                dataIndex: "BuyPrice",
                title: "Alış qiyməti",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "BuyPrice"
                      ).show
                    : false,
                defaultSortOrder: initialSort === "BuyPrice" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "BuyPrice" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },

            {
                dataIndex: "Moment",
                title: "Tarixi",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Moment"
                      ).show
                    : false,
                defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "Moment" ? "activesort" : "",
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
                label: "Maya dəyəri",
                name: "docPrice",
                start: "costprb",
                end: "costpre",
                type: "range",
                dataIndex: "docPrice",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "docPrice"
                      ).show
                    : true,
            },
            {
                key: "6",
                label: "Satış qiyməti",
                name: "salePrice",
                start: "prb",
                end: "pre",
                type: "range",
                dataIndex: "salePrice",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "salePrice"
                      ).show
                    : true,
            },
            {
                key: "7",
                label: "Anbar qalığı",
                name: "docPriceBlnc",
                start: "blncb",
                end: "blnce",
                type: "range",
                dataIndex: "docPriceBlnc",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "docPriceBlnc"
                      ).show
                    : true,
            },
            {
                key: "8",
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
                key: "9",
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
                key: "9",
                label: "Siyahı",
                name: "zeros",
                controller: "yesno",
                default: 3,
                type: "selectDefaultZeros",
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
        if (!isFetching) {
            setDocumentList(data.Body.List);
            setallsum(data.Body.SaleSum);
            setallcost(data.Body.CostSum);
            setallquantity(data.Body.QuantitySum);
            setIsFilter(false);
            setCount(data.Body.Count);
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
            <Button className="flex_directon_col_center">
                {" "}
                <SettingOutlined />
            </Button>
        </Dropdown>
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
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;

    return (
        <div className="custom_display">
            <Row className="header_row">
                <Col xs={24} md={24} xl={4}>
                    <div className="page_heder_left">
                        <h2>Anbar qalığı</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <Button
                                className="filter_button buttons_click"
                                onClick={() =>
                                    display === "none"
                                        ? setdisplay("block")
                                        : setdisplay("none")
                                }
                                content="Filter"
                            />
                            {/* <FastSearch className="search_header" /> */}
                            <MyFastSearch
                                searchFunc={searchFunc}
                                setSearchTerm={setStockbalanceSearchTerm}
                                searchTerm={stockbalanceSearchTerm}
                                className="search_header"
                            />
                        </div>

                        <div>{tableSettings}</div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} xl={24}>
                    <FilterComponent
                        from="stockbalance"
                        settings={filterSetting}
                        cols={filters}
                    />
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
                summary={() => (
                    <Table.Summary.Row>
                        {columns
                            .filter((c) => c.show === true)
                            .map((c) => (
                                <Table.Summary.Cell>
                                    <Text type="">
                                        {c.dataIndex === "ProductName"
                                            ? "Cəm"
                                            : c.dataIndex === "Amount"
                                            ? ConvertFixedTable(allcost) + " ₼"
                                            : c.dataIndex === "Quantity"
                                            ? ConvertFixedTable(allquantity) +
                                              "əd"
                                            : c.dataIndex === "SalePrice"
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
                    total: count,
                    onChange: handlePagination,
                    defaultPageSize: data.Body.Limit,
                    showSizeChanger: false,
                }}
                size="small"
            />
        </div>
    );
}
