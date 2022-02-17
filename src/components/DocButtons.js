import { useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import { Button, message, Modal, Menu, Dropdown } from "antd";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useCustomForm } from "../contexts/FormContext";
import { FaFileInvoice } from "react-icons/fa";
import {
    DeleteOutlined,
    CloseCircleOutlined,
    DownOutlined,
    PrinterOutlined,
    WarningOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    FileOutlined,
} from "@ant-design/icons";
import { delDoc } from "../api";
import { downloadFile } from "../config/function";

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
        message.loading({ content: "Yüklənir...", key: "doc_delete" });
        const res = await delDoc(editid, controller);
        if (
            res.Body &&
            res.Body.ResponseStatus &&
            res.Body.ResponseStatus === "0"
        ) {
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
    const dots = (
        <Menu>
            <Menu.Item key="0">
                <button
                    icon={<DeleteOutlined />}
                    className="new-button new-danger-button w-100"
                    onClick={handleDelete}
                    disabled={editid ? false : true}
                >
                    {closed === "p=product" ? "Silin" : "Sənədi silin"}
                </button>
            </Menu.Item>
            <Menu.Item>
                {editProduct && (
                    <button
                        className="new-button w-100"
                        onClick={onChangeArch}
                        disabled={editid ? false : true}
                    >
                        {isArch === 0 ? "Arxiva yerləşdir" : "Arxivden çıxart"}
                    </button>
                )}
            </Menu.Item>
        </Menu>
    );
    const downloadMenu = (
        <Menu>
            <Menu.Item
                className="icon-excel"
                key="1"
                icon={<FileExcelOutlined />}
                onClick={() => downloadFile({ id: editid }, "xlsx", from)}
            >
                Excel
            </Menu.Item>
            <Menu.Item
                className="icon-pdf"
                key="2"
                icon={<FilePdfOutlined />}
                onClick={() => downloadFile({ id: editid }, "pgf", from)}
            >
                PDF
            </Menu.Item>
        </Menu>
    );
    const printMenu = (
        <Menu>
            <Menu.Item key="1" icon={<FileOutlined />}>
                <Link
                    to={{
                        pathname: "/invoice",
                        search: `${editid}`,
                        hash: from,
                    }}
                    target={"_blank"}
                    className="buttons_click"
                >
                    A4
                </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FileOutlined />}>
                <Link
                    to={{
                        pathname: "/invoice",
                        search: `${editid}`,
                        hash: from,
                    }}
                    target={"_blank"}
                    className="buttons_click"
                >
                    A5
                </Link>
            </Menu.Item>
        </Menu>
    );
    const check = (
        <Menu className="download-menu">
            <Menu.Item>
                <Dropdown overlay={printMenu}>
                    <button className="new-button w-100">
                        <PrinterOutlined />
                        <span style={{ marginLeft: "5px" }}>Çap et</span>
                    </button>
                </Dropdown>
            </Menu.Item>
            <Menu.Item>
                <Dropdown overlay={downloadMenu}>
                    <button className="new-button w-100">
                        <DownloadOutlined />
                        <span style={{ marginLeft: "5px" }}>Yüklə</span>
                    </button>
                </Dropdown>
            </Menu.Item>
            {/* <Link
                    to={{
                        pathname: "/invoice",
                        search: `${editid}`,
                        hash: from,
                    }}
                    target={"_blank"}
                    className="buttons_click"
                >
                    A4
                </Link> */}
            {/* <Menu.Item
                key="1"
                onClick={() => downloadFile({ id: editid }, "xlsx", from)}
            >
                Yüklə xlsx
            </Menu.Item>
            <Menu.Item
                key="2"
                onClick={() => downloadFile({ id: editid }, "pgf", from)}
            >
                Yüklə pgf
            </Menu.Item> */}
        </Menu>
    );
    let menu = "";
    if (from === "customerorders") {
        menu = (
            <Menu>
                <Menu.Item key="0" disabled={editid ? false : true}>
                    <button
                        className="new-button w-100"
                        onClick={() => setIsReturn(true)}
                        form={"myForm"}
                        htmlType={"submit"}
                    >
                        Satış
                    </button>
                </Menu.Item>
            </Menu>
        );
    } else {
        menu = (
            <Menu>
                <Menu.Item key="0">
                    <button
                        className="new-button w-100"
                        disabled={editid ? false : true}
                        onClick={() => setIsPayment(true)}
                        id={"saveTrans"}
                        form={"myForm"}
                        htmlType={"submit"}
                    >
                        Ödəmə
                    </button>
                </Menu.Item>
                <Menu.Item key="1" disabled={editid ? false : true}>
                    <button
                        className="new-button w-100"
                        onClick={() => setIsReturn(true)}
                        form={"myForm"}
                        htmlType={"submit"}
                    >
                        Qaytarma
                    </button>
                </Menu.Item>
            </Menu>
        );
    }
    const getProductPrint = (id, br, pr, nm) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`/bc.php?bc=${br}&pr=${pr}&nm=${nm}`);
    };
    const checkBarkodePrint = proinfo ? (
        <Menu>
            <Menu.Item key="0">
                <button
                    style={{
                        display: from === "products" ? "block" : "none",
                    }}
                    className="new-button w-100"
                    onClick={getProductPrint(
                        proinfo.id,
                        proinfo.bc,
                        proinfo.price,
                        proinfo.nm
                    )}
                >
                    Ədəd
                </button>
            </Menu.Item>
            {proinfo.packPrice && (
                <Menu.Item key="1">
                    <button
                        style={{
                            display: from === "products" ? "block" : "none",
                        }}
                        className="new-button w-100"
                        onClick={getProductPrint(
                            proinfo.id,
                            proinfo.bc,
                            proinfo.packPrice,
                            proinfo.nm
                        )}
                    >
                        Paket
                    </button>
                </Menu.Item>
            )}
        </Menu>
    ) : null;

    if (redirect) return <Redirect to={`/${closed}`} />;
    if (redirectDoc) return <Redirect to={`${closed}`} />;

    if (redirectClose) return <Redirect to={`/${closed}`} />;

    if (redirectSaveClose) return <Redirect to={`/${closed}`} />;

    return (
        <div className="doc_buttons_wrapper">
            <div className="left_doc_button">
                <button
                    style={{
                        display:
                            controller === "sales" || controller === "returns"
                                ? "none"
                                : "block",
                    }}
                    className={
                        disable ? "new-button" : "new-button new-success-button"
                    }
                    form={"myForm"}
                    htmlType={"submit"}
                    disabled={disable}
                >
                    Yadda saxla
                </button>
                {linked ? (
                    <button
                        className="new-button new-danger-button"
                        onClick={() => handleRedirectDoc()}
                    >
                        Bağla
                    </button>
                ) : (
                    <button
                        className="new-button new-danger-button"
                        onClick={(e) => handleSaveOrNot(e)}
                    >
                        Bağla
                    </button>
                )}

                {from === "linked" ? null : (
                    <Dropdown
                        className="customnewdoc"
                        overlay={menu}
                        trigger={["click"]}
                    >
                        <button
                            style={{ display: additional }}
                            icon={<DownOutlined />}
                            onClick={(e) => e.preventDefault()}
                            className="new-button"
                        >
                            Sənəd yarat
                        </button>
                    </Dropdown>
                )}
            </div>
            <div className="right_doc_button">
                {proinfo ? (
                    <Dropdown overlay={checkBarkodePrint} trigger={["click"]}>
                        <button
                            style={{
                                display: from === "products" ? "block" : "none",
                            }}
                            className="new-button"
                        >
                            <PrinterOutlined />
                            <span style={{ marginLeft: "5px" }}>Barkod</span>
                        </button>
                    </Dropdown>
                ) : null}
                <Dropdown
                    className="mobilehidden checkbutton"
                    disabled={editid ? false : true}
                    overlay={check}
                    trigger={["click"]}
                >
                    <button
                        style={{ display: additional }}
                        className="new-button"
                    >
                        <FaFileInvoice
                            style={{
                                color: "var(--dark-blue)",
                                marginRight: "5px",
                            }}
                        />
                        Qaimə
                    </button>
                </Dropdown>
                <Dropdown overlay={dots} trigger={["click"]}>
                    <button
                        className="new-button"
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className="dots"></span>
                        <span className="dots"></span>
                        <span className="dots"></span>
                    </button>
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
                        <button
                            className="new-button"
                            form={"myForm"}
                            htmlType={"submit"}
                            onClick={(e) => handleSaveDocModal(e)}
                        >
                            Yadda saxla
                        </button>
                        <div className="close_doc_modal_right_side">
                            <button
                                className="new-button"
                                key="back"
                                onClick={() => setShowModal(false)}
                            >
                                Geri qayıt
                            </button>
                            <button
                                className="new-button new-danger-button"
                                key="link"
                                href="#"
                                onClick={() => setRedirectClose(true)}
                            >
                                Ok
                            </button>
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
