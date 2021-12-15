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
export default function CashIn() {
  const [redirect, setRedirect] = useState(false);
  const [direction, setDirection] = useState(1);
  const [defaultdr, setDefaultDr] = useState("descend");
  const [initialSort, setInitialSort] = useState("Moment");
  const [fieldSort, setFieldSort] = useState("Moment");
  const [allsum, setallsum] = useState(0);
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
    ["cashins", page, direction, fieldSort, doSearch, search, advanced],
    () => {
      return isFilter === true
        ? fetchFilterPage(
            "cashins",
            advancedPage,
            advanced,
            direction,
            fieldSort
          )
        : doSearch
        ? fecthFastPage("cashins", page, search)
        : !isFilter && !doSearch
        ? fetchPage("cashins", page, direction, fieldSort)
        : null;
    }
  );
  useEffect(() => {
    setColumnChange(false);
    if (filtered) setFiltered(false);
  }, [columnChange, filtered]);

  var markObject;
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
        dataIndex: "SalePointName",
        title: "Satış nöqtəsi",
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "SalePointName")
              .show
          : true,
        defaultSortOrder: initialSort === "SalePointName" ? defaultdr : null,
        sorter: (a, b) => null,
      },
      {
        dataIndex: "Moment",
        title: "Tarix",
        defaultSortOrder: initialSort === "Moment" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Moment").show
          : true,
        sorter: (a, b) => null,
      },

      {
        dataIndex: "Amount",
        title: "Miqdar",
        defaultSortOrder: initialSort === "Amount" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Amount").show
          : true,
        sorter: (a, b) => null,
      },

      {
        dataIndex: "Description",
        title: "Şərh",
        defaultSortOrder: initialSort === "Description" ? defaultdr : null,
        show: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Description")
              .show
          : false,
        sorter: (a, b) => null,
      },
    ];
  }, [defaultdr, initialSort, filtered, marks, advancedPage]);
  useEffect(() => {
    setInitial(columns);
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
      setallsum(data.Body.AllSum);
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

  if (redirect) return <Redirect push to={`/editSale/${editId}`} />;
  return (
    <div className="custom_display">
      <Row className="header_row">
        <Col xs={24} md={24} xl={4}>
          <div className="page_heder_left">
            <h2>Kassa mədaxil</h2>
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
        onChange={onChange}
        dataSource={documentList}
        summary={() => (
          <Table.Summary.Row>
            {columns
              .filter((c) => c.show === true)
              .map((c) => (
                <Table.Summary.Cell>
                  <Text type="">
                    {c.dataIndex === "Amount" ? allsum + " ₼" : null}
                  </Text>
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
