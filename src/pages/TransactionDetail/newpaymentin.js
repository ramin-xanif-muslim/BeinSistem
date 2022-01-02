import React from "react";
import { fetchDocName } from "../../api";
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
    DatePicker,
    Select,
    Spin,
    Row,
    Col,
    Collapse,
} from "antd";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { saveDoc, fetchSpendItems } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import CustomerDrawer from "../../components/CustomerDrawer";

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;
function NewPaymentIn() {
    const [form] = Form.useForm();
    const {
        outerDataSource,
        setOuterDataSource,
        departments,
        owners,
        customers,
        spenditems,
        setSpendItems,
        setSpendsLocalStorage,
        setDisable,
        disable,
    } = useTableCustom();
    const {
        docmark,
        setLoadingForm,
        setCustomerDrawer,

        saveFromModal,
        setRedirectSaveClose,
    } = useCustomForm();
    const [positions, setPositions] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);
    const [status, setStatus] = useState(true);
    const [spends, setSpends] = useState(false);

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
    }, []);
    const getSpendItems = async () => {
        setSpends(false);
        const itemResponse = await fetchSpendItems();
        setSpendItems(itemResponse.Body.List);
        setSpendsLocalStorage(itemResponse.Body.List);
        setSpends(true);
    };
    const getDocName = async (docname) => {
        const attrResponse = await fetchDocName(docname, "paymentins");
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
    const onChangeSpendItem = (value, option) => {
        console.log(value, option);
        if (option.staticname === "correct") {
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
        values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm");
        if (!values.status) {
            values.status = status;
        }
        values.mark = docmark;

        message.loading({ content: "Loading...", key: "doc_update" });

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

        const res = await saveDoc(values, "paymentins");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlanildi",
                key: "doc_update",
                duration: 2,
            });
            setEditId(res.Body.ResponseService);

            if (saveFromModal) {
                setRedirectSaveClose(true);
            } else {
                setRedirect(true);
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
    };
    if (redirect) return <Redirect to={`/editPaymentIn/${editId}`} />;

    if (!spends) return <div>Loading....</div>;
    if (spends)
        return (
            <div className="doc_wrapper">
                <div className="doc_name_wrapper">
                    <h2>Mədaxil (nağd)</h2>
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
                            <Col xs={24} md={24} xl={6}>
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
                            <Col xs={24} md={24} xl={3}></Col>
                            <Col xs={24} md={24} xl={6}>
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
                                    >
                                        {customerOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} xl={3}></Col>
                            <Col xs={24} md={24} xl={6}></Col>
                        </Row>

                        <Row>
                            <Col xs={24} md={24} xl={6}>
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
                            <Col xs={24} md={24} xl={3}></Col>
                            <Col xs={24} md={24} xl={6}>
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
                                        <Col xs={24} md={24} xl={3}></Col>
                                        <Col xs={24} md={24} xl={6}>
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
                                        <Col xs={24} md={24} xl={3}></Col>
                                        <Col xs={24} md={24} xl={6}></Col>
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
                                        <Col xs={24} md={24} xl={3}></Col>
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
                                        <Col xs={24} md={24} xl={6}></Col>
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

export default NewPaymentIn;
