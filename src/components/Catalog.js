import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import Buttons from "./Button";
import { useTableCustom } from "../contexts/TableContext";
import ProductGroup from "./ProductGroup";
import {
  Table,
  Modal,
  Button,
  Spin,
  Row,
  Col,
  Menu,
  Checkbox,
  Dropdown,
  Alert,
} from "antd";
import MyFastSearch from "../components/MyFastSearch";
import sendRequest from "../config/sentRequest";
import {
  ConvertFixedTable,
  isObject,
} from "../config/function/findadditionals";
const Catalog = ({ onClose, isCatalogVisible, positions }) => {
  const [count, setCount] = useState(1);
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

  const [otherColumns, setOtherColumns] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [direction, setDirection] = useState(0);
  const [defaultdr, setDefaultDr] = useState("ascend");
  const [initialSort, setInitialSort] = useState("Name");
  const [fieldSort, setFieldSort] = useState("Name");
  const [columnChange, setColumnChange] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [initial, setInitial] = useState(
    localStorage.getItem("procolumns")
      ? JSON.parse(localStorage.getItem("procolumns"))
      : null
  );
  const [isList, setIsList] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    productSearchTerm,
    setProductSearchTerm,
    search,
    doSearch,
    isFilter,
    advanced,
    advancedPage,
    setAdvancedPage,
    searchGr,
    attributes,
    setdisplay,
    display,
    setCatalog,
  } = useTableCustom();
  const { isLoading, error, data, isFetching } = useQuery(
    isCatalogVisible && [
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

  const searchFunc = async (value) => {
    setIsLoadingSearch(true);
    setProductSearchTerm(value);
    let obj = {
      ar: 0,
      dr: 1,
      fast: value,
      gp: "",
      pg: 0,
      lm: 100,
    };
    let res = await sendRequest("products/getfast.php", obj);
    setCount(res.Count);
    setProdutcList(res.List);
    setIsLoadingSearch(false);
  };
  useEffect(() => {
    if (!isFetching && isCatalogVisible) {
      if (isObject(data.Body)) {
        setProdutcList(data.Body.List);
        setCount(data.Body.Count);
      }
    } else {
      setProdutcList([]);
    }
  }, [isFetching]);
  const handlePagination = (pg) => {
    setPage(pg - 1);
    setAdvancedPage(pg - 1);
  };

  const onCloseModal = () => {
    setCatalog(true);
    onClose(selectedRows);
  };
  const onSelectChange = (selectedRowKey, selectedRow) => {
    var ids = new Set(selectedRows.map((d) => d.Id));

    var mergedKeys = [...selectedRowKeys, ...selectedRowKey];
    var merged = [
      ...selectedRows,
      ...selectedRow.filter((d) => !ids.has(d.Id)),
    ];
    setSelectedRows(merged);
    setSelectedRowKeys([...new Set(mergedKeys)]);
  };

  useEffect(() => {
    if (isCatalogVisible) {
      setSelectedRows(positions);

      let pos = [];
      console.log(positions);
      positions.map((p) => {
        pos.push(p.ProductId);
      });
      setSelectedRowKeys(pos);
    }
  }, [isCatalogVisible]);
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
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

  const columns = useMemo(() => {
    return [
      {
        dataIndex: "Order",
        title: "№",
        show: true,
        render: (text, record, index) => index + 1 + 100 * advancedPage,
      },
      {
        dataIndex: "Name",
        title: "Məhsulun adı",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Name").show
          : true,
        defaultSortOrder: initialSort === "Name" ? defaultdr : null,
        sorter: (a, b) => null,
        className: initialSort === "Name" ? "activesort" : "",
      },
      {
        dataIndex: "BarCode",
        title: "Barkod",
        defaultSortOrder: initialSort === "BarCode" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BarCode").show
          : true,
        sorter: (a, b) => null,
        className: initialSort === "BarCode" ? "activesort" : "",
      },
      {
        dataIndex: "ArtCode",
        title: "Artkod",
        defaultSortOrder: initialSort === "ArtCode" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "ArtCode").show
          : false,
        sorter: (a, b) => null,
        className: initialSort === "ArtCode" ? "activesort" : "",
      },
      {
        dataIndex: "GroupName",
        title: "Qrup",
        defaultSortOrder: initialSort === "GroupName" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "GroupName").show
          : true,
        sorter: (a, b) => null,
        className: initialSort === "GroupName" ? "activesort" : "",
      },
      {
        dataIndex: "BuyPrice",
        title: "Alış qiyməti",
        defaultSortOrder: initialSort === "BuyPrice" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BuyPrice").show
          : true,
        sorter: (a, b) => null,
        className: initialSort === "BuyPrice" ? "activesort" : "",
        render: (value, row, index) => {
          return ConvertFixedTable(value);
        },
      },
      {
        dataIndex: "Price",
        title: "Satış qiyməti",
        defaultSortOrder: initialSort === "Price" ? defaultdr : null,

        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Price").show
          : true,
        sorter: (a, b) => null,
        className: initialSort === "Price" ? "activesort" : "",
        render: (value, row, index) => {
          return ConvertFixedTable(value);
        },
      },
      {
        dataIndex: "MinPrice",
        title: "Minimum qiymət",
        defaultSortOrder: initialSort === "MinPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "MinPrice").show
          : false,
        sorter: (a, b) => null,
        className: initialSort === "MinPrice" ? "activesort" : "",
        render: (value, row, index) => {
          return ConvertFixedTable(value);
        },
      },

      {
        dataIndex: "Description",
        defaultSortOrder: initialSort === "Description" ? defaultdr : null,
        title: "Şərh",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Description")
              .show
          : false,
        sorter: (a, b) => null,
        className: initialSort === "Description" ? "activesort" : "",
      },
      {
        dataIndex: "StockBalance",
        title: "Anbar qalığı",
        default: 0,
        defaultSortOrder: initialSort === "StockBalance" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "StockBalance")
              .show
          : true,
        sorter: (a, b) => null,
        className: initialSort === "StockBalance" ? "activesort" : "",
      },

      {
        dataIndex: "PackPrice",
        title: "Paket qiyməti",
        defaultSortOrder: initialSort === "PackPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "PackPrice").show
          : false,
        sorter: (a, b) => null,
        className: initialSort === "PackPrice" ? "activesort" : "",
        render: (value, row, index) => {
          return ConvertFixedTable(value);
        },
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
        className: initialSort === "PackQuantity" ? "activesort" : "",
        render: (value, row, index) => {
          return ConvertFixedTable(value);
        },
      },
    ];
  }, [direction, fieldSort, filtered, advancedPage]);

//   if (error) return "An error has occurred: " + error.message;
  return (
    <Modal
      title="Məhsullar"
      className="catalog_modal"
      visible={isCatalogVisible}
      onOk={() => onCloseModal()}
      okText="Əlavə et"
      cancelText="Bağla"
      onCancel={onClose}
    >
      <div className="custom_display">
        <Row className="header_row">
          <Col xs={24} md={24} xl={20}>
            <div className="page_heder_right">
              <div className="buttons_wrapper">
                <MyFastSearch
                  searchFunc={searchFunc}
                  setSearchTerm={setProductSearchTerm}
                  searchTerm={productSearchTerm}
                  className="search_header"
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={24} md={24} xl={5}>
            <ProductGroup from="catalog" />
          </Col>
          <Col xs={24} md={24} xl={19}>
            <Table
              className="main-table"
              rowKey="Id"
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              onChange={onChange}
              dataSource={productList}
              pagination={{
                current: advancedPage + 1,
                total: count,
                onChange: handlePagination,
                defaultPageSize: 100,
                showSizeChanger: false,
              }}
              locale={{
                emptyText: isFetching ? <Spin /> : "Cədvəl boşdur",
              }}
              size="small"
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
export default Catalog;
