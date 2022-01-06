import { Select } from "antd";
import React, { useState, useEffect } from "react";
import sendRequest from "../config/sentRequest";

const { Option } = Select;

function CustomersSelectInput({ setCustomerId, handleChanged }) {

    const [ obj, setObj ] = useState({})
    const [ inputValue, setInputValue ] = useState()
	const [customers, setCustomers] = useState([]);

    const onSearchSelectInput = (e) => {
        setInputValue(e)
        setObj({
            fast: inputValue,
        })
    }
    const onChangeSelectInput = (e) => {
        handleChanged()
        setCustomerId(e)
    }

	const getCustomer = async () => {
        let res = await sendRequest('customers/getfast.php',obj)
        console.log(res)
        setCustomers(res.List)
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

	return (
		<Select
            lazyLoad
			showSearch
			showArrow={false}
			filterOption={false}
			className="customSelect detail-select"
			allowClear={true}
            onSearch={(e) => onSearchSelectInput(e)}
			onChange={(e) => onChangeSelectInput(e)}
		>
			{customers[0] &&
				customers.map((c) => {
					return (
						<Option key={c.Id} value={c.Id}>
							{c.Name}
						</Option>
					);
				})}
		</Select>
	);
}

export default CustomersSelectInput;
