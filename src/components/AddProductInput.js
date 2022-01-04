import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import axios from "axios";
import { useTableCustom } from "../contexts/TableContext";

function AddProductInput({ from }) {
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
                    var repeatedProduct = outerDataSource.find(
                        (p) => p.BarCode === searchTerm
                    );
                    if (repeatedProduct) {
                        let result = Object.keys(repeatedProduct).reduce(
                            (prev, current) => ({
                                ...prev,
                                [current.toLowerCase()]:
                                    repeatedProduct[current],
                            }),
                            {}
                        );
                        delete result["key"];
                        result = {
                            ...result,
                            value: result.productid,
                            text: result.name,
                        };
                        delete result["productid"];

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
                    costpricetotal: `${
                        parseFloat(r.CostPrice) * parseFloat(1)
                    }`,
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

            if (list) {
                setProductList(datas);
                setOpenDropDown(true);
            }
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
            totalprice: `${
                parseFloat(res.data.Body.List[0].Price) * parseFloat(1)
            }`,
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
        setNewPro(ob);
        setAdd(true);
        setOpenDropDown(false);
        setProductList([]);
        setValue("");
        setSearchTerm("");
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
                style={{
                    width: "100%",
                    fontWeight: "400",
                    fontStyle: "italic",
                    opacity: "1",
                    padding: "0.7rem 0",
                }}
                searchQuery={value}
                floating
                labeled
                open={openDropDown ? true : false}
                lazyLoad
                icon="shop"
                onClose={onClose}
                onSearchChange={(e) => handleSearch(e.target.value)}
                search
                placeholder="Məhsul əlavə et - Ad, Barkod və ya Artkod ilə"
            >
                <Dropdown.Menu style={{ maxHeight: "none", maxHeight: "46vh" }}>
                    {productList.map((option, index) =>
                        option.id !== "0" ? (
                            (console.log(option),
                            (
                                <Dropdown.Item
                                    key={option.value}
                                    {...option}
                                    onClick={() => onChange(option)}
                                >
                                    <div className="list-item-product">
                                        <div className="product-index">
                                            {index + 1}
                                        </div>
                                        <div className="list-item-body">
                                            <div className="item-row first-row">
                                                <div>
                                                    <div className="product-name">
                                                        <p>{option.name}</p>
                                                    </div>
                                                    <div className="product-artcode">
                                                        <p>{option.artcode}</p>
                                                    </div>
                                                </div>
                                                <div className="product-price">
                                                    {from === "demands" ? (
                                                        <p>
                                                            {(
                                                                Math.round(
                                                                    option.price *
                                                                        100
                                                                ) / 100
                                                            ).toFixed(2)}
                                                            <sup>₼</sup>
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            {(
                                                                Math.round(
                                                                    option.buyprice *
                                                                        100
                                                                ) / 100
                                                            ).toFixed(2)}
                                                            <sup>₼</sup>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="item-row second-row">
                                                <div className="product-barcode">
                                                    <p>{option.barcode}</p>
                                                </div>
                                                <div className="product-stock-quantity">
                                                    <p
                                                        className={
                                                            option.stockquantity <
                                                            0
                                                                ? "color-red"
                                                                : ""
                                                        }
                                                    >
                                                        {option.stockquantity
                                                            ? Math.round(
                                                                  option.stockquantity
                                                              ) + " əd"
                                                            : "0 əd"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown.Item>
                            ))
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
