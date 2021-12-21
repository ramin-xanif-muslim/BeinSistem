import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MyReactDate() {
	const [startDate, setStartDate] = useState(new Date());
	useEffect(() => {
		console.log(startDate);
	}, [startDate]);
	const handleDateSelect = () => {};
	return (
		<DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        locale="pt-BR"
        showTimeSelect
        timeFormat="p"
        timeIntervals={15}
        dateFormat="Pp"
		/>
	);
}

export default MyReactDate;
