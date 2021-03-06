import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import { fetchSpendItems, delSpendItems, updateSpendItem } from "../api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Form, Input, Button, Popconfirm, Modal, message, Spin } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
export default function SpendItems() {
    const [show, setShow] = useState(false);
    const [documentList, setDocumentList] = useState(null);
    const [edit, setEdit] = useState(null);
    const queryClient = useQueryClient();

    const { isLoading, error, data, isFetching } = useQuery(["spenditem"], () =>
        fetchSpendItems()
    );

    const deleteMutation = useMutation(delSpendItems, {
        refetchQueris: ["spenditem"],
    });

    const updateMutation = useMutation(updateSpendItem, {
        refetchQueris: ["spenditem"],
    });
    const onClose = () => {
        message.destroy();
    };

    useEffect(() => {
        if (!isFetching) {
            setDocumentList(data.Body.List);
        } else {
            setDocumentList([]);
        }
    }, [isFetching]);

    const handleEdit = (row) => {
        setEdit(row);
        setShow(true);
    };

    const delSpendItem = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        message.loading({ content: "Yüklənir...", key: "doc_del" });
        deleteMutation.mutate(id, {
            onSuccess: (res) => {
                if (res.Headers.ResponseStatus === "0") {
                    message.success({
                        content: "Dəyişildi",
                        key: "doc_del",
                        duration: 2,
                    });
                    queryClient.invalidateQueries("spenditem");
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
    const columns = useMemo(() => {
        return [
            {
                title: "№",
                dataIndex: "Order",
                show: true,
                render: (text, record, index) => index + 1 + 25 * 0,
            },
            {
                dataIndex: "Name",
                title: "Xərc maddəsi",
            },

            {
                dataIndex: "Edit",
                title: "Redaktə et",
                render: (value, row, index) => {
                    return (
                        <EditOutlined
                            style={{ color: "var(--dark-blue)" }}
                            onClick={() => handleEdit(row)}
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
                            onConfirm={(e) => delSpendItem(row.Id, e)}
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
    }, []);

    const handleOk = () => {
        // this.setState({ visible: false });
    };

    const handleCancel = () => {
        setShow(false);
        setEdit(null);
    };

    const onFinish = async (values) => {
        message.loading({ content: "Yüklənir...", key: "doc_update" });
        updateMutation.mutate(
            { id: edit ? edit.Id : null, filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Dəyişildi",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("spenditem");
                        setShow(false);
                        setEdit(null);
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
                },
                onError: (e) => {
                    console.log(e);
                },
            }
        );
    };
    if (isLoading) return "Yüklənir...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div>
            <Button
                icon={<PlusOutlined />}
                style={{
                    marginBottom: "10px",
                    alignItems: "center",
                    display: "flex",
                }}
                type="primary"
                onClick={() => setShow(true)}
            >
                Xərc maddəsi
            </Button>
            <Table
                pagination={false}
                rowKey="Id"
                columns={columns}
                dataSource={documentList}
                locale={{ emptyText: isFetching ? <Spin /> : "Cədvəl boşdur" }}
                size="small"
            />

            <Modal
                visible={show}
                title="Xərc maddəsi"
                onOk={handleOk}
                destroyOnClose={true}
                onCancel={handleCancel}
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Bağla
                    </Button>,
                    <Button
                        key="submit"
                        htmlType="submit"
                        className="customsavebtn"
                        form="spendItemForm"
                        onClick={handleOk}
                    >
                        Yadda saxla
                    </Button>,
                ]}
            >
                <Form
                    id="spendItemForm"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    initialValues={{
                        name: edit ? edit.Name : "",
                        id: edit ? edit.Id : "",
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Xərc maddəsi">
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true} name="id" label="id">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
