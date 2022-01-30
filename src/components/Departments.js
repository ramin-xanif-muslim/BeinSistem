import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import {
    fetchSpendItems,
    delSpendItems,
    updateSpendItem,
    fetchDepartments,
    delDepartment,
    updateDepartment,
} from "../api";
import { Redirect } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    Col,
    Row,
    Form,
    Input,
    Button,
    Popconfirm,
    TreeSelect,
    Select,
    Switch,
    Modal,
    message,
    Spin,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
export default function Departments() {
    const [show, setShow] = useState(false);
    const [spendid, setSpendId] = useState(null);
    const [documentList, setDocumentList] = useState(null);
    const [edit, setEdit] = useState(null);
    const queryClient = useQueryClient();

    const { isLoading, error, data, isFetching } = useQuery(
        ["department"],
        () => fetchDepartments()
    );

    const deleteMutation = useMutation(delDepartment, {
        refetchQueris: ["department"],
    });

    const updateMutation = useMutation(updateDepartment, {
        refetchQueris: ["department"],
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

    const delDepartments = (id, e) => {
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
                    queryClient.invalidateQueries("department");
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
        //   deleteSpendItems(delAttr, id);
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
                title: "Adı",
            },
            {
                dataIndex: "Description",
                title: "Şərh",
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
                            onConfirm={(e) => delDepartments(row.Id, e)}
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
                        queryClient.invalidateQueries("department");
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

    // if (error) return "An error has occurred: " + error.message;

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
                Şöbə
            </Button>
            <Table
                pagination={false}
                rowKey="Id"
                columns={columns}
                dataSource={documentList}
                locale={{ emptyText: <Spin /> }}
                size="small"
            />

            <Modal
                visible={show}
                title="Şöbə"
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
                        form="departmentform"
                        onClick={handleOk}
                    >
                        Yadda saxla
                    </Button>,
                ]}
            >
                <Form
                    id="departmentform"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    initialValues={{
                        name: edit ? edit.Name : "",
                        description: edit ? edit.Description : "",
                        id: edit ? edit.Id : "",
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Şöbə adı">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Şərh">
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
