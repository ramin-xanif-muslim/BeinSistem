import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import axios from "axios";
import { useTableCustom } from "../contexts/TableContext";

function AddProductInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeScan, setBarcodeScan] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [list, setList] = useState(null);
  const [productList, setProductList] = useState([]);
  const [value, setValue] = useState("");
  const { newPro, setNewPro, setAdd, outerDataSource } = useTableCustom();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      var filter = {
        token: localStorage.getItem("access-token"),
        fast: searchTerm,
      };
      if (searchTerm) {
        if (!isNaN(searchTerm) && searchTerm.length === 13) {
          setBarcodeScan(true);
          console.log(outerDataSource);
          var repeatedProduct = outerDataSource.find(
            (p) => p.BarCode === searchTerm
          );
          console.log(repeatedProduct);
          if (repeatedProduct) {
            let result = Object.keys(repeatedProduct).reduce(
              (prev, current) => ({
                ...prev,
                [current.toLowerCase()]: repeatedProduct[current],
              }),
              {}
            );
            delete result["key"];
            result = { ...result, value: result.productid, text: result.name };
            delete result["productid"];
            console.log("res", result);

            setNewPro(result);
            setAdd(true);
            setOpenDropDown(false);
            setProductList([]);
            setValue("");
          } else {
            getBarcode(filter);
          }
        } else {
          getProduct(filter);
        }
      } else setProductList([]);
      // Send Axios request here
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    var datas = [];
    if (list && list.data.Body.List.length > 0) {
      list.data.Body.List.forEach((r) => {
        datas.push({
          key: r.Id,
          value: r.Id,
          id: r.Id,
          barcode: r.BarCode,
          artcode: r.ArtCode,
          stockquantity: r.Quantity,
          amount: 1,
          price: r.Price,
          buyprice: r.BuyPrice,
          packprice: r.PackPrice,
          packquantity: r.PackQuantity,
          ispack: r.IsPack,
          totalprice: `${parseFloat(r.Price) * parseFloat(1)}`,
          name: r.Name,
          costprice: r.CostPrice,
          costpricetotal: `${parseFloat(r.CostPrice) * parseFloat(1)}`,
        });
      });
      setProductList(datas);
      setOpenDropDown(true);
    } else {
      datas.push({
        key: "0",
        value: "0",
        id: "0",
        name: "Mehsul tapilmadi",
        barcode: "",
        quantity: "",
      });
      setProductList(datas);
      setOpenDropDown(true);
    }
  }, [list]);
  async function getProduct(obj) {
    const data = await axios.post(
      `https://dev.bein.az/controllers/products/getfast.php`,
      obj
    );
    setList(data);
  }

  async function getBarcode(obj) {
    const res = await axios.post(
      `https://dev.bein.az/controllers/products/getfast.php`,
      obj
    );
    console.log(res.data.Body.List);
    var datas = {};

    Object.assign(datas, {
      key: res.data.Body.List[0].Id,
      value: res.data.Body.List[0].Id,
      id: res.data.Body.List[0].Id,
      barcode: res.data.Body.List[0].BarCode,
      artcode: res.data.Body.List[0].ArtCode,
      stockquantity: res.data.Body.List[0].Quantity,
      amount: 1,
      price: res.data.Body.List[0].Price,
      buyprice: res.data.Body.List[0].BuyPrice,
      packprice: res.data.Body.List[0].PackPrice,
      packquantity: res.data.Body.List[0].PackQuantity,
      ispack: res.data.Body.List[0].IsPack,
      totalprice: `${parseFloat(res.data.Body.List[0].Price) * parseFloat(1)}`,
      name: res.data.Body.List[0].Name,
      costprice: res.data.Body.List[0].CostPrice,
      costpricetotal: `${
        parseFloat(res.data.Body.List[0].CostPrice) * parseFloat(1)
      }`,
    });

    setNewPro(datas);
    setAdd(true);
    setValue("");
  }

  const handleSearch = (value) => {
    setSearchTerm(value);
    setValue(value);
  };

  const onChange = (ob) => {
    console.log(ob);
    setNewPro(ob);
    setAdd(true);
    setOpenDropDown(false);
    setProductList([]);
  };

  const onClose = () => {
    setBarcodeScan(false);
    setProductList([]);
    setSearchTerm("");
    setOpenDropDown(false);
  };
  return (
    <div>
      <Dropdown
        button
        className="icon"
        style={{ width: "100%" }}
        searchQuery={value}
        floating
        labeled
        open={openDropDown ? true : false}
        lazyLoad
        icon="shop"
        onClose={onClose}
        onSearchChange={(e) => handleSearch(e.target.value)}
        search
        text="Məhsul əlavə et - Ad, Barkod və ya Artkod ilə"
      >
        <Dropdown.Menu>
          {productList.map((option) =>
            option.id != "0" ? (
              <Dropdown.Item
                key={option.value}
                {...option}
                onClick={() => onChange(option)}
              >
                <p className="optionCustom">
                  <span className="">{option.name}</span>
                  <span> {option.artcode ? option.artcode + "-" : ""} </span>
                </p>
                <p className="optionCustom">
                  <span className="fadeOption">{option.barcode}</span>
                  <span
                    className="fadeOption"
                    style={{ color: option.stockquantity >= 0 ? "" : "red" }}
                  >
                    {option.stockquantity
                      ? option.stockquantity + " əd"
                      : "0.00 əd"}
                  </span>
                </p>
                <p>
                  <span>{option.price} ₼</span>
                </p>
              </Dropdown.Item>
            ) : !barcodeScan ? (
              <Dropdown.Item key={option.value} {...option}>
                <p className="optionCustom">
                  <span className="">{option.name}</span>
                </p>
              </Dropdown.Item>
            ) : (
              ""
            )
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default AddProductInput;
