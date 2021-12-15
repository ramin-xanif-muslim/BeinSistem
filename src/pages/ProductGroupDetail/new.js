import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchProductId, fetchRefList } from "../../api";
import DocButtons from "../../components/DocButtons";
import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  Card,
  Select,
  Spin,
  Space,
  Alert,
  Menu,
  Row,
  Col,
  Collapse,
} from "antd";
import "antd/dist/antd.css";
import { message } from "antd";
import { Redirect } from "react-router";
import { saveDoc, fetchBarcode } from "../../api";
import {
  SyncOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Tab } from "semantic-ui-react";
import { useTableCustom } from "../../contexts/TableContext";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function NewProductGroup() {
  const [form] = Form.useForm();
  const {
    productGroups,
    departments,
    owners,
    attributes,
    attrLoading,
    setAttrLoading,
    refList,
    setRefList,
    setRefsLocalStorage,
    linkedList,
    setLinkedList,
    prices,
    setPrices,
  } = useTableCustom();
  const [attrs, setAttrs] = useState(
    attributes ? attributes : JSON.parse(localStorage.getItem("attr"))
  );
  const [pricetypes, setPriceTypes] = useState(
    prices ? prices : JSON.parse(localStorage.getItem("prices"))
  );
  const [oneref, setOneRef] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);
  const [list, setList] = useState([]);
  const [barcode, setBarcode] = useState(null);
  const [listLength, setListLength] = useState(0);
  const [linked, setLinked] = useState(null);

  const onClose = () => {
    message.destroy();
  };
  var obj;
  productGroups
    ? (obj = productGroups)
    : (obj = JSON.parse(localStorage.getItem("progroups")));

  const groupOption = Object.values(obj).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  const handleFinish = async (values) => {
    if (!values.parentid) {
      values.parentid = "00000000-0000-0000-0000-000000000000";
    }
    message.loading({ content: "Loading...", key: "progr_update" });
    const res = await saveDoc(values, "productfolders");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "progr_update",
        duration: 2,
      });
      setEditId(res.Body.ResponseService);
      setRedirect(true);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "progr_update",
        duration: 0,
      });
    }
  };

  if (redirect) return <Redirect to={`/editProductGroup/${editId}`} />;

  return (
    <div>
      <DocButtons />
      <Form
        form={form}
        id="myForm"
        style={{ padding: "0px 20px" }}
        name="basic"
        className=""
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Row className="main_form_side">
          <Col xs={24} md={20} xl={8} className="left_form_wrapper">
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

            <Form.Item label="Product GroupName" name="parentid">
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
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default NewProductGroup;
