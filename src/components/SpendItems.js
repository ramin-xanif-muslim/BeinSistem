import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import { fetchSpendItems, delSpendItems, updateSpendItem } from "../api";
import { Redirect } from "react-router-dom";
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
export default function SpendItems() {
  const [show, setShow] = useState(false);
  const [spendid, setSpendId] = useState(null);
  const [documentList, setDocumentList] = useState(null);
  const [edit, setEdit] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery(["spenditem"], () =>
    fetchSpendItems()
  );

  const deleteMutation = useMutation(delSpendItems, {
    refetchQueris: ["spenditem"],
  });

  const updateMutation = useMutation(updateSpendItem, {
    refetchQueris: ["spenditem"],
  });
  const onClose = () => {
    message.destroy();
  };

  useEffect(() => {
    if (!isFetching) {
      setDocumentList(data.Body.List);
    } else {
      setDocumentList([]);
    }
  }, [isFetching]);

  const handleEdit = (row) => {
    setEdit(row);
    setShow(true);
  };

  const delSpendItem = (id, e) => {
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
          queryClient.invalidateQueries("spenditem");
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
        title: "Xərc maddəsi",
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
              onConfirm={(e) => delSpendItem(row.Id, e)}
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
            queryClient.invalidateQueries("spenditem");
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
        Xərc maddəsi
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
            form="spendItemForm"
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          id="spendItemForm"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={{
            name: edit ? edit.Name : "",
            id: edit ? edit.Id : "",
          }}
          onFinish={onFinish}
        >
          <Form.Item name="name" label="Xərc maddəsi">
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
