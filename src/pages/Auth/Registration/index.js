import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Modal } from "antd";
import { Link, Redirect } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { putLogin } from "../../../api";
import "../../Auth/Login.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useTableCustom } from "../../../contexts/TableContext";
import { fetchMarks, fetchStocks } from "../../../api";
import MaskedInput from "antd-mask-input";
import { sendRegOne, sendRegisterPhp } from "../../../api";
var pat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
var patName = /^([a-zA-Z]{4,})?$/;
export default function Registration() {
  const inputMaskRef = useRef(null);

  const { login, setToken } = useAuth();

  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [objectReg, setobjectReg] = useState(null);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingfirst, setLoadingfirst] = useState(false);

  useEffect(() => {
    setToken(null);
  }, []);

  async function signin(values) {
    const loginResponse = await putLogin(values);
    login(loginResponse);
    setLoading(false);
  }
  async function regfirst(values) {
    setLoadingfirst(true);
    const regResponse = await sendRegOne(values);
    console.log(regResponse);

    if (regResponse === "Login or Email or Phone is exists") {
      setError("Login və ya telefon nömrəsi mövcuddur");
      setLoadingfirst(false);
    } else if (regResponse === "Login or Email is exists") {
      setError("Login və ya email mövcuddur");
      setLoadingfirst(false);
    } else {
      setobjectReg(values);
      setLoading(false);
      setVisible(true);
      setLoadingfirst(false);
    }
  }

  async function register(values, val, logdata) {
    const regResponse = await sendRegisterPhp(values, val);
    setVisible(false);

    signin(logdata);
  }
  const onFinish = (values) => {
    regfirst(values);
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const handleOk = () => {
    setLoading(true);
    var logdata = {};
    logdata.Login = "admin@" + objectReg.Login;
    logdata.Password = objectReg.password;
    register(objectReg, value, logdata);
  };

  const handleCancel = () => {
    setVisible(false);
    setValue("");
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo", errorInfo);
  };
  return (
    <div className="login_page">
      <Modal
        visible={visible}
        className="reg_modal"
        title="Qeydiyyat"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Geri
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Davam et
          </Button>,
        ]}
      >
        <Input onChange={(e) => onChange(e)} value={value} />
      </Modal>

      <div className="lofin_form_wrapper">
        <h1 className="login_word_header">Qeydiyyat</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Login"
            name="Login"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, login daxil edin",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || patName.test(value)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "İstifadəçi adı minimum 4 hərfdən ibarət olmalıdır"
                    )
                  );
                },
              }),
            ]}
          >
            <Input addonBefore="admin@" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Şifrə"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, şifrənizi daxil edin",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || pat.test(value)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Şifrənizdə 6 və ya daha çox simvol və ən azı bir rəqəm olmalıdır.Xüsusi simvollara (#,@,#,!,$,_,-,+,*) icazə verilmir"
                    )
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Şifrəni təkrarla"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Şifrəni təkrarla",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Şifrələr eyni deyil"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mobil nömrəsi"
            name="mobile"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, mobil nömrənizi daxil edin",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log(value);
                  if (
                    !value ||
                    value.slice(7, 9) == "55" ||
                    value.slice(7, 9) == "60" ||
                    value.slice(7, 9) == "99" ||
                    value.slice(7, 9) == "51" ||
                    value.slice(7, 9) == "10" ||
                    value.slice(7, 9) == "50" ||
                    value.slice(7, 9) == "70" ||
                    value.slice(7, 9) == "77"
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Düzgün nömrə daxil edin...")
                  );
                },
              }),
            ]}
          >
            <MaskedInput
              ref={inputMaskRef}
              mask="(+994) 11-111-11-11"
              placeholderChar={"_"}
            />
          </Form.Item>

          <Form.Item
            className="login_bottom_side login"
            style={{ alignContent: "center" }}
          >
            <Button
              loading={loadingfirst}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Qydiyyatdan keç
            </Button>
          </Form.Item>
        </Form>

        <p style={{ color: "red", display: error ? "block" : "none" }}>
          {error}
        </p>
      </div>
    </div>
  );
}
