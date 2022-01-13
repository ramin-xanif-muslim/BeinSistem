import React, { useEffect, useState } from "react";
import { Input } from "antd";

function MyFastSearch({ searchTerm, setSearchTerm, searchFunc }) {
	const [isPut, setIsPut] = useState(false);

	useEffect(() => {
		if (searchTerm !== "") {
			const timer = setTimeout(() => {
				searchFunc(searchTerm);
			}, 500);
			return () => clearTimeout(timer);
		}
		if (searchTerm === "" && isPut) {
			searchFunc(searchTerm);
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
		setIsPut(true);
	};
	return (
		<div>
			<Input
				allowClear
				placeholder="Axtarış..."
				className="search_header"
				onChange={onChange}
				style={{ width: 200, height: "27.19px" }}
				defaultValue={searchTerm}
				// onPressEnter={handleSearch}
				// onSearch={onSearch}
			/>
		</div>
	);
}

export default MyFastSearch;
