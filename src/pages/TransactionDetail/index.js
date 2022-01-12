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
import Expenditure from "../../components/Expenditure";
import { useFetchDebt, useSearchSelectInput } from "../../hooks";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function PaymentInDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const myRefDescription = useRef(null);
    const myRefConsumption = useRef(null);
    const {
        outerDataSource,
        setOuterDataSource,
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
    const [positions, setPositions] = useState([]);
    const [status, setStatus] = useState(false);
    const [spends, setSpends] = useState(false);
    const [handleMark, setHandleMark] = useState(null);
    const [customerloading, setcustomerloading] = useState(false);
    const [expenditure, setExpenditure] = useState(false);
    

    const { onSearchSelectInput, customersForSelet } = useSearchSelectInput();
    const onChangeSelectInput = (e) => {
        handleChanged();
        setCustomerId(e);
    };

    const { doc_id } = useParams();
    const { isLoading, error, data, isFetching } = useQuery(
        ["paymentin", doc_id],
        () => fetchDocId(doc_id, "paymentins")
    );
    const handleDelete = (key) => {
        const dataSource = [...outerDataSource];
        setOuterDataSource(dataSource.filter((item) => item.key !== key));
        setPositions(dataSource.filter((item) => item.key !== key));
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
        setDisable(true);
        setPositions([]);
        setOuterDataSource([]);

        return () => {
            setDisable(true);
            setPositions([]);
            setOuterDataSource([]);
        };
    }, []);

    useEffect(() => {
        if (JSON.stringify(positions) !== JSON.stringify(outerDataSource)) {
            setDisable(false);
        }
    }, [outerDataSource]);

    const onClose = () => {
        message.destroy();
    };

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
            setHandleMark(data.Body.List[0] ? data.Body.List[0].Mark : "");
            setStatus(data.Body.List[0].Status);
        }
    }, [isFetching]);

    const updateMutation = useMutation(updateDoc, {
        refetchQueris: ["paymentin", doc_id],
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
        const attrResponse = await fetchDocName(docname, "paymentins");
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
                spenditem: spenditems.find((s) => s.StaticName === "correct")
                    .Id,
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
        if (option.staticname != "correct") {
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

        message.loading({ content: "Yüklənir...", key: "doc_update" });

        updateMutation.mutate(
            { id: doc_id, controller: "paymentins", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Dəyişikliklər yadda saxlanıldı",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("paymentin", doc_id);
                        audio.play();
                        fetchDebt()
                        // if (saveFromModal) {
                        //     setRedirectSaveClose(true);
                        // } else {
                        //     if (isReturn) {
                        //         setRedirect(true);
                        //     }
                        //     if (isPayment) {
                        //         setPaymentModal(true);
                        //     }
                        // }
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
                },
            }
        );
    };

    //#region OwDep

    //#endregion OwDep
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;
    if (!spends)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );
    if (!customerloading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );
    if (spends && customerloading)
        return (
            <div className="doc_wrapper">
                <div className="doc_name_wrapper">
                    <h2>Mədaxil (nağd)</h2>
                </div>
                <DocButtons
                    controller={"paymentins"}
                    additional={"none"}
                    editid={null}
                    closed={"p=transactions"}
                    editid={doc_id}
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
                            // status: true,
                            spenditem: data.Body.List[0].SpendItem,
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
                                        style={{ width: "100px" }}
                                        className="detail-input"
                                        type="number"
                                        step="any"
                                        placeholder="₼"
                                        allowClear
                                        min={0}
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
                                            ? Object.values(spenditems)
                                                  .filter(
                                                      (item) =>
                                                          item.StaticName ===
                                                              "buyproduct" ||
                                                          item.StaticName ===
                                                              "correct"
                                                  )
                                                  .map((c) => (
                                                      <Option
                                                          staticname={
                                                              c.StaticName
                                                          }
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
                                                onChange={(e) =>
                                                    setStatus(e.target.checked)
                                                }
                                                name="status"
                                                valuePropName="checked"
                                                style={{ width: "100%" }}
                                            >
                                                <Checkbox
                                                    size="small"
                                                    name="status"
                                                ></Checkbox>
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
                <Expenditure show={expenditure} setShow={setExpenditure} />
            </div>
        );
}

export default PaymentInDetail;
