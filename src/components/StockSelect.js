import React from "react";
import { Select} from "antd";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import { useRef, useEffect, useState } from "react";
import { fetchStocks } from "../api";
const { Option } = Select;
function StockSelect({ defaultValue }) {
  const select = useRef(null);
  const [ setisCreate] = useState(false);
  const { stocks, setStockLocalStorage, setStock } = useTableCustom();
  const {
    setDocStock,
    createdStock,
    setCreatedStock,
  } = useCustomForm();

  const getStocks = () => {
    if (createdStock) {
      getStocksAgain();
    }
  };

  useEffect(() => {
    if (createdStock) setisCreate(true);
  }, [createdStock]);

  const getStocksAgain = async () => {
    const stockResponse = await fetchStocks();
    setStock(stockResponse.Body.List);
    setStockLocalStorage(stockResponse.Body.List);
    setCreatedStock({});
  };
  const onChange = (stock) => {
    setDocStock(stock);
  };

  var obj;
  stocks ? (obj = stocks) : (obj = JSON.parse(localStorage.getItem("stocks")));

  const options = obj.map((m) => (
    <Option key={m.Id} value={m.Id}>
      {m.Name}
    </Option>
  ));
  return (
    <>
      <Select
        ref={select}
        showSearch
        showArrow={false}
        defaultValue={defaultValue}
        onFocus={() => getStocks()}
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

export default StockSelect;
