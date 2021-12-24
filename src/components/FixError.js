import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import { fetchSpendItems, delSpendItems, updateSpendItem } from "../api";
import { Redirect } from "react-router-dom";
import { Divider } from "antd";
import MaskedInput from "antd-mask-input";
import { ConvertFixedTable } from "../config/function/findadditionals";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    Col,
    Row,
    Form,
    Input,
    Button,
    Popconfirm,
    TreeSelect,
    Select,
    Switch,
    Modal,
    message,
    Spin,
} from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { fetchErrors } from "../api";
let lang = {
    PaymentIn: "Mədaxil nağd",
    InvoiceIn: "Mədaxil nağdsız",
    NewPaymentIn: "Mədaxil",
    PaymentChoose: "Seçim",
    PaymentOut: "Məxaric nağd",
    InvoiceOut: "Məxaric nağdsız",
    NewPaymentOut: "Məxaric ",
    Demand: "Satış",
    Supply: "Alış",
    Enter: "Daxilolma",
    Loss: "Silinmə",
    Sale: "Pərakəndə Satış",
    Return: "Pərakəndə Qaytarma",
    Move: "Yerdəyişmə",
    DemandReturn: "Satış qaytarma",
    SupplyReturn: "Alış qaytarma",
};
function FixError() {
    const { isLoading, error, data, isFetching } = useQuery(["erros"], () =>
        fetchErrors()
    );

    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    const expandedRowRender = (e, datas) => {
        const columns = [
            { title: "Sənəd növü", dataIndex: "DocType", key: "doctype" },
            { title: "Miqdar", dataIndex: "Quantity", key: "quantity" },
            { title: "Qalıq", dataIndex: "SumQ", key: "sumq" },
            { title: "Maya", dataIndex: "Price", key: "price" },
            { title: "Tarix", dataIndex: "Moment", key: "moment" },
        ];

        const data = [];
        for (let i = 0; i < Object.keys(datas).length; ++i) {
            for (let a = 0; a < Object.keys(datas[i]).length; a++) {
                if (datas[i][a] && datas[i][a].DocType === e.key) {
                    Object.values(datas[i]).forEach((d) => {
                        if (d.Price != null) {
                            data.push({
                                key: Math.random(),
                                DocType: lang[d.DocType],
                                Quantity: ConvertFixedTable(d.Quantity),
                                SumQ: ConvertFixedTable(d.SumQ),
                                Price: ConvertFixedTable(d.Price),
                                Moment: d.Moment,
                            });
                        }
                    });
                }
            }
        }

        return (
            <Table
                columns={columns}
                className="nestedTableError"
                rowClassName={(record) =>
                    record.SumQ < 0 ? "minus_errors" : "pilus_errors"
                }
                dataSource={data}
                pagination={false}
            />
        );
    };

    const cols = [
        {
            dataIndex: "DocType",
            key: "doctype",
            title: "Ad/Barkod",
        },
    ];
    const datas = [];

    for (let i = 0; i < Object.keys(data.Body.List).length; ++i) {
        for (let a = 0; a < Object.keys(data.Body.List[i]).length; a++) {
            if (data.Body.List[i][a] && data.Body.List[i][a].Price === null) {
                datas.push({
                    key: data.Body.List[i][a].DocType,
                    DocType: data.Body.List[i][a].DocType,
                });
            }
        }
    }
    return (
        <Row className="table_holder_section">
            <Row className="filter_table_wrapper_row doc">
                <Table
                    className="components-table-demo-nested fixederrodtable"
                    columns={cols}
                    rowClassName={() => "barcodewrapper"}
                    pagination={false}
                    expandedRowRender={(e) =>
                        expandedRowRender(e, data.Body.List)
                    }
                    dataSource={datas}
                />
            </Row>
        </Row>
    );
}

export default FixError;
