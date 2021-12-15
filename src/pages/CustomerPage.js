import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography, } from "antd";
import { Button, Icon } from "semantic-ui-react";

import ProductGroup from "../components/ProductGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import { SettingOutlined } from "@ant-design/icons";
import { useRef } from "react";
import "semantic-ui-css/semantic.min.css";
export default function CustomerPage() {
  const wrapperRef = useRef(null);
  const [openmenu, setopenmenu] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(0);
  const [columnadd, setColumnAdd] = useState(false);
  const [productList, setProdutcList] = useState([]);
  const [otherColumns, setOtherColumns] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [defaultdr, setDefaultDr] = useState("descend");
  const [initialSort, setInitialSort] = useState("GroupName");
  const [fieldSort, setFieldSort] = useState("GroupName");
  const [columnChange, setColumnChange] = useState(false);
  const [initial, setInitial] = useState(null);
  const [menus, setMenu] = useState(null);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
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
    advancedPage,
    setAdvancedPage,
    productcols,
    setproductcols,
    productcolsinitials,
    setproductcolsinitials,
    searchGr,
    setSearchGr,
  } = useTableCustom();

  const columns = useMemo(() => {
    return [
      {
        dataIndex: "Order",
        title: "№",
        show: true,
        render: (text, record, index) => index + 1 + 25 * advancedPage,
      },
      {
        dataIndex: "Name",
        title: "Müştəri adı",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Name").show
          : true,
        defaultSortOrder: initialSort === "Name" ? defaultdr : null,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Card",
        title: "Kart",
        defaultSortOrder: initialSort === "BarCardCode" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BarCoCardde")
              .show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Phone",
        title: "Telefon",
        defaultSortOrder: initialSort === "Phone" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Phone").show
          : false,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "GroupName",
        title: "Qrup",
        defaultSortOrder: initialSort === "GroupName" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "GroupName").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Discount",
        title: "Endirim",
        defaultSortOrder: initialSort === "Discount" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Discount").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Bonus",
        title: "Bonus",
        defaultSortOrder: initialSort === "Bonus" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Bonus").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Mail",
        title: "Mail",
        defaultSortOrder: initialSort === "Mail" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Mail").show
          : false,
        sorter: (a, b) => null,
      },

      {
        dataIndex: "Description",
        defaultSortOrder: initialSort === "Description" ? defaultdr : null,
        title: "Şərh",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Description")
              .show
          : true,
        sorter: (a, b) => null,
      },
     
    ];
  }, [direction, fieldSort, filtered,advancedPage]);

  useEffect(() => {
    setColumnChange(false);
    if (filtered) setFiltered(false);
  }, [columnChange, filtered]);


  const { isLoading, error, data, isFetching } = useQuery(
    [
      "customers",
      page,
      direction,
      fieldSort,
      doSearch,
      search,
      advanced,
      searchGr,
    ],
    () => {
      return isFilter === true
        ? fetchFilterPage(
            "customers",
            advancedPage,
            advanced,
            direction,
            fieldSort,
            searchGr
          )
        : doSearch
        ? fecthFastPage("customers", advancedPage, search, searchGr)
        : !isFilter && !doSearch
        ? fetchPage("customers", advancedPage, direction, fieldSort, searchGr)
        : null;
    }
  );

  useEffect(() => {
    if (!isFetching) {
      setProdutcList(data.Body.List);
    } else {
      setProdutcList([]);
    }
  }, [isFetching]);


 

  const editPage = (id) => {
    setRedirect(true);
    setEditId(id);
  };

  const handlePagination = (pg) => {
    setPage(pg - 1);
    setAdvancedPage(pg - 1);
  };

  function onChange(pagination, filters, sorter, extra) {
    setInitialSort(sorter.field);
    if (sorter.order === "ascend") {
      setDirection(0);
      setFieldSort(sorter.field);
      setDefaultDr("ascend");
    } else {
      setDirection(1);
      setFieldSort(sorter.field);
      setDefaultDr("descend");
    }
  }

  const onChangeMenu = (e) => {
    var initialCols = initial;
    var findelement;
    var findelementindex;
    var replacedElement;
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
    setFiltered(true);
  };


  const handleVisibleChange = (flag) => {
    setVisibleMenuSettings(flag);
  };
const menu = (
  <Menu>
    <Menu.ItemGroup title="Sutunlar">
      {initial
        ? Object.values(initial).map((d) => (
            <Menu.Item key={d.dataIndex}>
              <Checkbox
                id={d.dataIndex}
                onChange={(e) => onChangeMenu(e)}
                defaultChecked={
                  Object.values(columns).find(
                    (e) => e.dataIndex === d.dataIndex
                  ).show
                }
              >
                {d.title}
              </Checkbox>
            </Menu.Item>
          ))
        : null}
    </Menu.ItemGroup>
  </Menu>
);
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (redirect) return <Redirect to={`/editProduct/${editId}`} />;

  return (
    <div>
      <Row>
        <Col xs={24} md={24} xl={24} className="setting_button_wrapper">
          <Dropdown
            trigger={["click"]}
            overlay={menu}
            onVisibleChange={handleVisibleChange}
            visible={visibleMenuSettings}
          >
            <Button className="flex_directon_col_center">
              {" "}
              <SettingOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Table
        rowKey="Id"
        columns={columns.filter((c) => c.show == true)}
        dataSource={productList}
        onChange={onChange}
        locale={{ emptyText: <Spin /> }}
        pagination={{
          current: advancedPage + 1,
          total: data.Body.Count,
          onChange: handlePagination,
          defaultPageSize: data.Body.Limit,
          showSizeChanger: false,
        }}
        size="small"
        onRow={(r) => ({
          onDoubleClick: () => editPage(r.Id),
        })}
      />
    </div>
  );
}
