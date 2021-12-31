import React from "react";
import {  useState} from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Spin,
    Row,
    Col,
    Collapse,
    Modal,
} from "antd";
import "antd/dist/antd.css";
import { message } from "antd";
import { saveDoc } from "../api";
import {
    CloseCircleOutlined,
} from "@ant-design/icons";
import { useTableCustom } from "../contexts/TableContext";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function ProductGroupModal() {
    const [form] = Form.useForm();
    const {
        productGroups,
        attributes,
        prices,
        groupVisible,
        setGroupVisible,
        setNewGroup,
    } = useTableCustom();
    const [attrs, setAttrs] = useState(
        attributes ? attributes : JSON.parse(localStorage.getItem("attr"))
    );
    const [pricetypes, setPriceTypes] = useState(
        prices ? prices : JSON.parse(localStorage.getItem("prices"))
    );

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
    const handleCancel = () => {
        setGroupVisible(false);
    };
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
            setNewGroup(res.Body.ResponseService);
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

    return (
        <Modal
            className="create_product_modal"
            title="Məhsul Qrupu"
            visible={groupVisible}
            footer={[
                <Button danger key="back" onClick={handleCancel}>
                    Bağla
                </Button>,
                <Button
                    className="customsavebtn"
                    htmlType="submit"
                    form={"groupform"}
                >
                    Yadda saxla
                </Button>,
            ]}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                id="groupform"
                name="basic"
                layout="horizontal"
                onFinish={handleFinish}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
            >
                <Row className="main_form_side">
                    <Col xs={24} md={24} xl={24} className="left_form_wrapper">
                        <Form.Item
                            label="Qrup"
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
                    <Col xs={24} md={24} xl={24}>
                        <Form.Item label="Şərh" name="description">
                            <TextArea allowClear />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <Form.Item label="Yerləşdiyi qrup" name="parentid">
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
        </Modal>
    );
}

export default ProductGroupModal;
