import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName, fetchDocId, api } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { updateDoc } from "../../api";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import { ConvertFixedTable } from "../../config/function/findadditionals";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
    Form,
    Alert,
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
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import {
    saveDoc,
    fetchSpendItems,
    getCustomerFastFilter,
    fetchCustomers,
} from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { useRef } from "react";
import CustomerDrawer from "../../components/CustomerDrawer";
import { useFetchDebt, useSearchSelectInput } from "../../hooks";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function PaymentOutDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const myRefDescription = useRef(null);
    const myRefConsumption = useRef(null);
    const {
        departments,
        owners,
        setCustomersLocalStorage,
        customers,
        setCustomers,
        spenditems,
        setSpendItems,
        setSpendsLocalStorage,
        setDisable,
        disable,
    } = useTableCustom();
    const { docmark, setLoadingForm, setCustomerDrawer } = useCustomForm();
    const [status, setStatus] = useState(true);
    const [initial, setInitial] = useState(null);
    const [spends, setSpends] = useState(false);
    const [handleMark, setHandleMark] = useState(null);
    const [customerloading, setcustomerloading] = useState(false);

    const { onSearchSelectInput, customersForSelet } = useSearchSelectInput();
    const onChangeSelectInput = (e) => {
        handleChanged();
        setCustomerId(e);
    };

    const { doc_id } = useParams();
    const { isLoading, error, data, isFetching } = useQuery(
        ["invoiceout", doc_id],
        () => fetchDocId(doc_id, "invoiceouts")
    );
    const onClose = () => {
        message.destroy();
    };

	// const { debt, setCustomerId, customerId, fetchDebt } = useFetchDebt();
    const [debt, setDebt] = useState(0);
    const [ customerId, setCustomerId] = useState()
    const fetchDebt = async (id) => {
        let res = await api.fetchDebt(id ? id : customerId);
        setDebt(ConvertFixedTable(res));
    };
    useEffect(() => {
        if(customerId) {
            fetchDebt(customerId);
        }
    }, [customerId]);

    useEffect(() => {
        form.setFieldsValue({
            moment: moment(),
        });
        setLoadingForm(false);
        getSpendItems();
        getCustomers();
    }, []);

    useEffect(() => {
        if (!isFetching) {
            setCustomerId(data.Body.List[0].CustomerId);
            setHandleMark(data.Body.List[0].Mark);
            setStatus(data.Body.List[0].Status);
        }
    }, [isFetching]);

    const updateMutation = useMutation(updateDoc, {
        refetchQueris: ["invoiceout", doc_id],
    });
    const getSpendItems = async () => {
        setSpends(false);
        const itemResponse = await fetchSpendItems();
        setSpendItems(itemResponse.Body.List);
        setSpendsLocalStorage(itemResponse.Body.List);
        setSpends(true);
    };
    const getCustomers = async () => {
        setcustomerloading(false);
        const customerResponse = await fetchCustomers();
        setCustomers(customerResponse.Body.List);
        setCustomersLocalStorage(customerResponse.Body.List);
        setcustomerloading(true);
    };
    const doSearch = async (value) => {
        const customerResponse = await getCustomerFastFilter(value);
        setCustomers(customerResponse.Body.List);
    };
    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, "invoiceouts");
        return attrResponse;
    };
    
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
        values.customerid = customerId;
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.mark = docmark;
        if (!values.status) {
            values.status = status;
        }

        message.loading({ content: "Y??kl??nir...", key: "doc_update" });

        updateMutation.mutate(
            { id: doc_id, controller: "invoiceouts", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "D??yi??iklikl??r yadda saxlan??ld??",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("invoiceout", doc_id);
                        audio.play();
                        fetchDebt()
                    } else {
                        message.error({
                            content: (
                                <span className="error_mess_wrap">
                                    Saxlan??lmad??... {res.Body}{" "}
                                    {<CloseCircleOutlined onClick={onClose} />}
                                </span>
                            ),
                            key: "doc_update",
                            duration: 0,
                        });
                    }
                },
            }
        );
    };

    //#region OwDep

    //#endregion OwDep
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;
    if (!spends)
        return (
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );
    if (!customerloading)
        return (
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );
    if (spends && customerloading)
        return (
            <div className="doc_wrapper">
                <div className="doc_name_wrapper">
                    <h2>M??xaric (na??ds??z)</h2>
                </div>
                <DocButtons
                    controller={"invoiceouts"}
                    additional={"none"}
                    editid={doc_id}
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
                            name: data.Body.List[0].Name,
                            moment: moment(data.Body.List[0].Moment),
                            customerid: data.Body.List[0].CustomerName,
                            id: data.Body.List[0].Id,
                            amount: ConvertFixedTable(data.Body.List[0].Amount),
                            mark: data.Body.List[0].Mark,
                            description: data.Body.List[0].Description,
                            linkid: data.Body.List[0].LinkId,
                            status:
                                data.Body.List[0].Status == 1 ? true : false,
                            spenditem: data.Body.List[0].SpendItem,
                        }}
                        onFinish={handleFinish}
                        onFieldsChange={handleChanged}
                        layout="horizontal"
                    >
                        <Row>
                            <Col xs={6} sm={6} md={6} xl={6}>
                                <Form.Item
                                    label="M??xaric ???"
                                    name="name"
                                    className="doc_number_form_item"
                                    style={{ width: "100%" }}
                                >
                                    <Input
                                        placeholder="0000"
                                        className="detail-input"
                                        allowClear
                                        style={{ width: "100px" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}>
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
                                    label="Qar????-t??r??f"
                                    name="customerid"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Z??hm??t olmasa, qar???? t??r??fi se??in",
                                        },
                                    ]}
                                    className="form-item-customer"
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
                                        Qal??q borc:
                                    </span>
                                    {debt} ???
                                </p>
                            </Col>
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}></Col>
                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} xl={6}>
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
                            <Col xs={3} sm={3} md={3} xl={3}></Col>
                            <Col xs={6} sm={6} md={6} xl={6}>
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
                                    header="T??yinat"
                                    key="1"
                                >
                                    <Row>
                                        <Col xs={6} sm={6} md={6} xl={6}>
                                            <Form.Item
                                                label="Cavabdeh"
                                                name="ownerid"
                                                style={{ margin: "0", width: "100%" }}
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
                                                label="Ke??irilib"
                                                className="docComponentStatus"
                                                onChange={(e) =>
                                                    setStatus(e.target.checked)
                                                }
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
                                                label="????b??"
                                                name="departmentid"
                                                style={{ margin: "0", width: "100%" }}
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
            </div>
        );
}

export default PaymentOutDetail;
