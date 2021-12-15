import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import { Redirect } from "react-router";
import PaymentOutModal from "../../components/PaymentOutModal";
import CustomerDrawer from "../../components/CustomerDrawer";
import { Tab } from "semantic-ui-react";

import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  DatePicker,
  Switch,
  Select,
  Spin,
  Tag,
  Divider,
  Menu,
  Drawer,
  Typography,
  Statistic,
  Popconfirm,
  Row,
  Col,
  Collapse,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { fetchCustomers } from "../../api";
import { fetchStocks } from "../../api";
import { message } from "antd";
import { updateDoc } from "../../api";
import { useRef } from "react";
import { useCustomForm } from "../../contexts/FormContext";
import {
  FindAdditionals,
  FindCofficient,
  ConvertFixedTable,
} from "../../config/function/findadditionals";
const { Option, OptGroup } = Select;
const { TextArea } = Input;
let customPositions = [];
const { Panel } = Collapse;
function DemandReturnDetail() {
  const [form] = Form.useForm();
  const myRefDescription = useRef(null);
  const myRefConsumption = useRef(null);
  const queryClient = useQueryClient();
  const {
    docPage,
    docCount,
    docSum,
    outerDataSource,
    departments,
    owners,
    stocks,
    setStock,
    setStockLocalStorage,
    customers,
    setCustomers,
    setOuterDataSource,
  } = useTableCustom();
  const {
    docstock,
    setDocStock,
    docmark,
    setDocMark,
    setLoadingForm,
    loadingForm,
    setStockDrawer,
    setCustomerDrawer,
    customerDrawer,
    stockDrawer,
    createdStock,
    createdCustomer,
    setCreatedStock,
    setCreatedCustomer,
    isReturn,
    setIsReturn,
    isPayment,
    setIsPayment,
    setPaymentModal,
  } = useCustomForm();
  const [positions, setPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const { doc_id } = useParams();
  const [hasConsumption, setHasConsumption] = useState(false);
  const [status, setStatus] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const { isLoading, error, data, isFetching } = useQuery(
    ["demandreturn", doc_id],
    () => fetchDocId(doc_id, "demandreturns")
  );
  const handleDelete = (key) => {
    const dataSource = [...outerDataSource];
    setOuterDataSource(dataSource.filter((item) => item.key !== key));
    setPositions(dataSource.filter((item) => item.key !== key));
  };
  useEffect(() => {
    if (!isFetching) {
      customPositions = [];
      Object.values(data.Body.List[0].Positions).map((d) =>
        customPositions.push(d)
      );
      customPositions.map((c, index) => (c.key = index));
      customPositions.map((c) => (c.SellPrice = c.Price));
      customPositions.map((c) =>
        c.BasicPrice ? (c.PrintPrice = c.BasicPrice) : ""
      );
      customPositions.map((c) => (c.DefaultQuantity = c.Quantity));

      customPositions.map(
        (c) => (c.TotalPrice = parseFloat(c.Price) * parseFloat(c.Quantity))
      );
      customPositions.map(
        (c) =>
          (c.CostPriceTotal = parseFloat(c.CostPrice) * parseFloat(c.Quantity))
      );
      setPositions(customPositions);
      if (data.Body.List[0].Consumption) {
        setHasConsumption(true);
      }
      setConsumption(data.Body.List[0].Consumption);
      setLoadingForm(false);
      setStatus(data.Body.List[0].Status);
    } else {
      customPositions = [];
      setPositions([]);
      setLoadingForm(true);
    }
  }, [isFetching]);

  const onClose = () => {
    message.destroy();
  };
  const onChangeConsumption = (e) => {
    setHasConsumption(true);
    setConsumption(e.target.value);
  };
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        dataIndex: "Order",
        className: "orderField",
        editable: false,
        isVisible: true,
        render: (text, record, index) => index + 1 + 100 * docPage,
      },
      {
        title: "Adı",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
      },
      {
        title: "Barkodu",
        dataIndex: "BarCode",
        isVisible: true,
        className: "max_width_field_length",
        editable: false,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.BarCode - b.BarCode,
      },
      {
        title: "Miqdar",
        dataIndex: "Quantity",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Qiyməti",
        dataIndex: "Price",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Məbləğ",
        dataIndex: "TotalPrice",
        isVisible: true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Qalıq",
        dataIndex: "StockQuantity",
        className: "max_width_field",
        isVisible: true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
   
      {
        title: "Sil",
        className: "orderField printField",
        dataIndex: "operation",
        isVisible: true,
        editable: false,
        render: (_, record) => (
          <Typography.Link>
            <Popconfirm
              title="Silməyə əminsinizmi?"
              okText="Bəli"
              cancelText="Xeyr"
              onConfirm={() => handleDelete(record.key)}
            >
              <a className="deletePosition">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  }, [consumption, outerDataSource, docSum]);

  const updateMutation = useMutation(updateDoc, {
    refetchQueris: ["demandreturns", doc_id],
  });

  useEffect(() => {
    if (createdStock) {
      getStocksAgain();
    }
  }, [createdStock]);

  useEffect(() => {
    if (createdCustomer) {
      getCustomersAgain();
    }
  }, [createdCustomer]);

  const getCustomersAgain = async () => {
    const customerResponse = await fetchCustomers();
    setCustomers(customerResponse.Body.List);
    form.setFieldsValue({
      customerid: createdCustomer.id,
    });
    setCreatedCustomer(null);
  };
  const getStocksAgain = async () => {
    const stockResponse = await fetchStocks();
    setStock(stockResponse.Body.List);
    setStockLocalStorage(stockResponse.Body.List);
    form.setFieldsValue({
      stockid: createdStock.id,
    });
    setCreatedStock(null);
  };

  //#region OwDep
  var objCustomers;
  customers
    ? (objCustomers = customers)
    : (objCustomers = JSON.parse(localStorage.getItem("customers")));
  const customerOptions = Object.values(objCustomers).map((c) => (
    <Option key={c.Id} value={c.Id}>
      {c.Name}
    </Option>
  ));

  var objOwner;
  owners
    ? (objOwner = owners)
    : (objOwner = JSON.parse(localStorage.getItem("owners")));
  const ownersOptions = Object.values(objOwner).map((c) => (
    <Option key={c.Id} value={c.Id}>
      {c.Name}
    </Option>
  ));

  var objDep;
  departments
    ? (objDep = departments)
    : (objDep = JSON.parse(localStorage.getItem("departments")));

  const depOptions = Object.values(objDep).map((c) => (
    <Option key={c.Id}>{c.Name}</Option>
  ));

  var objStock;
  stocks
    ? (objStock = stocks)
    : (objStock = JSON.parse(localStorage.getItem("stocks")));

  const options = objStock.map((m) => (
    <Option key={m.Id} value={m.Id}>
      {m.Name}
    </Option>
  ));

  //#endregion OwDep

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const handleFinish = async (values) => {
    values.positions = outerDataSource;
    values.moment = values.moment._i;
    values.modify = values.modify._i;
    values.description = myRefDescription.current.resizableTextArea.props.value;
    values.status = status;
    console.log(values);
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { id: doc_id, controller: "demands", filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("demandreturn", doc_id);
            if (isReturn) {
              setRedirect(true);
            }
            if (isPayment) {
              setPaymentModal(true);
            }
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
      }
    );
  };

  const panes = [
    {
      menuItem: "Əsas",
      render: () => (
        <Tab.Pane attached={false}>
          <Row>
            <Col xs={24} md={24} xl={9}>
              <div className="addProductInputIcon">
                <AddProductInput className="newProInputWrapper" />
                <PlusOutlined className="addNewProductIcon" />
              </div>
            </Col>
            <Col xs={24} md={24} xl={24} style={{ paddingTop: "1rem" }}>
              <DocTable headers={columns} datas={positions} />
            </Col>
          </Row>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Əlaqəli sənədlər",
      render: () => <Tab.Pane attached={false}></Tab.Pane>,
    },
  ];

  return (
    <div className="doc_wrapper">
      <div className="doc_name_wrapper">
        <h2>Alıcıya qaytarma</h2>
      </div>
      <DocButtons
        editid={doc_id}
        additional={"none"}
        controller={"demandreturns"}
        closed={"p=demandreturns"}
      />
      <div className="formWrapper">
        <Form
          id="myForm"
          form={form}
          className="doc_forms"
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 14,
          }}
          initialValues={{
            name: data.Body.List[0].Name,
            moment: moment(data.Body.List[0].Moment),
            modify: moment(data.Body.List[0].Modify),
            mark: data.Body.List[0].Mark,
            stockid: data.Body.List[0].StockId,
            customerid: data.Body.List[0].CustomerId,
            status: data.Body.List[0].Status == 1 ? true : false,
          }}
          onFinish={handleFinish}
          layout="horizontal"
        >
          <Row style={{ marginTop: "1em", padding: "1em" }}>
            <Col xs={24} md={24} xl={18}>
              <Row>
                <Col xs={24} md={24} xl={10}>
                  <Row>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item
                        label="Alış №"
                        name="name"
                        className="doc_number_form_item"
                      >
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item label="Tarixi" name="moment">
                        <DatePicker
                          showTime={{ format: "HH:mm:ss" }}
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}></Col>
                  </Row>
                </Col>
                <Col xs={24} md={24} xl={10}>
                  <Row>
                    <Col xs={24} md={24} xl={24} className="plus_wrapper">
                      <Form.Item label="Qarşı-tərəf" name="customerid">
                        <Select
                          showSearch
                          showArrow={false}
                          filterOption={false}
                          className="customSelect"
                          allowClear={true}
                        >
                          {customerOptions}
                        </Select>
                      </Form.Item>
                      <PlusOutlined
                        onClick={() => setCustomerDrawer(true)}
                        className="add_elements"
                      />
                    </Col>
                    <Col xs={24} md={24} xl={24} className="plus_wrapper">
                      <Form.Item label="Anbar" name="stockid">
                        <Select
                          showSearch
                          showArrow={false}
                          filterOption={false}
                          className="customSelect"
                          allowClear={true}
                        >
                          {options}
                        </Select>
                      </Form.Item>
                      <PlusOutlined
                        onClick={() => setStockDrawer(true)}
                        className="add_elements"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} md={24} xl={4}>
                  <Col xs={24} md={24} xl={24}>
                    <Form.Item label="Dəyişmə Tarixi" name="modify">
                      <DatePicker
                        showTime={{ format: "HH:mm:ss" }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={24} xl={6}>
              <Collapse ghost>
                <Panel className="custom_panel_header" header="Təyinat" key="1">
                  <Form.Item
                    label="Cavabdeh"
                    name="ownerid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      filterOption={false}
                      notFoundContent={<Spin size="small" />}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {ownersOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Şöbə"
                    name="departmentid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      notFoundContent={<Spin size="small" />}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {depOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Keçirilib"
                    className="docComponentStatus"
                    name="status"
                    valuePropName="checked"
                  >
                    <Checkbox
                      onChange={(e) => setStatus(e.target.checked)}
                      name="status"
                    ></Checkbox>
                  </Form.Item>
                  <Form.Item label="Status" name="mark">
                    <StatusSelect defaultValue={null} />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col xs={24} md={24} xl={24}>
            <Tab className="custom_table_wrapper_tab" panes={panes} />
          </Col>
          <Col xs={24} md={24} xl={24}>
            <Row className="bottom_tab">
              <Col xs={24} md={24} xl={9}>
                <div>
                  <Form.Item name="description">
                    <TextArea
                      ref={myRefDescription}
                      placeholder={"Şərh..."}
                      defaultValue={data.Body.List[0].Description}
                      rows={3}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={24} xl={12}>
                <div className="static_wrapper">
                  <Statistic
                    groupSeparator=" "
                    className="doc_info_text total"
                    title=""
                    value={docSum}
                    prefix={"Yekun məbləğ: "}
                    suffix={"₼"}
                  />
                  <Statistic
                    groupSeparator=" "
                    className="doc_info_text doc_info_secondary quantity"
                    title=""
                    value={docCount}
                    prefix={"Miqdar: "}
                    suffix={"əd"}
                  />

                  <Divider style={{ backgroundColor: "grey" }} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <StockDrawer />
      <CustomerDrawer />
      <PaymentOutModal datas={data.Body.List[0]} />
    </div>
  );
}

export default DemandReturnDetail;
