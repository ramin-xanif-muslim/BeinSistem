import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import {
    fetchRefTypes,
    updateRef,
    delRefs,
} from "../api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import ModList from "./ModList";
import {
    Col,
    Row,
    Form,
    Input,
    Button,
    Popconfirm,
    Select,
    Modal,
    Spin,
    message,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
const { Option } = Select;
var pat = /^[a-z]+$/;

let lang = {
    string: "Mətn",
    number: "Rəqəm",
};
export default function ModReference({ visible, openModal }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [documentList, setDocumentList] = useState(null);
    const [edit, setEdit] = useState(null);
    const [list, setShowList] = useState(false);
    const { isLoading, error, data, isFetching } = useQuery(
        ["references", visible],
        () => {
            return visible ? fetchRefTypes() : null;
        }
    );
    const updateMutation = useMutation(updateRef, {
        refetchQueris: ["references"],
    });

    const deleteMutation = useMutation(delRefs, {
        refetchQueris: ["references"],
    });
    const handleEdit = (id) => {
        setEdit(id);
        setShowList(true);
    };

    const onClose = () => {
        message.destroy();
    };

    const delRef = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        message.loading({ content: "Loading...", key: "doc_del" });
        deleteMutation.mutate(id, {
            onSuccess: (res) => {
                if (res.Headers.ResponseStatus === "0") {
                    message.success({
                        content: "Updated",
                        key: "doc_del",
                        duration: 2,
                    });
                    queryClient.invalidateQueries("references");
                } else {
                    message.error({
                        content: (
                            <span className="error_mess_wrap">
                                Saxlanılmadı... {res.Body}{" "}
                                {<CloseCircleOutlined onClick={onClose} />}
                            </span>
                        ),
                        key: "doc_del",
                        duration: 0,
                    });
                }
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };
    useEffect(() => {
        if (!isFetching) {
            setDocumentList(data);
        } else {
            setDocumentList([]);
        }
    }, [isFetching]);

    const columns = useMemo(() => {
        return [
            {
                dataIndex: "Title",
                title: "Adı",
            },

            {
                dataIndex: "ValueType",
                title: "Tipi",
                render: (value, row, index) => {
                    if (value === "string") {
                        return "Mətn";
                    }
                    if (value === "number") {
                        return "Rəqəm";
                    }
                },
            },
            {
                dataIndex: "Edit",
                title: "Redaktə et",
                render: (value, row, index) => {
                    return (
                        <EditOutlined
                            style={{ color: "#0288d1" }}
                            onClick={() => handleEdit(row.Id)}
                        />
                    );
                },
            },
            {
                dataIndex: "Delete",
                title: "Sil",
                render: (value, row, index) => {
                    return (
                        <Popconfirm
                            onConfirm={(e) => delRef(row.Id, e)}
                            title="Əminsiniz？"
                            okText="Bəli"
                            cancelText="Xeyr"
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    );
                },
            },
        ];
    });

    const onFinish = async (values) => {
        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { id: edit ? edit.Id : null, filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        if (
                            res.Body.ResponseStatus &&
                            res.Body.ResponseStatus === "0"
                        ) {
                            message.success({
                                content: "Updated",
                                key: "doc_update",
                                duration: 2,
                            });
                            queryClient.invalidateQueries("references");
                            form.resetFields();
                        } else {
                            message.error({
                                content: (
                                    <span className="error_mess_wrap">
                                        Saxlanılmadı... {res.Body}{" "}
                                        {
                                            <CloseCircleOutlined
                                                onClick={onClose}
                                            />
                                        }
                                    </span>
                                ),
                                key: "doc_update",
                                duration: 0,
                            });
                            form.resetFields();
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
                        form.resetFields();
                    }
                },
                onError: (e) => {
                    console.log(e);
                },
            }
        );
    };
    return (
        <div>
            <Modal
                className="attribute-modal"
                visible={visible}
                title="Bağlılıq"
                destroyOnClose={true}
                onCancel={() => openModal(false)}
                footer={[
                    <Button danger key="back" onClick={() => openModal(false)}>
                        Bağla
                    </Button>,
                ]}
            >
                <Row>
                    <Col xs={24} md={18} xl={24}>
                        <Form
                            form={form}
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Qrup adı"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa xananı doldurun!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa xananı doldurun!",
                                    },
                                ]}
                                label="Tipi"
                                name="valuetype"
                            >
                                <Select>
                                    <Option value="string">Mətn</Option>
                                    <Option value="number">Rəqəm</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button
                                    style={{ width: "100%" }}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Əlavə et
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={18} xl={24} className="modTable">
                        <Table
                            pagination={false}
                            rowKey="Id"
                            columns={columns}
                            dataSource={documentList}
                            locale={{ emptyText: <Spin /> }}
                            size="small"
                        />
                    </Col>
                </Row>
            </Modal>

            <ModList visible={list} editid={edit} openModal={setShowList} />
        </div>
    );
}
