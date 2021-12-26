import { useState, useEffect } from "react";
import { useCustomForm } from "../contexts/FormContext";
import { saveDoc } from "../api";
import { useTableCustom } from "../contexts/TableContext";
import { fetchCustomerGroups } from "../api";
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
  message,
  Collapse,
} from "antd";
import {
  CloseCircleOutlined,
  SyncOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

function CustomerDrawer() {
  const [form] = Form.useForm();

  const {
    setCustomerDrawer,
    customerDrawer,
    setCustomerGroupDrawer,
    customerGroupDrawer,
    createdCustomer,
    setCreatedCustomer,
    createdCustomerGroup,
    setCreatedCustomerGroup,
  } = useCustomForm();
  const { customerGroups, setCustomerGroups } = useTableCustom();

  const onClose = () => {
    setCustomerDrawer(false);
  };
  const onCloseChildren = () => {
    setCustomerGroupDrawer(false);
  };
  useEffect(() => {
    if (customerDrawer) getCustomerGroups();
  }, [customerDrawer]);

  useEffect(() => {
    if (createdCustomerGroup) getCustomerGroups();
  }, [createdCustomerGroup]);
  const groupOptions = customerGroups
    ? Object.values(customerGroups).map((c) => (
        <Option key={c.Id} value={c.Id}>
          {c.Name}
        </Option>
      ))
    : null;
  const getCustomerGroups = async () => {
    const customerResponse = await fetchCustomerGroups();
    setCustomerGroups(customerResponse.Body.List);
    if (createdCustomerGroup) {
      form.setFieldsValue({
        groupid: createdCustomerGroup.id,
      });
      setCreatedCustomerGroup(null);
    }
  };
  const handleFinish = async (values) => {
    if (!values.parentid) {
      values.parentid = "00000000-0000-0000-0000-000000000000";
    }
    message.loading({ content: "Loading...", key: "customers_update" });
    const res = await saveDoc(values, "customers");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "customers_update",
        duration: 2,
      });
      setCreatedCustomer({
        name: values.name,
        id: res.Body.ResponseService,
      });
      setCustomerDrawer(false);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "customers_update",
        duration: 0,
      });
    }
  };

  const handleFinishChildren = async (values) => {
    if (!values.parentid) {
      values.parentid = "00000000-0000-0000-0000-000000000000";
    }
    message.loading({ content: "Loading...", key: "customergrs_update" });
    const res = await saveDoc(values, "customergroups");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "customergrs_update",
        duration: 2,
      });
      setCreatedCustomerGroup({
        name: values.name,
        id: res.Body.ResponseService,
      });
      setCustomerGroupDrawer(false);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "customergrs_update",
        duration: 0,
      });
    }
  };
  return (
    <Drawer
      title="Müştəri yarat"
      placement="right"
      width={600}
      onClose={onClose}
      visible={customerDrawer}
    >
      <Form
        style={{ padding: "0px 20px" }}
        name="basic"
        form={form}
        className=""
        layout="horizontal"
        onFinish={handleFinish}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        <Row className="main_form_side">
          <Col xs={24} md={20} xl={24} className="left_form_wrapper">
            <Form.Item
              label="Müştəri adı"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Zəhmət olmasa, müştəri adını qeyd edin..",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item label="Kart" name="card">
              <Input suffix={<SyncOutlined className={"suffixed"} />} />
            </Form.Item>

            <Form.Item label="Telefon" name="phone">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>

            <Button className="add-group-btn" onClick={() => setCustomerGroupDrawer(true)}>
              <PlusOutlined />
						</Button>
            <Form.Item label="Müştəri qrupu" name="groupid">
              <Select
                showSearch
                className="doc_status_formitem_wrapper_col "
                placeholder=""
                filterOption={false}
                notFoundContent={<Spin size="small" />}
              >
                {groupOptions}
              </Select>
            </Form.Item>

            <Button className="customsavebtn" htmlType="submit">
              Yadda saxla
            </Button>
          </Col>
        </Row>
      </Form>

      <Drawer
        title="Müştəri qrupu"
        width={400}
        closable={false}
        destroyOnClose={true}
        onClose={onCloseChildren}
        visible={customerGroupDrawer}
      >
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          name="basic"
          initialValues={{}}
          layout="horizontal"
          onFinish={handleFinishChildren}
        >
          <Form.Item
            label="Müştəri qrupu"
            name="name"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, müştəri adını qeyd edin..",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item label="Şərh" name="description">
            <TextArea rows={3} showCount maxLength={100} allowClear />
          </Form.Item>

          <Form.Item label="">
            <Button className="customsavebtn" htmlType="submit">
              Yadda saxla
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Drawer>
  );
}

export default CustomerDrawer;
