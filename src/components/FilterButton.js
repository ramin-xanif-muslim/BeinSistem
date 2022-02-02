
import React from "react";
import classNames from "classnames";
import { useTableCustom } from "../contexts/TableContext";

function FilterButton() {

	const {
		setdisplay,
		display,
		isEnterFilterValue,
	} = useTableCustom();
    

	let filterClasses = classNames({
		"new-filter-active": isEnterFilterValue,
		"new-button": !isEnterFilterValue,
		"new-button-open": display !== "none",
	});
	return (
		<button
			className={filterClasses}
			onClick={() =>
				display === "none" ? setdisplay("block") : setdisplay("none")
			}
		>
			Filter
		</button>
	);
}

export default FilterButton;
