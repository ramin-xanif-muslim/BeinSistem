import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { putLogin } from "../../../api";
import "../../Auth/Login.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useTableCustom } from "../../../contexts/TableContext";
import { fetchMarks, fetchStocks } from "../../../api";
export default function SignIn() {
  const { login, setToken } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(null);
  }, []);

  async function signin(values) {
    const loginResponse = await putLogin(values);
    login(loginResponse);
    setLoading(false);
  }
  const onFinish = (values) => {
    setLoading(true);
    signin(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo", errorInfo);
  };
  return (
    <div className="login_page">
      <div className="lofin_form_wrapper">
        <h1 className="login_word_header">Giriş</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="Login"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa login daxil edin!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Login"
            />
          </Form.Item>

          <Form.Item
            name="Password"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa parolu daxil edin!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Parol"
            />
          </Form.Item>

          <Form.Item className="login_bottom_side">
            <a className="login-form-forgot" href="">
              Parolu unutmuşam
            </a>

            <Link to={{ pathname: "/registration" }}>Qeydiyyatdan keç</Link>
          </Form.Item>

          <Form.Item
            className="login_bottom_side login"
            style={{ alignContent: "center" }}
          >
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Daxil ol
            </Button>
          </Form.Item>
        </Form>

        <p
          style={{
            color: "red",
            // display: this.state.error ? "block" : "none",
          }}
        ></p>
      </div>
    </div>
  );
}
