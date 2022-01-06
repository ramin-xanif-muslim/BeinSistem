import { Select } from "antd";
import React, { useState, useEffect } from "react";
import sendRequest from "../config/sentRequest";

const { Option } = Select;

function CustomersSelectInput({ setCustomerId }) {

    const [ obj, setObj ] = useState({})
    const [ inputValue, setInputValue ] = useState()
	const [customers, setCustomers] = useState([]);

    const onChangeSelectInput = (e) => {
        alert(e)
        console.log(e)
        setCustomerId(e)
        setInputValue(e)
        setObj({
            fast: inputValue,
        })
    }

	useEffect( async () => {
        let res = await sendRequest('customers/get.php',obj)
        console.log(res)
        setCustomers(res)
    }, [inputValue]);

	return (
		<Select
			showSearch
			showArrow={false}
			filterOption={false}
			className="customSelect detail-select"
			allowClear={true}
			onChange={(e) => onChangeSelectInput(e)}
			filterOption={(input, option) =>
				option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			}
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
