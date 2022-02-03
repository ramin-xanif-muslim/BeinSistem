
import React, { useEffect } from "react";
import classNames from "classnames";
import { useTableCustom } from "../contexts/TableContext";

function FilterButton(props) {

	const {
		setdisplay,
		display,
		isEnterFilterValue,
        setIsEnterFilterValue,
	} = useTableCustom();
    

	let filterClasses = classNames({
		"new-filter-active": isEnterFilterValue,
		"new-button": !isEnterFilterValue,
		"new-button-open": display !== "none",
	});

    useEffect(() => {
        if(props.from === "product" || props.from === "stockbalance") {
            setIsEnterFilterValue(true)
        }else {
            setIsEnterFilterValue(false)
        }
    },[])
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
