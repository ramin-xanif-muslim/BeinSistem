import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";
import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import { ConvertFixedTable, isObject } from "../config/function/findadditionals";

import { SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;

const SettlementsDrawer = React.lazy(() =>
    import("../components/SettlementsDrawer")
);
export default function Settlement() {
    const [redirect, setRedirect] = useState(false);
    const [direction, setDirection] = useState(1);
    const [defaultdr, setDefaultDr] = useState("descend");
    const [initialSort, setInitialSort] = useState("Moment");
    const [fieldSort, setFieldSort] = useState("Moment");
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
    const { isLoading, error, data, isFetching } = useQuery(
        ["settlements", page, direction, fieldSort, doSearch, search, advanced],
        () => {
            return isFilter === true
                ? fetchFilterPage(
                      "settlements",
                      advancedPage,
                      advanced,
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
                render: (text, record, index) => index + 1 + 25 * advancedPage,
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
                type: "date",
                dataIndex: "createdDate",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "createdDate"
                      ).show
                    : true,
            },
            {
                key: "4",
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
                key: "5",
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
                key: "6",
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
            if (isObject(data.Body)) {
                setDocumentList(data.Body.List);
                setallinsum(data.Body.AllInSum);
                setalloutsum(data.Body.AllOutSum);
                setallcurrentsum(
                    parseFloat(data.Body.AllInSum + data.Body.AllOutSum)
                );
            }
        } else {
            setDocumentList([]);
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
        console.log(initialCols);
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
            <Button className="flex_directon_col_center">
                {" "}
                <SettingOutlined />
            </Button>
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
    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    if (redirect) return <Redirect push to={`/editEnter/${editId}`} />;

    if (!isObject(data.Body))
        return (
            <>
                Xəta:
                <span style={{ color: "red" }}>
                    Serverdə xəta baş verdi : {data}
                </span>
            </>
        );

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
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={1}>
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
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} xl={24}>
                    <FilterComponent cols={filters} />
                </Col>
            </Row>
            <Table
                id="settlement-table"
                className="short-table"
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
                                <Table.Summary.Cell>
                                    <Text type="">
                                        {c.dataIndex === "CustomerName" ? (
                                            <span>Cəm</span>
                                        ) : c.dataIndex === "PayIn" ? (
                                            <span>
                                                {allinsum}
                                                <sup>₼</sup>
                                            </span>
                                        ) : c.dataIndex === "PayOut" ? (
                                            <span>
                                                {alloutsum}
                                                <sup>₼</sup>
                                            </span>
                                        ) : c.dataIndex === "Current" ? (
                                            <span>
                                                {allcurrentsum}
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
                    total: data.Body.Count,
                    onChange: handlePagination,
                    defaultPageSize: 100,
                    showSizeChanger: false,
                }}
                size="small"
                onRow={(r) => ({
                    onDoubleClick: () => editPage(r.CustomerId, r),
                    onClick: (e) => editClickPage(e, r.Id),
                })}
            />
            {visibleDrawer ? <SettlementsDrawer /> : null}
        </div>
    );
}
