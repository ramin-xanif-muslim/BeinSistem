import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import style from "./SearchByDate.module.css";

function SearchByDate({ getSearchObjByDate, defaultSort }) {
    const { setSelectedDateId } = useTableCustom()
    const [activId, setActivId] = useState(0);

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
    const obj = {
        pg: 0,
        dr: 1,
        momb: "",
        mome: "",
        sr: defaultSort ? defaultSort : "Moment",
    };
    const select = (i) => {
        let today = new Date();
        let y = today.getFullYear();
        let m = today.getMonth();
        let d = today.getDate();
        if (i === 1) {
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                // momb: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                // mome: moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
                momb: `${date} 00:00:00`,
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearchObjByDate(obj);
            return;
        }
        if (i === 2) {
            d = d - 1;
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                // momb: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
                // mome: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                momb: `${date} 00:00:00`,
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearchObjByDate(obj);
            return;
        }
        if (i === 3) {
            d = 1;
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
            //     momb: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
                //     momb: moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
                momb: `${date} 00:00:00`,
            };
            Object.assign(obj, tarix);
            d = today.getDate();
            date = y + "-" + (m + 1) + "-" + d;
            tarix = {
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearchObjByDate(obj);
            return;
        }
        if (i === 4) {
            if(m === 0){
            let date = (y-1) + "-" + 12 + "-" + d;
            var tarix = {
                momb: `${date} 00:00:00`,
            };
            Object.assign(obj, tarix);
            }
            let date = y + "-" + (m + 1) + "-" + d;
            var tarix = {
                mome: `${date} 23:59:59`,
            };
            Object.assign(obj, tarix);
            getSearchObjByDate(obj);
            return;
        }
        if (i === 5) {
            var tarix = {
                momb: "",
                mome: "",
            };
            Object.assign(obj, tarix);
            getSearchObjByDate(obj);
            return;
        }
    };

    const onClick = (i) => {
        select(i);
        setActivId(i);
        setSelectedDateId(i)
    };

    return (
        <div className={style.div}>
            <ul>
                {dates.map((m) => {
                    return (
                        <li
                            onClick={() => onClick(m.id)}
                            className={m.id === activId ? style.active : ""}
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
