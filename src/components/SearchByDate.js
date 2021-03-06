import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import style from "./SearchByDate.module.css";

function SearchByDate({ getSearchObjByDate, defaultSort, from }) {
	const { selectedDateId, setSelectedDateId } = useTableCustom();
    const [defaultCheckedDate, setdefaultCheckedDate] = useState()

	const dates = [
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
			title: "Keçən ay",
			onclick: false,
		},
	]
	const obj = {
		pg: 0,
		dr: 1,
		momb: "",
		mome: "",
		sr: defaultSort ? defaultSort : "Moment",
	};
	const select = (i) => {
		if (i === 1) {
			var tarix = {
				momb: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			// getSearchObjByDate(obj);
			return;
		} else if (i === 2) {
			var tarix = {
				momb: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			// getSearchObjByDate(obj);
			return;
		} else if (i === 3) {
			var tarix = {
				momb: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			// getSearchObjByDate(obj);
			return;
		} else if (i === 4) {
			var tarix = {
				momb: moment().subtract(1, "month").startOf("month"),
				mome: moment().subtract(1, "month").endOf("month"),
			};
			Object.assign(obj, tarix);
			// getSearchObjByDate(obj);
			return;
		}
	};

	const onClick = (i) => {
		select(i);
		setSelectedDateId({...selectedDateId, [from]: i});
	};
	useEffect(() => {
        if(from === 'producttransactions') {
            setdefaultCheckedDate(1)
        }
        if(from === 'salereports') {
            setdefaultCheckedDate(1)
        }
        if(from === 'profit') {
            setdefaultCheckedDate(3)
        }
	}, [from]);
	useEffect(() => {
		if (!selectedDateId[from] && defaultCheckedDate) {
            setSelectedDateId({...selectedDateId, [from]: defaultCheckedDate});
		}
	}, [defaultCheckedDate]);

	return (
		<div className={style.div}>
        Tarix
			<ul>
				{dates.map((m) => {
					return (
						<li
							key={m.id}
							onClick={() => onClick(m.id)}
							className={selectedDateId ? m.id === selectedDateId[from] ? style.active : "" : ''}
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
