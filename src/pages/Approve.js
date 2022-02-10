import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { sendRequest } from "../api";

function Approve() {
	const [count, setCount] = useState(5);

    setInterval(() => setCount(count - 1), 1000);

	// useEffect(() => {
	// 	let interval = setInterval(() => setCount(count - 1), 1000);
    //     // if(count === 0) {
    //     //   clearInterval(interval);
    //     // }
	// }, [count]);

	// useEffect(async () => {
	// 	await sendRequest("merch/status.php", {});
	// }, []);
    if(count === 0) {
        return <Redirect to='p=product' />
    }

	return (
		<div>
			<div>Approve</div>
			<div>{count}</div>
		</div>
	);
}

export default Approve;
