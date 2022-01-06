import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName, fetchDocId, api } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { updateDoc } from "../../api";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import ProductModal from "../../components/ProductModal";
import { Tab } from "semantic-ui-react";
import {
    FindAdditionals,
    FindCofficient,
    ConvertFixedTable,
} from "../../config/function/findadditionals";
import {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    SettingOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import {
    Form,
    Alert,
    Input,
    Button,
    InputNumber,
    TreeSelect,
    Checkbox,
    Dropdown,
    DatePicker,
    Switch,
    Select,
    Spin,
    Tag,
    Divider,
    Menu,
    Drawer,
    Typography,
    Statistic,
    Popconfirm,
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
import { fetchStocks } from "../../api";
import { useRef } from "react";
import CustomerDrawer from "../../components/CustomerDrawer";
import { useFetchDebt } from "../../hooks";

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function IvoiceInDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const myRefDescription = useRef(null);
    const myRefConsumption = useRef(null);
    const {
        docPage,
        docCount,
        docSum,
        outerDataSource,
        setOuterDataSource,
        departments,
        owners,
        stocks,
        setStock,
        setStockLocalStorage,
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
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [docname, setDocName] = useState(null);
    const [newStocksLoad, setNewStocksLoad] = useState(null);
    const [hasConsumption, setHasConsumption] = useState(false);
    const [consumption, setConsumption] = useState(0);
    const [status, setStatus] = useState(true);
    const [initial, setInitial] = useState(null);
    const [tablecolumns, setTableColumns] = useState([]);
    const [columnChange, setColumnChange] = useState(false);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const [spends, setSpends] = useState(false);
    const [handleMark, setHandleMark] = useState(null);
    const [customerloading, setcustomerloading] = useState(false);

    const {debt, setCustomerId} = useFetchDebt()

    const { doc_id } = useParams();
    const { isLoading, error, data, isFetching } = useQuery(
        ["invoicein", doc_id],
        () => fetchDocId(doc_id, "invoiceins")
    );
    const handleDelete = (key) => {
        const dataSource = [...outerDataSource];
        setOuterDataSource(dataSource.filter((item) => item.key !== key));
        setPositions(dataSource.filter((item) => item.key !== key));
    };
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
        refetchQueris: ["invoicein", doc_id],
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
        const attrResponse = await fetchDocName(docname, "invoiceins");
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
		values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.mark = docmark;
		if (!values.status) {
			values.status = status;
		}

        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { id: doc_id, controller: "invoiceins", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Updated",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("invoicein", doc_id);
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
    if (!spends) return <div>Loading....</div>;
    if (!customerloading) return <div>Loading....</div>;
    if (spends && customerloading)
        return (
            <div className="doc_wrapper">
                <div className="doc_name_wrapper">
                    <h2>Mədaxil (nağdsız)</h2>
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
                            name: data.Body.List[0].Name,
                            moment: moment(data.Body.List[0].Moment),
                            customerid: data.Body.List[0].CustomerId,
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
                                    label="Məxaric №"
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
                                    className="form-item-customer"
                                >
                                    <Select
                                        showSearch
                                        showArrow={false}
                                        filterOption={false}
                                        className="customSelect detail-select"
                                        allowClear={true}
                                        onChange={e => setCustomerId(e)}
                                    >
                                        {customerOptions}
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

export default IvoiceInDetail;
