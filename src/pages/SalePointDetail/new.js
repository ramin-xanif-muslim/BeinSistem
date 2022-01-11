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
    Switch,
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
import { useCustomForm } from "../../contexts/FormContext";
import StockDrawer from "../../components/StockDrawer";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function NewSalePoint() {
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
        customers,
        setCustomers,
        customerGroups,
        setCustomerGroups,
        setCustomerGroupsLocalStorage,
        setDisable,
        disable,
        stocks,
        setStockLocalStorage,
        setStock,
    } = useTableCustom();
    const { setStockDrawer } = useCustomForm();
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

    const onClose = () => {
        message.destroy();
    };

    var obj;
    stocks
        ? (obj = stocks)
        : (obj = JSON.parse(localStorage.getItem("stocks")));

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

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    const handleFinish = async (values) => {
        setDisable(true);

        message.loading({ content: "Yüklənir...", key: "pro_update" });
        const res = await saveDoc(values, "salepoints");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlanıldı",
                key: "pro_update",
                duration: 2,
            });
            setEditId(res.Body.ResponseService);
            setRedirect(true);
            audio.play();
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
    if (redirect) return <Redirect to={`/editSalePoint/${editId}`} />;

    return (
        <div className="doc_wrapper product_wrapper">
            <div className="doc_name_wrapper">
                <h2>Satış nöqtəsi</h2>
            </div>
            <DocButtons
                controller={"salepoints"}
                closed={"p=salepoints"}
                additional={"none"}
            />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    style={{ padding: "20px" }}
                    name="basic"
                    initialValues={{}}
                    className=""
                    layout="horizontal"
                    onFinish={handleFinish}
                    onFieldsChange={handleChanged}
                >
                    <Row>
                        <Col
                            xs={8}
                            sm={8}
                            md={8}
                            xl={8}
                            className="left_form_wrapper"
                        >
                            <Form.Item
                                label="Satış nöqtəsi"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa, məhsulun adını qeyd edin..",
                                    },
                                ]}
                            >
                                <Input allowClear={true} />
                            </Form.Item>

                            <Form.Item label="Şərh" name="description">
                                <TextArea size="small" allowClear />
                            </Form.Item>
                            <Button className="add-group-btn">
                                <PlusOutlined
                                    onClick={() => setStockDrawer(true)}
                                />
                            </Button>
                            <Form.Item
                                label="Bağlı anbar"
                                name="stockid"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa, anbarı seçin..",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    className="doc_status_formitem_wrapper_col "
                                    placeholder=""
                                    filterOption={false}
                                    notFoundContent={<Spin size="small" />}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {groupOption}
                                </Select>
                            </Form.Item>
                            <Form.Item name="status" valuePropName="checked">
                                <Switch
                                    checkedChildren="Aktiv"
                                    unCheckedChildren="Deaktiv"
                                    defaultChecked
                                />
                            </Form.Item>
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
                                            showSearch
                                            placeholder=""
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
                                            showSearch
                                            placeholder=""
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
            <StockDrawer />
            <ProductModal />
        </div>
    );
}

export default NewSalePoint;
