import React from "react";
import { useQueryClient } from "react-query";
import { fetchDocName } from "../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTableCustom } from "../contexts/TableContext";
import { fetchCustomers } from "../api";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Form,
    Input,
    Button,
    DatePicker,
    Checkbox,
    Select,
    Spin,
    Modal,
    Row,
    Col,
    Collapse,
} from "antd";
import { message } from "antd";
import { saveDoc } from "../api";
import { useCustomForm } from "../contexts/FormContext";
import { fetchStocks, getCustomerFastFilter, fetchSpendItems } from "../api";
import StatusSelect from "./StatusSelect";
import TextArea from "antd/lib/input/TextArea";
import { propTypes } from "react-bootstrap/esm/Image";
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
var spendOptions = null;
function PaymentOutModal({ datas }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const {
        customers,
        setCustomers,
        spenditems,
        setSpendItems,
        setSpendsLocalStorage,
    } = useTableCustom();
    const { paymentModal, setPaymentModal, isPayment, setIsPayment } =
        useCustomForm();
    const [docname, setDocName] = useState(null);
    const [spends, setSpends] = useState(false);
    const [newStocksLoad, setNewStocksLoad] = useState(null);

    useEffect(() => {
        if (isPayment) getSpendItems();
    }, [isPayment]);
    const getCustomers = async () => {
        const customerResponse = await fetchCustomers();
        setCustomers(customerResponse.Body.List);
    };

    const getSpendItems = async () => {
        setSpends(false);
        const itemResponse = await fetchSpendItems();
        setSpendItems(itemResponse.Body.List);
        setSpendsLocalStorage(itemResponse.Body.List);
        setSpends(true);
    };
    const doSearch = async (value) => {
        const customerResponse = await getCustomerFastFilter(value);
        setCustomers(customerResponse.Body.List);
    };

    //#region OwDep

    var objCustomers;
    customers
        ? (objCustomers = customers)
        : (objCustomers = JSON.parse(localStorage.getItem("customers")));
    const customerOptions = Object.values(objCustomers).map((c) => (
        <Option key={c.Id} value={c.Id}>
            {c.Name}
        </Option>
    ));

    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, "paymentins");
        return attrResponse;
    };
    const onClose = () => {
        message.destroy();
    };
    //#endregion OwDep
    const handleGancel = () => {
        setPaymentModal(false);
        setIsPayment(false);
    };

    const handleFinish = async (values) => {
        values.moment = values.moment._i;
        message.loading({ content: "Y??kl??nir...", key: "payment_update" });
        const nameres = await getDocName(values.name);
        values.name = nameres.Body.ResponseService;
        const res = await saveDoc(values, "paymentins");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Mexaric Saxlan??ld??",
                key: "payment_update",
                duration: 2,
            });
            setPaymentModal(false);
        } else {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlan??lmad??... {res.Body}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "payment_update",
                duration: 0,
            });
        }
    };
    return (
        <Modal
            className="payment-out-modal"
            title={propTypes.title}
            visible={paymentModal}
            onCancel={handleGancel}
            footer={[
                <Button danger key="back" onClick={handleGancel}>
                    Ba??la
                </Button>,
                <Button
                    form="payForm"
                    htmlType="submit"
                    className="customsavebtn"
                >
                    Yadda saxla
                </Button>,
            ]}
        >
            <Form
                form={form}
                id="payForm"
                className="doc_forms"
                name="basic"
                initialValues={{
                    status: true,
                    customerid: datas.CustomerId,
                    linkid: datas.Id,
                    moment: moment(),
                    spenditem: spenditems
                        ? spenditems.find((s) => s.StaticName === "buyproduct")
                              .Id
                        : null,
                }}
                onFinish={handleFinish}
                layout="horizontal"
            >
                <Row>
                    <Col xs={24} md={24} xl={11}>
                        <Form.Item
                            label="M??xaric ???"
                            name="name"
                            className="doc_number_form_item"
                            style={{ width: "100%" }}
                        >
                            <Input
                                style={{ width: "100px" }}
                                placeholder="0000"
                                allowClear
                                className="detail-input"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={2}></Col>
                    <Col xs={24} md={24} xl={11}>
                        <Form.Item
                            label="M??bl????"
                            name="amount"
                            className="doc_number_form_item"
                        >
                            <Input
                                className="detail-input"
                                type="number"
                                step="any"
                                placeholder="???"
                                allowClear
                                min={0}
                                style={{ width: "100px" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={3}></Col>
                    <Col xs={24} md={24} xl={6}></Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} xl={11}>
                        <Form.Item
                            label="Tarix"
                            name="moment"
                            style={{ width: "100%" }}
                        >
                            <DatePicker
                                className="detail-input"
                                showTime={{ format: "HH:mm:ss" }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={2}></Col>
                    <Col xs={24} md={24} xl={11}>
                        <Button className="add-stock-btn">
                            <PlusOutlined
                            // onClick={() => setCustomerDrawer(true)}
                            />
                        </Button>
                        <Form.Item
                            className="form-item-customer"
                            label="Qar????-t??r??f"
                            name="customerid"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Z??hm??t olmasa, qar???? t??r??fi se??in",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                showArrow={false}
                                filterOption={false}
                                className="customSelect detail-select"
                                allowClear={true}
                                // onChange={(e) => setCustomerId(e)}
                            >
                                {/* {customerOptions} */}
                            </Select>
                        </Form.Item>
                        <p
                            className="customer-debt"
                            // style={debt < 0 ? { color: "red" } : {}}
                        >
                            <span style={{ color: "red" }}>Qal??q borc:</span>
                            {/* {debt} ??? */}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} xl={11}>
                        <Form.Item
                            label="????rh"
                            name="description"
                            style={{ margin: "0", width: "100%" }}
                        >
                            <TextArea
                                showCount
                                maxLength={100}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={2}></Col>
                    <Col xs={24} md={24} xl={11}>
                        <Button className="add-stock-btn">
                            <PlusOutlined
                            // onClick={() => setExpenditure(true)}
                            />
                        </Button>
                        <Form.Item
                            label="X??rc madd??si"
                            name="spenditem"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Z??hm??t olmasa, x??rc madd??sini se??in",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                showArrow={false}
                                className="customSelect detail-select"
                                notFoundContent={<Spin size="small" />}
                                // onChange={onChangeSpendItem}
                                allowClear={true}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {spends
                                    ? Object.values(spenditems).map((c) => (
                                          <Option
                                              staticname={c.StaticName}
                                              key={c.Id}
                                              value={c.Id}
                                          >
                                              {c.Name}
                                          </Option>
                                      ))
                                    : null}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Collapse ghost style={{ width: "100%" }}>
                        <Panel
                            className="custom_panel_header"
                            header="T??yinat"
                            key="1"
                        >
                            <Row>
                                <Col xs={24} md={24} xl={11}>
                                    <Form.Item
                                        label="Cavabdeh"
                                        name="ownerid"
                                        style={{ margin: "0" }}
                                        style={{ width: "100%" }}
                                    >
                                        <Select
                                            showSearch
                                            className="detail-select"
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
                                            {/* {ownerOption} */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={24} xl={2}></Col>
                                <Col xs={24} md={24} xl={11}>
                                    <Form.Item
                                        label="Ke??irilib"
                                        className="docComponentStatus"
                                        name="status"
                                        valuePropName="checked"
                                        style={{ width: "100%" }}
                                    >
                                        <Checkbox name="status"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24} md={24} xl={11}>
                                    <Form.Item
                                        label="????b??"
                                        name="departmentid"
                                        style={{ margin: "0" }}
                                        style={{ width: "100%" }}
                                    >
                                        <Select
                                            className="detail-select"
                                            showSearch
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
                                            {/* {departmentOption} */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={24} xl={2}></Col>
                                <Col xs={24} md={24} xl={11}>
                                    <Form.Item
                                        label="Status"
                                        name="mark"
                                        style={{
                                            width: "100%",
                                            margin: "0",
                                        }}
                                    >
                                        <StatusSelect />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Row>
            </Form>
        </Modal>
    );
}

export default PaymentOutModal;
