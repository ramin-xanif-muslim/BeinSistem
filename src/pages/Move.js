import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import { Alert, Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";
import { ConvertFixedTable } from "../config/function/findadditionals";
import Buttons from "../components/Button";
import { Button } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";

import { SettingOutlined } from "@ant-design/icons";
import { useCustomForm } from "../contexts/FormContext";
import sendRequest from "../config/sentRequest";
import SearchByDate from "../components/SearchByDate";
const { Text } = Typography;
export default function Move() {
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
        advanced,
        setdisplay,
        display,
    } = useTableCustom();
    const { setSaveFromModal, setRedirectSaveClose } = useCustomForm();

    const [documentList, setDocumentList] = useState([]);
    const { isLoading, error, data, isFetching } = useQuery(
        ["moves", page, direction, fieldSort, doSearch, search, advanced],
        () => {
            return isFilter === true
                ? fetchFilterPage(
                      "moves",
                      advancedPage,
                      advanced,
                      direction,
                      fieldSort
                  )
                : doSearch
                ? fecthFastPage("moves", page, search)
                : !isFilter && !doSearch
                ? fetchPage("moves", page, direction, fieldSort)
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
    }, [columnChange, filtered]);

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
                dataIndex: "Name",
                title: "Yerdəyişmə №",
                className: "linkedColumns",
                show: initial
                    ? Object.values(initial).find((i) => i.dataIndex === "Name")
                          .show
                    : true,
                defaultSortOrder: initialSort === "Name" ? defaultdr : null,
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
                dataIndex: "StockFromName",
                title: "Anbardan",
                defaultSortOrder:
                    initialSort === "StockFromName" ? defaultdr : null,
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "StockFromName"
                      ).show
                    : true,
                sorter: (a, b) => null,
            },

            {
                dataIndex: "StockToName",
                title: "Anbara",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "StockToName"
                      ).show
                    : true,
                defaultSortOrder:
                    initialSort === "StockToName" ? defaultdr : null,
                sorter: (a, b) => null,
            },

            {
                dataIndex: "Mark",
                title: "Status",
                sort: true,
                show: initial
                    ? Object.values(initial).find((i) => i.dataIndex === "Mark")
                          .show
                    : true,
                showCustomFormatter: true,
                defaultSortOrder: initialSort === "Mark" ? defaultdr : null,
                sorter: (a, b) => null,
                render: (value, row, index) => {
                    console.log(value);
                    return (
                        <span
                            className="status_label"
                            style={{
                                backgroundColor: markObject
                                    ? markObject.find((m) => m.id === value)
                                        ? markObject.find((m) => m.id === value)
                                              .Name === "-"
                                            ? ""
                                            : markObject.find(
                                                  (m) => m.id === value
                                              ).Color
                                        : ""
                                    : null,
                            }}
                        >
                            {markObject
                                ? markObject.find((m) => m.id === value)
                                    ? markObject.find((m) => m.id === value)
                                          .Name === "-"
                                        ? ""
                                        : markObject.find((m) => m.id === value)
                                              .Name
                                    : ""
                                : null}
                        </span>
                    );
                },
            },
            {
                dataIndex: "Description",
                title: "Şərh",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Description"
                      ).show
                    : true,
                defaultSortOrder:
                    initialSort === "Description" ? defaultdr : null,
                sorter: (a, b) => null,
            },
            {
                dataIndex: "Modify",
                title: "Dəyişmə tarixi",
                show: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Modify"
                      ).show
                    : false,
                defaultSortOrder: initialSort === "Modify" ? defaultdr : null,
                sorter: (a, b) => null,
            },
        ];
    }, [defaultdr, initialSort, filtered, marks, advancedPage]);

    const filters = useMemo(() => {
        return [
            {
                key: "1",
                label: "Yerdəyişmə №",
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
                label: "Anbardan",
                name: "stockNameFrom",
                type: "select",
                controller: "stocks",
                dataIndex: "stockNameFrom",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "stockNameFrom"
                      ).show
                    : true,
            },
            {
                key: "4",
                label: "Anbara",
                name: "stockNameTo",
                type: "select",
                controller: "stocks",
                dataIndex: "stockNameTo",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "stockNameTo"
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
                type: "date",
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
    }, []);
    useEffect(() => {
        if (!isFetching) {
            setDocumentList(data.Body.List);
            setallsum(data.Body.AllSum);
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
    const getSearchObjByDate = async (ob) => {
        setFetchSearchByDate(true);
        let res = await sendRequest("moves/get.php", ob);
        setDocumentList(res.List);
        setallsum(res.AllSum);
        setFetchSearchByDate(false);
    };
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;

    if (redirect) return <Redirect push to={`/editMove/${editId}`} />;
    return (
        <div className="custom_display">
            <Row className="header_row">
                <Col xs={24} md={24} xl={4}>
                    <div className="page_heder_left">
                        <h2>Yerdəyişmə</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <Buttons
                                text={"Yerdəyişmə"}
                                redirectto={"/newmove"}
                                animate={"Yarat"}
                            />
                            <Button
                                className="filter_button buttons_click"
                                onClick={() =>
                                    display === "none"
                                        ? setdisplay("block")
                                        : setdisplay("none")
                                }
                                content="Filter"
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
                    <FilterComponent settings={filterSetting} cols={filters} />
                </Col>
            </Row>
            {isFetchSearchByDate && <Spin />}
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
                    total: data.Body.Count,
                    onChange: handlePagination,
                    defaultPageSize: data.Body.Limit,
                    showSizeChanger: false,
                }}
                size="small"
                onRow={(r) => ({
                    onClick: (e) => editPage(r.Id),
                    // onDoubleClick: () => editPage(r.Id),
                })}
            />
        </div>
    );
}
