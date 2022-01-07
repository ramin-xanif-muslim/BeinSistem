import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, fetchDocName } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
    Form,
    Input,
    Button,
    Checkbox,
    Dropdown,
    DatePicker,
    Switch,
    Select,
    Spin,
    Row,
    Col,
    Collapse,
    Alert,
} from "antd";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import {
    saveDoc,
    fetchSpendItems,
    getCustomerFastFilter,
    fetchCustomers,
} from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";
import CustomerDrawer from "../../components/CustomerDrawer";
import Expenditure from "../../components/Expenditure";
import { useFetchDebt, useSearchSelectInput } from "../../hooks";
import CustomersSelectInput from "../../components/CustomersSelectInput";

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function NewPaymentOut() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const myRefDescription = useRef(null);
    const myRefConsumption = useRef(null);
    const {
        departments,
        owners,
        customers,
        setCustomers,
        spenditems,
        setSpendItems,
        setSpendsLocalStorage,
        setDisable,
        disable,
    } = useTableCustom();
    const { setLoadingForm, setCustomerDrawer } = useCustomForm();
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [status, setStatus] = useState(true);
    const [spends, setSpends] = useState(false);
    const [expenditure, setExpenditure] = useState(false);

    const { debt, setCustomerId } = useFetchDebt();

    const { onSearchSelectInput, customersForSelet } = useSearchSelectInput();
    const onChangeSelectInput = (e) => {
        handleChanged();
        setCustomerId(e);
    };

    useEffect(() => {
        getSpendItems();
    }, [expenditure]);

    const onClose = () => {
        message.destroy();
    };

    useEffect(() => {
        form.setFieldsValue({
            moment: moment(),
        });
        setLoadingForm(false);
        getSpendItems();
    }, []);
    const getSpendItems = async () => {
        setSpends(false);
        const itemResponse = await fetchSpendItems();
        setSpendItems(itemResponse.Body.List);
        setSpendsLocalStorage(itemResponse.Body.List);
        setSpends(true);
    };
    const getCustomers = async () => {
        const customerResponse = await fetchCustomers();
        setCustomers(customerResponse.Body.List);
    };
    const doSearch = async (value) => {
        const customerResponse = await getCustomerFastFilter(value);
        setCustomers(customerResponse.Body.List);
    };
    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, "paymentouts");
        return attrResponse;
    };

    var objCustomers;
    customers
        ? (objCustomers = customers)
        : (objCustomers = JSON.parse(localStorage.getItem("customers")));
    const customerOptions = Object.values(objCustomers).map((c) => (
        <Option key={c.Id} value={c.Id}>
            {c.Name}
        </Option>
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

    const onChange = (value, option) => {
        if (value === "00000000-0000-0000-0000-000000000000") {
            form.setFieldsValue({
                spenditem: null,
            });
        } else {
            form.setFieldsValue({
                spenditem: spenditems.find((s) => s.StaticName === "buyproduct")
                    .Id,
            });
        }
    };
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

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    const handleFinish = async (values) => {
        setDisable(true);
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.status = status;
        // values.mark = docmark;

        message.loading({ content: "Yüklənir...", key: "doc_update" });

        try {
            const nameres = await getDocName(values.name);
            values.name = nameres.Body.ResponseService;
        } catch (error) {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlanılmadı... {error.message}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "doc_update",
                duration: 0,
            });
        }

        const res = await saveDoc(values, "paymentouts");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlanıldı",
                key: "doc_update",
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
                key: "doc_update",
                duration: 0,
            });
        }
    };

    //#region OwDep

    //#endregion OwDep
    if (redirect) return <Redirect to={`/editPaymentOut/${editId}`} />;

    if (!spends)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );
    if (spends)
        return (
            <div className="doc_wrapper">
                <div className="doc_name_wrapper">
                    <h2>Məxaric (nağd)</h2>
                </div>
                <DocButtons
                    additional={"none"}
                    editid={null}
                    closed={"p=transactions"}
                />
                <div className="formWrapper">
                    <Form
                        form={form}
                        id="myForm"
                        className="doc_forms"
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            status: true,
                            spenditem: spenditems.find(
                                (s) => s.StaticName === "buyproduct"
                            ).Id,
                        }}
                        onFinish={handleFinish}
                        onFieldsChange={handleChanged}
                        layout="horizontal"
                    >
                        <Row>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Form.Item
                                    label="Məxaric №"
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
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Form.Item
                                    label="Məbləğ"
                                    name="amount"
                                    className="doc_number_form_item"
                                >
                                    <Input
                                        className="detail-input"
                                        type="number"
                                        step="any"
                                        placeholder="₼"
                                        allowClear
                                        min={0}
                                        style={{ width: "100px" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}></Col>
                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} xl={6}>
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
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Button className="add-stock-btn">
                                    <PlusOutlined
                                        onClick={() => setCustomerDrawer(true)}
                                    />
                                </Button>
                                <Form.Item
                                    label="Qarşı-tərəf"
                                    name="customerid"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Zəhmət olmasa, qarşı tərəfi seçin",
                                        },
                                    ]}
                                >
                                    <Select
                                        lazyLoad
                                        showSearch
                                        showArrow={false}
                                        filterOption={false}
                                        className="customSelect detail-select"
                                        allowClear={true}
                                        onSearch={(e) => onSearchSelectInput(e)}
                                        onChange={(e) => onChangeSelectInput(e)}
                                    >
                                        {customersForSelet[0] &&
                                            customersForSelet.map((c) => {
                                                return (
                                                    <Option
                                                        key={c.Id}
                                                        value={c.Id}
                                                    >
                                                        {c.Name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                                <p
                                    className="customer-debt"
                                    style={debt < 0 ? { color: "red" } : {}}
                                >
                                    <span style={{ color: "red" }}>
                                        Qalıq borc:
                                    </span>
                                    {debt} ₼
                                </p>
                            </Col>
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}></Col>
                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Form.Item
                                    label="Şərh"
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
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Button className="add-stock-btn">
                                    <PlusOutlined
                                        onClick={() => setExpenditure(true)}
                                    />
                                </Button>
                                <Form.Item
                                    label="Xərc maddəsi"
                                    name="spenditem"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Zəhmət olmasa, xərc maddəsini seçin",
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
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {spends
                                            ? Object.values(spenditems).map(
                                                  (c) => (
                                                      <Option
                                                          staticname={
                                                              c.StaticName
                                                          }
                                                          key={c.Id}
                                                          value={c.Id}
                                                      >
                                                          {c.Name}
                                                      </Option>
                                                  )
                                              )
                                            : null}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}></Col>
                        </Row>

                        <Row>
                            <Collapse ghost style={{ width: "100%" }}>
                                <Panel
                                    className="custom_panel_header"
                                    header="Təyinat"
                                    key="1"
                                >
                                    <Row>
                                        <Col xs={6} sm={6} md={6} xl={6}>
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
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
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
                                        <Col xs={3} sm={3} md={3} xl={3}></Col>
                                        <Col xs={6} sm={6} md={6} xl={6}>
                                            <Form.Item
                                                label="Keçirilib"
                                                className="docComponentStatus"
                                                name="status"
                                                valuePropName="checked"
                                                style={{ width: "100%" }}
                                            >
                                                <Checkbox name="status"></Checkbox>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} xl={3}></Col>
                                        <Col xs={6} sm={6} md={6} xl={6}></Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} sm={6} md={6} xl={6}>
                                            <Form.Item
                                                label="Şöbə"
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
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
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
                                        <Col xs={3} sm={3} md={3} xl={3}></Col>
                                        <Col xs={6} sm={6} md={6} xl={6}>
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
                                        <Col xs={3} sm={3} md={3} xl={3}></Col>
                                        <Col xs={6} sm={6} md={6} xl={6}></Col>
                                    </Row>
                                </Panel>
                            </Collapse>
                        </Row>
                    </Form>
                </div>

                <CustomerDrawer />
                <Expenditure
                    show={expenditure}
                    setShow={setExpenditure}
                    getSpendItems={getSpendItems}
                />
            </div>
        );
}

export default NewPaymentOut;
