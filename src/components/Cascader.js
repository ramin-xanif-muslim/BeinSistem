import React, { useState } from "react";
import { Form, Cascader, Button } from "antd";
import { useCustomForm } from "../contexts/FormContext";
import { getBcTemplate } from "../api";
var temdesignarray = [];
const options = [
  {
    value: "3x2",
    label: "3x2",
    children: [
      {
        value: "3x2_1.css",
        label: "3x2_1",
      },
      {
        value: "3x2_2.css",
        label: "3x2_2",
      },
      {
        value: "3x2_3.css",
        label: "3x2_3",
      },
    ],
  },
  {
    value: "4x2",
    label: "4x2",
    children: [
      {
        value: "4x2_1.css",
        label: "4x2_1",
      },
      {
        value: "4x2_2.css",
        label: "4x2_2",
      },
    ],
  },
  {
    value: "6x4",
    label: "6x4",
    children: [
      {
        value: "6x4_1.css",
        label: "6x4_1",
      },
    ],
  },
];

export const CascaderBcTemplates = (props) => {
  const { isTemp, setIsTemp } = useCustomForm();
  const [path, setPath] = useState("");
  function onChange(value) {
    setPath(value);
  }

  const onFinish = async (values) => {
    localStorage.setItem("tempdesign", values.temp[1]);
    localStorage.setItem("temppath", JSON.stringify(path));
    setIsTemp(true);

    const res = await getBcTemplate();
    setIsTemp(false);
  };
  return (
    <div>
      <Form
        onFinish={onFinish}
        layout="horizontal"
        initialValues={{
          temp: JSON.parse(localStorage.getItem("temppath")),
        }}
      >
        <Form.Item name="temp" label="Şablonlar">
          <Cascader
            options={options}
            onChange={onChange}
            placeholder="Zəhmət olmasa seçin"
          />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button htmlType="submit">Yadda saxla</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
