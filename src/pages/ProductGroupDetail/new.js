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
        setDisable(true);
        if (!values.parentid) {
            values.parentid = "00000000-0000-0000-0000-000000000000";
        }
        message.loading({ content: "Yüklənir...", key: "progr_update" });
        const res = await saveDoc(values, "productfolders");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlanıldı",
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

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    if (redirect) return <Redirect to={`/editProductGroup/${editId}`} />;

    return (
        <div className="doc_wrapper product_wrapper">
            <div className="doc_name_wrapper">
                <h2>Məhsul qrupu</h2>
            </div>
            <DocButtons
                additional={"none"}
                editid={null}
                closed={"p=product"}
            />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    style={{ padding: "0px 20px" }}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    className="doc_forms"
                    onFinish={handleFinish}
                    onFieldsChange={handleChanged}
                >
                    <Row>
                        <Col xs={8} sm={8} md={8} xl={8}>
                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                    className="left_form_wrapper"
                                >
                                    <Form.Item
                                        size="small"
                                        label="Məhsulun qrupu"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                                            },
                                        ]}
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                    className="left_form_wrapper"
                                >
                                    <Form.Item label="Şərh" name="description">
                                        <TextArea size="small" allowClear />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                    className="left_form_wrapper"
                                >
                                    <Form.Item
                                        label="Yerləşdiyi Qrup"
                                        name="parentid"
                                    >
                                        <Select
                                            showSearch
                                            className="doc_status_formitem_wrapper_col "
                                            placeholder=""
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                        >
                                            {groupOption}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default NewProductGroup;
