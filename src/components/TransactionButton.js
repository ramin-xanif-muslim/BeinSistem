import { Menu, Dropdown } from "antd";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import "semantic-ui-css/semantic.min.css";

function TransactionButtons({ text, animate, redirectto }) {
    const [redirect, setRedirect] = useState(false);

    const onClick = () => {
        setRedirect(true);
    };

    const menuPaymentIn = (
        <Menu className="transaction_buttons_menu">
            <Menu.Item key="0">
                <Button
                    className="transaction-btn"
                    style={{ width: "100%" }}
                    as={Link}
                    to="/newpaymentin"
                >
                    <Button.Content visible>Nağd</Button.Content>
                </Button>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Button
                    className="transaction-btn"
                    style={{ width: "100%" }}
                    as={Link}
                    to="/newinvoicein"
                >
                    <Button.Content visible>Nağdsız</Button.Content>
                </Button>
            </Menu.Item>
        </Menu>
    );

    const menuPaymentOut = (
        <Menu className="transaction_buttons_menu">
            <Menu.Item key="0">
                <Button
                    className="transaction-btn"
                    style={{ width: "100%" }}
                    as={Link}
                    to="/newpaymentout"
                >
                    <Button.Content visible>Nağd</Button.Content>
                </Button>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Button
                    className="transaction-btn"
                    style={{ width: "100%" }}
                    as={Link}
                    to="/newinvoiceout"
                >
                    <Button.Content visible>Nağdsız</Button.Content>
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: "flex" }}>
            <Dropdown overlay={menuPaymentIn} trigger={["click"]}>
                <Button className="transaction-btn" animated="fade">
                    <Button.Content hidden>Yarat</Button.Content>
                    <Button.Content visible>
                        <span>
                            <PlusCircleOutlined />
                        </span>
                        <span style={{ marginLeft: "4px" }}>Mədaxil</span>
                    </Button.Content>
                </Button>
            </Dropdown>

            <Dropdown overlay={menuPaymentOut} trigger={["click"]}>
                <Button className="transaction-btn" animated="fade">
                    <Button.Content hidden>Yarat</Button.Content>
                    <Button.Content visible>
                        <span>
                            <MinusCircleOutlined />
                        </span>
                        <span style={{ marginLeft: "4px" }}>Məxaric</span>
                    </Button.Content>
                </Button>
            </Dropdown>
        </div>
    );
}

export default TransactionButtons;
