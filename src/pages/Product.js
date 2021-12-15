import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";

import ProductGroup from "../components/ProductGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import ProductPage from "./ProductPage";
import { Button, Icon } from "semantic-ui-react";
import { SettingOutlined } from "@ant-design/icons";

export default function Product() {
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(0);
  const [productList, setProdutcList] = useState([]);
  const [initialfilter, setInitialFilter] = useState(null);
  const [filterChanged, setFilterChanged] = useState(false);
  const [filterChange, setFilterChange] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);

  const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
    useState(false);
  const {
    productGroups,
    setAttrLoading,
    setAttributes,
    attributes,
    setAttrLocalStorage,
    setPrices,
    prices,
    setPricesLocalStorage,
    setRefList,
    search,
    setFastSearch,
    doSearch,
    setDoSearch,
    isFilter,
    setIsFilter,
    advanced,
    setAdvance,
    setdisplay,
    display,
  } = useTableCustom();

  const filters = useMemo(() => {
    return [
      {
        key: "1",
        label: "Adı",
        name: "productname",
        type: "text",
        dataIndex: "productname",
        show: initialfilter
          ? Object.values(initialfilter).find(
              (i) => i.dataIndex === "productname"
            ).show
          : true,
      },
      {
        key: "2",
        label: "Barkodu",
        name: "bc",
        type: "text",
        dataIndex: "bc",
        show: initialfilter
          ? Object.values(initialfilter).find((i) => i.dataIndex === "bc").show
          : true,
      },

      {
        key: "3",
        label: "Alş qiyməti",
        name: "buyPrice",
        start: "bprb",
        end: "bpre",
        type: "range",
        dataIndex: "buyPrice",
        show: initialfilter
          ? Object.values(initialfilter).find((i) => i.dataIndex === "buyPrice")
              .show
          : true,
      },
      {
        key: "4",
        label: "Satış Qiyməti",
        name: "salePrice",
        start: "prb",
        end: "pre",
        type: "range",
        dataIndex: "salePrice",
        show: initialfilter
          ? Object.values(initialfilter).find(
              (i) => i.dataIndex === "salePrice"
            ).show
          : true,
      },
      {
        key: "5",
        label: "Məhsul Qrupu",
        name: "gp",
        controller: "productfolders",
        type: "select",
        dataIndex: "gp",
        show: initialfilter
          ? Object.values(initialfilter).find((i) => i.dataIndex === "gp").show
          : true,
      },
      {
        key: "6",
        label: "Arxivli",
        name: "ar",
        controller: "yesno",
        default: 0,
        type: "selectDefaultYesNo",
        dataIndex: "ar",
        show: initialfilter
          ? Object.values(initialfilter).find((i) => i.dataIndex === "ar").show
          : true,
      },
      {
        key: "7",
        label: "Çəkili",
        name: "wg",
        controller: "yesno",
        default: "",
        type: "selectDefaultYesNo",
        dataIndex: "wg",
        show: initialfilter
          ? Object.values(initialfilter).find((i) => i.dataIndex === "wg").show
          : true,
      },
    ];
  }, [filterChanged]);

  let newfilters = [];

  useEffect(() => {
    if (attributes) {
      Object.values(attributes).forEach((c) => {
        let otherColumn = {
          key: c.ReferenceTypeId,
          label: c.Title,
          name: c.ValueType === "string" ? "colt--" + c.Name : "",
          type: c.ReferenceTypeId ? "selectMod" : "text",
          controller: c.ReferenceTypeId ? "selectMod" : "textMod",
          dataIndex: c.Name,
          show: initialfilter
            ? Object.values(initialfilter).find((i) => i.dataIndex === c.Name)
                .show
            : true,
        };
        newfilters = [...newfilters, otherColumn];
      });
      setFilterColumns(newfilters);
      setFilterChange(true);
    }
  }, [attributes]);

  // useEffect(() => {}, []);
  const handleVisibleChangeFilter = (flag) => {
    setVisibleMenuSettingsFilter(flag);
  };

  const onChangeMenuFilter = (e) => {
    var initialCols = initialfilter;
    var findelement;
    var findelementindex;
    var replacedElement;
    console.log(e.target.id);
    findelement = initialCols.find((c) => c.dataIndex === e.target.id);
    findelementindex = initialCols.findIndex(
      (c) => c.dataIndex === e.target.id
    );
    findelement.show = e.target.checked;
    replacedElement = findelement;
    initialCols.splice(findelementindex, 1, {
      ...findelement,
      ...replacedElement,
    });
    console.log(initialCols);
    setFilterChanged(true);
  };


  useEffect(() => {
    if (filterChange) setInitialFilter(filtersnew);
    if (filterChanged) setFilterChanged(false);
  }, [filterChange, filterChanged]);

  const filtersnew = useMemo(
    () => [...filters, ...filterColumns],
    [filterChange]
  );

  const filtermenus = (
    <Menu>
      <Menu.ItemGroup title="Sutunlar">
        {initialfilter
          ? Object.values(initialfilter).map((d) => (
              <Menu.Item key={d.dataIndex}>
                <Checkbox
                  id={d.dataIndex}
                  onChange={(e) => onChangeMenuFilter(e)}
                  defaultChecked={
                    Object.values(filtersnew).find(
                      (e) => e.dataIndex === d.dataIndex
                    ).show
                  }
                >
                  {d.label}
                </Checkbox>
              </Menu.Item>
            ))
          : null}
      </Menu.ItemGroup>
    </Menu>
  );

  const filterSetting = (
    <Dropdown
      trigger={["click"]}
      overlay={filtermenus}
      onVisibleChange={handleVisibleChangeFilter}
      visible={visibleMenuSettingsFilter}
    >
      <Button className="flex_directon_col_center">
        {" "}
        <SettingOutlined />
      </Button>
    </Dropdown>
  );
  // console.log(filtersnew);
  return (
    <div className="custom_display">
      <Row className="header_row">
        <Col xs={24} md={24} xl={4}>
          <div className="page_heder_left">
            <h2>Məhsullar</h2>
          </div>
        </Col>
        <Col xs={24} md={24} xl={20}>
          <div className="page_heder_right">
            <div className="buttons_wrapper">
              <Buttons
                text={"Yeni Mehsul"}
                redirectto={"/newproduct"}
                animate={"Yarat"}
              />
              <Buttons
                text={"Yeni Qrup"}
                redirectto={"/newprogroup"}
                animate={"Yarat"}
              />
              <Button
                className="filter_button buttons_click"
                onClick={() =>
                  display === "none" ? setdisplay("block") : setdisplay("none")
                }
                content="Filter"
                content="Filter"
              />
              <FastSearch className="search_header" />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={24} xl={24}>
          <FilterComponent
            from={"products"}
            settings={filterSetting}
            cols={filtersnew}
          />
        </Col>
      </Row>{" "}
      <Row>
        <Col xs={24} md={24} xl={4}>
          <ProductGroup />
        </Col>
        <Col xs={24} md={24} xl={20}>
          <ProductPage />
        </Col>
      </Row>
    </div>
  );
}
