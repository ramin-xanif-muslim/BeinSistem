import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { sendRequest } from "../api";
import { Result, Spin } from "antd";

function Approve() {
    const [count, setCount] = useState(6);

    setInterval(() => setCount(count - 1), 1000);

    useEffect(async() => {
        if(count === 1) {
            await sendRequest('merch/status.php', {})
        }
    },[count])

    if (count === 0) {
        return <Redirect to="p=product" />;
    }

    return (
        <Result
            title={
                <div>
                    <span>Ödəniş yoxlanılır</span>
                    <Spin style={{ marginLeft: "1rem" }} />
                </div>
            }
        ></Result>
    );
}

export default Approve;
