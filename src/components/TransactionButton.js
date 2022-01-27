import { Menu, Dropdown } from "antd";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
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
                <Link className="new-button link" as={Link} to="/newpaymentin">
                    <Button.Content visible>Nağd</Button.Content>
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Link className="new-button link" as={Link} to="/newinvoicein">
                    <Button.Content visible>Nağdsız</Button.Content>
                </Link>
            </Menu.Item>
        </Menu>
    );

    const menuPaymentOut = (
        <Menu className="transaction_buttons_menu">
            <Menu.Item key="0">
                <Link className="new-button link" as={Link} to="/newpaymentout">
                    <Button.Content visible>Nağd</Button.Content>
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Link className="new-button link" as={Link} to="/newinvoiceout">
                    <Button.Content visible>Nağdsız</Button.Content>
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: "flex" }}>
            <Dropdown overlay={menuPaymentIn} trigger={["click"]}>
                <button className="new-button">
                    <Button.Content visible>
                        <span>
                            <PlusCircleOutlined />
                        </span>
                        <span style={{ marginLeft: "4px" }}>Mədaxil</span>
                    </Button.Content>
                </button>
            </Dropdown>

            <Dropdown overlay={menuPaymentOut} trigger={["click"]}>
                <button className="new-button">
                    <Button.Content visible>
                        <span>
                            <MinusCircleOutlined />
                        </span>
                        <span style={{ marginLeft: "4px" }}>Məxaric</span>
                    </Button.Content>
                </button>
            </Dropdown>
        </div>
    );
}

export default TransactionButtons;
