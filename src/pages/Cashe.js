import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import TableCustom from "../components/TableCustom";
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
import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import enters from "../ButtonsNames/Enters/buttonsNames";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { isObject } from "../config/function/findadditionals";
const { Text } = Typography;

export default function Cashe() {
    const [direction, setDirection] = useState(1);
    const [defaultdr, setDefaultDr] = useState("");
    const [initialSort, setInitialSort] = useState("");
    const [fieldSort, setFieldSort] = useState("");
    const [allsum, setallsum] = useState(0);
    const [page, setPage] = useState(0);
    const [filtered, setFiltered] = useState(false);
    const { marks, isFilter, advancedPage, doSearch, search, advanced } =
        useTableCustom();

    const [documentList, setDocumentList] = useState([]);
    const { isLoading, error, data, isFetching } = useQuery(
        ["cashes", page, direction, fieldSort, doSearch, search, advanced],
        () => {
            return isFilter === true
                ? fetchFilterPage(advancedPage, advanced, direction, fieldSort)
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
                title: "Madd??",
            },
            {
                dataIndex: "Balance",
                title: "M??bl????",
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
        ];
    }, [defaultdr, initialSort, filtered, marks, advancedPage]);

    useEffect(() => {
        if (!isFetching) {
			if (isObject(data.Body)) {
				setDocumentList(data.Body.List);
				setallsum(data.Body.AllSum);
			}
        } else {
            setDocumentList([]);
        }
    }, [isFetching]);
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );

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
                columns={columns}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell className="table-summary">
                            <Text type="">C??m</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell className="table-summary">
                            <Text type="">
                                {" "}
                                {allsum}
                                <sup>???</sup>
                            </Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
                locale={{ emptyText: isFetching ? <Spin /> : "C??dv??l bo??dur" }}
                pagination={false}
                dataSource={documentList}
            />
        </div>
    );
}
