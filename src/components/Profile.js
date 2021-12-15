import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import { fetchSpendItems, delSpendItems, updateSpendItem } from "../api";
import { Redirect } from "react-router-dom";
import { Divider } from "antd";
import MaskedInput from "antd-mask-input";

import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Popconfirm,
  TreeSelect,
  Select,
  Switch,
  Modal,
  message,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { fetchCompany, updateCompany } from "../api";
var pat = /^[a-zA-Z0-9]+$/;
const deviderStyle = {
  width: "100%",
  background: "#d2d2d2",
  height: "1px",
};
function Profile() {
  const inputMaskRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery(["company"], () =>
    fetchCompany()
  );
  const updateMutation = useMutation(updateCompany, {
    refetchQueris: ["company"],
  });

  const onClose = () => {
    message.destroy();
  };

  const onFinish = async (values) => {
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("company");
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
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} düzgün formatda deyil!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h3>{JSON.parse(localStorage.getItem("user")).Login}</h3>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          email: data.Body.Email,
          companyname: data.Body.CompanyName,
          accountnumber: data.Body.AccountNumber,
          mobile: data.Body.Mobile,
          voin: data.Body.Voin,
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hesab nömrəsi"
          name="accountnumber"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || pat.test(value)) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    "Hesab nömrəsi yalnız hərflərdən və rəqəmlərdən ibarət olmalıdır"
                  )
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="VÖEN"
          name="voin"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || pat.test(value)) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    "VÖEN yalnız hərflərdən və rəqəmlərdən ibarət olmalıdır"
                  )
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Şirkət adı" name="companyname">
          <Input />
        </Form.Item>
        <Form.Item
          label="Mobil nömrəsi"
          name="mobile"
          rules={[
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

                return Promise.reject(new Error("Düzgün nömrə daxil edin..."));
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
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Divider style={deviderStyle} type="vertical" />
      <Form
        name="basic"
        id="cashback"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          cashback: data.Body.CashBack,
        }}
      >
        <Form.Item label="Cash Back" name="cashback">
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Profile;
