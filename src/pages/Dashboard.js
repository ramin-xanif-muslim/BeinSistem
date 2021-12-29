import { Col, Row, Switch, Select, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import style from "./Dashboard.module.css";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";
import { Line, Pie, G2 } from "@ant-design/charts";
import sendRequest from "../config/sentRequest";

function Dashboard() {
    const [data, setData] = useState({});
    useEffect(async () => {
        // let res = await sendRequest("dashboard/get.php", {});
        // setData(res.cards);
    }, []);

    const { Option } = Select;

    function handleChange(value) {
        console.log(`selected ${value}`);
    }

    return (
        <div id="dashboard" className={style.div}>
            <div className={style.dashboardHeader}>
                <h1>Göstəricilər</h1>
                <DatePicker picker="month" placeholder="Tarixi seçin" />
            </div>
            <Row>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>SATIŞLAR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>₼ 1253.56</p>
                        <div className={style.footer}>
                            <span className={style.percent}>
                                {true ? (
                                    <ArrowUpOutlined
                                        style={{ color: "#00c900" }}
                                    />
                                ) : (
                                    <ArrowDownOutlined
                                        style={{ color: "#ff0000" }}
                                    />
                                )}
                                <p>33.85%</p>
                            </span>
                            <p className={style.ptext}>
                                <i>dünənə nisbətən</i>
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>BORCLAR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Borc (Alacaq):</span> 1253.56 ₼
                        </p>
                        <p className={style.amount}>
                            <span>Borc (Verəcək):</span> 1253.56 ₼
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>KOMİSYON SATIŞ</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>₼ 1253.56</p>
                        <div className={style.footer}>
                            <span className={style.percent}>
                                {true ? (
                                    <ArrowUpOutlined
                                        style={{ color: "#00c900" }}
                                    />
                                ) : (
                                    <ArrowDownOutlined
                                        style={{ color: "#ff0000" }}
                                    />
                                )}
                                <p>33.85%</p>
                            </span>
                            <p className={style.ptext}>
                                <i>dünənə nisbətən</i>
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>ANBAR QALIĞI</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Maya:</span>1253.56 ₼
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>MƏNFƏƏT</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>₼ 1253.56</p>
                        <div className={style.footer}>
                            <span className={style.percent}>
                                {true ? (
                                    <ArrowUpOutlined
                                        style={{ color: "#00c900" }}
                                    />
                                ) : (
                                    <ArrowDownOutlined
                                        style={{ color: "#ff0000" }}
                                    />
                                )}
                                <p>33.85%</p>
                            </span>
                            <p className={style.ptext}>
                                <i>dünənə nisbətən</i>
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>ÖDƏNİŞLƏR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Mədaxil:</span>1253.56 ₼
                        </p>
                        <p className={style.amount}>
                            <span>Məxaric:</span>1253.56 ₼
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>SİFARİŞLƏR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Rezerv:</span>1253.56 ₼
                        </p>
                        <p className={style.amount}>
                            <span>Hazırlanıb:</span>1253.56 ₼
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>KAPİTAL</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Məbləğ:</span>1253.56 ₼
                        </p>
                    </div>
                </Col>
            </Row>
            <Row className={style.row}>
                <Col className={style.col} xs={24} md={24} xl={14}>
                    <div className={style.analiticHeader}>
                        <div className={style.analiticSelectText}>
                            <h2> QRAFİK</h2>
                            <Select
                                className={style.analiticSelect}
                                defaultValue="1"
                                onChange={handleChange}
                            >
                                <Option value="1">SATIŞ</Option>
                                <Option value="2">MƏNFƏƏT</Option>
                                <Option value="3">KAPİTAL</Option>
                            </Select>
                        </div>
                        <div className={style.time}>
                            <p>30 gün</p>
                            <Switch className={style.switch} />
                            <p>2022-ci il</p>
                            <div className={style.profit}>
                                <p>₼ 1253.56</p>
                                <div
                                    className={style.dflex}
                                    style={
                                        true
                                            ? { color: "#00c900" }
                                            : { color: "red" }
                                    }
                                >
                                    {true ? (
                                        <CaretUpOutlined
                                            style={{ color: "#00c900" }}
                                        />
                                    ) : (
                                        <CaretDownOutlined
                                            style={{ color: "red" }}
                                        />
                                    )}

                                    <p>21.80 %</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DemoLine />
                </Col>
                <Col className={style.col} xs={24} md={24} xl={10}>
                    <h2 style={{ margin: "auto" }}>BALANS</h2>
                    <DemoPie />
                </Col>
            </Row>
        </div>
    );
}

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

const DemoPie = () => {
    const G = G2.getEngine("canvas");
    const data = [
        {
            type: "Sahibkar",
            value: 250,
        },
        {
            type: "Kassa",
            value: 1250,
        },
        {
            type: "Balans",
            value: 850,
        },
    ];
    const cfg = {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 0.75,
        legend: false,
        label: {
            type: "spider",
            labelHeight: 40,
            formatter: (data, mappingData) => {
                const group = new G.Group({});
                group.addShape({
                    type: "circle",
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 40,
                        height: 50,
                        r: 5,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: "text",
                    attrs: {
                        x: 10,
                        y: 8,
                        text: `${data.type}`,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: "text",
                    attrs: {
                        x: 0,
                        y: 35,
                        text: `${data.value}₼ \n${(data.percent * 100).toFixed(
                            2
                        )}%`,
                        fill: "rgba(0, 0, 0, 0.65)",
                        fontWeight: 700,
                    },
                });
                return group;
            },
        },
        interactions: [
            {
                type: "element-selected",
            },
            {
                type: "element-active",
            },
        ],
    };
    const config = cfg;
    return <Pie {...config} />;
};

export default Dashboard;
