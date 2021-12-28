import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import style from "./Dashboard.module.css";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import sendRequest from "../config/sentRequest";

function Dashboard() {
    const [data, setData] = useState({});
    useEffect(async () => {
        let res = await sendRequest("dashboard/get.php",{});
        setData(res.cards)
        console.log(res.cards)
    },[]);

    let datas = [
        {
            id: 1,
            name: "SATIŞLAR",
            date: "12 Dekabr 2021",
        },
    ];

    let statistic = (
        <div className={style.statistic}>
            <div className={style.header}>
                <p className={style.name}>SATIŞLAR</p>
                <p className={style.date}>12 Dekabr 2021</p>
            </div>
            <hr />
            <p className={style.amount}>₼ 1236.50</p>
            <div className={style.footer}>
                <span className={style.percent}>
                    {true ? (
                        <ArrowUpOutlined style={{ color: "#00c900" }} />
                    ) : (
                        <ArrowDownOutlined style={{ color: "#ff0000" }} />
                    )}
                    <p>33.87%</p>
                </span>
                <p className={style.ptext}>dünənə nisbətən</p>
            </div>
        </div>
    );

    return (
        <div id="dashboard" className={style.div}>
            <h1>Göstəricilər</h1>
            <Row>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
            </Row>
            {/* <Row>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
                <Col xs={24} md={24} xl={6}>
                    {statistic}
                </Col>
            </Row> */}
            <Row>
                <DemoLine />
            </Row>
        </div>
    );
}

export default Dashboard;



const DemoLine = () => {
    const data = [
        {
            year: "1991",
            Məbləğ: 3,
        },
        {
            year: "1992",
            Məbləğ: 4,
        },
        {
            year: "1993",
            Məbləğ: 3.5,
        },
        {
            year: "1994",
            Məbləğ: 5,
        },
        {
            year: "1995",
            Məbləğ: 4.9,
        },
        {
            year: "1996",
            Məbləğ: 6,
        },
        {
            year: "1997",
            Məbləğ: 7,
        },
        {
            year: "1998",
            Məbləğ: 9,
        },
        {
            year: "1999",
            Məbləğ: 13,
        },
    ];
    const config = {
        data,
        xField: "year",
        yField: "Məbləğ",
        label: {},
        point: {
            size: 5,
            shape: "diamond",
            style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: "#000",
                    fill: "red",
                },
            },
        },
        interactions: [
            {
                type: "marker-active",
            },
        ],
    };
    return <Line className={style.chart} {...config} />;
};
