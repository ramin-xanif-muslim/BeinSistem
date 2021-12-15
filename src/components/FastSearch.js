import React, { useState } from "react";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { fecthFastPage } from "../api";
import { Input, Space } from "antd";
import { useTableCustom } from "../contexts/TableContext";
const { Search } = Input;

function FastSearch() {
  const { search, setFastSearch, doSearch, setDoSearch } = useTableCustom();
  const [value, setValue] = useState(null);

  const handleSearch = () => {
    console.log("enter oldu");
    setFastSearch(value);
    if (value) {
      setDoSearch(true);
    } else {
      setDoSearch(false);
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
      />
    </div>
  );
}

export default FastSearch;
