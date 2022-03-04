import { useState, useEffect } from "react";
import { useCustomForm } from "../contexts/FormContext";
import { fetchDebt, fetchLinkedDoc } from "../api";
import { useQuery } from "react-query";
import { useMemo } from "react";
import { Table } from "antd";

import { Button, Spin, Drawer } from "antd";
import { ConvertFixedTable } from "../config/function/findadditionals";
import MyReactDate from "./MyReactDate";
import { useDownload } from "../hooks/useDownload";
import { useCheck } from "../hooks/useCheck";
function SettlementsDrawer() {
    const { visibleDrawer, setVisibleDrawer, cusid, setcusid } =
        useCustomForm();
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
                title: "Sənəd nömrəsi",
                className: "linkedColumns",
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

                        case "InvoiceIn":
                            return "Mədaxil nağdsız";
                        case "InvoiceOut":
                            return "Məxaric nağdsız";
                        case "CreditPayOut":
                            return "Mədaxil nağd kassadan";
                        case "CreditPayIn":
                            return "Məxaric nağd kassadan";
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
            setDocumentList(data.Body.List);
        } else {
            setDocumentList([]);
        }
    }, [isFetching]);
    if (error) return "An error has occurred: " + error.message;

    return (
        <Drawer
            title="Üzləşmə aktı"
            placement="right"
            width={1200}
            onClose={onClose}
            visible={visibleDrawer}
        >
            {isLoading ? (
                "Yüklənir..."
            ) : error ? (
                `error occured ${error.message}`
            ) : (
                <div>
                    <RowAnderTable
                        cusid={cusid}
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
    const advanced = {
        token: localStorage.getItem("access-token"),
        cus: props.cusid,
    }

    const [ downloadButton ] = useDownload(advanced,'documents')
    const [checkComponent] = useCheck(props.cusid, 'settlements')

    if (props.document[0]) {
        const fetchDebtCustomer = async () => {
            let res = await fetchDebt(props.document[0].CustomerId);
            setDebt(res.Body.Debt);
        };
        fetchDebtCustomer();
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "1rem",
                }}
            >
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <h1 style={{ fontWeight: "600", color: "#041A3A" }}>
                        {props.document[0].CustomerName}
                    </h1>
                    {checkComponent}
                    {/* {downloadButton}
                    <Button type="primary">Çap et</Button> */}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "250px",
                            alignItems: "end",
                            marginRight: "2rem",
                        }}
                    >
                        <p style={{ margin: "0" }}>Bu tarixə:</p>
                        <MyReactDate className="my-date-picker" />
                    </span>
                    <p style={{ color: "#1164B1" }}>
                        Qalıq borc:{" "}
                        <span
                            style={
                                ConvertFixedTable(debt) < 0
                                    ? { color: "red", fontWeight: "600" }
                                    : { color: "#000", fontWeight: "600" }
                            }
                        >
                            {ConvertFixedTable(debt)}
                            <sup>₼</sup>
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};
