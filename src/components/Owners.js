import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import {
  fetchSpendItems,
  delSpendItems,
  updateSpendItem,
  fetchOwners,
  delOwner,
  updateOwner,
  fetchDepartments,
} from "../api";
import { Redirect } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTableCustom } from "../contexts/TableContext";
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
const { Option } = Select;
var patName = /^([a-zA-Z]{4,})?$/;
var pat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export default function Owners() {
  const [show, setShow] = useState(false);
  const [spendid, setSpendId] = useState(null);
  const [documentList, setDocumentList] = useState(null);
  const [edit, setEdit] = useState(null);
  const queryClient = useQueryClient();
  const { departments, setDepartments, setDepartmentsLocalStorage } =
    useTableCustom();
  const { isLoading, error, data, isFetching } = useQuery(
    departments && ["owner", { departments }],
    () => fetchOwners()
  );

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = async () => {
    const depResponse = await fetchDepartments();
    setDepartments(depResponse.Body.List);
    setDepartmentsLocalStorage(depResponse.Body.List);
  };
  const deleteMutation = useMutation(delOwner, {
    refetchQueris: ["owner", { departments }],
  });

  const updateMutation = useMutation(updateOwner, {
    refetchQueris: ["owner", { departments }],
  });
  const onClose = () => {
    message.destroy();
  };

  useEffect(() => {
    if (!isFetching) {
      setDocumentList(Object.values(data.Body.List));
    } else {
      setDocumentList([]);
    }
  }, [isFetching]);

  const handleEdit = (row) => {
    setEdit(row);
    setShow(true);
  };

  const delOwners = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(id);
    message.loading({ content: "Loading...", key: "doc_del" });
    deleteMutation.mutate(id, {
      onSuccess: (res) => {
        if (res.Headers.ResponseStatus === "0") {
          message.success({
            content: "Updated",
            key: "doc_del",
            duration: 2,
          });
          queryClient.invalidateQueries("owner");
        } else {
          message.error({
            content: (
              <span className="error_mess_wrap">
                Saxlanılmadı... {res.Body}{" "}
                {<CloseCircleOutlined onClick={onClose} />}
              </span>
            ),
            key: "doc_del",
            duration: 0,
          });
        }
      },
      onError: (e) => {
        console.log(e);
      },
    });
    //   deleteSpendItems(delAttr, id);
  };

  var objDep;
  departments
    ? (objDep = departments)
    : (objDep = JSON.parse(localStorage.getItem("departments")));

  const depOptions = Object.values(objDep).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        dataIndex: "Order",
        show: true,
        render: (text, record, index) => index + 1 + 25 * 0,
      },
      {
        dataIndex: "Name",
        title: "Ad və ya Soyad",
      },

      {
        dataIndex: "Login",
        title: "İstifadəçi adı",
        render: (value, row, index) => {
          return "admin@" + value;
        },
      },
      {
        dataIndex: "Description",
        title: "Şərh",
      },
      {
        dataIndex: "DepartmentId",
        title: "Bağlı olduğu şöbənin adı",
        render: (value, row, index) => {
          return objDep.find((m) => m.Id === value)
            ? objDep.find((m) => m.Id === value).Name
            : null;
        },
      },

      {
        dataIndex: "Edit",
        title: "Bax",
        render: (value, row, index) => {
          return <EyeOutlined onClick={() => handleEdit(row)} />;
        },
      },
      {
        dataIndex: "Delete",
        title: "Sil",
        render: (value, row, index) => {
          return (
            <Popconfirm
              onConfirm={(e) => delOwners(row.Id, e)}
              title="Əminsiniz？"
              okText="Bəli"
              cancelText="Xeyr"
            >
              <DeleteOutlined />
            </Popconfirm>
          );
        },
      },
    ];
  }, []);

  const handleOk = () => {
    // this.setState({ visible: false });
  };

  const handleCancel = () => {
    setShow(false);
    setEdit(null);
  };

  const onFinish = async (values) => {
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { id: edit ? edit.Id : null, filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("owner");
            setShow(false);
            setEdit(null);
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
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        style={{
          marginBottom: "10px",
          alignItems: "center",
          display: "flex",
        }}
        type="primary"
        onClick={() => setShow(true)}
      >
        İstifadəçi
      </Button>
      <Table
        rowKey="Id"
        columns={columns}
        dataSource={documentList}
        locale={{ emptyText: <Spin /> }}
        size="small"
      />

      <Modal
        visible={show}
        title="Title"
        onOk={handleOk}
        destroyOnClose={true}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="departmentform"
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          id="departmentform"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={{
            name: edit ? edit.Name : "",
            login: edit ? edit.Login : "",
            departmentid: edit ? edit.DepartmentId : "",
            description: edit ? edit.Description : "",

            id: edit ? edit.Id : "",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Adı"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, ad daxil edin",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="login"
            label="Istifadəçi adı"
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
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Şifrə"
            rules={[
              {
                required: edit ? false : true,
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
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="repassword"
            label="Şifrənin təkrarı"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: edit ? false : true,
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
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Əlaqə nömrəsi">
            <Input />
          </Form.Item>
          <Form.Item label="Şöbə" name="departmentid" style={{ margin: "0" }}>
            <Select
              showSearch
              placeholder=""
              notFoundContent={<Spin size="small" />}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {depOptions}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Şərh">
            <Input />
          </Form.Item>
          <Form.Item hidden={true} name="id" label="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}