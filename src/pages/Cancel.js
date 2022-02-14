import React, { useEffect, useState } from "react";
import { Result } from "antd";
import { sendRequest } from "../api";
import { Redirect } from "react-router-dom";

function Cancel() {
    const [count, setCount] = useState(4);

    setInterval(() => setCount(count - 1), 1000);

    useEffect(async() => {
        if(count === 1) {
            await sendRequest('merch/status.php', {})
        }
    },[count])

    if (count === 0) {
        return <Redirect to="p=product" />;
    }

    return <Result status="error" title="Ödəniş ləğv olundu"></Result>;
}

export default Cancel;
