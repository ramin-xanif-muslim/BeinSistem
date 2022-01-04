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
