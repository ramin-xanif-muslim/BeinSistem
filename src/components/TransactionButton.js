import { Menu, Dropdown } from "antd";
import { Button, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
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
        <Button as={Link} to="/newpaymentin">
          Nağd
        </Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Button as={Link} to="/newInvoiceIn">
          Köçürmə
        </Button>
      </Menu.Item>
    </Menu>
  );

  const menuPaymentOut = (
    <Menu className="transaction_buttons_menu">
      <Menu.Item key="0">
        <Button as={Link} to="/newpaymentout">
          Nağd
        </Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Button as={Link} to="/newInvoiceOut">
          Köçürmə
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{display:'flex'}}>
      <Dropdown overlay={menuPaymentIn} trigger={["click"]}>
        <Button
          icon
          labelPosition="left"
          animated="vertical"
          className="project_buttons mobilehidden"
        >
          <Icon name="add circle" />
          <Button.Content visible>Yeni</Button.Content>
          <Button.Content hidden>
            <DownOutlined />
          </Button.Content>
        </Button>
      </Dropdown>
      <Dropdown overlay={menuPaymentOut} trigger={["click"]}>
        <Button
          style={{ marginLeft: "15px" }}
          icon
          labelPosition="left"
          animated="vertical"
          className="project_buttons fotTransMobile mobilehidden"
        >
          <Icon name="minus circle" />
          <Button.Content visible>Yeni</Button.Content>
          <Button.Content hidden>
            <DownOutlined />
          </Button.Content>
        </Button>
      </Dropdown>
    </div>
  );
}

export default TransactionButtons;
