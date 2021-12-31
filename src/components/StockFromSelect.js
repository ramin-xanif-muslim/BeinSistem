import React from "react";
import { Select } from "antd";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
const { Option, OptGroup } = Select;
function StockFromSelect({ defaultValue }) {
  const { stocks } = useTableCustom();
  const {  setDocFromStock } = useCustomForm();

  var obj;
  stocks ? (obj = stocks) : (obj = JSON.parse(localStorage.getItem("stocks")));

  const onChange = (stock) => {
    setDocFromStock(stock);
  };
  const options = obj.map((m) => (
    <Option key={m.Id} value={m.Id}>
      {m.Name}
    </Option>
  ));
  return (
    <>
      <Select
        showSearch
        showArrow={false}
        defaultValue={defaultValue}
        filterOption={false}
        onChange={onChange}
        className="customSelect"
        allowClear={true}
      >
        {options}
      </Select>
    </>
  );
}

export default StockFromSelect;
