import React, { useEffect, useState } from 'react'
import { api } from '../api';
import { ConvertFixedTable } from '../config/function/findadditionals';

export function useFetchDebt(data) {
    const [debt, setDebt] = useState(null);
    const [ customerId, setCustomerId] = useState()
    const fetchDebt = async (id) => {
        let res = await api.fetchDebt(id);
        setDebt(ConvertFixedTable(res));
    };
    useEffect(() => {
        if(data){
            setCustomerId(data);
        }
    }, []);
    useEffect(() => {
        fetchDebt(customerId);
    }, [customerId]);
    return {debt,setDebt,setCustomerId}
}

