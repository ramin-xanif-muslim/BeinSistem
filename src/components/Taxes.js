import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import {
  fetchSpendItems,
  delSpendItems,
  updateSpendItem,
  updateTaxes,
} from "../api";
import { Redirect } from "react-router-dom";
import { Divider } from "antd";
import MaskedInput from "antd-mask-input";
import { ConvertDecimal } from "../config/function/findadditionals";

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
  Checkbox,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { fetchCompany, fetchTaxes, updateCompany } from "../api";

function Taxes() {
  const [loading, setLoading] = useState(false);
  const [sendObject, setSendObject] = useState({});
  const [newObj, setNewObj] = useState(null);
  const [services, setServices] = useState([]);
  const [accountservices, setAccountServices] = useState([]);
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery(["taxes"], () =>
    fetchTaxes()
  );
  const updateMutation = useMutation(updateTaxes, {
    refetchQueris: ["taxes"],
  });

  useEffect(() => {
    if (accountservices) {
      var newObj = {};

      Object.entries(accountservices).map(([k, v]) => {
        Object.assign(newObj, { [`s${k}`]: v });
      });
    }

    setSendObject(newObj);
  }, [accountservices]);

  useEffect(() => {
    if (newObj) {
      Object.assign(sendObject, newObj);
      setSendObject(sendObject);
      setNewObj(null);
    }
  }, [newObj]);

  const onChangeFilter = (e, name) => {
    var n = "s" + name;
    var v = e.target.value;
    var newObj = { [n]: v };
    setNewObj(newObj);
  };
  const onChange = (e) => {
    var n = "s" + e.target.id;
    var v = e.target.checked;
    var newObj = { [n]: v };
    setNewObj(newObj);
  };
  useEffect(() => {
    if (!isFetching) {
      setServices(Object.values(data.Body.Services));
      setAccountServices(data.Body.AccountServices);
    } else {
      setServices([]);
      setAccountServices([]);
    }
  }, [isFetching]);

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
        title: "Servis",
      },

      {
        dataIndex: "Price",
        title: "Gündəlik",
      },
      {
        dataIndex: "PriceMonthly",
        title: "Aylıq",
        render: (value, row, index) => {
          return ConvertDecimal(row.Price * 30);
        },
      },
      {
        dataIndex: "Configuration",
        title: "Seçim",
        render: (value, row, index) => {
          if (row.ServiceType === "num") {
            return (
              <Input
                type="number"
                min={row.Minimal}
                name={row.Id}
                onChange={(e) => onChangeFilter(e, row.Id)}
                defaultValue={
                  Object.entries(accountservices).find((ac) => ac[0] === row.Id)
                    ? Object.entries(accountservices).find(
                        (ac) => ac[0] === row.Id
                      )[1]
                    : 0
                }
              />
            );
          } else if (row.ServiceType === "check") {
            console.log(
              Object.entries(accountservices).find((ac) => ac[0] === row.Id)
            );
            return (
              <Checkbox
                id={row.Id}
                onChange={(e) => onChange(e)}
                defaultChecked={
                  Object.entries(accountservices).find((ac) => ac[0] === row.Id)
                    ? Object.entries(accountservices).find(
                        (ac) => ac[0] === row.Id
                      )[1] === "1"
                      ? true
                      : false
                    : false
                }
              />
            );
          }
        },
      },
    ];
  }, [services, accountservices]);

  const onClose = () => {
    message.destroy();
  };

  const handleSaveTaxes = async () => {
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { filter: sendObject },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("taxes");
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
      <Row>
        <Col xs={24} md={24} xl={24}>
          <Table
            rowKey="Id"
            columns={columns}
            dataSource={services}
            locale={{ emptyText: <Spin /> }}
            size="small"
          />
        </Col>
        <Col xs={24} md={24} xl={24}>
          <Button
            onClick={() => handleSaveTaxes()}
            form="taxesForm"
            type="primary"
          >
            Yadda saxla
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Taxes;
