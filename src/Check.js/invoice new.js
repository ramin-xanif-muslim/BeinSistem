import React from "react";
import { Divider } from "antd";
import {
    ConvertFixedTable,
    ConvertFixedPositionInvoice,
    ConvertFixedPosition,
} from "../config/function/findadditionals";
import { useParams } from "react-router-dom";
import { fetchCheck } from "../api";
import { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import moment from "moment";
import { useMemo } from "react";
import { Table } from "antd";

import { getBcTemplate, getBcTemplateMain, fetchCustomersData } from "../api";
export default function Invoice(props) {
    const { nav, setNav } = useTableCustom();
    const [print, setPrint] = useState(false);
    const [datas, setDatas] = useState(null);
    const [documentList, setDocumentList] = useState([]);
    const [info, setInfo] = useState(null);
    const [cusInfo, setCusInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setNav("none");
        getCheckDatas();
        return () => {
            setNav("block");
        };
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: "№",
                dataIndex: "Order",
                render: (text, record, index) => index + 1,
            },
            {
                dataIndex: "CustomerName",
                title: "Tərəf müqabil",
            },
            {
                dataIndex: "Moment",
                title: "Tarix",
            },
            {
                dataIndex: "Payins",
                title: "Borc (alacaq)",
                render: (value, row, index) => {
                    if (row.IsPack === 1) {
                        return "paket";
                    } else {
                        return "əd";
                    }
                },
            },
            {
                dataIndex: "Payouts",
                title: "Borc (verəcək)",
                render: (value, row, index) => {
                },
            },
            {
                dataIndex: "Amount",
                title: "Cari vəziyyət",
                render: (value, row, index) => {
                    return ConvertFixedPositionInvoice(value);
                },
            },
        ];
    }, [datas, info]);

    const getCheckDatas = async () => {
        const res = await fetchCheck(
            props.location.hash.slice(1),
            props.location.search.substring(1)
        );

        if (res.Headers.ResponseStatus === "0") {
            if (props.location.hash.slice(1)) {
                setDocumentList(res.Body.List);
                console.log(res.Body.List)
                setLoading(false);
                // setTimeout(() => {
                //     window.print();
                // }, 200);
            }
        }
    };

    if (loading) return <div>Yüklənir...</div>;
    return (
        <div className="invoice">
            <div className="invoice_header">
                <h1 className="header_name">HESAB-FAKTURA</h1>
            </div>

            <Table
                rowKey="Id"
                className="invoicetable"
                columns={columns}
                dataSource={documentList}
                pagination={false}
                size="small"
            />
        </div>
    );
}
