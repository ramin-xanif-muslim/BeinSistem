import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";

import Buttons from "../components/Button";
import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import enters from "../ButtonsNames/Enters/buttonsNames";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { SettingOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function Cashe() {
    const [redirect, setRedirect] = useState(false);
    const [direction, setDirection] = useState(1);
    const [defaultdr, setDefaultDr] = useState("");
    const [initialSort, setInitialSort] = useState("");
    const [fieldSort, setFieldSort] = useState("");
    const [allsum, setallsum] = useState(0);
    const [allprofit, setallprofit] = useState(0);
    const [allbonus, setallbonus] = useState(0);
    const [allbank, setallbank] = useState(0);
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState(0);
    const [filtered, setFiltered] = useState(false);
    const [expandedRowKeys, setexpandedRowKeys] = useState(["4"]);
    const [children, setChildren] = useState([]);
    const [columnChange, setColumnChange] = useState(false);
    const [initial, setInitial] = useState(null);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const {
        marks,
        setMarkLocalStorage,
        setMark,
        isFilter,
        advancedPage,
        setAdvancedPage,
        doSearch,
        search,
        advanced,
        setdisplay,
        display,
    } = useTableCustom();

    const [documentList, setDocumentList] = useState([]);
    const [document, setDocument] = useState({});
    const { isLoading, error, data, isFetching } = useQuery(
        ["cashes", page, direction, fieldSort, doSearch, search, advanced],
        () => {
            return isFilter === true
                ? fetchFilterPage(
                      "cashes",
                      advancedPage,
                      advanced,
                      direction,
                      fieldSort
                  )
                : doSearch
                ? fecthFastPage("cashes", page, search)
                : !isFilter && !doSearch
                ? fetchPage("cashes", page, direction, fieldSort)
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
                title: "Maddə",
            },
            {
                dataIndex: "Balance",
                title: "Məbləğ",
            },
        ];
    }, [defaultdr, initialSort, filtered, marks, advancedPage]);

    useEffect(() => {
        if (!isFetching) {
            setDocumentList(data.Body.List);
            setallsum(data.Body.AllSum);
        } else {
            setDocumentList([]);
        }
    }, [isFetching]);
    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div className="custom_display">
            <Row className="header_row">
                <Col xs={24} md={24} xl={4}>
                    <div className="page_heder_left">
                        <h2>Balans</h2>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={20}>
                    <div className="page_heder_right">
                        <div className="buttons_wrapper">
                            <FastSearch className="search_header" />
                        </div>
                    </div>
                </Col>
            </Row>

            <Table
                id="cashes-table"
                className="short-table"
                locale={{ emptyText: <Spin /> }}
                columns={columns}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell>
                            <Text type="">Cəm</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                            <Text type="">
                                {" "}
                                {allsum}
                                <sup>₼</sup>
                            </Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
                locale={{ emptyText: isFetching ? <Spin /> : "Cədvəl boşdur" }}
                pagination={false}
                dataSource={documentList}
            />
        </div>
    );
}
