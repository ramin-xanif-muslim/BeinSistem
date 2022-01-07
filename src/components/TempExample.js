import React from "react";
import "../Check.js/bcTemplates/bcMain.css";
import { useCustomForm } from "../contexts/FormContext";
import fourtwofirst from "../Check.js/bcTemplates/4x2_1";
import fourtwosecond from "../Check.js/bcTemplates/4x2_2";
import fourtwothird from "../Check.js/bcTemplates/4x2_3";
import threetwofirst from "../Check.js/bcTemplates/3x2_1";
import threetwosecond from "../Check.js/bcTemplates/3x2_2";
import threetwothird from "../Check.js/bcTemplates/3x2_3";
import sixtwofirst from "../Check.js/bcTemplates/6x4_1";
import { FaTruckLoading } from "react-icons/fa";
var searchBarcode = `https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`;
export const TemplateExample = (props) => {
    const { isTemp } = useCustomForm();
    var mainWrapperStyle;
    var mainStyle;
    var imgStyle;
    var nameStyle;
    var priceStyle;

    var cssName = localStorage.getItem("tempdesign");
    switch (cssName) {
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

    const templateFour = (
        <div className="mainwrapperhold" style={mainWrapperStyle}>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(searchBarcode).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {new URLSearchParams(searchBarcode).get("pr")}{" "}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>

            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(searchBarcode).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {new URLSearchParams(searchBarcode).get("pr")}{" "}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(searchBarcode).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {new URLSearchParams(searchBarcode).get("pr")}{" "}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(searchBarcode).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {new URLSearchParams(searchBarcode).get("pr")}{" "}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
    const template = (
        <div className="mainwrapperhold" style={mainWrapperStyle}>
            <div className="main" style={mainStyle}>
                <img
                    style={imgStyle}
                    src={`https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`}
                />
                <div style={{ display: "flex" }}>
                    <div className="namepro" style={nameStyle}>
                        {new URLSearchParams(searchBarcode).get("nm")}
                    </div>
                    <div className="pricepro" style={priceStyle}>
                        <p>
                            {new URLSearchParams(searchBarcode).get("pr")}{" "}
                            <sup class="manat">₼</sup>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isTemp) {
        return <div>Yüklənir...</div>;
    } else {
        if (cssName === "4x2_3.css") {
            return templateFour;
        } else {
            return template;
        }
    }
};
