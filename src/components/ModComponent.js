import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import {
    fetchSpendItems,
    delSpendItems,
    updateSpendItem,
    fetchAttributes,
    fetchRefTypes,
    delAttributes,
    updateAttributes,
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
    Checkbox,
    Spin,
} from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    EditOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import ModReference from "./ModReference";

const { Option } = Select;
var pat = /^[a-z]+$/;

let lang = {
    string: "Mətn",
    number: "Ədəd",
};
export default function ModComponent() {
    const [show, setShow] = useState(false);
    const [linked, setShowLinked] = useState(false);
    const [spendid, setSpendId] = useState(null);
    const [documentList, setDocumentList] = useState(null);
    const [edit, setEdit] = useState(null);
    const queryClient = useQueryClient();
    const [reftypes, setRefTypes] = useState(null);
    const [hideValueType, sethideValueType] = useState(false);

    useEffect(() => {
        getRefTypes();
    }, []);

    const { isLoading, error, data, isFetching } = useQuery(
        reftypes && ["attributes", { reftypes }],
        () => fetchAttributes()
    );

    const deleteMutation = useMutation(delAttributes, {
        refetchQueris: ["attributes", reftypes],
    });

    const updateMutation = useMutation(updateAttributes, {
        refetchQueris: ["attributes", reftypes],
    });
    const onClose = () => {
        message.destroy();
    };

    const getRefTypes = async () => {
        const ref = await fetchRefTypes();
        setRefTypes(ref);
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
        message.loading({ content: "Loading...", key: "doc_del" });
        deleteMutation.mutate(id, {
            onSuccess: (res) => {
                if (res.Headers.ResponseStatus === "0") {
                    message.success({
                        content: "Updated",
                        key: "doc_del",
                        duration: 2,
                    });
                    queryClient.invalidateQueries("attributes");
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
                dataIndex: "Title",
                title: "Adı",
            },

            {
                dataIndex: "Name",
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
                        return "Ədəd";
                    }
                },
            },
            {
                dataIndex: "ReferenceType",
                title: "Bağlılıq",
                render: (value, row, index) => {
                    if (value === 1) {
                        return <Checkbox disabled={true} checked={true} />;
                    } else {
                        return <Checkbox disabled={true} checked={false} />;
                    }
                },
            },
            {
                dataIndex: "IsFilter",
                title: "Filter",
                render: (value, row, index) => {
                    if (value === 1) {
                        return <Checkbox disabled={true} checked={true} />;
                    } else {
                        return <Checkbox disabled={true} checked={false} />;
                    }
                },
            },
            {
                dataIndex: "IsRequired",
                title: "Vaciblik",
                render: (value, row, index) => {
                    if (value === 1) {
                        return <Checkbox disabled={true} checked={true} />;
                    } else {
                        return <Checkbox disabled={true} checked={false} />;
                    }
                },
            },
            {
                dataIndex: "Edit",
                title: "Redaktə et",
                render: (value, row, index) => {
                    return (
                        <EditOutlined
                            style={{ color: "#1164b1" }}
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

    const onSelect = () => {
        sethideValueType(true);
    };

    const onClear = () => {
        sethideValueType(false);
    };

    const handleOk = () => {
        // this.setState({ visible: false });
    };

    const handleCancel = () => {
        setShow(false);
        setEdit(null);
    };
    const refOptions = reftypes
        ? reftypes.map((item) => (
              <Option key={item.Id} value={item.Id}>
                  {item.Title}
              </Option>
          ))
        : null;

    const onFinish = async (values) => {
        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { id: edit ? edit.Id : null, filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Updated",
                            key: "doc_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries("attributes");
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
    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div>
            <div style={{ display: "flex" }}>
                <Button
                    icon={<PlusOutlined />}
                    style={{
                        marginBottom: "1rem",
                        alignItems: "center",
                        display: "flex",
                    }}
                    type="primary"
                    onClick={() => setShowLinked(true)}
                >
                    Qrup
                </Button>
                <Button
                    icon={<PlusOutlined />}
                    style={{
                        margin: "0 0 1rem 1rem",
                        alignItems: "center",
                        display: "flex",
                    }}
                    type="primary"
                    onClick={() => setShow(true)}
                >
                    Modifikasiya
                </Button>
            </div>
            <Table
                rowKey="Id"
                columns={columns}
                dataSource={documentList}
                locale={{ emptyText: isFetching ? <Spin /> : "Cədvəl boşdur" }}
                size="small"
            />

            <Modal
                visible={show}
                title="Modifikasiya"
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
                        form="modForm"
                        onClick={handleOk}
                    >
                        Yadda saxla
                    </Button>,
                ]}
            >
                <Form
                    id="modForm"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    initialValues={{
                        title: edit ? edit.Title : "",
                        name: edit ? edit.Name : "",
                        id: edit ? edit.Id : "",
                        entitytype: edit ? edit.EntityType : "product",
                        valuetype: edit ? edit.ValueType : "",
                        referencetypeid: edit ? edit.ReferenceTypeId : "",
                        isrequired: edit ? edit.IsRequired : false,
                        isfilter: edit ? edit.IsFilter : false,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        tooltip="Sistem üçün təyin olunan ad"
                        label="Texniki ad"
                        rules={[
                            {
                                required: true,
                                message: "Texniki adı doldurun",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || pat.test(value)) {
                                        if (
                                            value.length >= 5 &&
                                            value.length <= 15
                                        ) {
                                            return Promise.resolve();
                                        }
                                    }

                                    return Promise.reject(
                                        new Error(
                                            "Ad yalnız kiçik ingilis hərflərindən ibarət olmalıdır və uzunluğu 5-15 arasında dəyişməlidir"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input disabled={edit ? true : false} />
                    </Form.Item>
                    <Form.Item name="title" label="Adı">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        hidden={true}
                        name="entitytype"
                        label="Obyekt növü"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="valuetype" label="Tipi">
                        <Select
                            showSearch
                            disabled={edit ? true : hideValueType}
                            showArrow={false}
                            filterOption={(input, option) =>
                                option
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option key="string" value={"string"}>
                                Mətn
                            </Option>
                            <Option key="number" value={"number"}>
                                Ədəd
                            </Option>
                            <Option key="date" value={"date"}>
                                Tarix
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item hidden={true} name="id" label="Obyekt növü">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="referencetypeid"
                        className="modpage"
                        label="Bağlılıq"
                    >
                        <Select
                            showSearch
                            allowClear
                            onSelect={onSelect}
                            onClear={onClear}
                            disabled={edit ? true : false}
                            showArrow={false}
                            filterOption={(input, option) =>
                                option
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {refOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="isrequired"
                        label="Vaciblik"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Bəli"
                            unCheckedChildren="Xeyr"
                        />
                    </Form.Item>

                    <Form.Item
                        name="isfilter"
                        label="Filter"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Bəli"
                            unCheckedChildren="Xeyr"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <ModReference visible={linked} openModal={setShowLinked} />
        </div>
    );
}
