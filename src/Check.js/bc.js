import React from "react";
import fourtwofirst from "./bcTemplates/4x2_1";
import fourtwosecond from "./bcTemplates/4x2_2";
import fourtwothird from "./bcTemplates/4x2_3";
import threetwofirst from "./bcTemplates/3x2_1";
import threetwosecond from "./bcTemplates/3x2_2";
import threetwothird from "./bcTemplates/3x2_3";
import sixtwofirst from "./bcTemplates/6x4_1";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import {
    ConvertFixedPosition,
    ConvertFixedBarcode,
} from "../config/function/findadditionals";
import { API_BASE, getBcTemplate, getBcTemplateMain } from "../api";
export default function Bc(props) {
    const { nav, setNav } = useTableCustom();
    const [print, setPrint] = useState(false);
    useEffect(() => {
        setNav("none");
        return () => {
            setNav("block");
        };
    }, []);

    let mainWrapperStyle;

    let mainStyle;
    let imgStyle;
    let nameStyle;
    let priceStyle;
    let cssName = localStorage.getItem("tempdesign");

    switch (localStorage.getItem("tempdesign")) {
        case "4x2_1.css":
            mainStyle = fourtwofirst.main;
            imgStyle = fourtwofirst.img;
            nameStyle = fourtwofirst.name;
            priceStyle = fourtwofirst.price;
            break;
        case "4x2_2.css":
            mainStyle = fourtwosecond.main;
            imgStyle = fourtwosecond.img;
            nameStyle = fourtwosecond.name;
            priceStyle = fourtwosecond.price;
            break;

        case "4x2_3.css":
            mainWrapperStyle = fourtwothird.mainWrapper;
            mainStyle = fourtwothird.main;
            imgStyle = fourtwothird.img;
            nameStyle = fourtwothird.name;
            priceStyle = fourtwothird.price;
            break;
        case "3x2_1.css":
            mainStyle = threetwofirst.main;
            imgStyle = threetwofirst.img;
            nameStyle = threetwofirst.name;
            priceStyle = threetwofirst.price;
            break;
        case "3x2_2.css":
            mainStyle = threetwosecond.main;
            imgStyle = threetwosecond.img;
            nameStyle = threetwosecond.name;
            priceStyle = threetwosecond.price;
            break;

        case "3x2_3.css":
            mainStyle = threetwothird.main;
            imgStyle = threetwothird.img;
            nameStyle = threetwothird.name;
            priceStyle = threetwothird.price;
            break;

        case "6x4_1.css":
            mainStyle = sixtwofirst.main;
            imgStyle = sixtwofirst.img;
            nameStyle = sixtwofirst.name;
            priceStyle = sixtwofirst.price;
            break;
        default:
            break;
    }

    const getBarcode = async () => {
        const res = await getBcTemplateMain(props.location.search.substring(1));
        setPrint(true);
        window.print();
    };

    useEffect(() => {
        getBarcode();
    }, []);

    const tempfour = (
        <div className="mainwrapperhold fourtemps" style={mainWrapperStyle}>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https${API_BASE}/controllers/products/print.php?bc=${props.location.search.substring(
                        1
                    )}`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(props.location.search).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {ConvertFixedBarcode(
                                new URLSearchParams(props.location.search).get(
                                    "pr"
                                )
                            )}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>

            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`${API_BASE}/controllers/products/print.php?bc=${props.location.search.substring(
                        1
                    )}`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(props.location.search).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {ConvertFixedBarcode(
                                new URLSearchParams(props.location.search).get(
                                    "pr"
                                )
                            )}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`${API_BASE}/controllers/products/print.php?bc=${props.location.search.substring(
                        1
                    )}`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(props.location.search).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {ConvertFixedBarcode(
                                new URLSearchParams(props.location.search).get(
                                    "pr"
                                )
                            )}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`${API_BASE}/controllers/products/print.php?bc=${props.location.search.substring(
                        1
                    )}`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(props.location.search).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {ConvertFixedBarcode(
                                new URLSearchParams(props.location.search).get(
                                    "pr"
                                )
                            )}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const temp = (
        <div className="mainwrapperhold" style={mainWrapperStyle}>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`${API_BASE}/controllers/products/print.php?bc=${props.location.search.substring(
                        1
                    )}`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(props.location.search).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {ConvertFixedBarcode(
                                new URLSearchParams(props.location.search).get(
                                    "pr"
                                )
                            )}
                            <sup class="manat" style={{fontFamily: "Montserrat"}}>₼</sup>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (cssName === "4x2_3.css") {
        return tempfour;
    } else {
        return temp;
    }
}
