import { useCustomForm } from "../contexts/FormContext";
import { saveDoc, fetchStocks } from "../api";
import { useEffect, useState } from "react";
import { useTableCustom } from "../contexts/TableContext";
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Drawer,
  Row,
  Col,
  message,
} from "antd";
import TreeView from "../components/TreeView";

import { CloseCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
function StockDrawer({ direction }) {
  const [form] = Form.useForm();

  const { setStockDrawer, stockDrawer, setCreatedStock } = useCustomForm();
  const { stocks, setStockLocalStorage } = useTableCustom();
  const [modalVisible, setModalVisible] = useState(false);
  const [stockId, setStockId] = useState([]);

  var obj;
  stocks ? (obj = stocks) : (obj = JSON.parse(localStorage.getItem("stocks")));
  const onClose = () => {
    setStockDrawer(false);
  };
  const groupOption = Object.values(obj).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  useEffect(() => {
    form.setFieldsValue({
      parentid: stockId[0]?.name,
    });
  }, [stockId]);
  const handleClick = () => {
    setModalVisible(!modalVisible);
  };
  const handleFinish = async (values) => {
    if (!values.parentid) {
      values.parentid = "00000000-0000-0000-0000-000000000000";
    } else {
      values.parentid = stockId[0]?.id;
    }

    message.loading({ content: "Yüklənir...", key: "stocks_update" });
    const res = await saveDoc(values, "stocks");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanıldı",
        key: "stocks_update",
        duration: 2,
      });
      setCreatedStock({
        name: values.name,
        id: res.Body.ResponseService,
      });
      setStockDrawer(false);
    } else {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {res.Body}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "stocks_update",
        duration: 0,
      });
    }
  };
  return (
    <>
      <Drawer
        title="Anbar Yarat"
        placement="right"
        width={600}
        onClose={onClose}
        visible={stockDrawer}
        destroyOnClose={true}
      >
        <Form
          form={form}
          id="myForm"
          style={{ padding: "0px 20px" }}
          name="basic"
          className=""
          layout="horizontal"
          onFinish={handleFinish}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
        >
          <Row className="main_form_side">
            <Col xs={24} md={20} xl={24} className="left_form_wrapper">
              <Form.Item
                label="Qrup adı"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>

              <Form.Item label="Şərh" name="description">
                <TextArea showCount maxLength={100} allowClear />
              </Form.Item>

              <Form.Item label="Anbar qrupu" name="parentid">
                <Input
                  allowClear
                  className="detail-input"
                  onClick={handleClick}
                />
              </Form.Item>
              <Button className="customsavebtn" htmlType="submit">
                Yadda saxla
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <TreeView
        from={"fetchstocks"}
        modalVisible={modalVisible}
        setGroupId={setStockId}
        onClose={handleClick}
        fetchGroup={fetchStocks}
      />
    </>
  );
}

export default StockDrawer;
