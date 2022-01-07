import { Button, Drawer, Form, Input, message } from "antd";
import React from "react";
import { useCustomForm } from "../contexts/FormContext";
import { saveDoc } from "../api";
import { CloseCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

function CustomerGroupDrawer() {
    const [form] = Form.useForm();

    const {
        setCustomerDrawer,
        setCustomerGroupDrawer,
        customerGroupDrawer,
        setCreatedCustomerGroup,
    } = useCustomForm();
    const onCloseChildren = () => {
        setCustomerGroupDrawer(false);
    };

    const onClose = () => {
        setCustomerDrawer(false);
    };

    const handleFinishChildren = async (values) => {
        if (!values.parentid) {
            values.parentid = "00000000-0000-0000-0000-000000000000";
        }
        message.loading({ content: "Yüklənir...", key: "customergrs_update" });
        const res = await saveDoc(values, "customergroups");
        if (res.Headers.ResponseStatus === "0") {
            message.success({
                content: "Saxlanıldı",
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
    );
}

export default CustomerGroupDrawer;
