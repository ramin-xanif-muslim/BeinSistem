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
import {
    SettingOutlined,
    DownOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import MyFastSearch from "../components/MyFastSearch";
import sendRequest from "../config/sentRequest";
import FastSearch from "../components/FastSearch";
import { downloadFile } from "../config/function";

const { Text } = Typography;
export default function ProductTransactions() {
    const [count, setCount] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [direction, setDirection] = useState(0);
    const [defaultdr, setDefaultDr] = useState("ascend");
    const [filterChanged, setFilterChanged] = useState(false);
    const [initialSort, setInitialSort] = useState("Quantity");
    const [fieldSort, setFieldSort] = useState("Quantity");
    const [allquantity, setallquantity] = useState(0);
    const [allcost, setallcost] = useState(0);
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState(0);
    const [filtered, setFiltered] = useState(false);
    const [columnChange, setColumnChange] = useState(false);
    const [initial, setInitial] = useState(null);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const [initialfilter, setInitialFilter] = useState(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
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

    const [tabls, setTables] = useState(null);
    const tablsTitles = [
        "Daxilolma",
        "Silinmə",
        "Yerdəyişmə",
        "Alış",
        "Təchizatçılara qaytarmalar",
        "Satışlar",
        "Alıcıların qaytarmaları",
        "Satışlar",
    ];

    const [documentList1, setDocumentList1] = useState([]);
    const [documentList2, setDocumentList2] = useState([]);
    const [documentList3, setDocumentList3] = useState([]);
    const [documentList4, setDocumentList4] = useState([]);
    const [documentList5, setDocumentList5] = useState([]);
    const [documentList6, setDocumentList6] = useState([]);
    const [documentList7, setDocumentList7] = useState([]);
    const [documentList8, setDocumentList8] = useState([]);
    const { isLoading, error, data, isFetching } = useQuery(
        [
            "producttransactions",
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
                      "producttransactions",
                      advancedPage,
                      advanced,
                      direction
                  )
                : doSearch
                ? fecthFastPage("producttransactions", page, search)
                : !isFilter && !doSearch
                ? fetchPage("producttransactions", page, direction)
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
                title: "Məhsulun adı",
                show: initial
                    ? Object.values(initial).find((i) => i.dataIndex === "Name")
                          .show
                    : true,
                defaultSortOrder: initialSort === "Name" ? defaultdr : null,
                sorter: (a, b) => null,
                className:
                    initialSort === "Name"
                        ? "linkedColumns activesort"
                        : "linkedColumns",
            },
            {
                dataIndex: "Barcode",
                title: "Barkodu",
                defaultSortOrder: initialSort === "Barcode" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Barcode"
                      ).show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Barcode" ? "activesort" : "",
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
                dataIndex: "sQuantity",
                title: "Miqdar",
                defaultSortOrder:
                    initialSort === "sQuantity" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "sQuantity"
                      ).show
                    : true,
                className: initialSort === "sQuantity" ? "activesort" : "",
                sorter: (a, b) => null,
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },

            {
                dataIndex: "Price",
                title: "Qiyməti",
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
                dataIndex: "sPrice",
                title: "Məbləg",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "sPrice"
                      ).show
                    : true,
                defaultSortOrder: initialSort === "sPrice" ? defaultdr : null,
                sorter: (a, b) => null,
                className: initialSort === "sPrice" ? "activesort" : "",
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
        setTables([
            {
                title: "Daxilolma",
                documentList: documentList1[0],
                allSum: documentList1[1],
            },
            {
                title: "Silinmə",
                documentList: documentList2[0],
                allSum: documentList2[1],
            },
            {
                title: "Yerdəyişmə",
                documentList: documentList3[0],
                allSum: documentList3[1],
            },
            {
                title: "Alış",
                documentList: documentList4[0],
                allSum: documentList4[1],
            },
            {
                title: "Təchizatçılara qaytarmalar",
                documentList: documentList5[0],
                allSum: documentList5[1],
            },
            {
                title: "Satışlar",
                documentList: documentList6[0],
                allSum: documentList6[1],
            },
            {
                title: "Alıcıların qaytarmaları",
                documentList: documentList7[0],
                allSum: documentList7[1],
            },
            {
                title: "Satışlar",
                documentList: documentList8[0],
                allSum: documentList8[1],
            },
        ]);
    }, [documentList1[0]]);
    useEffect(() => {
        setInitial(columns);
        setInitialFilter(filters);
    }, []);

    useEffect(() => {
        if (!isFetching) {
            setDocumentList1([
                data.Body.demandreturns,
                data.Body.demandreturnsSum,
            ]);
            setDocumentList2([data.Body.demands, data.Body.demandsSum]);
            setDocumentList3([data.Body.enters, data.Body.entersSum]);
            setDocumentList4([data.Body.losses, data.Body.lossesSum]);
            setDocumentList5([data.Body.moves, data.Body.movesSum]);
            setDocumentList6([data.Body.sales, data.Body.salesSum]);
            setDocumentList7([data.Body.supplies, data.Body.suppliesSum]);
            setDocumentList8([
                data.Body.supplyreturns,
                data.Body.supplyreturnsSum,
            ]);
            setIsFilter(false);
        }
    }, [isFetching]);

    const editPage = (id) => {
        setRedirect(true);
        setEditId(id);
    };

    const handlePagination = (pg) => {
        console.log("handlePagination", pg);
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
    let tablesComponents;
    if (tabls) {
        tablesComponents = tabls.map((table) => {
            const { title, documentList, allSum } = table;
            return (
                <div>
                    <h4 className="producttransactions-header">{title}</h4>
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
                                                {c.dataIndex === "ProductName"
                                                    ? "Cəm"
                                                    : c.dataIndex === "sPrice"
                                                    ? ConvertFixedTable(
                                                          allSum
                                                      ) + " ₼"
                                                    : null}
                                            </Text>
                                        </Table.Summary.Cell>
                                    ))}
                            </Table.Summary.Row>
                        )}
                        locale={{
                            emptyText: isFetching ? <Spin /> : "Cədvəl boşdur",
                        }}
                        pagination={{ position: ["none", "none"] }}
                        size="small"
                    />
                </div>
            );
        });
    }
    
    const printMenu = (
        <Menu>
            <Menu.Item key="1" icon={<FileExcelOutlined />} onClick={() => downloadFile(advanced, "xlsx", "producttransactions")}>
                Excel
            </Menu.Item>
            <Menu.Item key="2" icon={<FilePdfOutlined />} onClick={() => downloadFile(advanced, "pdf", "producttransactions")}>
                PDF
            </Menu.Item>
        </Menu>
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
                        <h2>Dövriyyə</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <button
                                className="new-button"
                                onClick={() =>
                                    display === "none"
                                        ? setdisplay("block")
                                        : setdisplay("none")
                                }
                            >
                                Filter
                            </button>
                            <FastSearch className="search_header" />
                        </div>

                        <div>
                            <Dropdown overlay={printMenu}>
                                <Button
                                    className="buttons_click"
                                >
                                    <DownloadOutlined />
                                    <span style={{ marginLeft: "5px" }}>
                                        Yüklə
                                    </span>
                                </Button>
                            </Dropdown>

                            {tableSettings}
                        </div>
                    </div>
                </Col>
            </Row>
            {isLoadingSearch && <Spin />}
            <Row>
                <Col xs={24} md={24} xl={24}>
                    <FilterComponent
                        from="producttransactions"
                        settings={filterSetting}
                        cols={filters}
                    />
                </Col>
            </Row>

            {tablesComponents && tablesComponents}
        </div>
    );
}
