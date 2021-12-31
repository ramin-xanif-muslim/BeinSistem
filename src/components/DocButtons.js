import { useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import { Button, message, Modal, Menu, Dropdown } from "antd";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useCustomForm } from "../contexts/FormContext";
import {
    CheckSquareOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    DownOutlined,
    PrinterOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { delDoc } from "../api";
function DocButtons({
    editProduct,
    closed,
    editid,
    controller,
    linked,
    additional,
    from,
    proinfo,
    isArch,
    onChangeArch,
}) {
    const { outerDataSource, disable, setDisable } = useTableCustom();
    const {
        saveFromModal,
        setSaveFromModal,
        redirectSaveClose,
        setRedirectSaveClose,
    } = useCustomForm();
    const [redirect, setRedirect] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [redirectDoc, setRedirectDoc] = useState(false);
    const [redirectClose, setRedirectClose] = useState(false);
    const {
        isReturn,
        setIsReturn,
        setIsPayment,
        paymentModal,
        setPaymentModal,
    } = useCustomForm();
    const handleDelete = () => {
        deleteDoc();
    };
    const onClose = () => {
        message.destroy();
    };

    const handleRedirectDoc = () => {
        setRedirectDoc(true);
    };

    const handleSaveDocModal = () => {
        // setRedirectClose(true);
        setSaveFromModal(true);
    };

    const handleSaveOrNot = (e) => {
        if (!disable) {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
        } else {
            setRedirectClose(true);
        }
    };
    const goCheckPage = () => {};

    const deleteDoc = async () => {
        message.loading({ content: "Loading...", key: "doc_delete" });
        const res = await delDoc(editid, controller);
        if (res.Body.ResponseStatus === "0") {
            message.success({
                content: "Silindi",
                key: "doc_delete",
                duration: 2,
            });
            setRedirect(true);
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
    };
    console.log(editid);
    const dots = (
        <Menu>
            <Menu.Item key="0">
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    className="align_center del"
                    onClick={handleDelete}
                    disabled={editid ? false : true}
                >
                    {closed === "p=product" ? "Silin" : "Sənədi silin"}
                </Button>
                {editProduct && (
                    <Button
                        className="align_center del"
                        onClick={onChangeArch}
                        disabled={editid ? false : true}
                    >
                        {isArch === 0 ? "Arxiva yerləşdir" : "Arxivden çıxart"}
                    </Button>
                )}
            </Menu.Item>
            <Menu.Divider />
        </Menu>
    );
    const check = (
        <Menu>
            <Menu.Item key="0">
                <Link
                    to={{
                        pathname: "/invoice",
                        search: `${editid}`,
                        hash: from,
                    }}
                    target={"_blank"}
                >
                    A4
                </Link>
            </Menu.Item>
        </Menu>
    );
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Button
                    style={{ width: "100%" }}
                    disabled={editid ? false : true}
                    onClick={() => setIsPayment(true)}
                    id={"saveTrans"}
                    form={"myForm"}
                    htmlType={"submit"}
                >
                    Ödəmə
                </Button>
            </Menu.Item>
            <Menu.Item key="1" disabled={editid ? false : true}>
                <Button
                    style={{ width: "100%" }}
                    onClick={() => setIsReturn(true)}
                    form={"myForm"}
                    htmlType={"submit"}
                >
                    Qaytarma
                </Button>
            </Menu.Item>
        </Menu>
    );
    const getProductPrint = (id, br, pr, nm) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`/bc/?bc=${br}&pr=${pr}&nm=${nm}`);
    };

    if (redirect) return <Redirect to={`/${closed}`} />;
    if (redirectDoc) return <Redirect to={`${closed}`} />;

    if (redirectClose) return <Redirect to={`/${closed}`} />;

    if (redirectSaveClose) return <Redirect to={`/${closed}`} />;

    return (
        <div className="doc_buttons_wrapper">
            <div className="left_doc_button">
                <Button
                    style={{
                        display:
                            controller === "sales" || controller === "returns"
                                ? "none"
                                : "block",
                    }}
                    className="customsavebtn"
                    form={"myForm"}
                    htmlType={"submit"}
                    disabled={disable}
                >
                    Yadda saxla
                </Button>
                {linked ? (
                    <Button
                        className="customclosebtn"
                        onClick={() => handleRedirectDoc()}
                    >
                        Bağla
                    </Button>
                ) : (
                    <Button
                        onClick={(e) => handleSaveOrNot(e)}
                        className="customclosebtn"
                    >
                        Bağla
                    </Button>
                )}

                <Dropdown
                    className="customnewdoc"
                    overlay={menu}
                    trigger={["click"]}
                >
                    <Button
                        style={{ display: additional }}
                        icon={<DownOutlined />}
                        onClick={(e) => e.preventDefault()}
                    >
                        Yeni sənəd
                    </Button>
                </Dropdown>
            </div>
            <div className="right_doc_button">
                {proinfo ? (
                    <Button
                        style={{
                            display: from === "products" ? "block" : "none",
                        }}
                        className="flex_directon_col_center d-flex-row"
                        onClick={getProductPrint(
                            proinfo.id,
                            proinfo.bc,
                            proinfo.price,
                            proinfo.nm
                        )}
                    >
                        Barkod
                        <PrinterOutlined />
                    </Button>
                ) : null}
                <Dropdown
                    className="mobilehidden checkbutton"
                    disabled={editid ? false : true}
                    overlay={check}
                    trigger={["click"]}
                >
                    <Button
                        style={{ display: additional }}
                        className="flex_directon_col_center d-flex-row"
                    >
                        <PrinterOutlined />
                        Qaimə
                    </Button>
                </Dropdown>
                <Dropdown overlay={dots} trigger={["click"]}>
                    <Button
                        className="form_setting_icon_wrapper flex_directon_col_center"
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className="dots"></span>
                        <span className="dots"></span>
                        <span className="dots"></span>
                    </Button>
                </Dropdown>
            </div>

            <Modal
                title={
                    <div className="exitModalTitle">
                        <WarningOutlined style={{ color: "#ffb300" }} /> Diqqət
                    </div>
                }
                closable={false}
                className="close_doc_modal_wrapper"
                visible={showModal}
                footer={[
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            form={"myForm"}
                            htmlType={"submit"}
                            onClick={(e) => handleSaveDocModal(e)}
                        >
                            Yadda saxla
                        </Button>
                        <div className="close_doc_modal_right_side">
                            <Button
                                key="back"
                                onClick={() => setShowModal(false)}
                            >
                                Geri qayıt
                            </Button>
                            <Button
                                danger
                                key="link"
                                href="#"
                                onClick={() => setRedirectClose(true)}
                            >
                                Ok
                            </Button>
                        </div>
                    </div>,
                ]}
            >
                <p className="exitModalBodyText">
                    Dəyişikliklər yadda saxlanılmayacaq
                </p>
            </Modal>
        </div>
    );
}
export default DocButtons;
