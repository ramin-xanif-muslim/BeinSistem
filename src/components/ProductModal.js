import React from "react";
import { useEffect, useState } from "react";
import { fetchRefList } from "../api";
import { fetchProductFolders } from "../api";
import { useCustomForm } from "../contexts/FormContext";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Checkbox,
  Select,
  Spin,
  Row,
  Col,
  Collapse,
} from "antd";
import "antd/dist/antd.css";
import { message } from "antd";
import { saveDoc, fetchBarcode } from "../api";
import {
  SyncOutlined,
  PlusOutlined,
  CloseCircleOutlined,
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
                              option.label
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
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
                    <div style={{ padding: "0.3rem 1rem 1rem" }}>
                        <Form.Item label="Alış qiyməti" name="buyprice">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                allowClear
                                addonAfter="₼"
                                min={0}
                            />
                        </Form.Item>
                        <h3>Satış qiymətləri</h3>
                        <Form.Item label="Minimal qiyməti" name="minprice">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                addonAfter="₼"
                                allowClear
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item label="Satış qiyməti" name="price">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                addonAfter="₼"
                                allowClear
                                min={0}
                            />
                        </Form.Item>
                        <div className="prices_wrapper">
                            {pricetypes.map((c) => (
                                <div className="price_del_icons">
                                    <Form.Item
                                        label={c.Name}
                                        name={"PriceType_" + c.Id}
                                    >
                                        <Input
                                            type="number"
                                            step="any"
                                            className="hiddenarrows detail-input-addon"
                                            allowClear
                                            addonAfter="₼"
                                            min={0}
                                        />
                                    </Form.Item>

                                    {/* <Dropdown
                                        className="customnewdoc"
                                        overlay={editDel({
                                            namepr: c.Name,
                                            id: c.Id,
                                        })}
                                        trigger={["click"]}
                                    >
                                        <BsThreeDotsVertical />
                                    </Dropdown> */}
                                </div>
                            ))}
                        </div>
                        {/* <Button
                            type="dashed"
                            className={"create_new_price_button"}
                            onClick={() => handleOpenNewPrice()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Yeni qiymət
                        </Button> */}
                    </div>
                    {/* <Modal
                        destroyOnClose
                        className="modal_price_type"
                        title="Ad"
                        visible={priceModal}
                        onCancel={(e) => handleGancel(e)}
                        footer={[
                            <Button key="back" onClick={(e) => handleGancel(e)}>
                                Bağla
                            </Button>,
                            <Button
                                key="submit"
                                htmlType={"submit"}
                                className="customsavebtn"
                                form="priceTypes"
                            >
                                Yadda saxla
                            </Button>,
                        ]}
                    >
                        <Form
                            id="priceTypes"
                            name="dynamic_form_nest_item"
                            autoComplete="off"
                            onFinish={handleDynamicFinish}
                            initialValues={{
                                namepr: editPrice ? editPrice.namepr : null,
                                id: editPrice ? editPrice.id : null,
                            }}
                        >
                            <Form.Item name="namepr">
                                <Input placeholder={"adı"} />
                            </Form.Item>

                            <Form.Item name="id" hidden={true}>
                                <Input placeholder={"adı"} />
                            </Form.Item>
                        </Form>
                    </Modal> */}
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
        {
            menuItem: "Şəkillər",
            render: () => (
                <Tab.Pane attached={false}>
                    <p>
                        <i>Tezliklə...</i>
                    </p>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Anbar qalığı",
            render: () => (
                <Tab.Pane attached={false}>
                    <p>
                        <i>Tezliklə...</i>
                    </p>
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
                <Button danger key="back" onClick={handleCancel}>
                    Bağla
                </Button>,
                <Button
                    htmlType="submit"
                    className="customsavebtn"
                    form={"newPro"}
                >
                    Yadda saxla
                </Button>,
            ]}
            onCancel={handleCancel}
        >
            <div
                className="formWrapper product_wrapper"
                style={{ background: "#fff" }}
            >
                <Form
                    form={form}
                    id="newPro"
                    style={{ padding: "0px 20px" }}
                    name="basic"
                    initialValues={{}}
                    layout="horizontal"
                    onFinish={handleFinish}
                    onFieldsChange={onValuesChange}
                >
                    <Row>
                        <Col xs={24} md={12} xl={12}>
                            <Row>
                                <Col>
                                    <h3 style={{ marginBottom: "2.6rem" }}>
                                        Ümumi məlumat
                                    </h3>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item
                                        label="Məhsulun adı"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Zəhmət olmasa, məhsulun adını qeyd edin..",
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="detail-input"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item label="Barkod" name="barcode">
                                        <Input
                                            className="detail-input"
                                            suffix={
                                                <SyncOutlined
                                                    style={{ color: "#0288d1" }}
                                                    className="suffixed"
                                                    // onClick={this.onGetBarcode}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Button
                                        className="add-stock-btn"
                                        // onClick={() => setGroupVisible(true)}
                                    >
                                        <PlusOutlined />
                                    </Button>
                                    <Form.Item
                                        label="Qrup"
                                        name="groupid"
                                        className="group_item_wrapper"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            className="doc_status_formitem_wrapper_col"
                                            className="detail-select"
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {groupOption}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item label="Artkod" name="artcode">
                                        <Input className="detail-input" />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item name="description" label="Şərh">
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item
                                        label="Çəki"
                                        name="isweight"
                                        valuePropName="checked"
                                    >
                                        <Checkbox
                                            size="large"
                                            onChange={handleBarcodeSelect}
                                            name="wt"
                                        ></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            style={{ paddingLeft: "5rem" }}
                            xs={24}
                            md={24}
                            xl={10}
                        >
                            <div className="tab_wrapper">
                                <Tab
                                    menu={{ attached: false }}
                                    onTabChange={handleTabChange}
                                    panes={panes}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} xl={12}>
                            <Collapse ghost>
                                <Panel
                                    className="custom_panel_header_2"
                                    header="Əlavə parametr"
                                    key="1"
                                >
                                    <Collapse ghost>
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
                                                <InputNumber className="detail-input-number" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Ədəd"
                                                name="packquantity"
                                                // onBlur={(e) => this.onChangeItem(e, "packquantity")}
                                            >
                                                <InputNumber className="detail-input-number" />
                                            </Form.Item>
                                        </Panel>
                                    </Collapse>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} xl={8}>
                            <Collapse ghost>
                                <Panel
                                    className="custom_panel_header"
                                    header="Təyinat"
                                    key="1"
                                >
                                    <Form.Item
                                        label={"Cavabdeh"}
                                        name="ownerid"
                                    >
                                        <Select
                                            className="detail-select"
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                            filterOption={(input, option) =>
                                                option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {ownerOption}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label={"Şöbə"}
                                        name="departmentid"
                                    >
                                        <Select
                                            className="detail-select"
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                            filterOption={(input, option) =>
                                                option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {departmentOption}
                                        </Select>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
}

export default ProductModal;
