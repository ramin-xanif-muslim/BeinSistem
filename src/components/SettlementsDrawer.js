import { useState, useEffect } from "react";
import { useCustomForm } from "../contexts/FormContext";
import { fetchLinkedDoc, saveDoc } from "../api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTableCustom } from "../contexts/TableContext";
import { useMemo } from "react";
import { Table } from "antd";

import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  DatePicker,
  Switch,
  Select,
  Spin,
  Tag,
  Divider,
  Menu,
  Drawer,
  Typography,
  Statistic,
  Popconfirm,
  Row,
  Col,
  message,
  Collapse,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
function SettlementsDrawer() {
  const {
    docstock,
    setDocStock,
    docmark,
    setDocMark,
    setLoadingForm,
    setStockDrawer,
    stockDrawer,
    createdStock,
    setCreatedStock,
    visibleDrawer,
    setVisibleDrawer,
    cusid,
    setcusid,
  } = useCustomForm();
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
  const { stocks, setStockLocalStorage } = useTableCustom();
  const [documentList, setDocumentList] = useState([]);
  const [page, setPage] = useState(0);

  const { isLoading, error, data, isFetching } = useQuery(
    ["linkedDoc", cusid, page, visibleDrawer],
    () => visibleDrawer  ? fetchLinkedDoc(cusid, page) : null
  );
  const onClose = () => {
    setVisibleDrawer(false);
    setDocumentList([]);
    setcusid(null);
  };

  const columns = useMemo(() => {
    return [
      {
        dataIndex: "Order",
        title: "№",
        show: true,
        render: (text, record, index) => index + 1 + 15 * page,
      },
      {
        dataIndex: "Name",
        title: "Adı",
      },
      {
        dataIndex: "DocType",
        title: "Sənədin növü",
        render: (value, row, index) => {
          switch (value) {
            case "Return":
              return "Pərakəndə Qaytarma";
            case "Sale":
              return "Pərakəndə Satış";
            case "PaymentOut":
              return "Məxaric nəğd";
            case "PaymentIn":
              return "Mədaxil nəğd";
            case "Supply":
              return "Alış";
            case "Demand":
              return "Satış";
            default:
              break;
          }
        },
      },
      {
        dataIndex: "Moment",
        title: "Tarix",
      },
      {
        dataIndex: "Amount",
        title: "Məbləğ",
      },
      {
        dataIndex: "SalePointName",
        title: "Satış nöqtəsi",
      },
    ];
  }, [page]);
  const handlePagination = (pg) => {
    setPage(pg - 1);
  };
  useEffect(() => {
    if (!isFetching) {
      setDocumentList(data.Body.List);
    } else {
      setDocumentList([]);
    }
  }, [isFetching]);
  if (error) return "An error has occurred: " + error.message;

  return (
    <Drawer
      title="Əlaqəli sənədlər"
      placement="right"
      width={1200}
      onClose={onClose}
      visible={visibleDrawer}
    >
      {isLoading ? (
        "Loading..."
      ) : error ? (
        `error occured ${error.message}`
      ) : (
        <Table
          rowKey="Id"
          columns={columns}
          className="drawertable"
          dataSource={documentList}
          locale={{ emptyText: <Spin /> }}
          pagination={{
            current: page + 1,
            total: data.Body.Count,
            onChange: handlePagination,
            defaultPageSize: data.Body.Limit,
            showSizeChanger: false,
          }}
          size="small"
        />
      )}
    </Drawer>
  );
}

export default SettlementsDrawer;
