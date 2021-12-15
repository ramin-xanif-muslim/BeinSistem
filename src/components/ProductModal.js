import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchProductId, fetchRefList } from "../api";
import DocButtons from "../components/DocButtons";
import { fetchProductFolders } from "../api";
import { useCustomForm } from "../contexts/FormContext";
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
import { saveDoc, fetchBarcode } from "../api";
import {
  SyncOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Tab } from "semantic-ui-react";
import { useTableCustom } from "../contexts/TableContext";
import { Modal } from "antd";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function ProductModal() {
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
    isNew,
    setNew,
    setNewPro,
    setAdd,
    setProductGroups,
    setProductGroupsLocalStorage,
  } = useTableCustom();

  const { setProductModal, productModal } = useCustomForm();
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

  const handleOk = () => {
    setProductModal(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setProductModal(false);
    form.resetFields();
  };
  const onClose = () => {
    message.destroy();
  };
  useEffect(() => {
    if (productModal) {
      form.resetFields();

      setLinkedList([]);
      getGroups();
      setOneRef([]);
      getlists();
      getBarcode(false);
    } else {
      form.resetFields();
    }

    return () => {
      setLinkedList([]);
      setLinked([]);
    };
  }, [productModal]);

  useEffect(() => {
    if (count === listLength) {
      setAttrLoading(false);
    }
    setLinkedList([
      ...linkedList,
      {
        [linked]: {
          list,
        },
      },
    ]);
  }, [list]);

  const getGroups = async () => {
    const res = await fetchProductFolders();
    if (res.Headers.ResponseStatus === "0") {
      setProductGroups(res.Body.List);
      setProductGroupsLocalStorage(res.Body.List);
    }
  };
  const getlists = async () => {
    setAttrLoading(true);
    setLinkedList([]);
    setOneRef([]);
    count = 0;
    const elements = attrs.filter((a) => a.ReferenceTypeId != "");
    setListLength(Object.keys(elements).length);
    for (const elem of elements) {
      const arr = await fetchRefList(elem.ReferenceTypeId);
      count++;
      setLinked(elem.ReferenceTypeId);
      setList(arr);
    }
  };
  const handleBarcodeSelect = (event) => {
    getBarcode(event.target.checked);
  };
  const getBarcode = async (weight) => {
    const res = await fetchBarcode(weight);
    setBarcode(res.Body);
    form.setFieldsValue({
      barcode: res.Body,
    });
  };

  const fillOption = (id) => {
    oneRefArray = [];
    setOneRef([]);
    Object.values(linkedList).map((links) => {
      Object.entries(links).forEach(([key, value]) => {
        if (key === id) {
          value.list.map((r) => {
            oneRefArray.push({
              label: r.Name,
              value: r.Id,
            });
          });
        }
      });
      setOneRef(oneRefArray);
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    Object.assign(lastObject, {
      [changedValues[0].name[0]]: changedValues[0].value,
    });
  };
  const handleFinish = async (values) => {
    console.log(values);
    var error = false;

    message.loading({ content: "Loading...", key: "pro_update" });
    Object.assign(values, lastObject);
    var prices = [];
    Object.entries(values).map(([k, v]) => {
      if (k.indexOf("PriceType_") != -1) {
        if (v) {
          prices.push({
            PriceType: k.slice(k.indexOf("_") + 1),
            Price: v,
          });
        }
      }
    });
    values.prices = prices;

    Object.values(attrs).map((atr) => {
      Object.entries(values).findIndex(([k, v]) => console.log(k));
      if (atr.IsRequired === 1) {
        if (
          Object.entries(values).findIndex(
            ([k, v]) => k === "col_" + atr.Name
          ) === -1
        ) {
          console.log("values", values);
          error = true;
        }
      }
    });

    if (error) {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {"Vacib paratmetlrer var"}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "pro_update",
        duration: 0,
      });
    }
    if (!error) {
      const res = await saveDoc(values, "products");
      if (res.Headers.ResponseStatus === "0") {
        message.success({
          content: "Saxlanildi",
          key: "pro_update",
          duration: 2,
        });
        var obj = values;
        obj.id = res.Body.ResponseService;
        setNewPro(obj);
        setNew(true);
        setProductModal(false);
        lastObject = {};
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
    }
  };
  var obj;
  productGroups
    ? (obj = productGroups)
    : (obj = JSON.parse(localStorage.getItem("progroups")));

  const groupOption = obj
    ? Object.values(obj).map((c) => <Option key={c.Id}>{c.Name}</Option>)
    : null;

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

  const handleTabChange = (event, data) => {};
  const modInputs = attrs
    ? attrs
        .filter((a) => a.ReferenceTypeId === "")
        .map((a) => (
          <Form.Item
            label={a.Title}
            name={a.Name}
            key={a.Id}
            rules={[
              {
                required: a.IsRequired == 1 ? true : false,
                message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
              },
            ]}
          >
            <Input allowClear={true} />
          </Form.Item>
        ))
    : null;
  const modSelects = attrs
    ? attrs
        .filter((a) => a.ReferenceTypeId != "")
        .map((a) => (
          <Form.Item
            label={a.Title}
            name={`col_${a.Name}`}
            key={a.Id}
            rules={[
              {
                required: a.IsRequired == 1 ? true : false,
                message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
              },
            ]}
          >
            <Select
              showSearch
              allowClear={true}
              autoFocus={false}
              style={{ width: 200 }}
              id={`col_${a.Name}`}
              placeholder=""
              onFocus={() => fillOption(a.ReferenceTypeId)}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              notFoundContent={<Spin size="small" />}
              options={oneref}
            />
          </Form.Item>
        ))
    : null;
  const panes = [
    {
      menuItem: "Qiymət",
      render: () => (
        <Tab.Pane className="numberinputsholder" attached={false}>
          <Form.Item label="BuyPrice" name="buyprice">
            <Input
              type="number"
              step="any"
              className="hiddenarrows"
              addonAfter="₼"
              min={0}
            />
          </Form.Item>
          <Form.Item label="Cost Price" name="costprice">
            <Input
              type="number"
              step="any"
              className="hiddenarrows"
              disabled={true}
              addonAfter="₼"
              min={0}
            />
          </Form.Item>
          <h5>Satış qiymətləri</h5>
          <Form.Item label="Product Price" name="price">
            <Input
              type="number"
              step="any"
              className="hiddenarrows"
              addonAfter="₼"
              min={0}
            />
          </Form.Item>
          <div className="prices_wrapper">
            {pricetypes.map((c) => (
              <div className="price_del_icons">
                <Form.Item label={c.Name} name={"PriceType_" + c.Id}>
                  <Input
                    type="number"
                    step="any"
                    className="hiddenarrows"
                    addonAfter="₼"
                    min={0}
                  />
                </Form.Item>
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Parametrlər",
      render: () => (
        <Tab.Pane attached={false} loading={attrLoading}>
          {modInputs}
          {modSelects}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Modal
      className="create_product_modal custom_modal"
      title="Məhsul"
      destroyOnClose={true}
      visible={productModal}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button htmlType="submit" type="primary" form={"newPro"}>
          Submit
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      <div>
        <Form
          form={form}
          id="newPro"
          style={{ padding: "0px 20px" }}
          name="basic"
          initialValues={{}}
          className=""
          layout="horizontal"
          onFinish={handleFinish}
          onFieldsChange={onValuesChange}
        >
          <Row>
            <Col xs={24} md={12} xl={8}>
              <Form.Item
                label="Product Name"
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
              <Form.Item label="BarCode" name="barcode">
                <Input
                  suffix={
                    <SyncOutlined
                      className={"suffixed"}
                      // onClick={this.onGetBarcode}
                    />
                  }
                />
              </Form.Item>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Form.Item
                  label="Product GroupName"
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
                <PlusOutlined className="custom_add_group_icon addGroupFromProducts" />
              </div>
              <Form.Item label="ArtCode" name="artcode">
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item label="Weight" name="isweight" valuePropName="checked">
                <Checkbox onChange={handleBarcodeSelect} name="wt"></Checkbox>
              </Form.Item>
              <Collapse ghost>
                <Panel header="Əlavə parametr" key="1">
                  <Collapse>
                    <Panel header="Paket (qutu)" key="1">
                      <Form.Item
                        label={"Paketli məhsul"}
                        valuePropName="checked"
                        name={"ispack"}
                      >
                        <Checkbox></Checkbox>
                      </Form.Item>
                      <Form.Item
                        label="Satış qiyməti"
                        name="packprice"
                        // onBlur={(e) => this.onChangeItem(e, "packprice")}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Ədəd"
                        name="packquantity"
                        // onBlur={(e) => this.onChangeItem(e, "packquantity")}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
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
            <Col xs={24} md={12} xl={8}>
              <div className="tab_wrapper">
                <Tab
                  menu={{ attached: false }}
                  onTabChange={handleTabChange}
                  panes={panes}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}

export default ProductModal;
