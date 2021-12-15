import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import CustomerGroup from "../components/CustomerGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import CustomerPage from "./CustomerPage";
import { Button, Icon } from "semantic-ui-react";
export default function Customer() {
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
      name: "customerName",
      type: "text",
      dataIndex: "customerName",
      show: initialfilter
        ? Object.values(initialfilter).find(
            (i) => i.dataIndex === "customerName"
          ).show
        : true,
    },
    {
      key: "2",
      label: "Kart №",
      name: "card",
      type: "text",
      dataIndex: "card",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "card").show
        : true,
    },
    {
      key: "3",
      label: "Telefon",
      name: "phone",
      type: "text",
      dataIndex: "phone",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "phone").show
        : true,
    },

    {
      key: "4",
      label: "Bonus",
      name: "bonus",
      start: "bonusb",
      end: "bonuse",
      type: "range",
      dataIndex: "bonus",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "bonus").show
        : true,
    },
    {
      key: "5",
      label: "Endirim",
      name: "discount",
      start: "disb",
      end: "dise",
      type: "range",
      dataIndex: "discount",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "discount")
            .show
        : true,
    },
    {
      key: "6",
      label: "Müştəri Qrupu",
      name: "gp",
      controller: "customergroups",
      type: "select",
      dataIndex: "gp",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "gp").show
        : true,
    },
    {
      key: "7",
      label: "Email",
      name: "email",
      type: "text",
      dataIndex: "email",
      show: initialfilter
        ? Object.values(initialfilter).find((i) => i.dataIndex === "email").show
        : true,
    },
  ];
}, [filterChanged]);
  
   const handleVisibleChangeFilter = (flag) => {
     setVisibleMenuSettingsFilter(flag);
  };

  
  useEffect(() => {
    setInitialFilter(filters);
    if (filterChanged) setFilterChanged(false);
  }, [filterChanged]);
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
                    Object.values(filters).find(
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
  return (
    <div className="custom_display">
      <Row className="header_row">
        <Col xs={24} md={24} xl={4}>
          <div className="page_heder_left">
            <h2>Tərəf-müqabillər</h2>
          </div>
        </Col>
        <Col xs={24} md={24} xl={20}>
          <div className="page_heder_right">
            <div className="buttons_wrapper">
              <Buttons
                text={"Yeni Müştəri"}
                redirectto={"/newcustomer"}
                animate={"Yarat"}
              />
              <Buttons
                text={"Yeni Qrup"}
                redirectto={"/newcusgroup"}
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
            cols={filters}
          />
        </Col>
      </Row>{" "}
      <Row>
        <Col xs={24} md={24} xl={4}>
          <CustomerGroup />
        </Col>
        <Col xs={24} md={24} xl={20}>
          <CustomerPage />
        </Col>
      </Row>
    </div>
  );
}
