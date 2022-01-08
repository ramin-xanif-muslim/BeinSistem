import { Col, Row, Switch, Select, DatePicker, Spin, Alert } from "antd";
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
import { ConvertFixedTable } from "../config/function/findadditionals";
import { each, findIndex } from "@antv/util";

function Dashboard() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        let res = await sendRequest("dashboard/get.php", {});
        setData(res);
        setLoading(false);
    }, []);

    const { Option } = Select;

    function handleChange(value) {
        console.log(`selected ${value}`);
    }
    if (loading) {
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );
    }

    // var result = money / 100 * tallage;
    let percentS;
    let percentP;
    let percentC;
    if (data) {
        percentS = (
            (data.Sales.PrevAmount / 100) *
            data.Sales.CurrAmount
        ).toFixed(2);
        percentP = (
            (data.Profits.PrevAmount / 100) *
            data.Profits.CurrAmount
        ).toFixed(2);
        percentC = (
            (data.Comission.PrevAmount / 100) *
            data.Comission.CurrAmount
        ).toFixed(2);
    }

    return (
        <div id="dashboard" className={style.div}>
            <div className={style.dashboardHeader}>
                <h1>Göstəricilər</h1>
                <DatePicker
                    bordered={false}
                    picker="month"
                    placeholder="Tarixi seçin"
                />
            </div>
            <Row>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>SATIŞLAR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            ₼{" "}
                            {data
                                ? ConvertFixedTable(data.Sales.CurrAmount)
                                : ""}
                        </p>
                        <div className={style.footer}>
                            <span
                                className={style.percent}
                                style={
                                    percentP > -1
                                        ? { color: "#00c900" }
                                        : { color: "#ff0000" }
                                }
                            >
                                {percentS > -1 ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )}
                                <p
                                    style={
                                        percentP > -1
                                            ? { color: "#00c900" }
                                            : { color: "#ff0000" }
                                    }
                                >
                                    {percentS}%
                                </p>
                            </span>
                            <p className={style.ptext}></p>
                        </div>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>BORCLAR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Borc (Alacaq):</span>{" "}
                            {data
                                ? ConvertFixedTable(data.Settlements.Credit)
                                : ""}{" "}
                            ₼
                        </p>
                        <p className={style.amount}>
                            <span>Borc (Verəcək):</span>{" "}
                            {data ? data.Settlements.Debt : ""} ₼
                        </p>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>KOMİSYON SATIŞ</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            ₼{" "}
                            {data
                                ? ConvertFixedTable(data.Comission.Sales)
                                : ""}
                        </p>
                        <div className={style.footer}>
                            <span
                                className={style.percent}
                                style={
                                    percentC > -1
                                        ? { color: "#00c900" }
                                        : { color: "#ff0000" }
                                }
                            >
                                {percentC > -1 ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )}
                                <p
                                    style={
                                        percentC > -1
                                            ? { color: "#00c900" }
                                            : { color: "#ff0000" }
                                    }
                                >
                                    {percentC}%
                                </p>
                            </span>
                            <p className={style.ptext}></p>
                        </div>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>ANBAR QALIĞI</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Maya:</span>
                            {data
                                ? ConvertFixedTable(data.StockedBalance.Amount)
                                : ""}{" "}
                            ₼
                        </p>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>MƏNFƏƏT</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            ₼{" "}
                            {data && ConvertFixedTable(data.Profits.CurrAmount)}
                        </p>
                        <div className={style.footer}>
                            <span
                                className={style.percent}
                                style={
                                    percentP > -1
                                        ? { color: "#00c900" }
                                        : { color: "#ff0000" }
                                }
                            >
                                {percentP > -1 ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )}
                                <p
                                    style={
                                        percentP > -1
                                            ? { color: "#00c900" }
                                            : { color: "#ff0000" }
                                    }
                                >
                                    {percentP}%
                                </p>
                            </span>
                        </div>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>ÖDƏNİŞLƏR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Mədaxil:</span>
                            {data && ConvertFixedTable(data.Payments.Payins)} ₼
                        </p>
                        <p className={style.amount}>
                            <span>Məxaric:</span>
                            {data && ConvertFixedTable(data.Payments.Payouts)} ₼
                        </p>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>SİFARİŞLƏR</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Rezerv:</span>
                            {data && ConvertFixedTable(data.Orders.Reserved)} ₼
                        </p>
                        <p className={style.amount}>
                            <span>Hazırlanıb:</span>
                            {data && ConvertFixedTable(data.Orders.Prepared)} ₼
                        </p>
                    </div>
                </Col>
                <Col xs={6} sm={6} md={6} xl={6}>
                    <div className={style.statistic}>
                        <div className={style.header}>
                            <p className={style.name}>KAPİTAL</p>
                            <p className={style.date}>Bu gün</p>
                        </div>
                        <hr />
                        <p className={style.amount}>
                            <span>Məbləğ:</span>
                            {data && ConvertFixedTable(data.Capital.Amount)} ₼
                        </p>
                    </div>
                </Col>
            </Row>
            <Row className={style.demoLineRow}>
                <Col className={style.col} xs={14} md={14} xl={14}>
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
                            <p>12 ay</p>
                            <div className={style.profit}>
                                <p className={style.bold}>1253.56 ₼</p>
                            </div>
                        </div>
                    </div>
                    {data && <DemoLine charts={data.Charts} />}
                </Col>
                <Col className={style.col} xs={10} sm={10} md={10} xl={10}>
                    <h2 style={{ margin: "auto" }}>BALANS</h2>
                    {data && <DemoPie balances={data ? data.Balances : ""} />}
                </Col>
            </Row>
        </div>
    );
}

const DemoLine = ({charts}) => {

    const { InteractionAction, registerInteraction, registerAction } = G2;

    console.log(charts)
    let lastDay = charts.Sales[0].Moment.slice(8)
    console.log(num)
    let num = Number(lastDay) - 1
    console.log(num)
    let arr;
    for (num; num < Number(lastDay); num++) {
        
     }




    // const data = charts.Sales.map( d => {
    //     num = Number(num) + 1
    //     if(num <= 9) {
    //         num = "0" + `${num}`
    //     }
    //     console.log(num)
    //     let year = d.Moment.slice(0,8)
    //     year = year + num
    //     console.log('year',year)
    //     return(
    //         {
    // 			year: year,
    // 			value: ConvertFixedTable(Number(d.Amount)),
    //         }
    //     )})
    //     console.log(charts)


    const data = [
        {
            year: "1991",
            value: 3,
        },
        {
            year: "1992",
            value: 4,
        },
        {
            year: "1993",
            value: 3.5,
        },
        {
            year: "1994",
            value: 5,
        },
        {
            year: "1995",
            value: 4.9,
        },
        {
            year: "1996",
            value: 6,
        },
        {
            year: "1997",
            value: 7,
        },
        {
            year: "1998",
            value: 9,
        },
        {
            year: "1999",
            value: 13,
        },
    ];
    G2.registerShape("point", "custom-point", {
        draw(cfg, container) {
            const point = {
                x: cfg.x,
                y: cfg.y,
            };
            const group = container.addGroup();
            group.addShape("circle", {
                name: "outer-point",
                attrs: {
                    x: point.x,
                    y: point.y,
                    fill: cfg.color || "#0288d1",
                    opacity: 0.5,
                    r: 6,
                },
            });
            group.addShape("circle", {
                name: "inner-point",
                attrs: {
                    x: point.x,
                    y: point.y,
                    fill: cfg.color || "#1164b1",
                    opacity: 1,
                    r: 2,
                },
            });
            return group;
        },
    });

    class CustomMarkerAction extends InteractionAction {
        active() {
            const view = this.getView();
            const evt = this.context.event;

            if (evt.data) {
                const { items } = evt.data;
                const pointGeometries = view.geometries.filter(
                    (geom) => geom.type === "point"
                );
                each(pointGeometries, (pointGeometry) => {
                    each(pointGeometry.elements, (pointElement, idx) => {
                        const active =
                            findIndex(
                                items,
                                (item) => item.data === pointElement.data
                            ) !== -1;
                        const [point0, point1] =
                            pointElement.shape.getChildren();

                        if (active) {
                            // outer-circle
                            point0.animate(
                                {
                                    r: 10,
                                    opacity: 0.2,
                                },
                                {
                                    duration: 1800,
                                    easing: "easeLinear",
                                    repeat: true,
                                }
                            ); // inner-circle

                            point1.animate(
                                {
                                    r: 6,
                                    opacity: 0.4,
                                },
                                {
                                    duration: 800,
                                    easing: "easeLinear",
                                    repeat: true,
                                }
                            );
                        } else {
                            this.resetElementState(pointElement);
                        }
                    });
                });
            }
        }

        reset() {
            const view = this.getView();
            const points = view.geometries.filter(
                (geom) => geom.type === "point"
            );
            each(points, (point) => {
                each(point.elements, (pointElement) => {
                    this.resetElementState(pointElement);
                });
            });
        }

        resetElementState(element) {
            const [point0, point1] = element.shape.getChildren();
            point0.stopAnimate();
            point1.stopAnimate();
            const { r, opacity } = point0.get("attrs");
            point0.attr({
                r,
                opacity,
            });
            const { r: r1, opacity: opacity1 } = point1.get("attrs");
            point1.attr({
                r: r1,
                opacity: opacity1,
            });
        }

        getView() {
            return this.context.view;
        }
    }

    registerAction("custom-marker-action", CustomMarkerAction);
    registerInteraction("custom-marker-interaction", {
        start: [
            {
                trigger: "tooltip:show",
                action: "custom-marker-action:active",
            },
        ],
        end: [
            {
                trigger: "tooltip:hide",
                action: "custom-marker-action:reset",
            },
        ],
    });
    const config = {
        data,
        xField: "year",
        yField: "value",
        label: {},
        point: {
            size: 5,
            shape: "custom-point",
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
                type: "custom-marker-interaction",
            },
        ],
    };
    return <Line {...config} />;
};

// const DemoLine = ({charts}) => {

//     let data = charts.Sales.map( d => (
//         {
// 			year: d.Moment,
// 			Məbləğ: ConvertFixedTable(d.Amount),
//         }
//     ))

// 	// const data = [
// 	// 	{
// 	// 		year: 5,
// 	// 		Məbləğ: 3,
// 	// 	},
// 	// 	{
// 	// 		year: "1992",
// 	// 		Məbləğ: 4,
// 	// 	},
// 	// 	{
// 	// 		year: "1993",
// 	// 		Məbləğ: 3.5,
// 	// 	},
// 	// 	{
// 	// 		year: "1994",
// 	// 		Məbləğ: 5,
// 	// 	},
// 	// 	{
// 	// 		year: "1995",
// 	// 		Məbləğ: 4.9,
// 	// 	},
// 	// 	{
// 	// 		year: "1996",
// 	// 		Məbləğ: 6,
// 	// 	},
// 	// 	{
// 	// 		year: "1997",
// 	// 		Məbləğ: 7,
// 	// 	},
// 	// 	{
// 	// 		year: "1998",
// 	// 		Məbləğ: 9,
// 	// 	},
// 	// 	{
// 	// 		year: "1999",
// 	// 		Məbləğ: 13,
// 	// 	},
// 	// ];

// 	const config = {
// 		data,
// 		xField: "year",
// 		yField: "Məbləğ",
// 		label: {},
// 		point: {
// 			size: 5,
// 			shape: "diamond",
// 			style: {
// 				fill: "white",
// 				stroke: "#5B8FF9",
// 				lineWidth: 2,
// 			},
// 		},
// 		tooltip: {
// 			showMarkers: false,
// 		},
// 		state: {
// 			active: {
// 				style: {
// 					shadowBlur: 4,
// 					stroke: "#000",
// 					fill: "red",
// 				},
// 			},
// 		},
// 		interactions: [
// 			{
// 				type: "marker-active",
// 			},
// 		],
// 	};
// 	return <Line className={style.chart} {...config} />;
// };

const DemoPie = (props) => {
    let balance =
        props.balances.Balance < 0 ? 0 : Math.abs(props.balances.Balance);
    let retailCashes =
        props.balances.RetailCashes < 0 ? 0 : props.balances.RetailCashes;
    let bankBalance =
        props.balances.BankBalance < 0 ? 0 : props.balances.BankBalance;
    const G = G2.getEngine("canvas");
    const data = [
        {
            type: "Sahibkar",
            value: balance,
        },
        {
            type: "Kassalar",
            value: retailCashes,
        },
        {
            type: "Hesab",
            value: bankBalance,
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
