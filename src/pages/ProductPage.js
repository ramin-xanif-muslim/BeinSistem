import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";
import { Button, Icon } from "semantic-ui-react";

import ProductGroup from "../components/ProductGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import { SettingOutlined, PrinterOutlined } from "@ant-design/icons";
import { useRef } from "react";
import "semantic-ui-css/semantic.min.css";
export default function ProductPage() {
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
        title: "Məhsulun adı",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Name").show
          : true,
        defaultSortOrder: initialSort === "Name" ? defaultdr : null,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "BarCode",
        title: "Barkod",
        defaultSortOrder: initialSort === "BarCode" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BarCode").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "ArtCode",
        title: "Artkod",
        defaultSortOrder: initialSort === "ArtCode" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "ArtCode").show
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
        dataIndex: "BuyPrice",
        title: "Alış qiyməti",
        defaultSortOrder: initialSort === "BuyPrice" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BuyPrice").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Price",
        title: "Satış qiyməti",
        defaultSortOrder: initialSort === "Price" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Price").show
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "MinPrice",
        title: "Minimum qiymət",
        defaultSortOrder: initialSort === "MinPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "MinPrice").show
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
      {
        dataIndex: "StockBalance",
        title: "Anbar qalığı",
        defaultSortOrder: initialSort === "StockBalance" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "StockBalance")
              .show
          : true,
        sorter: (a, b) => null,
      },

      {
        dataIndex: "PackPrice",
        title: "Paket qiyməti",
        defaultSortOrder: initialSort === "PackPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "PackPrice").show
          : false,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "PackQuantity",
        title: "Paket miqdarı",
        defaultSortOrder: initialSort === "PackQuantity" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "PackQuantity")
              .show
          : false,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "PrintBarcode",
        title: "Print",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "PrintBarcode")
              .show
          : true,
        render: (value, row, index) => {
          return (
            <span
              onClick={getProductPrint(
                row.ProductId,
                row.BarCode,
                row.IsPack === 1 ? row.PackPrice : row.Price,
                row.Name
              )}
            >
              <PrinterOutlined />
            </span>
          );
        },
      },
    ];
  }, [direction, fieldSort, filtered, advancedPage]);


  const getProductPrint = (id, br, pr, nm) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/bc/?bc=${br}&pr=${pr}&nm=${nm}`);
    
  };
  let newcols = [];
  useEffect(() => {
    if (attributes) {
      Object.values(attributes).forEach((c) => {
        let otherColumn = {
          dataIndex: c.Name,
          title: c.Title,
          show: initial
            ? Object.values(initial).find((i) => i.dataIndex === c.Name).show
            : false,
          sorter: (a, b) => null,
        };
        newcols = [...newcols, otherColumn];
      });
      setOtherColumns(newcols);
      setColumnChange(true);
    }
  }, [attributes]);



  const [cols, setCols] = useState([]);

  const { isLoading, error, data, isFetching } = useQuery(
    [
      "products",
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
            "products",
            advancedPage,
            advanced,
            direction,
            fieldSort,
            searchGr,
            null,
            0
          )
        : doSearch
        ? fecthFastPage("products", advancedPage, search, searchGr)
        : !isFilter && !doSearch
        ? fetchPage(
            "products",
            advancedPage,
            direction,
            fieldSort,
            searchGr,
            null, 
            0
          )
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

  useEffect(() => {
    setRefList([]);
    getAttributes();
    getPrices();
  }, []);
  const getAttributes = async () => {
    const attrResponse = await fetchAttributes();
    setAttributes(attrResponse.Body.List);
    setAttrLocalStorage(attrResponse.Body.List);
  };
  const getPrices = async () => {
    const priceResponse = await fetchPriceTypes();
    setPrices(priceResponse.Body.List);
    setPricesLocalStorage(priceResponse.Body.List);
  };

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

    useEffect(() => {
      if (filtered) setFiltered(false);
      if (columnChange) setInitial(columnsnew);
    }, [columnChange, filtered]);

    const columnsnew = useMemo(
      () => [...columns, ...otherColumns],
      [columnChange, direction, fieldSort, advancedPage]
    );
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
                    Object.values(columnsnew).find(
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
        columns={columnsnew.filter((c) => c.show == true)}
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
