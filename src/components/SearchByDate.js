import React, { useState } from "react";
import { Radio } from "antd";
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

    const onClick = (i) => {
        select(i);
        setDates([...dates]);
    };

    const [dates, setDates] = useState([
        {
            id: 1,
            title: "Bu gün",
            onclick: false,
        },
        {
            id: 2,
            title: "Dünən",
            onclick: false,
        },
        {
            id: 3,
            title: "Bu ay",
            onclick: false,
        },
        {
            id: 4,
            title: "30 gün",
            onclick: false,
        },
        {
            id: 5,
            title: "Müddətsiz",
            onclick: false,
        },
    ]);

    return (
        <div className={style.div}>
            <ul>
                {dates.map((m) => {
                    return (
                        <li
                            // onClick={() => onClick(m.id)}
                            className={m.onclick ? style.active : ""}
                        >
                            <a>{m.title}</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SearchByDate;
