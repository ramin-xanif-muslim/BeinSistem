import React, { useEffect, useState } from 'react'
import { api } from '../api';
import { ConvertFixedTable } from '../config/function/findadditionals';

export function useFetchDebt() {
    const [debt, setDebt] = useState(0);
    const [ customerId, setCustomerId] = useState()
    const fetchDebt = async (id) => {
        console.log(id)
        console.log(customerId)
        let res = await api.fetchDebt(id ? id : customerId);
        setDebt(ConvertFixedTable(res));
    };
    useEffect(() => {
        if(customerId) {
            fetchDebt(customerId);
        }
    }, [customerId]);
    return {debt, setDebt, setCustomerId, customerId, fetchDebt}
}

