import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { fecthFastPage } from "../api";
import { Input, Space } from "antd";
import { useTableCustom } from "../contexts/TableContext";
const { Search } = Input;

function MyFastSearch({searchTerm, setSearchTerm, searchFunc}) {
  const { search, setFastSearch,setIsFilter, doSearch, setDoSearch } = useTableCustom();

//   useEffect(() => {
//     handleSearch()
//     //  alert('clear')
//   },[])

  const handleSearch = () => {
    searchFunc(searchTerm)
    
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
      />
    </div>
  );
}

export default MyFastSearch;
