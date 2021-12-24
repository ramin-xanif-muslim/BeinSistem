import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function MyReactDate() {
    const [startDate, setStartDate] = useState(new Date());
    const handleCalendarClose = () => {
        let date = moment(startDate).format("YYYY-MM-DD HH:mm");
    };

    return (
        <DatePicker
            className="my-date-picker"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            onCalendarClose={handleCalendarClose}
        />
    );
}

export default MyReactDate;
