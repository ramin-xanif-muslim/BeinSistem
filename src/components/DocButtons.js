import { useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import { Button, message, Modal, Menu, Dropdown } from "antd";
import { Redirect } from "react-router";
import { useCustomForm } from "../contexts/FormContext";
import { Link } from "react-router-dom";
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
function DocButtons({ closed, editid, controller, linked, additional }) {
  const { outerDataSource,disable,setDisable} = useTableCustom();
  const [redirect, setRedirect] = useState(false);
  const [redirectDoc, setRedirectDoc] = useState(false);
  const { isReturn, setIsReturn, setIsPayment, paymentModal, setPaymentModal } =
    useCustomForm();
  const handleDelete = () => {
    deleteDoc();
  };
  const onClose = () => {
    message.destroy();
  };

  const handleRedirectDoc = () => {
    setRedirectDoc(true);
  };

  const goCheckPage = () => {
    
  }

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
  const dots = (
    <Menu>
      <Menu.Item key="0">
        <Button
          icon={<DeleteOutlined />}
          className="align_center del"
          onClick={handleDelete}
          disabled={editid ? false : true}
        >
          {closed === "p=product" ? "Məhsulu silin" : "Sənədi silin"}
        </Button>
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
              hash: "enters",
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
          className="customsavebtn"
          onClick={() => setIsReturn(true)}
          form={"myForm"}
          htmlType={"submit"}
        >
          Qaytarma
        </Button>
      </Menu.Item>
    </Menu>
  );

  if (redirect) return <Redirect to={`/${closed}`} />;
  if (redirectDoc) return <Redirect to={`${closed}`} />;

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
            Bagla
          </Button>
        ) : (
          <Button className="customclosebtn">
            <Link to={`/${closed}`}>Bagla</Link>
          </Button>
        )}

        <Dropdown className="customnewdoc" overlay={menu} trigger={["click"]}>
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
        <Dropdown
          className="mobilehidden checkbutton"
          disabled={editid ? false : true}
          overlay={check}
          trigger={["click"]}
        >
          <Button className="flex_directon_col_center d-flex-row">
            Qaimə
            <PrinterOutlined />
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
    </div>
  );
}
export default DocButtons;
