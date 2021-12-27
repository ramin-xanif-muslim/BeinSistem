import React from "react";

function SearchByDate({ getSearcObjByDate }) {
    const obj = {
		pg: 0,
		nm: "",
		dr: 1,
		sr: "Moment",
		momb: "",
		mome: "",
	}
	const select = (i) => {
		let today = new Date();
		let y = today.getFullYear();
		let m = today.getMonth();
		let d = today.getDate();
		if (i === 1) {
			let date = y + "/" + (m + 1) + "/" + d;
			var tarix = {
				momb: `${date} 00:00`,
				mome: `${date} 23:59`,
			};
			Object.assign(obj, tarix);
			getSearcObjByDate(obj);
			return;
		}
		if (i === 2) {
			d = d - 1;
			let date = y + "/" + (m + 1) + "/" + d;
			var tarix = {
				momb: `${date} 00:00`,
				mome: `${date} 23:59`,
			};
			Object.assign(obj, tarix);
			getSearcObjByDate(obj);
			return;
		}
		if (i === 3) {
			d = 1;
			let date = y + "/" + (m + 1) + "/" + d;
			var tarix = {
				momb: `${date} 00:00`,
			};
			Object.assign(obj, tarix);
			d = 30;
			date = y + "/" + (m + 1) + "/" + d;
			tarix = {
				mome: `${date} 23:59`,
			};
			Object.assign(obj, tarix);
			getSearcObjByDate(obj);
			return;
		}
		if (i === 4) {
			let date = y + "/" + m + "/" + d;
			var tarix = {
				momb: `${date} 00:00`,
			};
			Object.assign(obj, tarix);
			date = y + "/" + (m + 1) + "/" + d;
			var tarix = {
				mome: `${date} 23:59`,
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
		<div className="search-by-date">
			<p onClick={() => select(1)}>Bu gün</p>
			{/* <img src={dot} alt=''></img> */}
			<p onClick={() => select(2)}>Dünən</p>
			{/* <img src={dot} alt=''></img> */}
			<p onClick={() => select(3)}>Bu ay</p>
			{/* <img src={dot} alt=''></img> */}
			<p onClick={() => select(4)}>Keçən ay</p>
			{/* <img src={dot} alt=''></img> */}
			<p onClick={() => select(5)}>Müddətsiz</p>
		</div>
	);
}

export default SearchByDate;
