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
                dataIndex: "Name",
                title: "Malın adı",
            },
            {
                dataIndex: "BarCode",
                title: "Barkodu",
            },
            {
                dataIndex: "Unique",
                title: "Ölçü vahidi",
                render: (value, row, index) => {
                    if (row.IsPack === 1) {
                        return "paket";
                    } else {
                        return "əd";
                    }
                },
            },
            {
                dataIndex: "Quantity",
                title: "Miqdar",
                render: (value, row, index) => {
                    return ConvertFixedPositionInvoice(value)
                },
            },
            {
                dataIndex: "Price",
                title: "Qiymət",
                render: (value, row, index) => {
                    return ConvertFixedPositionInvoice(value);
                },
            },
            {
                dataIndex: "TotalPrice",
                title: "Məbləğ",
                render: (value, row, index) => {
                    return ConvertFixedPosition(row.Price * row.Quantity);
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
                if (props.location.hash.slice(1) != "enters") {
                    const cus = await fetchCustomersData(
                        res.Body.List[0].CustomerId
                    );
                    setCusInfo(cus.Body);
                    setDatas(res.Body.List[0]);
                    setInfo(res.Body);
                    if(res.Body.List[0]?.Positions) {
                        const result = Object.values(res.Body.List[0].Positions);
                        setDocumentList(result);
                    }
                    setLoading(false);
                    setTimeout(() => {
                        window.print();
                    }, 200);
                } else {
                    setDatas(res.Body.List[0]);
                    setInfo(res.Body);
                    const result = Object.values(res.Body.List[0].Positions);
                    setDocumentList(result);
                    setLoading(false);
                    setTimeout(() => {
                        window.print();
                    }, 200);
                }
            }
        }
    };

    if (loading) return <div>Yüklənir...</div>;
    return (
        <div className="invoice">
            {console.log(datas.Positions)}
            <div className="invoice_header">
                <h1 className="header_name">HESAB-FAKTURA</h1>
            </div>
            <div className="invoice_main_info">
                <div className="invoice_main_info_wrapper">
                    <div className="invoice_main_info_part number_wrapper">
                        <p>Hesab-faktura №:</p>
                        <p>{datas.Name}</p>
                    </div>
                    <div className="invoice_main_info_part date_wrapper">
                        <p>Tarix:</p>
                        <p>{moment().format("YYYY-MM-DD HH:mm")}</p>
                    </div>
                </div>
            </div>
            <Divider style={{ backgroundColor: "black" }} dashed={false} />
            <div className="invoice_supplier_part">
                <div className="invoice_main_info_part market cusnames">
                    <p>Mal göndərən :</p>
                    <p>
                        {props.location.hash.slice(1) === "supplies"
                            ? datas.CustomerName
                            : localStorage.getItem("companyname")}
                    </p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>Ünvan :</p>
                    <p>...</p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>Telefon :</p>
                    <p>{JSON.parse(localStorage.getItem("company")).Mobile}</p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>Bank rekvizitləri :</p>
                    <p>
                        {props.location.hash.slice(1) === "supplies"
                            ? datas.Phone
                            : JSON.parse(localStorage.getItem("company"))
                                  .Mobile}
                    </p>

                    <p></p>
                </div>
            </div>
            <Divider style={{ backgroundColor: "black" }} dashed={false} />
            <div className="invoice_buyer_part">
                <div className="invoice_main_info_part market cusnames">
                    <p>Mal alan :</p>
                    <p>
                        {props.location.hash.slice(1) === "supplies"
                            ? localStorage.getItem("companyname")
                            : datas.CustomerName}
                    </p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>VÖEN :</p>
                    <p></p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>Ünvan :</p>
                    <p></p>
                </div>
                <div className="invoice_main_info_part market">
                    <p>Telefon :</p>
                    <p>
                        {props.location.hash.slice(1) === "supplies"
                            ? JSON.parse(localStorage.getItem("company")).Mobile
                            : datas.Phone}
                    </p>
                </div>
            </div>

            <Table
                rowKey="Id"
                className="invoicetable"
                columns={columns}
                dataSource={documentList}
                pagination={false}
                size="small"
            />
            <Divider className="total_price_divider">
                {String(datas.Amount).split(".")[0]} manat{" "}
                {String(datas.Amount).split(".")[1].slice(0,2)} qəp.
                {console.log((datas.Amount).split(".")[1].slice(0,2))}
            </Divider>
            <div className="invoice_buyer_part">
                {props.location.hash.slice(1) != "enters" ? (
                    <>
                        {console.log(cusInfo)}
                        <div className="invoice_main_info_part market customerinfo">
                            <p>Qalıq borc :</p>
                            <p>
                                {ConvertFixedPositionInvoice(cusInfo.Debt)}{" "}
                                {" ₼"}
                            </p>
                        </div>
                        <div className="invoice_main_info_part market customerinfo">
                            <p>Son ödəmə :</p>
                            <p>
                                {ConvertFixedPositionInvoice(
                                    cusInfo.LastTransaction
                                )}{" "}
                                {" ₼"}
                            </p>
                        </div>
                    </>
                ) : null}

                {/* <div className="invoice_main_info_part market customerinfo">
          <p>Qalıq borc :</p>
          <p>
            {this.props.state.groups.customerDebt} {" ₼"}
          </p>
        </div>
        <div className="invoice_main_info_part market customerinfo">
          <p>Son ödəmə :</p>
          <p>
            {this.props.state.groups.customerLastTransaction} {" ₼"}
          </p>
        </div> */}

                <div className="invoice_main_info_part market customerinfo companyname">
                    <div className="firstCol cols">
                        <p>{localStorage.getItem("companyname")} :</p>
                        <p>_____</p>
                    </div>
                    <div className="secondCol cols">
                        <p>Təhvil verdi :</p>
                        <p> _____</p>
                    </div>
                    <div className="thirdCol cols">
                        <p>Təhvil aldı :</p>
                        <p> _____</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
