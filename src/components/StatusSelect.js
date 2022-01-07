import { useState, useEffect } from "react";
import {
    Select,
    Drawer,
    Input,
    Divider,
    Button,
    Spin,
    Modal,
    message,
    Form,
} from "antd";
import { useTableCustom } from "../contexts/TableContext";
import { useCustomForm } from "../contexts/FormContext";
import {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { editMarks, fetchMarks, delMarks } from "../api";
const { Option, OptGroup } = Select;
function StatusSelect({ defaultvalue }) {
    const { marks, setMarkLocalStorage, setMark } = useTableCustom();
    const { docmark, setDocMark } = useCustomForm();
    const [defaultName, setDefaultName] = useState(defaultvalue);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(null);
    const [markLoading, setMarkLoading] = useState(false);
    var obj;
    marks ? (obj = marks) : (obj = JSON.parse(localStorage.getItem("marks")));
    const options = obj.map((m) => (
        <Option
            style={{ display: "flex", justifyContent: "space-between" }}
            key={m.Id}
            value={m.Id}
        >
            <span>{m.Name}</span>
            <span className="mark_option_icons_wrapper">
                <EditOutlined
                    style={{ marginRight: "8px", color: "#0288d1" }}
                    id={m.Id}
                    onClick={(e) => handleEditMark(e, m.Id, m.Name, m.Color)}
                />
                <DeleteOutlined
                    style={{ color: "red" }}
                    onClick={(e) => handleDeleteMark(e, m.Id)}
                />
            </span>
        </Option>
    ));

    const onClose = () => {
        message.destroy();
    };

    const handleOk = () => {};

    const handleCancel = () => {
        setShow(false);
        setEdit(null);
    };
    const onChange = (mark) => {
        setDocMark(mark);
    };

    const addMark = () => {
        setShow(true);
    };

    const handleEditMark = (e, id, name, color) => {
        e.preventDefault();
        e.stopPropagation();
        setEdit({
            Name: name,
            Color: color,
            Id: id,
        });
        setShow(true);
    };

    const handleDeleteMark = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        message.loading({ content: "Yüklənir...", key: "doc_delete" });
        const res = await delMarks(id);

        if (res.Body.ResponseStatus && res.Body.ResponseStatus === "0") {
            const get = await fetchMarks();
            setMark(get.Body.List);
            setMarkLocalStorage(get.Body.List);
            setMarkLoading(false);
            setDocMark(null);

            setShow(false);
            message.success({
                content: "Silindi",
                key: "doc_delete",
                duration: 2,
            });
        } else {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlanılmadı... {res.Body}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "doc_delete",
                duration: 0,
            });
        }
    };

    const onFinish = async (values) => {
        message.loading({ content: "Yüklənir...", key: "doc_update" });
        setMarkLoading(true);
        const markResponse = await editMarks(values);
        if (
            markResponse.Body.ResponseStatus &&
            markResponse.Body.ResponseStatus === "0"
        ) {
            const get = await fetchMarks();
            setMark(get.Body.List);
            setMarkLocalStorage(get.Body.List);
            setMarkLoading(false);
            setDocMark(markResponse.Body.ResponseService);
            setDefaultName(markResponse.Body.ResponseService);

            setShow(false);
            message.success({
                content: "Dəyişildi",
                key: "doc_update",
                duration: 2,
            });
        } else {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlanılmadı... {markResponse.Body}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "doc_update",
                duration: 0,
            });
        }

        if (
            markResponse.Body.ResponseStatus &&
            markResponse.Body.ResponseStatus === "0"
        ) {
            const get = await fetchMarks();
            setMark(get.Body.List);
            setMarkLocalStorage(get.Body.List);
            setMarkLoading(false);
            setDocMark(markResponse.Body.ResponseService);
            setDefaultName(markResponse.Body.ResponseService);

            setShow(false);
            message.success({
                content: "Dəyişildi",
                key: "doc_update",
                duration: 2,
            });
        } else {
            message.error({
                content: (
                    <span className="error_mess_wrap">
                        Saxlanılmadı... {markResponse.Body}{" "}
                        {<CloseCircleOutlined onClick={onClose} />}
                    </span>
                ),
                key: "doc_update",
                duration: 0,
            });
        }
    };

    return (
        <>
            <Form.Item name="mark">
                <Select
                    showSearch
                    showArrow={false}
                    filterOption={false}
                    onChange={onChange}
                    className="customSelect markselect detail-select"
                    allowClear={true}
                    notFoundContent={<Spin size="small" />}
                    dropdownRender={(menu) => (
                        <div className="site-drawer-render-in-current-wrapper customDrawer">
                            {menu}
                            <Divider style={{ margin: "4px 0" }} />
                            <Drawer
                                title="Status adı"
                                placement="right"
                                closable={false}
                                getContainer={false}
                                style={{ position: "absolute" }}
                            >
                                <Input style={{ width: "115px" }} />
                                <Input type="color" />
                                <Button>Yadda saxla</Button>
                            </Drawer>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    padding: 8,
                                    flexDirection: "column",
                                }}
                            >
                                <a
                                    style={{
                                        flex: "none",
                                        padding: "8px",
                                        display: "block",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => addMark()}
                                >
                                    <PlusOutlined /> Əlavə et
                                </a>
                            </div>
                        </div>
                    )}
                >
                    {markLoading ? [] : options}
                </Select>
            </Form.Item>

            <Modal
                visible={show}
                title="Title"
                onOk={handleOk}
                destroyOnClose={true}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        form="statusform"
                        onClick={handleOk}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <Form
                    id="statusform"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    initialValues={{
                        name: edit ? edit.Name : "",
                        color: edit ? edit.Color : "",
                        id: edit ? edit.Id : "",
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Status adı">
                        <Input />
                    </Form.Item>
                    <Form.Item name="color" label="Rəng">
                        <Input type="color" defaultValue="#0288d1" />
                    </Form.Item>
                    <Form.Item hidden={true} name="id" label="id">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default StatusSelect;
