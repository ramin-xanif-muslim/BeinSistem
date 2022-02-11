import React, { useEffect, useState } from "react";
import { Result } from "antd";
import { sendRequest } from "../api";
import { Redirect } from "react-router-dom";

function Decline() {
    const [count, setCount] = useState(3);

    setInterval(() => setCount(count - 1), 1000);

    useEffect(async() => {
        if(count === 0) {
            await sendRequest('merch/status.php', {})
        }
    },[count])

    if (count === 0) {
        return <Redirect to="p=product" />;
    }
    return <Result status="error" title="Ödəniş imtina olundu"></Result>;
}

export default Decline;
