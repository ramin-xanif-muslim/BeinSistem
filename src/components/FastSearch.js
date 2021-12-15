import React, { useState } from "react";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { fecthFastPage } from "../api";
import { Input, Space } from "antd";
import { useTableCustom } from "../contexts/TableContext";
const { Search } = Input;

function FastSearch() {
  const { search, setFastSearch,setIsFilter, doSearch, setDoSearch } = useTableCustom();
  const [value, setValue] = useState(null);

  const handleSearch = () => {
    console.log("enter oldu");
    setFastSearch(value);
    if (value) {
      setIsFilter(false)
      setDoSearch(true);
    } else {
      setDoSearch(false);
      setIsFilter(false);

    }
  };
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div>
      <Search
        className="search_header"
        onChange={onChange}
        onPressEnter={handleSearch}
        style={{ width: 200 }}
        defaultValue={search}
      />
    </div>
  );
}

export default FastSearch;
