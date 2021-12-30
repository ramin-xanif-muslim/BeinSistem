import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import CustomerGroup from "../components/CustomerGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import { Button, Icon } from "semantic-ui-react";
import { ConvertFixedTable } from "../config/function/findadditionals";
export default function Customer() {
    const [initialfilter, setInitialFilter] = useState(null);
    const [filterChanged, setFilterChanged] = useState(false);
    const [filterChange, setFilterChange] = useState(false);
    const [filterColumns, setFilterColumns] = useState([]);
    const [openmenu, setopenmenu] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState(0);
    const [columnadd, setColumnAdd] = useState(false);
    const [productList, setProdutcList] = useState([]);

    const [otherColumns, setOtherColumns] = useState([]);
    const [filtered, setFiltered] = useState(false);
    const [direction, setDirection] = useState(1);
    const [defaultdr, setDefaultDr] = useState("descend");
    const [initialSort, setInitialSort] = useState("GroupName");
    const [fieldSort, setFieldSort] = useState("GroupName");
    const [columnChange, setColumnChange] = useState(false);
    const [initial, setInitial] = useState(null);
    const [menus, setMenu] = useState(null);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

    const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
        useState(false);
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
        setdisplay,
        display,
    } = useTableCustom();

    const filters = useMemo(() => {
        return [
            {
                key: "1",
                label: "Adı",
                name: "customerName",
                type: "text",
                dataIndex: "customerName",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "customerName"
                      ).show
                    : true,
                className: "linkedColumns",
            },
            {
                key: "2",
                label: "Kart №",
                name: "card",
                type: "text",
                dataIndex: "card",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "card"
                      ).show
                    : true,
            },
            {
                key: "3",
                label: "Telefon",
                name: "phone",
                type: "text",
                dataIndex: "phone",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "phone"
                      ).show
                    : true,
            },

            {
                key: "4",
                label: "Bonus",
                name: "bonus",
                start: "bonusb",
                end: "bonuse",
                type: "range",
                dataIndex: "bonus",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "bonus"
                      ).show
                    : true,
            },
            {
                key: "5",
                label: "Endirim",
                name: "discount",
                start: "disb",
                end: "dise",
                type: "range",
                dataIndex: "discount",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "discount"
                      ).show
                    : true,
            },
            {
                key: "6",
                label: "Müştəri Qrupu",
                name: "gp",
                controller: "customergroups",
                type: "select",
                dataIndex: "gp",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "gp"
                      ).show
                    : true,
            },
            {
                key: "7",
                label: "Email",
                name: "email",
                type: "text",
                dataIndex: "email",
                show: initialfilter
                    ? Object.values(initialfilter).find(
                          (i) => i.dataIndex === "email"
                      ).show
                    : true,
            },
        ];
    }, [filterChanged]);

    const handleVisibleChangeFilter = (flag) => {
        setVisibleMenuSettingsFilter(flag);
    };

    useEffect(() => {
        setInitialFilter(filters);
        if (filterChanged) setFilterChanged(false);
    }, [filterChanged]);
    const onChangeMenuFilter = (e) => {
        var initialCols = initialfilter;
        var findelement;
        var findelementindex;
        var replacedElement;
        console.log(e.target.id);
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

    const columns = useMemo(() => {
        return [
            {
                dataIndex: "Order",
                title: "№",
                show: true,
                render: (text, record, index) => index + 1 + 25 * advancedPage,
            },
            {
                dataIndex: "Name",
                title: "Müştəri adı",
                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
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
                dataIndex: "Card",
                title: "Kart",
                defaultSortOrder:
                    initialSort === "BarCardCode" ? defaultdr : null,
                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Card").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Card" ? "activesort" : "",
            },
            {
                dataIndex: "Phone",
                title: "Telefon",
                defaultSortOrder: initialSort === "Phone" ? defaultdr : null,

                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Phone").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Phone" ? "activesort" : "",
            },
            {
                dataIndex: "GroupName",
                title: "Qrup",
                defaultSortOrder:
                    initialSort === "GroupName" ? defaultdr : null,
                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "GroupName").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "GroupName" ? "activesort" : "",
            },
            {
                dataIndex: "Discount",
                title: "Endirim",
                defaultSortOrder: initialSort === "Discount" ? defaultdr : null,

                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Discount").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Discount" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                dataIndex: "Bonus",
                title: "Bonus",
                defaultSortOrder: initialSort === "Bonus" ? defaultdr : null,

                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Bonus").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Bonus" ? "activesort" : "",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                dataIndex: "Mail",
                title: "Mail",
                defaultSortOrder: initialSort === "Mail" ? defaultdr : null,
                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Mail").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Mail" ? "activesort" : "",
            },
            {
                dataIndex: "Description",
                defaultSortOrder:
                    initialSort === "Description" ? defaultdr : null,
                title: "Şərh",
                show: JSON.parse(localStorage.getItem("customercolumns"))
                    ? Object.values(
                          JSON.parse(localStorage.getItem("customercolumns"))
                      ).find((i) => i.dataIndex === "Description").show
                    : true,
                sorter: (a, b) => null,
                className: initialSort === "Description" ? "activesort" : "",
            },
        ];
    }, [defaultdr, direction, fieldSort, filtered, advancedPage]);

    useEffect(() => {
        setColumnChange(false);
        if (filtered) setFiltered(false);
    }, [columnChange, filtered]);

    useEffect(() => {
        setInitial(columns);
        setInitialFilter(filters);
        if (!localStorage.getItem("customercolumns")) {
            localStorage.setItem("customercolumns", JSON.stringify(columns));
        }
    }, []);
    const { isLoading, error, data, isFetching } = useQuery(
        [
            "customers",
            page,
            direction,
            fieldSort,
            doSearch,
            search,
            advanced,
            searchGr,
        ],
        () => {
            return isFilter === true
                ? fetchFilterPage(
                      "customers",
                      advancedPage,
                      advanced,
                      direction,
                      fieldSort,
                      searchGr
                  )
                : doSearch
                ? fecthFastPage("customers", advancedPage, search, searchGr)
                : !isFilter && !doSearch
                ? fetchPage(
                      "customers",
                      advancedPage,
                      direction,
                      fieldSort,
                      searchGr
                  )
                : null;
        }
    );

    useEffect(() => {
        if (!isFetching) {
            setProdutcList(data.Body.List);
        } else {
            setProdutcList([]);
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

    const onChangeMenu = (e) => {
        var initialCols = JSON.parse(localStorage.getItem("customercolumns"));

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
        localStorage.setItem("customercolumns", JSON.stringify(initialCols));

        setFiltered(true);
    };

    const handleVisibleChange = (flag) => {
        setVisibleMenuSettings(flag);
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
            <Button className="flex_directon_col_center">
                <SettingOutlined />
            </Button>
        </Dropdown>
    );
    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    if (redirect) return <Redirect to={`/editCustomer/${editId}`} />;
    return (
        <div className="custom_display">
            <Row className="header_row">
                <Col xs={24} md={24} xl={4}>
                    <div className="page_heder_left">
                        <h2>Tərəf-müqabillər</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <Buttons
                                text={"Yeni Müştəri"}
                                redirectto={"/newcustomer"}
                                animate={"Yarat"}
                            />
                            <Buttons
                                text={"Yeni Qrup"}
                                redirectto={"/newcusgroup"}
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
                                content="Filter"
                            />
                            <FastSearch className="search_header" />
                        </div>
                        {tableSettings}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} xl={24}>
                    <FilterComponent
                        from={"products"}
                        settings={filterSetting}
                        cols={filters}
                    />
                </Col>
            </Row>{" "}
            <Row>
                <Col xs={24} md={24} xl={4}>
                    <CustomerGroup />
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <Table
                        className="main-table"
                        rowKey="Id"
                        columns={columns.filter((c) => c.show == true)}
                        dataSource={productList}
                        onChange={onChange}
                        pagination={{
                            current: advancedPage + 1,
                            total: data.Body.Count,
                            onChange: handlePagination,
                            defaultPageSize: data.Body.Limit,
                            showSizeChanger: false,
                        }}
                        locale={{
                            emptyText: isFetching ? <Spin /> : "Cədvəl boşdur",
                        }}
                        size="small"
                        onRow={(r) => ({
                            onDoubleClick: () => editPage(r.Id),
                        })}
                    />
                </Col>
            </Row>
        </div>
    );
}
