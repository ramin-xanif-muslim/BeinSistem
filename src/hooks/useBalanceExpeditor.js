import React, { useState } from 'react';
import { sendRequest } from '../api';
import { ConvertFixedTable } from '../config/function/findadditionals';
import { Spin } from "antd"

export function useBalanceExpeditor() {
    const [balance, setBalance] = useState()
	const [isSpin, setIsSpin] = useState(false);

    const fetchBalance = async (item) => {
        if(item) {
            setIsSpin(true)
            let res = await sendRequest('expeditorstockbalance/get.php',{stockName: item.StockId});
            setBalance(ConvertFixedTable(res.Balance));
            setIsSpin(false)
        }
    };
    const balanceComponent =  isSpin ? <Spin /> : 
    <p
        className="customer-debt"
        style={balance < 0 ? { color: "red" } : {}}
    >
        <span style={{ color: "red" }}>Balans:</span>
        {balance} ₼
    </p>
    
     
  return [ balanceComponent, fetchBalance, setBalance ]
}
