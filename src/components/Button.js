import { useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import { Link, withRouter,Redirect } from "react-router-dom";
import {
  PlusCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import "semantic-ui-css/semantic.min.css";

function Buttons({ text, animate,redirectto }) {
  const [redirect, setRedirect] = useState(false)

  const onClick = () => {
    setRedirect(true)
  }

  if (redirect) return <Redirect to={redirectto}/>
  return (
      <Button className="buttons_click" onClick={onClick} animated="fade">
        <Button.Content
          style={{ display: "flex", margin: "0", color: "black" }}
          visible
        >
          <span>
            <PlusCircleOutlined />
          </span>
          <span style={{ marginLeft: "4px" }}>{text}</span>
        </Button.Content>
        <Button.Content hidden>{animate}</Button.Content>
      </Button>
  );
}

export default Buttons;
