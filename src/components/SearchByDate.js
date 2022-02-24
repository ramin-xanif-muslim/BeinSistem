import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import style from "./SearchByDate.module.css";

function SearchByDate({ getSearchObjByDate, defaultSort, defaultCheckedDate }) {
	const { selectedDateId, setSelectedDateId } = useTableCustom();
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
			title: "Keçən ay",
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
		if (i === 1) {
			var tarix = {
				momb: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			getSearchObjByDate(obj);
			return;
		} else if (i === 2) {
			var tarix = {
				momb: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			getSearchObjByDate(obj);
			return;
		} else if (i === 3) {
			var tarix = {
				momb: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
				mome: moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
			};
			Object.assign(obj, tarix);
			getSearchObjByDate(obj);
			return;
		} else if (i === 4) {
			var tarix = {
				momb: moment().subtract(1, "month").startOf("month"),
				mome: moment().subtract(1, "month").endOf("month"),
			};
			Object.assign(obj, tarix);
			getSearchObjByDate(obj);
			return;
		}
	};

	const onClick = (i) => {
		select(i);
		setActivId(i);
		setSelectedDateId(i);
	};
	useEffect(() => {
		if (defaultCheckedDate) {
			setActivId(defaultCheckedDate);
			setSelectedDateId(defaultCheckedDate);
		}else {
            setSelectedDateId(null)
        }
	}, [defaultCheckedDate]);

	return (
		<div className={style.div}>
			<ul>
				{dates.map((m) => {
					return (
						<li
							key={m.id}
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
