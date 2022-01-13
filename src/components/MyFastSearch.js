import React, { useEffect } from "react";
import { Input } from "antd";
const { Search } = Input;

function MyFastSearch({ searchTerm, setSearchTerm, searchFunc }) {
  
  useEffect(() => {
      if(searchTerm !== ''){
        const timer = setTimeout(() => {
            searchFunc(searchTerm)
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [searchTerm]);
  useEffect(() => {
      if(searchTerm === ''){
        searchFunc(searchTerm)
    }
  }, [searchTerm]);

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
			<Input
				allowClear
				placeholder="Axtarış..."
				className="search_header"
				onChange={onChange}
				onPressEnter={handleSearch}
				style={{ width: 200, height: "27.19px" }}
                allowClear
				// onPressEnter={handleSearch}
				defaultValue={searchTerm}
				// onSearch={onSearch}
			/>
		</div>
	);
}

export default MyFastSearch;
