import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, fetchDocName } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import CustomerDrawer from "../../components/CustomerDrawer";
import { fetchCustomers } from "../../api";
import {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
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
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useFetchDebt, useGetDocItems } from "../../hooks";
import TextArea from "antd/lib/input/TextArea";
import { Tab } from "semantic-ui-react";
import { ConvertFixedTable } from "../../config/function/findadditionals";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;

function SupplyReturnLinked(props) {
    const [form] = Form.useForm();
    const myRefDescription = useRef(null);
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
        setStockDrawer,
        setCustomerDrawer,
        customerDrawer,
        stockDrawer,
        createdStock,
        createdCustomer,
        setCreatedStock,
        setCreatedCustomer,
        setIsReturn,
    } = useCustomForm();
    const [positions, setPositions] = useState(props.location.state.position);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [docname, setDocName] = useState(null);
    const [newStocksLoad, setNewStocksLoad] = useState(null);
    const [status, setStatus] = useState(false);

    const { allsum, allQuantity } = useGetDocItems();

    const onClose = () => {
        message.destroy();
    };

    // const { debt, setCustomerId, customerId, fetchDebt } = useFetchDebt();
    const [debt, setDebt] = useState(0);
    const [customerId, setCustomerId] = useState();
    const fetchDebt = async (id) => {
        let res = await api.fetchDebt(id ? id : customerId);
        setDebt(ConvertFixedTable(res));
    };
    useEffect(() => {
        if (customerId) {
            fetchDebt(customerId);
        }
    }, [customerId]);

    useEffect(() => {
        console.log(props.location.state.data.Positions);
        setPositions(props.location.state.position);
        setStatus(props.location.state.data.Status);
        setCustomerId(props.location.state.data.CustomerId);
    }, []);

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
                    // do something like adding commas to the value or prefix
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
                    // do something like adding commas to the value or prefix
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
                    // do something like adding commas to the value or prefix
                    return ConvertFixedTable(value);
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
                    // do something like adding commas to the value or prefix
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
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <a className="deletePosition">Sil</a>
                        </Popconfirm>
                    </Typography.Link>
                ),
            },
        ];
    });

    useEffect(() => {
        if (JSON.stringify(positions) !== JSON.stringify(outerDataSource)) {
            setDisable(false);
        }
    }, [outerDataSource]);

    useEffect(() => {
        setIsReturn(false);
        setDisable(false);
    }, []);

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
    useEffect(() => {
        form.setFieldsValue({
            moment: moment(),
        });
        setLoadingForm(false);
    }, []);

    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, "supplyreturns");
        return attrResponse;
    };

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    const handleFinish = async (values) => {
        values.positions = outerDataSource;
        values.customerid = customerId;
        values.mark = docmark;
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        values.description =
            myRefDescription.current.resizableTextArea.props.value;
        if (!values.status) {
            values.status = status;
        }

        message.loading({ content: "Y??kl??nir...", key: "doc_update" });
        const nameres = await getDocName(values.name);

        values.name = nameres.Body.ResponseService;

        const res = await saveDoc(values, "supplyreturns");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlan??ld??",
                key: "doc_update",
                duration: 2,
            });
            setEditId(res.Body.ResponseService);
            audio.play();
            fetchDebt();
            // setRedirect(true);
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

    const onChange = (stock) => {
        setDocStock(stock);
    };

    if (redirect)
        return <Redirect to={`/editSupply/${props.location.state.linked}`} />;

    const panes = [
        {
            menuItem: "??sas",
            render: () => (
                <Tab.Pane attached={false}>
                    <Row>
                        <Col xs={9} sm={9} md={9} xl={9}>
                            <div className="addProductInputIcon">
                                <AddProductInput className="newProInputWrapper" />
                                <PlusOutlined className="addNewProductIcon" />
                            </div>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={24}
                            xl={24}
                            style={{ paddingTop: "1rem" }}
                        >
                            <DocTable
                                headers={columns}
                                datas={
                                    debt && props.location.state.data.Positions
                                }
                            />
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
                <h2>Al??????n geriqaytarmas??</h2>
            </div>
            <DocButtons
                editid={props.location.state.linked}
                linked={true}
                closed={`/editSupply/${props.location.state.linked}`}
                from="linked"
            />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    className="doc_forms"
                    name="basic"
                    initialValues={{
                        name: props.location.state.data.Name,
                        moment: moment(props.location.state.data.Moment),
                        modify: moment(props.location.state.data.Modify),
                        mark: props.location.state.data.Mark,
                        stockid: props.location.state.data.StockId,
                        link: props.location.state.data.Id,
                        customerid: props.location.state.data.CustomerName,
                        status:
                            props.location.state.data.Status == 1
                                ? true
                                : false,
                    }}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={handleFinish}
                    onFieldsChange={handleChanged}
                    layout="horizontal"
                >
                    <Row>
                        <Col xs={6} sm={6} md={6} xl={6}>
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
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={3} sm={3} md={3} xl={3}></Col>
                        <Col xs={6} sm={6} md={6} xl={6}>
                            <Button className="add-stock-btn">
                                <PlusOutlined
                                // onClick={() => setCustomerDrawer(true)}
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
                                    disabled
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    className="customSelect detail-select"
                                    allowClear={true}
                                    // onChange={(e) => setCustomerId(e)}
                                >
                                    {customerOptions}
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
                                label="Tarix"
                                name="moment"
                                style={{ width: "100%" }}
                            >
                                <DatePicker
                                    disabled
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
                                // onClick={() => setStockDrawer(true)}
                                />
                            </Button>
                            <Form.Item
                                label="Anbar"
                                name="stockid"
                                rules={[
                                    {
                                        required: true,
                                        message: "Z??hm??t olmasa, anbar?? se??in",
                                    },
                                ]}
                            >
                                <Select
                                    disabled
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={onChange}
                                    className="customSelect detail-select"
                                    allowClear={true}
                                >
                                    {options}
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
                                            label="Status"
                                            name="mark"
                                            style={{
                                                width: "100%",
                                                margin: "0",
                                            }}
                                        >
                                            <StatusSelect disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={3} sm={3} md={3} xl={3}></Col>
                                    <Col xs={6} sm={6} md={6} xl={6}>
                                        <Form.Item
                                            label="Cavabdeh"
                                            name="ownerid"
                                            style={{ margin: "0", width: "100%" }}
                                        >
                                            <Select
                                                disabled
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
                                                {/* {ownersOptions} */}
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
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6} xl={6}>
                                        <Form.Item
                                            label="????b??"
                                            name="departmentid"
                                            style={{ margin: "0", width: "100%" }}
                                        >
                                            <Select
                                                disabled
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
                                                {/* {depOptions} */}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={3} sm={3} md={3} xl={3}></Col>
                                    <Col xs={6} sm={6} md={6} xl={6}></Col>
                                    <Col xs={3} sm={3} md={3} xl={3}></Col>
                                    <Col xs={6} sm={6} md={6} xl={6}></Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    </Row>
                </Form>

                <Row>
                    <Col xs={24} sm={24} md={24} xl={24}>
                        <Tab
                            className="custom_table_wrapper_tab"
                            panes={panes}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} xl={24}>
                        <Row className="bottom_tab">
                            <Col xs={9} sm={9} md={9} xl={9}>
                                <div>
                                    <Form
                                        initialValues={{
                                            description:
                                                props.location.state.data
                                                    .Description,
                                        }}
                                        onFieldsChange={handleChanged}
                                    >
                                        <Form.Item name="description">
                                            <TextArea
                                                ref={myRefDescription}
                                                placeholder={"????rh..."}
                                                rows={3}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} xl={12}>
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
        </div>
    );
}

export default SupplyReturnLinked;
