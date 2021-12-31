import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { fecthFastPage } from "../api";
import { Input, Space } from "antd";
import { useTableCustom } from "../contexts/TableContext";
const { Search } = Input;

function MyFastSearch({ searchTerm, setSearchTerm, searchFunc }) {
  
  useEffect(() => {
      if(searchTerm !== ''){
        const timer = setTimeout(() => {
            searchFunc(searchTerm)
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, []);

	const handleSearch = () => {
		searchFunc(searchTerm);
	};

	const onSearch = () => {
		searchFunc(searchTerm);
	};
	const onChange = (e) => {
		setSearchTerm(e.target.value);
	};
	return (
		<div>
			<Search
				className="search_header"
				onChange={onChange}
				onPressEnter={handleSearch}
				style={{ width: 200 }}
				defaultValue={searchTerm}
				onSearch={onSearch}
			/>
		</div>
	);
}

export default MyFastSearch;
