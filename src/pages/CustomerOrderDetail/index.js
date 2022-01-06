import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockDrawer from "../../components/StockDrawer";
import { Redirect } from "react-router";
import PaymentModal from "../../components/PaymentModal";
import CustomerDrawer from "../../components/CustomerDrawer";
import { Tab } from "semantic-ui-react";

import {
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import {
    Form,
    Alert,
    Input,
    Button,
    Checkbox,
    DatePicker,
    Select,
    Spin,
    Divider,
    Typography,
    Statistic,
    Popconfirm,
    Row,
    Col,
    Collapse,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { fetchCustomers } from "../../api";
import { fetchStocks } from "../../api";
import { message } from "antd";
import { updateDoc } from "../../api";
import { useRef } from "react";
import { useCustomForm } from "../../contexts/FormContext";
import {
    FindAdditionals,
    FindCofficient,
    ConvertFixedTable,
} from "../../config/function/findadditionals";
import { useFetchDebt, useGetDocItems } from "../../hooks";
const { Option, OptGroup } = Select;
const { TextArea } = Input;
let customPositions = [];
const { Panel } = Collapse;
function CustomerOrderDetail() {
    const [form] = Form.useForm();
    const myRefDescription = useRef(null);
    const myRefConsumption = useRef(null);
    const queryClient = useQueryClient();
    const {
        docPage,
        docCount,
        docSum,
        outerDataSource,
        departments,
        owners,
        stocks,
        setStock,
        setStockLocalStorage,
        customers,
        setCustomers,
        setOuterDataSource,
        orderStatusArr,
        setOrderStatusArr,
        disable,
        setDisable,
    } = useTableCustom();
    const {
        setLoadingForm,
        setStockDrawer,
        setCustomerDrawer,
        createdStock,
        createdCustomer,
        setCreatedStock,
        setCreatedCustomer,
        isReturn,
        isPayment,
        setPaymentModal,
    } = useCustomForm();
    const [positions, setPositions] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const { doc_id } = useParams();
    const [hasConsumption, setHasConsumption] = useState(false);
    const [status, setStatus] = useState(false);
    const [consumption, setConsumption] = useState(0);

    const {debt, setCustomerId} = useFetchDebt()

    const { allsum, allQuantity } = useGetDocItems()

    const { isLoading, error, data, isFetching } = useQuery(
        ["customerorder", doc_id],
        () => fetchDocId(doc_id, "customerorders")
    );
    const handleDelete = (key) => {
        const dataSource = [...outerDataSource];
        setOuterDataSource(dataSource.filter((item) => item.key !== key));
        setPositions(dataSource.filter((item) => item.key !== key));
    };
    useEffect(() => {
        if (!isFetching) {
            setCustomerId(data.Body.List[0].CustomerId);
            customPositions = [];
            Object.values(data.Body.List[0].Positions).map((d) =>
                customPositions.push(d)
            );
            customPositions.map((c, index) => (c.key = index));
            customPositions.map((c) => (c.SellPrice = c.Price));
            customPositions.map((c) =>
                c.BasicPrice ? (c.PrintPrice = c.BasicPrice) : ""
            );
            customPositions.map((c) => (c.DefaultQuantity = c.Quantity));

            customPositions.map(
                (c) =>
                    (c.TotalPrice =
                        parseFloat(c.Price) * parseFloat(c.Quantity))
            );
            customPositions.map(
                (c) =>
                    (c.CostPriceTotal =
                        parseFloat(c.CostPrice) * parseFloat(c.Quantity))
            );
            setPositions(customPositions);
            if (data.Body.List[0].Consumption) {
                setHasConsumption(true);
            }
            setConsumption(data.Body.List[0].Consumption);
            setLoadingForm(false);
            setStatus(data.Body.List[0].Status);
        } else {
            customPositions = [];
            setPositions([]);
            setLoadingForm(true);
        }
    }, [isFetching]);

    const onClose = () => {
        message.destroy();
    };
    const onChangeConsumption = (e) => {
        setHasConsumption(true);
        setConsumption(e.target.value);
    };
    const columns = useMemo(() => {
        return [
            {
                title: "№",
                dataIndex: "Order",
                className: "orderField",
                editable: false,
                isVisible: true,
                render: (text, record, index) => index + 1 + 100 * docPage,
            },
            {
                title: "Adı",
                dataIndex: "Name",
                className: "max_width_field_length",
                editable: false,
                isVisible: true,
                sorter: (a, b) => a.Name.localeCompare(b.Name),
            },
            {
                title: "Barkodu",
                dataIndex: "BarCode",
                isVisible: true,
                className: "max_width_field_length",
                editable: false,
                sortDirections: ["descend", "ascend"],
                sorter: (a, b) => a.BarCode - b.BarCode,
            },
            {
                title: "Miqdar",
                dataIndex: "Quantity",
                isVisible: true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return value;
                },
            },
            {
                title: "Qiyməti",
                dataIndex: "Price",
                isVisible: true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return value;
                },
            },
            {
                title: "Məbləğ",
                dataIndex: "TotalPrice",
                isVisible: true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return value;
                },
            },
            {
                title: "Qalıq",
                dataIndex: "StockQuantity",
                className: "max_width_field",
                isVisible: true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return value;
                },
            },
            {
                title: "Maya",
                dataIndex: "CostPr",
                className: "max_width_field",
                isVisible: true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    let defaultCostArray = [];
                    let consumtionPriceArray = [];
                    outerDataSource.forEach((p) => {
                        defaultCostArray.push(Number(p.Price));
                    });
                    console.log("defaultCostArray", defaultCostArray);
                    if (hasConsumption) {
                        console.log(hasConsumption);
                        console.log(positions);
                        console.log(consumption);
                        console.log(docSum);
                        console.log(FindAdditionals(consumption, docSum, 12));
                        consumtionPriceArray = [];
                        outerDataSource.forEach((p) => {
                            consumtionPriceArray.push(
                                FindAdditionals(
                                    consumption,
                                    docSum,
                                    Number(p.Price)
                                )
                            );
                        });
                        console.log(
                            "consumtionPriceArray",
                            consumtionPriceArray
                        );
                        return ConvertFixedTable(consumtionPriceArray[index]);
                    } else {
                        return ConvertFixedTable(defaultCostArray[index]);
                    }
                },
            },
            {
                title: "Cəm Maya",
                dataIndex: "CostTotalPr",
                className: "max_width_field",
                isVisible: true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    let defaultCostArray = [];
                    let consumtionPriceArray = [];
                    outerDataSource.forEach((p) => {
                        defaultCostArray.push(Number(p.TotalPrice));
                    });
                    if (hasConsumption) {
                        consumtionPriceArray = [];
                        outerDataSource.forEach((p) => {
                            consumtionPriceArray.push(
                                FindAdditionals(
                                    consumption,
                                    docSum,
                                    Number(p.TotalPrice)
                                )
                            );
                        });

                        return ConvertFixedTable(consumtionPriceArray[index]);
                    } else {
                        return ConvertFixedTable(defaultCostArray[index]);
                    }
                },
            },
            {
                title: "Sil",
                className: "orderField printField",
                dataIndex: "operation",
                isVisible: true,
                editable: false,
                render: (_, record) => (
                    <Typography.Link>
                        <Popconfirm
                            title="Silməyə əminsinizmi?"
                            okText="Bəli"
                            cancelText="Xeyr"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <a className="deletePosition">Sil</a>
                        </Popconfirm>
                    </Typography.Link>
                ),
            },
        ];
    }, [consumption, outerDataSource, docSum]);

    const updateMutation = useMutation(updateDoc, {
        refetchQueris: ["customerorder", doc_id],
    });

    useEffect(() => {
        if (createdStock) {
            getStocksAgain();
        }
    }, [createdStock]);

    useEffect(() => {
        if (createdCustomer) {
            getCustomersAgain();
        }
    }, [createdCustomer]);

    const getCustomersAgain = async () => {
        const customerResponse = await fetchCustomers();
        setCustomers(customerResponse.Body.List);
        form.setFieldsValue({
            customerid: createdCustomer.id,
        });
        setCreatedCustomer(null);
    };
    const getStocksAgain = async () => {
        const stockResponse = await fetchStocks();
        setStock(stockResponse.Body.List);
        setStockLocalStorage(stockResponse.Body.List);
        form.setFieldsValue({
            stockid: createdStock.id,
        });
        setCreatedStock(null);
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

    var objOwner;
    owners
        ? (objOwner = owners)
        : (objOwner = JSON.parse(localStorage.getItem("owners")));
    const ownersOptions = Object.values(objOwner).map((c) => (
        <Option key={c.Id} value={c.Id}>
            {c.Name}
        </Option>
    ));

    var objOrder;
    orderStatusArr
        ? (objOrder = orderStatusArr)
        : (objOrder = JSON.parse(localStorage.getItem("orderarray")));
    const orderOptions = Object.values(objOrder).map((c) => (
        <Option key={c.Id} value={c.Id}>
            {c.Name}
        </Option>
    ));

    var objDep;
    departments
        ? (objDep = departments)
        : (objDep = JSON.parse(localStorage.getItem("departments")));

    const depOptions = Object.values(objDep).map((c) => (
        <Option key={c.Id}>{c.Name}</Option>
    ));

    var objStock;
    stocks
        ? (objStock = stocks)
        : (objStock = JSON.parse(localStorage.getItem("stocks")));

    const options = objStock.map((m) => (
        <Option key={m.Id} value={m.Id}>
            {m.Name}
        </Option>
    ));

    //#endregion OwDep

    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;

    if (redirect)
        return (
            <Redirect
                to={{
                    pathname: "/editDemandReturnLinked",
                    state: {
                        data: data.Body.List[0],
                        position: positions,
                        linked: doc_id,
                    },
                }}
            />
        );

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };

    const handleFinish = async (values) => {
        setDisable(true);
        values.positions = outerDataSource;
		values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
		values.modify = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.description =
            myRefDescription.current.resizableTextArea.props.value;
            if (!values.status) {
                values.status = status;
            }
        console.log(values);
        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { id: doc_id, controller: "customerorders", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Updated",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("customerorder", doc_id);
                        if (isReturn) {
                            setRedirect(true);
                        }
                        if (isPayment) {
                            setPaymentModal(true);
                        }
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

    const panes = [
        {
            menuItem: "Əsas",
            render: () => (
                <Tab.Pane attached={false}>
                    <Row>
                        <Col xs={24} md={24} xl={9}>
                            <div className="addProductInputIcon">
                                <AddProductInput className="newProInputWrapper" />
                                <PlusOutlined className="addNewProductIcon" />
                            </div>
                        </Col>
                        <Col
                            xs={24}
                            md={24}
                            xl={24}
                            style={{ paddingTop: "1rem" }}
                        >
                            <DocTable headers={columns} datas={positions} />
                        </Col>
                    </Row>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Əlaqəli sənədlər",
            render: () => <Tab.Pane attached={false}></Tab.Pane>,
        },
    ];

    return (
        <div className="doc_wrapper">
            <div className="doc_name_wrapper">
                <h2>Sifariş</h2>
            </div>
            <DocButtons
                editid={doc_id}
                controller={"customerorders"}
                closed={"p=customerorders"}
                from={"customerorders"}
            />
            <div className="formWrapper">
                <Form
                    id="myForm"
                    form={form}
                    className="doc_forms"
                    name="basic"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    initialValues={{
                        name: data.Body.List[0].Name,
                        moment: moment(data.Body.List[0].Moment),
                        modify: moment(data.Body.List[0].Modify),
                        mark: data.Body.List[0].Mark,
                        stockid: data.Body.List[0].StockId,
                        statusorder: data.Body.List[0].StatusOrder,
                        customerid: data.Body.List[0].CustomerId,
                        status: data.Body.List[0].Status == 1 ? true : false,
                    }}
                    onFinish={handleFinish}
                    layout="horizontal"
                    onFieldsChange={handleChanged}
                >
                    <Row>
                        <Col xs={24} md={24} xl={6}>
                            <Form.Item
                                label="Sifariş №"
                                name="name"
                                className="doc_number_form_item"
                                style={{ width: "100%" }}
                            >
                                <Input className="detail-input" allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}>
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
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    className="customSelect detail-select"
                                    allowClear={true}
                                    onChange={e => setCustomerId(e)}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
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
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}></Col>
                    </Row>

                    <Row>
                        <Col xs={24} md={24} xl={6}>
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
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}>
                            <Button className="add-stock-btn">
                                <PlusOutlined
                                    onClick={() => setStockDrawer(true)}
                                />
                            </Button>
                            <Form.Item
                                label="Anbar"
                                name="stockid"
                                rules={[
                                    {
                                        required: true,
                                        message: "Zəhmət olmasa, anbarı seçin",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    // onChange={onChange}
                                    className="customSelect detail-select"
                                    allowClear={true}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {options}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}></Col>
                    </Row>

                    <Row>
                        <Collapse ghost style={{ width: "100%" }}>
                            <Panel
                                className="custom_panel_header"
                                header="Təyinat"
                                key="1"
                            >
                                <Row>
                                    <Col xs={24} md={24} xl={6}>
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
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}>
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
                                                {ownersOptions}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}>
                                        <Form.Item
                                            label="Keçirilib"
                                            className="docComponentStatus"
                                            onChange={(e) => setStatus(e.target.checked)}
                                            name="status"
                                            valuePropName="checked"
                                            style={{ width: "100%" }}
                                        >
                                            <Checkbox name="status"></Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} xl={6}>
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
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(
                                                            input.toLowerCase()
                                                        ) >= 0
                                                }
                                            >
                                                {depOptions}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}></Col>
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}></Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    </Row>
                </Form>

                <Row>
                    { isFetching ? <Spin />
                        :
                        <Col xs={24} md={24} xl={24}>
                            <Tab
                                className="custom_table_wrapper_tab"
                                panes={panes}
                            />
                        </Col>
                    }
                    <Col xs={24} md={24} xl={24}>
                        <Row className="bottom_tab">
                            <Col xs={24} md={24} xl={9}>
                                <div>
									<Form
										initialValues={{
											description: data.Body.List[0].Description,
										}}
                                        onFieldsChange={handleChanged}
									>
										<Form.Item name="description">
											<TextArea
												ref={myRefDescription}
												placeholder={"Şərh..."}
												rows={3}
											/>
										</Form.Item>
									</Form>
                                </div>
                            </Col>
                            <Col xs={24} md={24} xl={12}>
                                <div className="static_wrapper">
                                    <Statistic
                                        groupSeparator=" "
                                        className="doc_info_text total"
                                        title=""
                                        value={allsum}
                                        prefix={"Yekun məbləğ: "}
                                        suffix={"₼"}
                                    />
                                    <Statistic
                                        groupSeparator=" "
                                        className="doc_info_text doc_info_secondary quantity"
                                        title=""
                                        value={allQuantity}
                                        prefix={"Miqdar: "}
                                        suffix={"əd"}
                                    />

                                    <Divider
                                        style={{ backgroundColor: "grey" }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <StockDrawer />
            <CustomerDrawer />
            <PaymentModal datas={data.Body.List[0]} title="Məxaric" endPoint="paymentouts"/>
        </div>
    );
}

export default CustomerOrderDetail;
