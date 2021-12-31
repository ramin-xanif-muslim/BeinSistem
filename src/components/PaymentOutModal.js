import React from "react";
import { useQueryClient } from "react-query";
import { fetchDocName } from "../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTableCustom } from "../contexts/TableContext";
import { fetchCustomers } from "../api";
import {
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Switch,
  Select,
  Spin,
  Modal,
  Row,
  Col,
  Collapse,
} from "antd";
import { message } from "antd";
import { saveDoc } from "../api";
import { useCustomForm } from "../contexts/FormContext";
import { fetchStocks, getCustomerFastFilter, fetchSpendItems } from "../api";
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
var spendOptions = null;
function PaymentOutModal({ datas }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const {
    customers,
    setCustomers,
    spenditems,
    setSpendItems,
    setSpendsLocalStorage,
  } = useTableCustom();
  const { paymentModal, setPaymentModal, isPayment, setIsPayment } =
    useCustomForm();
  const [docname, setDocName] = useState(null);
  const [spends, setSpends] = useState(false);
  const [newStocksLoad, setNewStocksLoad] = useState(null);

  useEffect(() => {
    if (isPayment) getSpendItems();
  }, [isPayment]);
  const getCustomers = async () => {
    const customerResponse = await fetchCustomers();
    setCustomers(customerResponse.Body.List);
  };

  const getSpendItems = async () => {
    setSpends(false);
    const itemResponse = await fetchSpendItems();
    setSpendItems(itemResponse.Body.List);
    setSpendsLocalStorage(itemResponse.Body.List);
    setSpends(true);
  };
  const doSearch = async (value) => {
    const customerResponse = await getCustomerFastFilter(value);
    setCustomers(customerResponse.Body.List);
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

  const getDocName = async (docname) => {
    const attrResponse = await fetchDocName(docname, "paymentouts");
    return attrResponse;
  };
  const onClose = () => {
    message.destroy();
  };
  //#endregion OwDep
  const handleGancel = () => {
    setPaymentModal(false);
    setIsPayment(false);
  };

  const handleFinish = async (values) => {
    values.moment = values.moment._i;
    message.loading({ content: "Loading...", key: "payment_update" });
    const nameres = await getDocName(values.name);
    values.name = nameres.Body.ResponseService;
    const res = await saveDoc(values, "paymentouts");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Mexaric saxlanildi",
        key: "payment_update",
        duration: 2,
      });
      setPaymentModal(false);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "payment_update",
        duration: 0,
      });
    }

  };
  return (
    <Modal
      title={"Mexaric"}
      visible={paymentModal}
      onCancel={handleGancel}
      footer={[
        <Button key="back" onClick={handleGancel}>
          Bağla
        </Button>,
        <Button form="payForm" htmlType="submit" type="primary">
          Yadda saxla
        </Button>,
      ]}
    >
      <Form
        form={form}
        id="payForm"
        className="doc_forms"
        name="basic"
        initialValues={{
          status: true,
          customerid: datas.CustomerId,
          linkid: datas.Id,
          moment: moment(),
          spenditem: spenditems
            ? spenditems.find((s) => s.StaticName === "buyproduct").Id
            : null,
        }}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 14,
        }}
        onFinish={handleFinish}
        layout="horizontal"
      >
        <Row>
          <Col xs={24} md={24} xl={18}>
            <Row>
              <Col xs={24} md={24} xl={10}>
                <Row>
                  <Col xs={24} md={24} xl={24}>
                    <Form.Item
                      label="Mexaric"
                      name="name"
                      className="doc_number_form_item"
                    >
                      <Input allowClear />
                    </Form.Item>
                    <Form.Item
                      name="linkid"
                      hidden={true}
                      className="doc_number_form_item"
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} xl={24}>
                    <Form.Item label="Created Moment" name="moment">
                      <DatePicker
                        showTime={{ format: "HH:mm:ss" }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} xl={24}></Col>
                </Row>
              </Col>
              <Col xs={24} md={24} xl={10}>
                <Row>
                  <Col xs={24} md={24} xl={24}>
                    <Form.Item label="Qarsi teref" name="customerid">
                      <Select
                        showSearch
                        showArrow={false}
                        filterOption={false}
                        className="customSelect"
                        onFocus={getCustomers}
                        onSearch={doSearch}
                        allowClear={true}
                      >
                        {customerOptions}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} xl={24}>
                    <Form.Item label="Xerc maddesi" name="spenditem">
                      <Select
                        showSearch
                        showArrow={false}
                        filterOption={false}
                        className="customSelect"
                        onFocus={() => getSpendItems()}
                        notFoundContent={<Spin size="small" />}
                        allowClear={true}
                      >
                        {spends
                          ? Object.values(spenditems).map((c) => (
                              <Option key={c.Id} value={c.Id}>
                                {c.Name}
                              </Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={24} xl={4}></Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default PaymentOutModal;
