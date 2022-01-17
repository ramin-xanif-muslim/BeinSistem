import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { Tree } from "antd";
import { fetchStocks, updateStocks, delStocks } from "../api";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

import {
    Modal,
    Form,
    Input,
    Button,
    Popconfirm,
    message,
    Select,
    Spin,
} from "antd";
import { useTableCustom } from "../contexts/TableContext";
import "../Group.css";
const { DirectoryTree } = Tree;
let pid;
const { Option } = Select;

function convert(array) {
    var map = [{}];
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (!(obj.id in map)) {
            map[obj.id] = obj;
            map[obj.id].children = [];
        }

        if (typeof map[obj.id].name == "undefined") {
            map[obj.id].title = obj.title;
            map[obj.id].key = obj.key;
            map[obj.id].icon = obj.icon;
        }

        var parent = obj.parent || "-";
        if (!(parent in map)) {
            map[parent] = {};
            map[parent].children = [];
        }

        map[parent].children.push(map[obj.id]);
    }
    return map["-"].children;
}

function Stock() {
    const {
        searchGr,
        setSearchGr,
        setAdvancedPage,
        stocks,
        setStock,
        setStockLocalStorage,
    } = useTableCustom();
    var datas = [];
    const [editId, setEditId] = useState(null);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(null);

    const queryClient = useQueryClient();

    const { isLoading, error, data, isFetching } = useQuery("stocks", () =>
        fetchStocks()
    );

    const updateMutation = useMutation(updateStocks, {
        refetchQueris: ["stocks"],
    });

    const deleteMutation = useMutation(delStocks, {
        refetchQueris: ["stocks"],
    });

    const handleEdit = (e, id, name, des, pid) => {
        e.preventDefault();
        setEditId(id);
        setEdit({
            Id: id,
            Name: name,
            Description: des,
            ParentId: pid,
        });
        setShow(true);
    };
    const onClose = () => {
        message.destroy();
    };
    const deleteGroup = (id, e) => {
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
                    queryClient.invalidateQueries("stocks");
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
    const handleOk = () => {
        // this.setState({ visible: false });
    };

    const handleCancel = () => {
        setShow(false);
        setEditId(null);
        setEdit(null);
    };

    useEffect(() => {
        if (!isFetching) {
            setStock(data.Body.List);
            setStockLocalStorage(data.Body.List);
        }
    }, [isFetching]);

    const onFinish = async (values) => {
        if (!values.parentid) {
            values.parentid = "00000000-0000-0000-0000-000000000000";
        }
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
                        queryClient.invalidateQueries("stocks");
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

    Object.values(data.Body.List).map((d) => {
        d.ParentId === "00000000-0000-0000-0000-000000000000"
            ? (pid = "")
            : (pid = d.ParentId);
        datas.push({
            id: d.Id,
            name: d.Name,
            parent: pid,
            title: d.Name,
            key: d.Id,
            icon: (
                <span>
                    <EditOutlined
                        onClick={(e) =>
                            handleEdit(
                                e,
                                d.Id,
                                d.Name,
                                d.Description,
                                d.ParentId
                            )
                        }
                        className="editGr"
                    />
                    <Popconfirm
                        className="editGr deleteGr"
                        onConfirm={(e) => deleteGroup(d.Id, e)}
                        title="Əminsiniz？"
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </span>
            ),
        });
    });

    var obj;
    stocks
        ? (obj = stocks)
        : (obj = JSON.parse(localStorage.getItem("stocks")));

    const groupOption = Object.values(obj).map((c) => (
        <Option key={c.Id}>{c.Name}</Option>
    ));

    const onSelect = (keys, info) => {
        console.log("Trigger Select", keys, info);
        setSearchGr(keys[0]);
        setAdvancedPage(0);
    };

    var convertedDatas = convert(datas);
    convertedDatas.unshift({
        id: "",
        name: "Bütün anbarlar",
        parent: "",
        title: "Bütün anbarlar",
        key: "",
    });
    return (
        <div className="group_wrapper">
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
                Anbar
            </Button>
            <Modal
                visible={show}
                title="Anbar"
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
                        description: edit ? edit.Description : "",
                        parentid: edit
                            ? edit.ParentId ===
                              "00000000-0000-0000-0000-000000000000"
                                ? ""
                                : edit.ParentId
                            : "",
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Adı">
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true} name="id" label="id">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Təsvir" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Yerləşdiyi anbar" name="parentid">
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
                </Form>
            </Modal>
            <DirectoryTree
                multiple
                draggable
                showIcon={true}
                icon
                defaultSelectedKeys={[searchGr]}
                treeData={convertedDatas}
                onSelect={onSelect}
            />
        </div>
    );
}

export default Stock;
