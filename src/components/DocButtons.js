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
            console.log("if");
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
        } else {
            console.log("else");
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
    const downloadMenu = (
        <Menu>
            <Menu.Item
                key="1"
                icon={<FileExcelOutlined />}
                onClick={() => downloadFile({ id: editid }, "xlsx", from)}
            >
                Excel
            </Menu.Item>
            <Menu.Item
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
            <Dropdown overlay={printMenu} trigger={["click"]}>
                <Button className="buttons_click">
                    <PrinterOutlined />
                    <span style={{ marginLeft: "5px" }}>Çap et</span>
                </Button>
            </Dropdown>
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
            <Dropdown overlay={downloadMenu} trigger={["click"]}>
                <Button className="buttons_click">
                    <DownloadOutlined />
                    <span style={{ marginLeft: "5px" }}>Yüklə</span>
                </Button>
            </Dropdown>
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
        window.open(`/bc.php?bc=${br}&pr=${pr}&nm=${nm}`);
    };
    const checkBarkodePrint = proinfo ? (
        <Menu>
            <Menu.Item key="0">
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
                    Ədəd
                </Button>
            </Menu.Item>
            {proinfo.packPrice && (
                <Menu.Item key="1">
                    <Button
                        style={{
                            display: from === "products" ? "block" : "none",
                        }}
                        className="flex_directon_col_center d-flex-row"
                        onClick={getProductPrint(
                            proinfo.id,
                            proinfo.bc,
                            proinfo.packPrice,
                            proinfo.nm
                        )}
                    >
                        Paket
                    </Button>
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

                {from === "linked" ? null : (
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
                )}
            </div>
            <div className="right_doc_button">
                {proinfo ? (
                    <Dropdown overlay={checkBarkodePrint} trigger={["click"]}>
                        <Button
                            style={{
                                display: from === "products" ? "block" : "none",
                            }}
                            className="flex_directon_col_center d-flex-row"
                        >
                            Barkod
                            <PrinterOutlined />
                        </Button>
                    </Dropdown>
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
                        <FaFileInvoice
                            style={{
                                color: "var(--dark-blue)",
                                marginRight: "5px",
                            }}
                        />
                        Qaimə
                    </Button>
                </Dropdown>
                <Dropdown overlay={dots} trigger={["click"]}>
                    <button
                        className="new-Button"
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
