import { useEffect, useState } from "react";
import sendRequest from "../config/sentRequest";


export const useSearchSelectInput = () => {

    const [ obj, setObj ] = useState({})
    const [ inputValue, setInputValue ] = useState()
	const [customersForSelet, setCustomersForSelet] = useState([]);

    const onSearchSelectInput = (e) => {
        setInputValue(e)
        setObj({
            fast: inputValue,
        })
    }

	const getCustomer = async () => {
        let res = await sendRequest('customers/getfast.php',obj)
        console.log(res)
        setCustomersForSelet(res.List)
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setObj({
                fast: inputValue,
            });
            if (inputValue) {
                getCustomer();
            } else getCustomer([]);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);
    
    return { onSearchSelectInput, customersForSelet }
}