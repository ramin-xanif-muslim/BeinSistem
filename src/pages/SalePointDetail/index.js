import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import {
    fetchSalePointId,
    updateSalePoint,
} from "../../api";
import DocButtons from "../../components/DocButtons";

import {
    Form,
    Input,
    Button,
    Select,
    Spin,
    Alert,
    Row,
    Col,
    Switch,
    Collapse,
} from "antd";
import "antd/dist/antd.css";
import { message } from "antd";
import { fetchCard } from "../../api";
import {
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { useTableCustom } from "../../contexts/TableContext";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let mods = {};
let count = 0;
let oneRefArray = [];
let lastObject = {};
function SalePointDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [priceModal, setPriceModal] = useState(false);
    const { slpnt_id } = useParams();

    const {
        productGroups,
        setProductGroupsLocalStorage,
        setProductGroups,
        departments,
        owners,
        attributes,
        attrLoading,
        setAttrLoading,
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
        setStockLocalStorage,
        customers,
        setCustomers,
        customerGroups,
        setCustomerGroups,
        setCustomerGroupsLocalStorage,
        setDisable,
        disable,
        stocks,
    } = useTableCustom();

    const [oneref, setOneRef] = useState([]);
    const [priceIsAdd, setPriceIsAdd] = useState(false);
    const [editPrice, setEditPrice] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [list, setList] = useState([]);
    const [barcode, setBarcode] = useState(null);
    const [listLength, setListLength] = useState(0);
    const [linked, setLinked] = useState(null);
    const { isLoading, error, data, isFetching } = useQuery(
        ["salepoints", slpnt_id],
        () => fetchSalePointId(slpnt_id)
    );

    const onClose = () => {
        message.destroy();
    };

    const getBarcode = async () => {
        const res = await fetchCard();
        setBarcode(res.Body);
        form.setFieldsValue({
            card: res.Body,
        });
    };
    var obj;
    stocks
        ? (obj = stocks)
        : (obj = JSON.parse(localStorage.getItem("stocks")));

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

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };

    const updateMutation = useMutation(updateSalePoint, {
        refetchQueris: ["salepoints", slpnt_id],
    });
    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

    if (error) return "An error has occurred: " + error.message;

    const handleFinish = async (values) => {
        setDisable(true);

        message.loading({ content: "Loading...", key: "pro_update" });
        updateMutation.mutate(
            { id: slpnt_id, controller: "salepoints", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Updated",
                            key: "pro_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("salepoints", slpnt_id);
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
    return (
        <div className="doc_wrapper product_wrapper">
            <div className="doc_name_wrapper">
                <h2>Satış nöqtəsi</h2>
            </div>
            <DocButtons
                controller={"salepoints"}
                closed={"p=salepoints"}
                additional={"none"}
            />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    style={{ padding: "20px" }}
                    name="basic"
                    initialValues={{
                        name: data.Body.List[0].Name,
                        stockid: data.Body.List[0].StockId,
                        description: data.Body.List[0].Description,
                        status: data.Body.List[0].Status === 1 ? true : false,
                    }}
                    className=""
                    layout="horizontal"
                    onFinish={handleFinish}
                    onFieldsChange={handleChanged}
                >
                    <Row>
                        <Col
                            xs={24}
                            md={20}
                            xl={8}
                            className="left_form_wrapper"
                        >
                            <Form.Item
                                label="Satış nöqtəsi"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa, məhsulun adını qeyd edin..",
                                    },
                                ]}
                            >
                                <Input allowClear={true} />
                            </Form.Item>

                            <Form.Item label="Şərh" name="description">
                                <TextArea size="small" allowClear />
                            </Form.Item>
                            <Button className="add-group-btn">
                                <PlusOutlined
                                // onClick={() => setStockDrawer(true)}
                                />
                            </Button>
                            <Form.Item
                                label="Bağlı anbar"
                                name="stockid"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa, anbarı seçin..",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    className="doc_status_formitem_wrapper_col "
                                    placeholder=""
                                    filterOption={false}
                                    notFoundContent={<Spin size="small" />}
                                >
                                    {groupOption}
                                </Select>
                            </Form.Item>
                            <Form.Item name="status" valuePropName="checked">
                                <Switch
                                    checkedChildren="Aktiv"
                                    unCheckedChildren="Deaktiv"
                                    // defaultChecked
                                />
                            </Form.Item>
                            <Collapse ghost>
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
                                            showSearch
                                            placeholder=""
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
                                            showSearch
                                            placeholder=""
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

export default SalePointDetail;
