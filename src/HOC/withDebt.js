import React, { useEffect, useState } from 'react'
import { api } from '../api'

function withDebt(Component, customerId) {

    return (props) => {
        const [ debt, setDebt] = useState(null)
    
        const fetchDebt = async () => {
            let res = await api.fetchDebt(customerId)
            setDebt(res)
        }
        useEffect(() => {
            fetchDebt()
        },[])
        return (
            <div>
                <Component { ...props } debt={debt} />
            </div>
        )

    }
}

export default withDebt
