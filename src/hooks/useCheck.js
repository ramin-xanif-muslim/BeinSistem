import { Dropdown, Menu } from "antd";
import {
    PrinterOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    FileOutlined,
} from "@ant-design/icons";
import { FaFileInvoice } from "react-icons/fa";
import { Link } from "react-router-dom";
import { downloadFile } from "../config/function";


export const useCheck = ( id, from ) => {
    const printMenu = (
        <Menu>
            <Menu.Item key="1" icon={<FileOutlined />}>
                <Link
                    to={{
                        pathname: "/invoice",
                        search: `${id}`,
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
                        search: `${id}`,
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
    const downloadMenu = (
        <Menu>
            <Menu.Item
                className="icon-excel"
                key="1"
                icon={<FileExcelOutlined />}
                onClick={() => downloadFile({ cus: id }, "xlsx", from)}
            >
                Excel
            </Menu.Item>
            <Menu.Item
                className="icon-pdf"
                key="2"
                icon={<FilePdfOutlined />}
                onClick={() => downloadFile({ cus: id }, "pgf", from)}
            >
                PDF
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
        </Menu>
    );
    const checkComponent = (
        <Dropdown
            className="mobilehidden checkbutton"
            // disabled={id ? false : true}
            overlay={check}
            trigger={["click"]}
        >
            <button
                // style={{ display: additional }}
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
        )

        return [checkComponent]
}