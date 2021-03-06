import React from "react";
import { useQueryClient } from "react-query";
import { fetchDocId, fetchDocName, updateDoc } from "../api";
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
import { useFetchDebt } from "../hooks";
import CustomerDrawer from "./CustomerDrawer";
import Expenditure from "./Expenditure";
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
var spendOptions = null;

function PaymentOutModal({ datas, title, endPoint }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const {
        departments,
        owners,
        customers,
        setCustomers,
        spenditems,
        setSpendItems,
        setSpendsLocalStorage,
    } = useTableCustom();
    const {
        paymentModal,
        setPaymentModal,
        isPayment,
        setIsPayment,
        setCustomerDrawer,
    } = useCustomForm();
    const [docname, setDocName] = useState(null);
    const [spends, setSpends] = useState(false);
    const [newStocksLoad, setNewStocksLoad] = useState(null);
    const [expenditure, setExpenditure] = useState(false);
    const [status, setStatus] = useState(false);
    const [amount, setAmount] = useState(false);
    const [documentName, setDocumentName] = useState();
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState();

    const { debt, setDebt, setCustomerId, customerId, fetchDebt } =
        useFetchDebt();

    useEffect(() => {
        if(paymentModal) {
            setFormData(datas)
            setCustomerId(datas.CustomerId);
            setStatus(datas.Status);
        }
    }, [paymentModal]);
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

    var objCustomers;
    customers
        ? (objCustomers = customers)
        : (objCustomers = JSON.parse(localStorage.getItem("customers")));
    let customerOptions;
    if(objCustomers) {
        customerOptions = Object.values(objCustomers).map((c) => (
            <Option key={c.Id} value={c.Id}>
                {c.Name}
            </Option>
        ));
    }
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

    const onChangeSpendItem = (value, option) => {
        console.log(value, option);
        if (option.staticname != "buyproduct") {
            form.setFieldsValue({
                customerid: "00000000-0000-0000-0000-000000000000",
            });
        } else {
            if (
                form.getFieldsValue().customerid ===
                "00000000-0000-0000-0000-000000000000"
            ) {
                form.setFieldsValue({
                    customerid: "",
                });
            }
        }
    };

    //#region OwDep

    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, endPoint);
        return attrResponse;
    };
    const onClose = () => {
        fetchDebt();
        setDebt(debt + amount);
        message.destroy();
    };
    //#endregion OwDep
    const handleGancel = () => {
        setPaymentModal(false);
        setIsPayment(false);
        setDocumentName()
    };
    let funct = async (ob) => {
        let res = await updateDoc(ob)
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: `${title} Saxlan??ld??`,
                key: "payment_update",
                duration: 2,
            });
        }
        let result = await fetchDocId(ob.id, ob.controller)
        console.log(result)
        fetchDebt();
    }

    const handleFinish = async (values) => {
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.customerid = customerId;
        if (!values.status) {
            values.status = status;
        }
        message.loading({ content: "Y??kl??nir...", key: "payment_update" });
        if(!documentName) {
            const nameres = await getDocName(values.name);
            values.name = nameres.Body.ResponseService;
            setDocumentName(nameres.Body.ResponseService)
            const res = await saveDoc(values, endPoint);
            if (res.Headers.ResponseStatus === "0") {
                message.success({
                    content: `${title} Saxlan??ld??`,
                    key: "payment_update",
                    duration: 2,
                });
                setEditId(res.Body.ResponseService);
                fetchDebt();
                // setPaymentModal(false)
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
        }else {
            values.name = documentName
            let obj = {filter: "", id: "", controller: ""}
            obj.filter = values
            obj.id = editId
            obj.controller = endPoint
            funct(obj)
        }
    };
    return (
        <Modal
            className="payment-out-modal"
            title={title}
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
                    customerid: datas.CustomerName,
                    linkid: datas.Id,
                    amount: formData ? formData.Amount : null,
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
                            label={`${title} ???`}
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
                                onChange={(e) => setAmount(e.target.value)}
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
                                onClick={() => setCustomerDrawer(true)}
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
                                onChange={(e) => setCustomerId(e)}
                            >
                                {customerOptions}
                            </Select>
                        </Form.Item>
                        <p
                            className="customer-debt"
                            style={debt < 0 ? { color: "red" } : {}}
                        >
                            <span style={{ color: "red" }}>Qal??q borc:</span>
                            {debt} ???
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
                                onClick={() => setExpenditure(true)}
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
                                onChange={onChangeSpendItem}
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
                                            {ownerOption}
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
                                        onChange={(e) =>
                                            setStatus(e.target.checked)
                                        }
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
                                            {departmentOption}
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

            <CustomerDrawer />
            <Expenditure show={expenditure} setShow={setExpenditure} />
        </Modal>
    );
}

export default PaymentOutModal;
