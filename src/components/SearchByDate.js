import React from "react";
import style from "./SearchByDate.module.css";

function SearchByDate({ getSearcObjByDate }) {
    const obj = {
        pg: 0,
		lm: 25,
		dr: 1,
        sr: "Moment",
        momb: "",
        mome: "",
    };
    const select = (i) => {
        let today = new Date();
        let y = today.getFullYear();
        let m = today.getMonth();
        let d = today.getDate();
        if (i === 1) {
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                momb: `${date} 00:00:00`,
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearcObjByDate(obj);
            return;
        }
        if (i === 2) {
            d = d - 1;
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                momb: `${date} 00:00:00`,
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearcObjByDate(obj);
            return;
        }
        if (i === 3) {
            d = 1;
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                momb: `${date} 00:00:00`,
            };
            Object.assign(obj, tarix);
            d = 30;
            date = y + "-" + (m + 1) + "-" + d;
            tarix = {
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearcObjByDate(obj);
            return;
        }
        if (i === 4) {
            let date = y + "-" + m + "-" + d;
            var tarix = {
                momb: `${date} 00:00:00`,
            };
            Object.assign(obj, tarix);
            date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearcObjByDate(obj);
            return;
        }
        if (i === 5) {
            var tarix = {
                momb: "",
                mome: "",
            };
            Object.assign(obj, tarix);
            getSearcObjByDate(obj);
            return;
        }
    };
    return (
        <div className={style.div}>
            <ul>
                <li onClick={() => select(1)}>
                    <a>Bu gün</a>
                </li>
                <li onClick={() => select(2)}>
                    <a>Dünən</a>
                </li>
                <li onClick={() => select(3)}>
                    <a>Bu ay</a>
                </li>
                <li onClick={() => select(4)}>
                    <a>30 gün</a>
                </li>
                <li onClick={() => select(5)}>
                    <a>Müddətsiz</a>
                </li>
            </ul>
        </div>
    );
}

export default SearchByDate;
