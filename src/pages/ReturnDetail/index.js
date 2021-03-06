import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StockDrawer from "../../components/StockDrawer";
import { Redirect } from "react-router";
import PaymentModal from "../../components/PaymentModal";
import CustomerDrawer from "../../components/CustomerDrawer";
import { Tab } from "semantic-ui-react";

import { CloseCircleOutlined } from "@ant-design/icons";
import {
    Form,
    Alert,
    Input,
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
import {
    useFetchDebt,
    useGetDocItems,
    useSearchSelectInput,
} from "../../hooks";
import CustomersSelectInput from "../../components/CustomersSelectInput";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);
const { Option, OptGroup } = Select;
const { TextArea } = Input;
let customPositions = [];
const { Panel } = Collapse;
function ReturnDetail() {
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
        setDisable,
        disable,
    } = useTableCustom();
    const {
        docstock,
        setDocStock,
        docmark,
        setDocMark,
        setLoadingForm,
        loadingForm,
        setStockDrawer,
        setCustomerDrawer,
        customerDrawer,
        stockDrawer,
        createdStock,
        createdCustomer,
        setCreatedStock,
        setCreatedCustomer,
        isReturn,
        setIsReturn,
        isPayment,
        setIsPayment,
        setPaymentModal,
    } = useCustomForm();
    const [positions, setPositions] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const { doc_id } = useParams();
    const [hasConsumption, setHasConsumption] = useState(false);
    const [status, setStatus] = useState(false);
    const [consumption, setConsumption] = useState(0);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

    const { debt, setCustomerId, customerId } = useFetchDebt();

    const { allsum, allQuantity } = useGetDocItems();

    const { onSearchSelectInput, customersForSelet } = useSearchSelectInput();
    const onChangeSelectInput = (e) => {
        // handleChanged();
        setCustomerId(e);
    };

    const { isLoading, error, data, isFetching } = useQuery(
        ["return", doc_id],
        () => fetchDocId(doc_id, "returns")
    );
    const handleDelete = (key) => {
        const dataSource = [...outerDataSource];
        setOuterDataSource(dataSource.filter((item) => item.BarCode !== key));
        setPositions(dataSource.filter((item) => item.BarCode !== key));
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
    const handleVisibleChange = (flag) => {
        setVisibleMenuSettings(flag);
    };
    const onChangeConsumption = (e) => {
        setHasConsumption(true);
        setConsumption(e.target.value);
    };
    const columns = useMemo(() => {
        return [
            {
                title: "???",
                dataIndex: "Order",
                className: "orderField",
                editable: false,
                isVisible: true,
                render: (text, record, index) => index + 1 + 100 * docPage,
            },
            {
                title: "Ad??",
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
                    return ConvertFixedTable(value);
                },
            },
            {
                title: "Qiym??ti",
                dataIndex: "Price",
                isVisible: true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                title: "M??bl????",
                dataIndex: "TotalPrice",
                isVisible: true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
                },
            },
            {
                title: "Endirim",
                dataIndex: "Discount",
                isVisible: true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    if (row.BasicPrice != 0) {
                        return (
                            parseFloat(
                                (row.BasicPrice - row.Price) / row.BasicPrice
                            ) *
                                100 +
                            " %"
                        );
                    } else {
                        return 0 + " %";
                    }
                },
            },
            {
                title: "Qal??q",
                dataIndex: "StockQuantity",
                className: "max_width_field",
                isVisible: true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    return ConvertFixedTable(value);
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
                            title="Silm??y?? ??minsinizmi?"
                            okText="B??li"
                            cancelText="Xeyr"
                            onConfirm={() => handleDelete(record.BarCode)}
                        >
                            <a className="deletePosition">Sil</a>
                        </Popconfirm>
                    </Typography.Link>
                ),
            },
        ];
    }, [consumption, outerDataSource, docSum]);

    const updateMutation = useMutation(updateDoc, {
        refetchQueris: ["return", doc_id],
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

    var objOwner;
    owners
        ? (objOwner = owners)
        : (objOwner = JSON.parse(localStorage.getItem("owners")));
    const ownersOptions = Object.values(objOwner).map((c) => (
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
            <Spin className="fetchSpinner" tip="Y??kl??nir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;

    if (redirect)
        return (
            <Redirect
                to={{
                    pathname: "/editSaleReturnLinked",
                    state: {
                        data: data.Body.List[0],
                        position: positions,
                        linked: doc_id,
                    },
                }}
            />
        );

    const handleFinish = async (values) => {
        setDisable(true);
        values.positions = outerDataSource;
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.modify = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.description =
            myRefDescription.current.resizableTextArea.props.value;
        values.status = status;
        console.log(values);
        message.loading({ content: "Y??kl??nir...", key: "doc_update" });
        updateMutation.mutate(
            { id: doc_id, controller: "returns", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "D??yi??iklikl??r yadda saxlan??ld??",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("return", doc_id);
                        audio.play();
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

    const panes = [
        {
            menuItem: "??sas",
            render: () => (
                <Tab.Pane attached={false}>
                    <Row>
                        <Col xs={24} md={24} xl={9}>
                            <div className="addProductInputIcon"></div>
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
            menuItem: "??laq??li s??n??dl??r",
            render: () => <Tab.Pane attached={false}></Tab.Pane>,
        },
    ];

    return (
        <div className="doc_wrapper">
            <div className="doc_name_wrapper">
                <h2>Qaytarma</h2>
            </div>
            <DocButtons
                additional={"none"}
                editid={null}
                controller={"returns"}
                closed={"p=returns"}
            />
            <div className="formWrapper">
                <Form
                    id="myForm"
                    form={form}
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
                        modify: moment(data.Body.List[0].Modify),
                        mark: data.Body.List[0].Mark,
                        stockid: data.Body.List[0].StockId,
                        customerid: data.Body.List[0].CustomerName,
                        status: data.Body.List[0].Status == 1 ? true : false,
                    }}
                    onFinish={handleFinish}
                    layout="horizontal"
                >
                    <Row>
                        <Col xs={24} md={24} xl={6}>
                            <Form.Item
                                label="Qaytarma ???"
                                name="name"
                                className="doc_number_form_item"
                                style={{ width: "100%" }}
                            >
                                <Input
                                    className="detail-input"
                                    allowClear
                                    style={{ width: "100px" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}>
                            <Form.Item
                                label="Qar????-t??r??f"
                                name="customername"
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
                                                <Option key={c.Id} value={c.Id}>
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
                            <Form.Item label="Anbar" name="stockid">
                                <Select
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    className="customSelect detail-input"
                                    allowClear={true}
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
                                header="T??yinat"
                                key="1"
                            >
                                <Row>
                                    <Col xs={24} md={24} xl={6}>
                                        <Form.Item
                                            label="Cavabdeh"
                                            name="ownerid"
                                            style={{ margin: "0", width: "100%" }}
                                        >
                                            <Select
                                                className="detail-input"
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
                                                {ownersOptions}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}>
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
                                    <Col xs={24} md={24} xl={3}></Col>
                                    <Col xs={24} md={24} xl={6}></Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} xl={6}>
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
                    {isFetching ? (
                        <Spin />
                    ) : (
                        <Col xs={24} md={24} xl={24}>
                            <Tab
                                className="custom_table_wrapper_tab"
                                panes={panes}
                            />
                        </Col>
                    )}
                    <Col xs={24} md={24} xl={24}>
                        <Row className="bottom_tab">
                            <Col xs={24} md={24} xl={9}>
                                <div>
                                    <Form.Item name="description">
                                        <TextArea
                                            ref={myRefDescription}
                                            placeholder={"????rh..."}
                                            defaultValue={
                                                data.Body.List[0].Description
                                            }
                                            rows={3}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} md={24} xl={12}>
                                <div className="static_wrapper">
                                    <Statistic
                                        groupSeparator=" "
                                        className="doc_info_text total"
                                        title=""
                                        value={allsum}
                                        prefix={"Yekun m??bl????: "}
                                        suffix={"???"}
                                    />
                                    <Statistic
                                        groupSeparator=" "
                                        className="doc_info_text doc_info_secondary quantity"
                                        title=""
                                        value={allQuantity}
                                        prefix={"Miqdar: "}
                                        suffix={"??d"}
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
            <PaymentModal
                datas={data.Body.List[0]}
                title="M??xaric"
                endPoint="paymentouts"
            />
        </div>
    );
}

export default ReturnDetail;
