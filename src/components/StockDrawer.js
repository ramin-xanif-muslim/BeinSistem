import { useState, useEffect } from "react";
import { useCustomForm } from "../contexts/FormContext";
import { saveDoc } from "../api";
import { useTableCustom } from "../contexts/TableContext";
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
function StockDrawer() {
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
  } = useCustomForm();
  const { stocks, setStockLocalStorage } = useTableCustom();

  var obj;
  stocks ? (obj = stocks) : (obj = JSON.parse(localStorage.getItem("stocks")));
  const onClose = () => {
    setStockDrawer(false);
  };
  const groupOption = Object.values(obj).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  const handleFinish = async (values) => {
    if (!values.parentid) {
      values.parentid = "00000000-0000-0000-0000-000000000000";
    }
    message.loading({ content: "Loading...", key: "stocks_update" });
    const res = await saveDoc(values, "stocks");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "stocks_update",
        duration: 2,
      });
      setCreatedStock({
        name: values.name,
        id: res.Body.ResponseService,
      });
      setStockDrawer(false);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "stocks_update",
        duration: 0,
      });
    }
  };
  return (
    <Drawer
      title="Anbar Yarat"
      placement="right"
      width={600}
      onClose={onClose}
      visible={stockDrawer}
    >
      <Form
        id="myForm"
        style={{ padding: "0px 20px" }}
        name="basic"
        className=""
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Row className="main_form_side">
          <Col xs={24} md={20} xl={24} className="left_form_wrapper">
            <Form.Item
              label="Group Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea allowClear />
            </Form.Item>

            <Form.Item label="Anbar qrupu" name="parentid">
              <Select
                showSearch
                className="doc_status_formitem_wrapper_col "
                placeholder=""
                filterOption={false}
                notFoundContent={<Spin size="small" />}
              >
                {groupOption}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}

export default StockDrawer;
