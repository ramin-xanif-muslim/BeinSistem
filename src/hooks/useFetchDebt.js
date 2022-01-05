import React, { useEffect, useState } from 'react'
import { api } from '../api';
import { ConvertFixedTable } from '../config/function/findadditionals';

export function useFetchDebt() {
    const [debt, setDebt] = useState(0);
    const [ customerId, setCustomerId] = useState()
    const fetchDebt = async (id) => {
        let res = await api.fetchDebt(id);
        setDebt(ConvertFixedTable(res));
    };
    useEffect(() => {
        if(customerId) {
            fetchDebt(customerId);
        }
    }, [customerId]);
    return {debt,setCustomerId}
}

