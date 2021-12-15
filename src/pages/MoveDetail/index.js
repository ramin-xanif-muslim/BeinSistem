import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
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
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { updateDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
const { Option, OptGroup } = Select;
let customPositions = [];

function LossDetail() {
  const queryClient = useQueryClient();
  const { docPage, docCount, docSum, outerDataSource } = useTableCustom();
  const { docstock, setDocStock, docmark, setDocMark, setLoadingForm } =
    useCustomForm();
  const [positions, setPositions] = useState([]);
  const { doc_id } = useParams();
  const { isLoading, error, data, isFetching } = useQuery(
    ["loss", doc_id],
    () => fetchDocId(doc_id, "losses")
  );

  useEffect(() => {
    if (!isFetching) {
      setDocStock(data.Body.List[0].StockId);
      setDocMark(data.Body.List[0].Mark);
      customPositions = [];
      Object.values(data.Body.List[0].Positions).map((d) =>
        customPositions.push(d)
      );
      customPositions.map((c, index) => (c.key = index));
      customPositions.map((c) => (c.SellPrice = c.Price));
      customPositions.map((c) =>
        c.BasicPrice ? (c.PrintPrice = c.BasicPrice) : ""
      );
      customPositions.map((c) => (c.DefaultQuantity = c.Quantity));

      customPositions.map(
        (c) => (c.TotalPrice = parseFloat(c.Price) * parseFloat(c.Quantity))
      );
      customPositions.map(
        (c) =>
          (c.CostPriceTotal = parseFloat(c.CostPrice) * parseFloat(c.Quantity))
      );
      setPositions(customPositions);
      setLoadingForm(false);
    } else {
      customPositions = [];
      setPositions([]);
      setLoadingForm(true);
      setDocStock(null);
      setDocMark(null);
    }
  }, [isFetching]);

  const onClose = () => {
    message.destroy();
  };
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        dataIndex: "Order",
        className: "orderField",
        editable: false,
        isVisible: true,
        render: (text, record, index) => index + 1 + 100 * docPage,
      },
      {
        title: "Adı",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
      },
      {
        title: "Barkodu",
        dataIndex: "BarCode",
        isVisible: true,
        className: "max_width_field_length",
        editable: false,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.BarCode - b.BarCode,
      },
      {
        title: "Miqdar",
        dataIndex: "Quantity",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Qiyməti",
        dataIndex: "Price",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Məbləğ",
        dataIndex: "TotalPrice",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Qalıq",
        dataIndex: "StockQuantity",
        className: "max_width_field",
        isVisible: true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Sil",
        className: "orderField printField",
        dataIndex: "operation",
        isVisible: true,
        editable: false,
        render: (_, record) => (
          <Typography.Link>
            <Popconfirm
              title="Silməyə əminsinizmi?"
              okText="Bəli"
              cancelText="Xeyr"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a className="deletePosition">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  });

  const updateMutation = useMutation(updateDoc, {
    refetchQueris: ["loss", doc_id],
  });
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const handleFinish = async (values) => {
    values.stockid = docstock;
    values.positions = outerDataSource;
    values.mark = docmark;
    values.moment = values.moment._i;
    values.modify = values.modify._i;
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { id: doc_id, controller: "losses", filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("loss", doc_id);
          } else {
            message.error({
              content: (
                <span className="error_mess_wrap">
                  Saxlanılmadı... {res.Body}{" "}
                  {<CloseCircleOutlined onClick={onClose} />}
                </span>
              ),
              key: "doc_update",
              duration: 0,
            });
          }
        },
      }
    );
  };

  return (
    <div>
      <DocButtons />
      <Form
        id="myForm"
        className="doc_forms"
        name="basic"
        initialValues={{
          name: data.Body.List[0].Name,
          moment: moment(data.Body.List[0].Moment),
          modify: moment(data.Body.List[0].Modify),
          mark: data.Body.List[0].Mark,
          stockid: data.Body.List[0].StockId,
          status: data.Body.List[0].Status == 1 ? true : false,
        }}
        onFinish={handleFinish}
        layout="horizontal"
      >
        <Form.Item
          label="Loss Number"
          name="name"
          className="doc_number_form_item"
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item label="Created Moment" name="moment">
          <DatePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item
          label="Modified moment"
          name="modify"
          className="modified_date_input"
        >
          <DatePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item label="Mark" name="mark">
          <StatusSelect defaultValue={data.Body.List[0].Mark} />
        </Form.Item>
        <Form.Item label="Stock" name="stockid">
          <StockSelect defaultValue={data.Body.List[0].StockId} />
        </Form.Item>
        <Form.Item
          label="Status"
          className="docComponentStatus"
          name="status"
          valuePropName="checked"
        >
          <Checkbox name="status"></Checkbox>
        </Form.Item>
      </Form>

      <AddProductInput />
      <DocTable headers={columns} datas={positions} />
      <div>
        <Statistic
          groupSeparator=" "
          className="doc_info_text total"
          title=""
          value={docSum}
          prefix={"Yekun məbləğ: "}
          suffix={"₼"}
        />
        <Statistic
          groupSeparator=" "
          className="doc_info_text doc_info_secondary quantity"
          title=""
          value={docCount}
          prefix={"Miqdar: "}
          suffix={"əd"}
        />
      </div>
    </div>
  );
}

export default LossDetail;
