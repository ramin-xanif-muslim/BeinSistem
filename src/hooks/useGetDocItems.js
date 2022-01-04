import React, { useEffect, useState } from 'react'
import { useTableCustom } from '../contexts/TableContext';
import { ConvertFixedTable } from "../config/function/findadditionals"

export function useGetDocItems() {

    const {
        docCount,
        docSum,
    } = useTableCustom();

    const [allsum, setAllsum] = useState(null);
    const [allQuantity, setAllQuantity] = useState(null);
    useEffect(() => {
        if(docSum != 0) {
            setAllsum(ConvertFixedTable(docSum))
        }
        if(docCount != 0) {
            setAllQuantity(ConvertFixedTable(docCount))
        }
    },[docSum, docCount])
    return { allsum, allQuantity }
}

