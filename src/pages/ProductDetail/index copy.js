import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import {
    fetchProductId,
    fetchRefList,
    savePrice,
    fetchPriceTypes,
    fetchProductFolders,
    delPrice,
} from "../../api";
import DocButtons from "../../components/DocButtons";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Form,
    Input,
    Button,
    InputNumber,
    TreeSelect,
    Checkbox,
    Dropdown,
    message,
    Popconfirm,
    Typography,
    Card,
    Select,
    Spin,
    Space,
    Alert,
    Menu,
    Row,
    Col,
    Collapse,
    Modal,
} from "antd";
import "antd/dist/antd.css";
import {
    SyncOutlined,
    PlusOutlined,
    CaretDownOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Tab } from "semantic-ui-react";
import { convert, convertDataToTree } from "../../config/function/convert";
import { useTableCustom } from "../../contexts/TableContext";
import { updateProduct } from "../../api";
import ProductGroupModal from "../../components/ProductGroupModal";
import { useCustomForm } from "../../contexts/FormContext";
import {
    FindAdditionals,
    FindCofficient,
    ConvertFixedTable,
} from "../../config/function/findadditionals";
import ok from "../../audio/ok.mp3";
import withTreeViewModal from "../../HOC/withTreeViewModal";

const from = "products";

const audio = new Audio(ok);
var mods = {};
let lastObject = {};
const { Option } = Select;
const { TextArea } = Input;
let customPositions = [];
const { Panel } = Collapse;
let array = [];
let count = 0;
let oneRefArray = [];
var guid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function ProductDetail({ groupId, setGroupId, bntOpenTreeViewModal }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [priceModal, setPriceModal] = useState(false);
    const inputEl = useRef(null);
    const { product_id } = useParams();
    const {
        docPage,
        productGroups,
        setProductGroupsLocalStorage,
        setProductGroups,
        departments,
        owners,
        attributes,
        outerDataSource,
        setOuterDataSource,
        attrLoading,
        setAttrLoading,
        docSum,
        refList,
        setRefList,
        setRefsLocalStorage,
        linkedList,
        setLinkedList,
        prices,
        setPrices,
        setPricesLocalStorage,
        groupVisible,
        setGroupVisible,
        setNewGroup,
        newGroup,
        disable,
        setDisable,
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

        isPayment,
        setPaymentModal,
        isReturn,

        saveFromModal,
        setRedirectSaveClose,
    } = useCustomForm();
    const [attrs, setAttrs] = useState(
        attributes ? attributes : JSON.parse(localStorage.getItem("attr"))
    );
    console.log(localStorage.getItem("attr"));
    const [pricetypes, setPriceTypes] = useState(
        prices ? prices : JSON.parse(localStorage.getItem("prices"))
    );
    const [positions, setPositions] = useState([]);
    const [oneref, setOneRef] = useState([]);
    const [priceIsAdd, setPriceIsAdd] = useState(false);
    const [list, setList] = useState([]);
    const [editPrice, setEditPrice] = useState(null);
    const [linked, setLinked] = useState(null);
    const [listLength, setListLength] = useState(0);
    const [isArch, setIsArch] = useState(0);

    const [redirect, setRedirect] = useState(false);
    const { doc_id } = useParams();
    const [hasConsumption, setHasConsumption] = useState(false);
    const [status, setStatus] = useState(false);
    const [consumption, setConsumption] = useState(0);
    const [initial, setInitial] = useState(null);
    const [columnChange, setColumnChange] = useState(false);
    const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
    const [isOpenCallapsePaket, setIsOpenCallapsePaket] = useState(false);
    const [isOpenCallapseTeyinat, setIsOpenCallapseTeyinat] = useState(false);

    const { isLoading, error, data, isFetching } = useQuery(
        ["products", product_id],
        () => fetchProductId(product_id)
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
    useEffect(() => {
        if (!isFetching) {
            console.log(data);
            customPositions = [];
            if (data.Body.List[0].Positions) {
                data.Body.List[0].Positions.map((d) => customPositions.push(d));
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
                form.setFieldsValue({
                    mark: data.Body.List[0].Mark,
                });
            }
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
                    return ConvertFixedTable(value);
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
                    return ConvertFixedTable(value);
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
                    return ConvertFixedTable(value);
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
                    return ConvertFixedTable(value);
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
                        defaultCostArray.push(Number(p.CostPrice));
                    });
                    if (hasConsumption) {
                        consumtionPriceArray = [];
                        outerDataSource.forEach((p) => {
                            consumtionPriceArray.push(
                                FindAdditionals(
                                    consumption,
                                    docSum,
                                    Number(p.CostPrice)
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
                        defaultCostArray.push(Number(p.TotalCostPrice));
                    });
                    if (hasConsumption) {
                        consumtionPriceArray = [];
                        outerDataSource.forEach((p) => {
                            consumtionPriceArray.push(
                                FindAdditionals(
                                    consumption,
                                    docSum,
                                    Number(p.TotalCostPrice)
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

    useEffect(() => {
        setLinkedList([]);
        setOneRef([]);
        getlists();

        return () => {
            setLinkedList([]);
            setLinked([]);
        };
    }, []);

    useEffect(() => {
        if (data) {
            setIsArch(data.Body.List[0].IsArch);
            console.log(data.Body.List[0].IsArch);
        }
    }, []);

    useEffect(() => {
        if (priceIsAdd) {
            setPriceTypes(prices);
            setPriceIsAdd(false);
        }
    }, [priceIsAdd]);
    useEffect(() => {
        if (count === listLength) {
            setAttrLoading(false);
        }
        setLinkedList([
            ...linkedList,
            {
                [linked]: {
                    list,
                },
            },
        ]);
    }, [list]);
    useEffect(() => {
        if (newGroup) {
            getProductGroupsAgain();
        }
    }, [newGroup]);

    const getProductGroupsAgain = async () => {
        const groupResponse = await fetchProductFolders();
        setProductGroups(groupResponse.Body.List);
        setProductGroupsLocalStorage(groupResponse.Body.List);
        form.setFieldsValue({
            groupid: newGroup,
        });
        setNewGroup(null);
        setGroupVisible(false);
    };
    const getlists = async () => {
        setAttrLoading(true);
        setLinkedList([]);
        setOneRef([]);
        count = 0;
        if (attrs !== null) {
            const elements = attrs.filter((a) => a.ReferenceTypeId !== "");
            setListLength(Object.keys(elements).length);
            for (const elem of elements) {
                const arr = await fetchRefList(elem.ReferenceTypeId);
                count++;
                setLinked(elem.ReferenceTypeId);
                setList(arr);
            }
        }
    };
    const updateMutation = useMutation(updateProduct, {
        refetchQueris: ["products", product_id],
    });
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;
    var selectedProduct = data.Body.List[0];
    var pricelist = {};
    let initialValues = Object.assign(
        ...Object.keys(selectedProduct).map((key) => ({
            [key.toLowerCase()]: selectedProduct[key],
        }))
    );
    if (Array.isArray(selectedProduct.Prices)) {
        selectedProduct.Prices.map((p) => {
            var name = "PriceType_" + p.PriceType;
            pricelist[name] = p ? p.Price : "";
        });
    }
    Object.assign(initialValues, pricelist);
    var obj;
    productGroups
        ? (obj = productGroups)
        : (obj = JSON.parse(localStorage.getItem("progroups")));

    const groupOption = Object.values(obj).map((c) => (
        <Option key={c.Id}>{c.Name}</Option>
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

    const handleGancel = () => {
        setPriceModal(false);
        setEditPrice(null);
    };
    const fillOption = (id) => {
        oneRefArray = [];
        setOneRef([]);
        Object.values(linkedList).map((links) => {
            Object.entries(links).forEach(([key, value]) => {
                if (key === id) {
                    value.list.map((r) => {
                        oneRefArray.push({
                            label: r.Name,
                            value: r.Id,
                        });
                    });
                }
            });
            setOneRef(oneRefArray);
        });
    };
    const modInputs = attrs
        .filter((a) => a.ReferenceTypeId === "")
        .map((a) => (
            <Form.Item
                label={a.Title}
                name={a.Name}
                key={a.Id}
                rules={[
                    {
                        required: a.IsRequired == 1 ? true : false,
                        message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
                    },
                ]}
            >
                <Input allowClear={true} />
            </Form.Item>
        ));
    const modSelects = attrs
        .filter((a) => a.ReferenceTypeId != "")
        .map((a) => (
            <Form.Item
                label={a.Title}
                name={`col_${a.Name}`}
                key={a.Id}
                rules={[
                    {
                        required: a.IsRequired == 1 ? true : false,
                        message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
                    },
                ]}
            >
                <Select
                    showSearch
                    allowClear={true}
                    autoFocus={false}
                    id={`col_${a.Name}`}
                    onFocus={() => fillOption(a.ReferenceTypeId)}
                    filterOption={(input, option) =>
                        option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                    notFoundContent={<Spin size="small" />}
                    options={oneref}
                />
            </Form.Item>
        ));

    const editDel = (obj) => (
        <Menu>
            <Menu.Item key="0">
                <EditOutlined
                    style={{ color: "#0288d1" }}
                    onClick={() => handleOpenModal(JSON.stringify(obj))}
                />
            </Menu.Item>
            <Menu.Item key="1">
                <DeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => handleDeletePrice(obj.id)}
                />
            </Menu.Item>
        </Menu>
    );
    const panes = [
        {
            menuItem: "Qiymət",
            render: () => (
                <Tab.Pane className="numberinputsholder" attached={false}>
                    <div style={{ padding: "0.3rem 1rem 1rem" }}>
                        <Form.Item label="Alış qiyməti" name="buyprice">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                allowClear
                                addonAfter="₼"
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item label="Mayası" name="costprice">
                            <Input
                                disabled
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                allowClear
                                addonAfter="₼"
                                min={0}
                            />
                        </Form.Item>
                        <h3>Satış qiymətləri</h3>
                        <Form.Item label="Minimal qiyməti" name="minprice">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                addonAfter="₼"
                                allowClear
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item label="Satış qiyməti" name="price">
                            <Input
                                className="detail-input-addon"
                                type="number"
                                step="any"
                                addonAfter="₼"
                                allowClear
                                min={0}
                            />
                        </Form.Item>
                        <div className="prices_wrapper">
                            {pricetypes.map((c) => (
                                <div className="price_del_icons">
                                    <Form.Item
                                        label={c.Name}
                                        name={"PriceType_" + c.Id}
                                    >
                                        <Input
                                            type="number"
                                            step="any"
                                            className="hiddenarrows detail-input-addon"
                                            allowClear
                                            addonAfter="₼"
                                            min={0}
                                        />
                                    </Form.Item>

                                    <Dropdown
                                        className="customnewdoc"
                                        overlay={editDel({
                                            namepr: c.Name,
                                            id: c.Id,
                                        })}
                                        trigger={["click"]}
                                    >
                                        <BsThreeDotsVertical />
                                    </Dropdown>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="dashed"
                            className={"create_new_price_button"}
                            onClick={() => handleOpenNewPrice()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Yeni qiymət
                        </Button>
                    </div>
                    <Modal
                        destroyOnClose
                        className="modal_price_type"
                        title="Ad"
                        visible={priceModal}
                        onCancel={(e) => handleGancel(e)}
                        footer={[
                            <Button key="back" onClick={(e) => handleGancel(e)}>
                                Bağla
                            </Button>,
                            <Button
                                key="submit"
                                htmlType={"submit"}
                                className="customsavebtn"
                                form="priceTypes"
                            >
                                Yadda saxla
                            </Button>,
                        ]}
                    >
                        <Form
                            id="priceTypes"
                            name="dynamic_form_nest_item"
                            autoComplete="off"
                            onFinish={handleDynamicFinish}
                            initialValues={{
                                namepr: editPrice ? editPrice.namepr : null,
                                id: editPrice ? editPrice.id : null,
                            }}
                        >
                            <Form.Item name="namepr">
                                <Input placeholder={"adı"} />
                            </Form.Item>

                            <Form.Item name="id" hidden={true}>
                                <Input placeholder={"adı"} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Parametrlər",
            render: () => (
                <Tab.Pane attached={false} loading={attrLoading}>
                    {modInputs}
                    {modSelects}
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Şəkillər",
            render: () => (
                <Tab.Pane attached={false}>
                    <p>
                        <i>Tezliklə...</i>
                    </p>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Anbar qalığı",
            render: () => (
                <Tab.Pane attached={false}>
                    <p>
                        <i>Tezliklə...</i>
                    </p>
                </Tab.Pane>
            ),
        },
    ];

    const handleTabChange = (event, data) => {
        if (data.activeIndex === 1) {
            mods = {};
            Object.entries(initialValues).forEach(([key, value]) => {
                if (key.includes("col_")) {
                    Object.assign(mods, { [key]: value });
                }
            });

            Object.values(linkedList).map((links) => {
                Object.entries(links).forEach(([key, value]) => {
                    Object.values(value.list).forEach((c) => {
                        Object.entries(mods).forEach(([keyMods, valueMods]) => {
                            if (c.Id === valueMods) {
                                form.setFieldsValue({
                                    [keyMods]: c.Name,
                                });
                            }
                        });
                    });
                });
            });
        }
    };

    const onValuesChange = (changedValues, allValues) => {
        Object.assign(lastObject, {
            [changedValues[0].name[0]]: changedValues[0].value,
        });
        if (disable) {
            setDisable(false);
        }
    };
    const handleFinish = async (values) => {
        if (!isOpenCallapsePaket) {
            values.ispack = initialValues.ispack;
            values.packprice = initialValues.packprice;
            values.packquantity = initialValues.packquantity;
        }
        if (!isOpenCallapseTeyinat) {
            values.ownerid = initialValues.ownerid;
            values.departmentid = initialValues.departmentid;
        }
        setDisable(true);

        var valueMods = {};
        Object.entries(values).forEach(([k, v]) => {
            if (k.includes("col_")) {
                Object.assign(valueMods, { [k]: v });
            }
        });

        Object.entries(valueMods).forEach(([vk, vv]) => {
            Object.entries(mods).forEach(([mk, mv]) => {
                if (vk == mk) {
                    if (guid.test(vv)) {
                        console.log(guid.test(vv));
                    } else {
                        console.log(guid.test(vv));
                        values[`${vk}`] = null;
                        values[`${vk}`] = mv;
                    }
                    return true;
                }
            });
        });
        // var prices = [];
        // Object.entries(values).map(([k, v]) => {
        //     if (k.indexOf("PriceType_") != -1) {
        //         if (v) {
        //             prices.push({
        //                 PriceType: k.slice(k.indexOf("_") + 1),
        //                 Price: v,
        //             });
        //         }
        //     }
        // });
        // Object.assign(values, initialValues, lastObject);
        // values.prices = prices;
        values.isarch = isArch;

        message.loading({ content: "Yüklənir...", key: "pro_update" });

        updateMutation.mutate(
            { id: product_id, controller: "products", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Dəyişikliklər yadda saxlanıldı",
                            key: "pro_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("products", product_id);
                        audio.play();
                    } else {
                        message.error({
                            content: (
                                <span className="error_mess_wrap">
                                    Saxlanılmadı... {res.Body}{" "}
                                    {<CloseCircleOutlined onClick={onClose} />}
                                </span>
                            ),
                            key: "pro_update",
                            duration: 0,
                        });
                    }
                },
            }
        );
    };

    const handleDynamicFinish = async (values) => {
        var newPriceTypes = {};
        newPriceTypes = values;
        newPriceTypes.name = values.namepr;
        message.loading({ content: "Yüklənir...", key: "price_update" });

        const res = await savePrice(values);
        if (res.Headers.ResponseStatus === "0") {
            const get = await getPrices();
            setPriceIsAdd(true);
            message.success({
                content: "Saxlanıldı",
                key: "price_update",
                duration: 2,
            });
            setPriceModal(false);
        }
    };

    const handleOpenModal = (obj) => {
        setEditPrice(JSON.parse(obj));
        setPriceModal(true);
    };
    const handleOpenNewPrice = () => {
        setEditPrice(null);
        setPriceModal(true);
    };
    const handleDeletePrice = async (id) => {
        message.loading({ content: "Yüklənir...", key: "price_del" });
        const del = await delPrice(id);
        if (del.Headers.ResponseStatus === "0") {
            const get = await getPrices();
            setPriceIsAdd(true);
            message.success({
                content: "Silindi",
                key: "price_del",
                duration: 2,
            });
        } else {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlanılmadı... {del.Body}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "price_del",
                duration: 0,
            });
        }
    };

    const getPrices = async () => {
        const priceResponse = await fetchPriceTypes();
        setPrices(priceResponse.Body.List);
        setPricesLocalStorage(priceResponse.Body.List);
    };
    const onChangeArch = () => {
        isArch === 0 ? setIsArch(1) : setIsArch(0);
        setDisable(false);
        console.log(isArch);
    };
    return (
        <div className="doc_wrapper product_wrapper">
            <ProductGroupModal />
            <div className="doc_name_wrapper">
                <h2>Məhsul</h2>
            </div>
            <DocButtons
                editProduct={true}
                onChangeArch={onChangeArch}
                isArch={isArch}
                editid={product_id}
                controller={"products"}
                closed={"p=product"}
                additional={"none"}
                from={"products"}
                proinfo={{
                    id: data.Body.List[0].Id,
                    bc: data.Body.List[0].BarCode,
                    price: data.Body.List[0].Price,
                    packPrice:
                        data.Body.List[0].IsPack === 1
                            ? data.Body.List[0].PackPrice
                            : null,
                    nm: data.Body.List[0].Name,
                }}
            />
            <div className="formWrapper">
                <Form
                    id="myForm"
                    style={{ padding: "0px 20px" }}
                    name="basic"
                    form={form}
                    ref={inputEl}
                    className=""
                    initialValues={initialValues}
                    onFieldsChange={onValuesChange}
                    onFinish={handleFinish}
                    layout="horizontal"
                >
                    <Row>
                        <Col xs={12} sm={8} md={8} xl={8}>
                            <Row>
                                <Col>
                                    <h3 style={{ marginBottom: "2.6rem" }}>
                                        Ümumi məlumat
                                    </h3>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item
                                        label="Məhsulun adı"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Zəhmət olmasa, məhsulun adını qeyd edin..",
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="detail-input"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item label="Barkod" name="barcode">
                                        <Input
                                            className="detail-input"
                                            suffix={
                                                <SyncOutlined
                                                    style={{ color: "#0288d1" }}
                                                    className="suffixed"
                                                    // onClick={this.onGetBarcode}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Button
                                        className="add-stock-btn"
                                        onClick={() => setGroupVisible(true)}
                                    >
                                        <PlusOutlined />
                                    </Button>
                                    <Button
                                        className="add-stock-btn"
                                        // onClick={handleClick}
                                    >
                                        <CaretDownOutlined />
                                    </Button>
                                    {/* {bntOpenTreeViewModal} */}
                                    <Form.Item
                                        label="Qrup"
                                        name="groupid"
                                        className="group_item_wrapper"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            className="doc_status_formitem_wrapper_col"
                                            className="detail-select"
                                            filterOption={false}
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
                                            {groupOption}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item label="Artkod" name="artcode">
                                        <Input className="detail-input" />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item name="description" label="Şərh">
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                                <Col
                                    className="left_wrapper"
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    xl={24}
                                >
                                    <Form.Item
                                        label="Çəki"
                                        name="isweight"
                                        valuePropName="checked"
                                    >
                                        <Checkbox
                                            size="large"
                                            // onChange={handleBarcodeSelect}
                                            name="wt"
                                        ></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            xs={12}
                            sm={10}
                            md={10}
                            xl={10}
                            style={{ paddingLeft: "5rem" }}
                        >
                            <div className="tab_wrapper">
                                <Tab
                                    menu={{ attached: false }}
                                    onTabChange={handleTabChange}
                                    panes={panes}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} sm={8} md={8} xl={8}>
                            <Collapse ghost>
                                <Panel
                                    className="custom_panel_header_2"
                                    header="Əlavə parametr"
                                    key="1"
                                >
                                    <Collapse
                                        ghost
                                        onChange={() =>
                                            setIsOpenCallapsePaket(true)
                                        }
                                    >
                                        <Panel header="Paket (qutu)" key="1">
                                            <Form.Item
                                                label={"Paketli məhsul"}
                                                valuePropName="checked"
                                                name={"ispack"}
                                            >
                                                <Checkbox></Checkbox>
                                            </Form.Item>
                                            <Form.Item
                                                label="Satış qiyməti"
                                                name="packprice"
                                                // onBlur={(e) => this.onChangeItem(e, "packprice")}
                                            >
                                                <InputNumber className="detail-input-number" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Ədəd"
                                                name="packquantity"
                                                // onBlur={(e) => this.onChangeItem(e, "packquantity")}
                                            >
                                                <InputNumber className="detail-input-number" />
                                            </Form.Item>
                                        </Panel>
                                    </Collapse>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} sm={8} md={8} xl={8}>
                            <Collapse
                                ghost
                                onChange={() => setIsOpenCallapseTeyinat(true)}
                            >
                                <Panel
                                    className="custom_panel_header"
                                    header="Təyinat"
                                    key="1"
                                >
                                    <Form.Item
                                        label={"Cavabdeh"}
                                        name="ownerid"
                                    >
                                        <Select
                                            className="detail-select"
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                            filterOption={(input, option) =>
                                                option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {ownerOption}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label={"Şöbə"}
                                        name="departmentid"
                                    >
                                        <Select
                                            className="detail-select"
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                <Spin size="small" />
                                            }
                                            filterOption={(input, option) =>
                                                option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {departmentOption}
                                        </Select>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default withTreeViewModal(ProductDetail, from);
