import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
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
    ConvertFixedPosition,
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
    Space,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function NewDocument() {
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
        customers,
        setCustomers,
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
        stockDrawer,
        createdStock,
        setCreatedStock,
        setProductModal,

        saveFromModal,
        setSaveFromModal,

        redirectSaveClose,
        setRedirectSaveClose,
    } = useCustomForm();
    const [positions, setPositions] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);
    const [docname, setDocName] = useState(null);
    const [newStocksLoad, setNewStocksLoad] = useState(null);
    const [hasConsumption, setHasConsumption] = useState(false);
    const [consumption, setConsumption] = useState(0);
    const [status, setStatus] = useState(true);
    const [initial, setInitial] = useState(null);
    const [tablecolumns, setTableColumns] = useState([]);
    const [columnChange, setColumnChange] = useState(false);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const handleDelete = (key) => {
        handleChanged()
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
    const onClose = () => {
        message.destroy();
    };
    const onChangeConsumption = (e) => {
        setHasConsumption(true);
        setConsumption(e.target.value);
    };

    const handleVisibleChange = (flag) => {
        setVisibleMenuSettings(flag);
    };
    const columns = useMemo(() => {
        return [
            {
                title: "???",
                dataIndex: "Order",
                className: "orderField",
                editable: false,
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Order"
                      ).isVisible
                    : true,
                render: (text, record, index) => index + 1 + 100 * docPage,
            },
            {
                title: "Ad??",
                dataIndex: "Name",
                className: "max_width_field_length",
                editable: false,
                isVisible: initial
                    ? Object.values(initial).find((i) => i.dataIndex === "Name")
                          .isVisible
                    : true,

                // sorter: (a, b) => a.Name.localeCompare(b.Name),
            },
            {
                title: "Barkodu",
                dataIndex: "BarCode",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "BarCode"
                      ).isVisible
                    : true,
                className: "max_width_field_length",
                editable: false,
                sortDirections: ["descend", "ascend"],
                // sorter: (a, b) => a.BarCode - b.BarCode,
            },
            {
                title: "Miqdar",
                dataIndex: "Quantity",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Quantity"
                      ).isVisible
                    : true,
                className: "max_width_field",
                editable: true,
                sortDirections: ["descend", "ascend"],
                // sorter: (a, b) => a.Quantity - b.Quantity,
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return ConvertFixedTable(value);
                },
            },
            {
                title: "Qiym??ti",
                dataIndex: "Price",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "Price"
                      ).isVisible
                    : true,

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
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "TotalPrice"
                      ).isVisible
                    : true,
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
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "StockQuantity"
                      ).isVisible
                    : true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    // do something like adding commas to the value or prefix
                    return ConvertFixedTable(value);
                },
            },
            {
                title: "Maya",
                dataIndex: "CostPr",
                className: "max_width_field",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "CostPr"
                      ).isVisible
                    : true,
                editable: false,
                sortDirections: ["descend", "ascend"],
                render: (value, row, index) => {
                    let defaultCostArray = [];
                    let consumtionPriceArray = [];
                    outerDataSource.forEach((p) => {
                        defaultCostArray.push(Number(p.Price));
                    });
                    if (hasConsumption) {
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

                        return ConvertFixedTable(consumtionPriceArray[index]);
                    } else {
                        return ConvertFixedTable(value);
                    }
                },
            },
            {
                title: "C??m Maya",
                dataIndex: "CostTotalPr",
                className: "max_width_field",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "CostTotalPr"
                      ).isVisible
                    : true,
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
                        return ConvertFixedTable(value);
                    }
                },
            },
            {
                title: "Sil",
                className: "orderField printField",
                dataIndex: "operation",
                isVisible: initial
                    ? Object.values(initial).find(
                          (i) => i.dataIndex === "operation"
                      ).isVisible
                    : true,
                editable: false,
                render: (_, record) => (
                    <Typography.Link>
                        <Popconfirm
                            title="Silm??y?? ??minsinizmi?"
                            okText="B??li"
                            cancelText="Xeyr"
                            onConfirm={() => handleDelete(record.BarCode)}
                        >
                            <a className="color-red">Sil</a>
                        </Popconfirm>
                    </Typography.Link>
                ),
            },
        ];
    }, [consumption, outerDataSource, docSum, columnChange]);

    useEffect(() => {
        setInitial(columns);
    }, []);

    useEffect(() => {
        setColumnChange(false);
    }, [columnChange]);

    const onChangeMenu = (e) => {
        var initialCols = initial;
        var findelement;
        var findelementindex;
        var replacedElement;
        findelement = initialCols.find((c) => c.dataIndex === e.target.id);
        console.log(findelement);
        findelementindex = initialCols.findIndex(
            (c) => c.dataIndex === e.target.id
        );
        findelement.isVisible = e.target.checked;
        replacedElement = findelement;
        initialCols.splice(findelementindex, 1, {
            ...findelement,
            ...replacedElement,
        });
        setColumnChange(true);
    };
    const menu = (
        <Menu>
            <Menu.ItemGroup title="Sutunlar">
                {Object.values(columns).map((d) => (
                    <Menu.Item key={d.dataIndex}>
                        <Checkbox
                            id={d.dataIndex}
                            disabled={
                                columns.length === 3 && d.isVisible === true
                                    ? true
                                    : false
                            }
                            isVisible={d.isVisible}
                            onChange={(e) => onChangeMenu(e)}
                            defaultChecked={d.isVisible}
                        >
                            {d.title}
                        </Checkbox>
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
        </Menu>
    );
    useEffect(() => {
        if (createdStock) {
            getStocksAgain();
        }
    }, [createdStock]);

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
        const attrResponse = await fetchDocName(docname, "documents");
        return attrResponse;
    };

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    const handleFinish = async (values) => {
        setDisable(true);

        values.positions = outerDataSource;
        // values.mark = docmark;
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
        console.log(values);
        values.description =
            myRefDescription.current.resizableTextArea.props.value;
        values.consumption =
            myRefConsumption.current.clearableInput.props.value;
            if (!values.status) {
                values.status = status;
            }
        message.loading({ content: "Y??kl??nir...", key: "doc_update" });

        try {
            const nameres = await getDocName(values.name);
            values.name = nameres.Body.ResponseService;
        } catch (error) {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlan??lmad??... {error.message}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "doc_update",
                duration: 0,
            });
        }

        const res = await saveDoc(values, "documents");
        console.log(res);
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlan??ld??",
                key: "doc_update",
                duration: 2,
            });
            setEditId(res.Body.ResponseService);
            audio.play();

            if (saveFromModal) {
                setRedirectSaveClose(true);
            } else {
                setRedirect(true);
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
    };

    //#region OwDep
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
    const panes = [
        {
            menuItem: "??sas",
            render: () => (
                <Tab.Pane attached={false}>
                    <Row style={{ justifyContent: "space-between" }}>
                        <Col
                            xs={24}
                            md={24}
                            xl={9}
                            style={{ maxWidth: "none", flex: "0.5", zIndex: 1 }}
                        >
                            <div className="addProductInputIcon">
                                <AddProductInput className="newProInputWrapper" />
                                <PlusOutlined
                                    onClick={() => setProductModal(true)}
                                    className="addNewProductIcon"
                                />
                            </div>
                        </Col>
                        <Dropdown
                            overlay={menu}
                            onVisibleChange={handleVisibleChange}
                            visible={visibleMenuSettings}
                        >
                            <Button className="flex_directon_col_center">
                                {" "}
                                <SettingOutlined />
                            </Button>
                        </Dropdown>
                        <Col
                            xs={24}
                            md={24}
                            xl={24}
                            style={{ paddingTop: "1rem", zIndex: "0" }}
                        >
                            <DocTable
                                headers={columns.filter(
                                    (c) => c.isVisible == true
                                )}
                                datas={positions}
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

    if (redirect) return <Redirect to={`/editDocument/${editId}`} />;
    return (
        <div className="doc_wrapper">
            <div className="doc_name_wrapper">
                <h2>S??n??d</h2>
            </div>

            <DocButtons additional={"none"} editid={null} closed={"p=documents"} />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    className="doc_forms"
                    name="basic"
                    initialValues={{
                        status: true,
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
                        <Col xs={24} md={24} xl={6}>
                            <Form.Item
                                label="Daxilolma ???"
                                name="name"
                                className="doc_number_form_item"
                                style={{ width: "100%" }}
                            >
                                <Input
                                    size="small"
                                    allowClear
                                    style={{ width: "100px" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}></Col>
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
                                    style={{ width: "100%" }}
                                    size="small"
                                    showTime={{ format: "HH:mm:ss" }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} xl={3}></Col>
                        <Col xs={24} md={24} xl={6}>
                            <Button
                                className="add-stock-btn"
                                onClick={() => setStockDrawer(true)}
                            >
                                <PlusOutlined />
                            </Button>
                            <Form.Item label="Anbar" name="stockid">
                                <Select
                                    size="small"
                                    showSearch
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={onChange}
                                    className="customSelect"
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
                                            style={{ margin: "0", width: "100%" }}
                                        >
                                            <Select
                                                size="small"
                                                showSearch
                                                placeholder=""
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
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} xl={6}>
                                        <Form.Item
                                            label="????b??"
                                            name="departmentid"
                                            style={{ margin: "0", width: "100%" }}
                                        >
                                            <Select
                                                size="small"
                                                showSearch
                                                placeholder=""
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
                    <Col xs={24} md={24} xl={24}>
                        <Tab
                            className="custom_table_wrapper_tab"
                            panes={panes}
                        />
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                        <Row className="bottom_tab">
                            <Col xs={24} md={24} xl={9}>
                                <div>
                                    <Form.Item name="description">
                                        <TextArea
                                            ref={myRefDescription}
                                            placeholder={"????rh..."}
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
                                        value={ConvertFixedTable(docSum)}
                                        prefix={"Yekun m??bl????: "}
                                        suffix={"???"}
                                    />
                                    <Statistic
                                        groupSeparator=" "
                                        className="doc_info_text doc_info_secondary quantity"
                                        title=""
                                        value={ConvertFixedTable(docCount)}
                                        prefix={"Miqdar: "}
                                        suffix={"??d"}
                                    />

                                    <Divider
                                        style={{ backgroundColor: "grey" }}
                                    />
                                    <div style={{ marginTop: "20px" }}>
                                        <Form.Item
                                            className="comsumption_input_wrapper"
                                            label="??lav?? x??rc"
                                            onChange={onChangeConsumption}
                                            name="consumption"
                                        >
                                            <Input
                                                ref={myRefConsumption}
                                                type="number"
                                                step="any"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <StockDrawer />
            <ProductModal />
        </div>
    );
}

export default NewDocument;
