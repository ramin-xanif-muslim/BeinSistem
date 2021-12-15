import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";

import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography } from "antd";

import Buttons from "../components/Button";
import { Button, Icon } from "semantic-ui-react";
import FastSearch from "../components/FastSearch";
import FilterComponent from "../components/FilterComponent";
import { useTableCustom } from "../contexts/TableContext";
import enters from "../ButtonsNames/Enters/buttonsNames";

import { SettingOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function SaleReport() {
  const [redirect, setRedirect] = useState(false);
  const [direction, setDirection] = useState(1);
  const [defaultdr, setDefaultDr] = useState("descend");
  const [initialSort, setInitialSort] = useState("Quantity");
  const [fieldSort, setFieldSort] = useState("Quantity");
  const [otherColumns, setOtherColumns] = useState([]);

  const [allsum, setallsum] = useState(0);
  const [allprofit, setallprofit] = useState(0);
  const [allbonus, setallbonus] = useState(0);
  const [allbank, setallbank] = useState(0);
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(0);
  const [filtered, setFiltered] = useState(false);

  const [columnChange, setColumnChange] = useState(false);
  const [initial, setInitial] = useState(null);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
  const {
    marks,
    setMarkLocalStorage,
    setMark,
    isFilter,
    advancedPage,
    setAdvancedPage,
    doSearch,
    search,
    advanced,
    setdisplay,
    display,
  } = useTableCustom();

  const [documentList, setDocumentList] = useState([]);
  
  const { isLoading, error, data, isFetching } = useQuery(
    ["salereports", page, direction, fieldSort, doSearch, search, advanced],
    () => {
      return isFilter === true
        ? fetchFilterPage(
            "salereports",
            advancedPage,
            advanced,
            direction,
            fieldSort
          )
        : doSearch
        ? fecthFastPage("salereports", page, search)
        : !isFilter && !doSearch
        ? fetchPage("salereports", page, direction, fieldSort)
        : null;
    }
  );

  var markObject;
  var ac = 'salam'
  marks
    ? (markObject = marks)
    : (markObject = JSON.parse(localStorage.getItem("marks")));
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        dataIndex: "Order",
        show: true,
        render: (text, record, index) => index + 1 + 25 * advancedPage,
      },
      {
        dataIndex: "ProductName",
        title: "Məhsul adı",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "ProductName")
              .show
          : true,
        defaultSortOrder: initialSort === "ProductName" ? defaultdr : null,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Quantity",
        title: "Miqdar",
        defaultSortOrder: initialSort === "Quantity" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Quantity")
            ? Object.values(initial).find((i) => i.dataIndex === "Quantity")
                .show
            : true
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "SumCost",
        title: 'Cəm Maya',
        defaultSortOrder: initialSort === "SumCost" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "SumCost")
            ? Object.values(initial).find((i) => i.dataIndex === "SumCost").show
            : true
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "SumPrice",
        title: "Cəm satış",
        defaultSortOrder: initialSort === "SumPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "SumPrice")
            ? Object.values(initial).find((i) => i.dataIndex === "SumPrice")
                .show
            : true
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "RetQuantity",
        title: "Miqdar",
        defaultSortOrder: initialSort === "RetQuantity" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "RetQuantity")
            ? Object.values(initial).find((i) => i.dataIndex === "RetQuantity")
                .show
            : true
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "RetSumCost",
        title: "Cəm maya",
        defaultSortOrder: initialSort === "RetSumCost" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "RetSumCost")
            ? Object.values(initial).find((i) => i.dataIndex === "RetSumCost")
                .show
            : true
          : true,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "RetSumPrice",
        title: "Cəm satış",
        defaultSortOrder: initialSort === "RetSumPrice" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "RetSumPrice")
            ? Object.values(initial).find((i) => i.dataIndex === "RetSumPrice")
                .show
            : true
          : true,
        sorter: (a, b) => null,
      },

      {
        dataIndex: "Profit",
        title: "Qazanc",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Profit").show
          : true,
        defaultSortOrder: initialSort === "Profit" ? defaultdr : null,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Percent",
        title: "Marja",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Profit").show
          : true,
        render: (value, row, index) => {
          if (row.SumPrice - row.RetSumPrice === 0) {
            return "0 %";
          } else {
            if (!row.SumPrice) {
              return (
                (parseFloat(row.Profit) * 100) / parseFloat(row.RetSumPrice) +
                " %"
              );
            } else if (row.RetSumPrice) {
              return (
                (parseFloat(row.Profit) * 100) /
                  parseFloat(row.SumPrice - row.RetSumPrice) +
                " %"
              );
            } else {
              return (
                (parseFloat(row.Profit) * 100) / parseFloat(row.SumPrice) + " %"
              );
            }
          }
        },
      },
    ];
  }, [defaultdr, initialSort, filtered, marks, advancedPage]);

  useEffect(() => {
    setInitial(columns);
    setColumnChange(true);
  }, []);
  const filters = useMemo(() => {
    return [
      {
        key: "1",
        label: "Alış №",
        name: "docNumber",
        type: "text",
        hidden: false,
      },
      {
        key: "2",
        label: "Məhsul adı",
        name: "productName",
        type: "select",
        controller: "products",
        hidden: false,
      },

      {
        key: "3",
        label: "Anbar",
        name: "stockName",
        type: "select",
        controller: "stocks",
        hidden: false,
      },
      {
        key: "4",
        label: "Şöbə",
        name: "departmentName",
        controller: "departments",
        type: "select",
        hidden: true,
      },
      {
        key: "5",
        label: "Cavabdeh",
        name: "ownerName",
        controller: "owners",
        type: "select",
        hidden: true,
      },
      {
        key: "6",
        label: "Dəyişmə tarixi",
        name: "modifedDate",
        type: "date",
        hidden: true,
      },
      {
        key: "7",
        label: "Məbləğ",
        name: "docPrice",
        start: "amb",
        end: "ame",
        type: "range",
        hidden: true,
      },
      {
        key: "8",
        label: "Tarixi",
        name: "createdDate",
        type: "date",
        hidden: false,
      },
    ];
  });
  useEffect(() => {
    if (!isFetching) {
      setDocumentList(data.Body.List);
    } else {
      setDocumentList([]);
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

  const handleVisibleChange = (flag) => {
    setVisibleMenuSettings(flag);
  };

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

  useEffect(() => {
    if (filtered) setFiltered(false);
    setColumnChange(false);
  }, [filtered, columnChange]);
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
                    Object.values(initial).find(
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
  console.log(columns);
  return (
    <div className="custom_display">
      <Row className="header_row">
        <Col xs={24} md={24} xl={4}>
          <div className="page_heder_left">
            <h2>Mənfəət</h2>
          </div>
        </Col>
        <Col xs={24} md={24} xl={20}>
          <div className="page_heder_right">
            <div className="buttons_wrapper">
              <Button
                className="filter_button buttons_click"
                onClick={() =>
                  display === "none" ? setdisplay("block") : setdisplay("none")
                }
                content="Filter"
              />
              <FastSearch className="search_header" />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={24} xl={24}>
          <FilterComponent cols={filters} />
        </Col>
      </Row>
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
        rowKey="Name"
        columns={columns.filter((c) => c.show == true)}
        bordered
        onChange={onChange}
        dataSource={documentList}
        title={(pageData) => (
          <Row>
            <span>Satislar</span> <span>Qaytarmalar</span>
          </Row>
        )}
        summary={() => (
          <Table.Summary.Row>
            {columns
              .filter((c) => c.show === true)
              .map((c) => (
                <Table.Summary.Cell>
                  <Text type="">{null}</Text>
                </Table.Summary.Cell>
              ))}
          </Table.Summary.Row>
        )}
        locale={{ emptyText: <Spin /> }}
        pagination={{
          current: advancedPage + 1,
          total: data.Body.Count,
          onChange: handlePagination,
          defaultPageSize: 100,
          showSizeChanger: false,
        }}
        size="small"
      />
    </div>
  );
}
