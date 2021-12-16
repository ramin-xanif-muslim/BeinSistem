import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import ProductModal from "../../components/ProductModal";
import {
  fetchProductId,
  fetchRefList,
  savePrice,
  fetchPriceTypes,
  delPrice,
  fetchProductFolders,
} from "../../api";
import DocButtons from "../../components/DocButtons";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  Popconfirm,
  Card,
  Select,
  Spin,
  Space,
  Alert,
  Menu,
  Row,
  Col,
  Collapse,
  Modal,
} from "antd";
import "antd/dist/antd.css";
import { message } from "antd";
import { Redirect } from "react-router";
import { saveDoc, fetchBarcode, fetchCard } from "../../api";
import {
  SyncOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Tab } from "semantic-ui-react";
import { useTableCustom } from "../../contexts/TableContext";
import ProductGroupModal from "../../components/ProductGroupModal";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function NewCustomer() {
  const [form] = Form.useForm();
  const [priceModal, setPriceModal] = useState(false);

  const {
    productGroups,
    setProductGroupsLocalStorage,
    setProductGroups,
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
    setPricesLocalStorage,
    groupVisible,
    setGroupVisible,
    setNewGroup,
    newGroup,
    setStockLocalStorage,
    customers,
    setCustomers,
    customerGroups,
    setCustomerGroups,
    setCustomerGroupsLocalStorage,
    setDisable,
    disable,
  } = useTableCustom();
  const [attrs, setAttrs] = useState(
    attributes ? attributes : JSON.parse(localStorage.getItem("attr"))
  );
  const [pricetypes, setPriceTypes] = useState(
    prices ? prices : JSON.parse(localStorage.getItem("prices"))
  );
  const [oneref, setOneRef] = useState([]);
  const [priceIsAdd, setPriceIsAdd] = useState(false);
  const [editPrice, setEditPrice] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);
  const [list, setList] = useState([]);
  const [barcode, setBarcode] = useState(null);
  const [listLength, setListLength] = useState(0);
  const [linked, setLinked] = useState(null);

  useEffect(() => {
    getBarcode();
  }, []);
  const onClose = () => {
    message.destroy();
  };

  const getBarcode = async () => {
    const res = await fetchCard();
    setBarcode(res.Body);
    form.setFieldsValue({
      card: res.Body,
    });
  };
  var obj;
  customerGroups
    ? (obj = customerGroups)
    : (obj = JSON.parse(localStorage.getItem("cusgroups")));

  const groupOption = Object.values(obj).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  var ownerList;
  owners
    ? (ownerList = owners)
    : (ownerList = JSON.parse(localStorage.getItem("owners")));

  var departmentList;
  departments
    ? (departmentList = departments)
    : (departmentList = JSON.parse(localStorage.getItem("departments")));
  const ownerOption = Object.values(ownerList).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));
  const departmentOption = Object.values(departmentList).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  const panes = [
    {
      menuItem: "Endirm",
      render: () => (
        <Tab.Pane className="numberinputsholder" attached={false}>
          <Form.Item label="Enidirm" name="discount">
            <Input type="number" step="any" className="hiddenarrows" min={0} />
          </Form.Item>
          <Form.Item label="Bonus" name="bonus">
            <Input type="number" step="any" className="hiddenarrows" min={0} />
          </Form.Item>
        </Tab.Pane>
      ),
    },
  ];

  const handleChanged = () => {
    if (disable) {
      setDisable(false);
    }
  };
  const handleFinish = async (values) => {
    setDisable(true);

    message.loading({ content: "Loading...", key: "pro_update" });
    const res = await saveDoc(values, "customers");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "pro_update",
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
        key: "pro_update",
        duration: 0,
      });
    }
  };
  if (redirect) return <Redirect to={`/editCustomer/${editId}`} />;

  return (
    <div className="doc_wrapper product_wrapper">
      <div className="doc_name_wrapper">
        <h2>Müştəri</h2>
      </div>
      <DocButtons
        controller={"customers"}
        closed={"p=customer"}
        additional={"none"}
      />
      <div className="formWrapper">
        <Form
          form={form}
          id="myForm"
          style={{ padding: "0px 20px" }}
          name="basic"
          initialValues={{}}
          className=""
          layout="horizontal"
          onFinish={handleFinish}
          onFieldsChange={handleChanged}
        >
          <Row>
            <Col className="left_wrapper" xs={24} md={12} xl={8}>
              <Form.Item
                label="Müştəri adı"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Zəhmət olmasa, məhsulun adını qeyd edin..",
                  },
                ]}
              >
                <Input allowClear={true} />
              </Form.Item>
              <Form.Item label="Kart" name="card">
                <Input
                  suffix={
                    <SyncOutlined className={"suffixed"} onClick={getBarcode} />
                  }
                />
              </Form.Item>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
                className="plus_wrapper"
              >
                <Form.Item
                  label="Qrup"
                  name="groupid"
                  className="group_item_wrapper"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                    },
                  ]}
                >
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
                <PlusOutlined
                  onClick={() => setGroupVisible(true)}
                  className="add_elements_group"
                />
              </div>
              <Form.Item label="Telefon" name="phone">
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Şərh">
                <TextArea rows={3} />
              </Form.Item>

              <Collapse ghost>
                <Panel header="Təyinat" key="1">
                  <Form.Item
                    label={"Cavabdeh"}
                    name="ownerid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      filterOption={false}
                      notFoundContent={<Spin size="small" />}
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {ownerOption}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={"Şöbə"}
                    name="departmentid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      filterOption={false}
                      notFoundContent={<Spin size="small" />}
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {departmentOption}
                    </Select>
                  </Form.Item>
                </Panel>
              </Collapse>
            </Col>
            <Col style={{ paddingLeft: "3rem" }} xs={24} md={12} xl={8}>
              <div className="tab_wrapper">
                <Tab menu={{ attached: false }} panes={panes} />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default NewCustomer;