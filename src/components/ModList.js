import React, { useState, useEffect } from "react";
import {
    fetchRefList,
    updateRefList,
    delRefsList,
} from "../api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    Col,
    List,
    Row,
    Form,
    Input,
    Button,
    Popconfirm,
    Select,
    Modal,
    message,
} from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
const { Option } = Select;
var pat = /^[a-z]+$/;
const { Search } = Input;

let lang = {
    string: "Mətn",
    number: "Ədəd",
};
export default function ModList({ visible, openModal, editid }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [filterText, setFilterText] = useState("");
    const [documentList, setDocumentList] = useState(null);
    const [editRefItem, setEditRefItem] = useState(null);
    const [editVisible, setEditVisible] = useState(false);

    const { isLoading, error, data, isFetching } = useQuery(
        ["reflists", editid, visible],
        () => {
            return visible ? fetchRefList(editid) : null;
        }
    );
    const updateMutation = useMutation(updateRefList, {
        refetchQueris: ["reflists"],
    });

    const deleteMutation = useMutation(delRefsList, {
        refetchQueris: ["reflists"],
    });
    const handleEdit = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditVisible(true);
        setEditRefItem({
            Name: data.find((c) => c.Id === e.target.id).Name,
            RefId: editid,
            Id: e.target.id,
        });
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
                    queryClient.invalidateQueries("reflists");
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

    const onFinish = async (values) => {
        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { refid: editid, filter: values },
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
                            queryClient.invalidateQueries("reflists");
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
    const handleFinishRef = async (values) => {
        message.loading({ content: "Loading...", key: "doc_update" });
        updateMutation.mutate(
            { refid: editid, filter: values },
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
                            queryClient.invalidateQueries("reflists");
                            form.resetFields();
                            setEditVisible(false);
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

    const onSearch = (value) => {
        console.log(value);
    };
    const onChange = (e) => {
        setFilterText(e.target.value);
    };
    const filteredList = data
        ? data.filter((item) => {
              return (
                  item.Name.toLowerCase().indexOf(filterText.toLowerCase()) !==
                  -1
              );
          })
        : [];
    return (
        <div>
            <Modal
                className="attribute-modal"
                visible={visible}
                title="Title"
                destroyOnClose={true}
                onCancel={() => openModal(false)}
                footer={[
                    <Button danger key="back" onClick={() => openModal(false)}>
                        Bağla
                    </Button>,
                ]}
            >
                <Row>
                    <Col xs={24} md={24} xl={24} className="modTable">
                        <Search
                            placeholder="Axtarış..."
                            onSearch={onSearch}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <Form
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                marginTop: "1rem",
                            }}
                            form={form}
                            name="basic"
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
                                style={{ width: "80%" }}
                                label="Element adı"
                                name="name"
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
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Əlavə et
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <List
                            itemLayout="horizontal"
                            locale={{ emptyText: "Tapılmadı" }}
                            pagination={{
                                onChange: (page) => {
                                    console.log(page);
                                },
                                pageSize: 3,
                            }}
                            dataSource={filteredList}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.Id}
                                    actions={[
                                        <a
                                            key="list-loadmore-edit"
                                            href="/"
                                            id={item.Id}
                                            onClick={(e) =>
                                                handleEdit(item.Id, e)
                                            }
                                        >
                                            <EditOutlined />
                                        </a>,
                                        <Popconfirm
                                            onConfirm={(e) =>
                                                delRef(item.Id, e)
                                            }
                                            title="Silməyə əminsiniz?"
                                            okText="Bəli"
                                            cancelText="Xeyr"
                                        >
                                            <a
                                                style={{
                                                    color: "rgb(255, 61, 61)",
                                                }}
                                                href="/"
                                                key="list-loadmore-more"
                                            >
                                                <DeleteOutlined />
                                            </a>
                                        </Popconfirm>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<a href={"/"}>{item.Name}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Modal>

            <Modal
                visible={editVisible}
                title="Title"
                destroyOnClose={true}
                onCancel={() => setEditVisible(false)}
                footer={[
                    <Button
                        danger
                        key="back"
                        onClick={() => setEditVisible(false)}
                    >
                        Bağla
                    </Button>,
                    <Button
                        key="submit"
                        htmlType="submit"
                        className="customsavebtn"
                        form="createnewlistitemform"
                    >
                        Yadda saxla
                    </Button>,
                ]}
            >
                <Form
                    id="createnewlistitemform"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        name: editRefItem ? editRefItem.Name : "",
                        id: editRefItem ? editRefItem.Id : "",
                        refid: editRefItem ? editRefItem.RefId : "",
                    }}
                    onFinish={handleFinishRef}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Adı"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Zəhmət olmasa xananı doldurun!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="refid" name="refid" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="id" name="id" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    ></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
