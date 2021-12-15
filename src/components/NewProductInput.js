import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import axios from "axios";
import { useTableCustom } from "../contexts/TableContext";

function NewProductInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeScan, setBarcodeScan] = useState(false);
  const [list, setList] = useState(null);
  const [productList, setProductList] = useState([]);
  const { newPro, setNewPro, setAdd } = useTableCustom();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      var filter = {
        token: localStorage.getItem("access-token"),
        fast: searchTerm,
      };
      if (searchTerm) getProduct(filter);
      else setProductList([]);
      // Send Axios request here
    }, 1000);

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
    }
  }, [list]);
  async function getProduct(obj) {
    const data = await axios.post(
      `https://dev.bein.az/controllers/products/getfast.php`,
      obj
    );
    setList(data);
  }

  const onChange = (ob) => {
    setNewPro(ob);
    setAdd(true);
  };

  const onClose = () => {
    setBarcodeScan(false);
    setProductList([]);
  };
  return (
    <div>
      <Dropdown
        button
        className="icon"
        style={{ width: "100%" }}
        floating
        labeled
        lazyLoad
        icon="shop"
        onClose={onClose}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
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

export default NewProductInput;
