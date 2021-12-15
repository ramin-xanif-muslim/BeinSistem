import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import CustomerDrawer from "../../components/CustomerDrawer";
import { fetchCustomers } from "../../api";
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
import { message } from "antd";
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;

function DemandReturnLinked(props) {
  const [form] = Form.useForm();
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
  } = useTableCustom();
  const {
    docstock,
    setDocStock,
    docmark,
    setDocMark,
    setLoadingForm,
    setStockDrawer,
    setCustomerDrawer,
    customerDrawer,
    stockDrawer,
    createdStock,
    createdCustomer,
    setCreatedStock,
    setCreatedCustomer,
    setIsReturn,
  } = useCustomForm();
  const [positions, setPositions] = useState(props.location.state.position);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);
  const [docname, setDocName] = useState(null);
  const [newStocksLoad, setNewStocksLoad] = useState(null);

  const onClose = () => {
    message.destroy();
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
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a className="deletePosition">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  });

  useEffect(() => {
    setIsReturn(false);
  }, []);

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
  useEffect(() => {
    console.log(props);
    form.setFieldsValue({
      moment: moment(),
    });
    setLoadingForm(false);
  }, []);

  const getDocName = async (docname) => {
    const attrResponse = await fetchDocName(docname, "demandreturns");
    return attrResponse;
  };
  const handleFinish = async (values) => {
    values.positions = outerDataSource;
    values.mark = docmark;
    values.moment = values.moment._i;

    message.loading({ content: "Loading...", key: "doc_update" });
    const nameres = await getDocName(values.name);

    values.name = nameres.Body.ResponseService;

    const res = await saveDoc(values, "demandreturns");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlanildi",
        key: "doc_update",
        duration: 2,
      });
      setEditId(res.Body.ResponseService);
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

  const onChange = (stock) => {
    setDocStock(stock);
  };

  if (redirect) return <Redirect to={`/editDemandReturn/${editId}`} />;
  return (
    <div className="doc_wrapper">
      <div className="doc_name_wrapper">
        <h2>Qaytarma</h2>
      </div>
      <DocButtons
        editid={props.location.state.linked}
        linked={true}
        closed={`/editDemand/${props.location.state.linked}`}
      />
      <div className="formWrapper">
        <Form
          form={form}
          id="myForm"
          className="doc_forms"
          name="basic"
          initialValues={{
            name: props.location.state.data.Name,
            moment: moment(props.location.state.data.Moment),
            modify: moment(props.location.state.data.Modify),
            mark: props.location.state.data.Mark,
            stockid: props.location.state.data.StockId,
            link: props.location.state.data.Id,
            customerid: props.location.state.data.CustomerId,
            status: props.location.state.data.Status == 1 ? true : false,
          }}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleFinish}
          layout="horizontal"
        >
          <Row>
            <Col xs={24} md={24} xl={18}>
              <Row>
                <Col xs={24} md={24} xl={10}>
                  <Row>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item
                        label="Qaytarma"
                        name="name"
                        className="doc_number_form_item"
                      >
                        <Input disabled={true} allowClear />
                      </Form.Item>
                      <Form.Item
                        label=""
                        name="link"
                        hidden={true}
                        className="doc_number_form_item"
                      >
                        <Input disabled={true} allowClear />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item label="Created Moment" name="moment">
                        <DatePicker
                          showTime={{ format: "HH:mm:ss" }}
                          format="YYYY-MM-DD HH:mm:ss"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}></Col>
                  </Row>
                </Col>
                <Col xs={24} md={24} xl={10}>
                  <Row>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item label="Qarsi teref" name="customerid">
                        <Select
                          showSearch
                          showArrow={false}
                          filterOption={false}
                          className="customSelect"
                          allowClear={true}
                          disabled={true}
                        >
                          {customerOptions}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item label="Stock" name="stockid">
                        <Select
                          showSearch
                          showArrow={false}
                          filterOption={false}
                          onChange={onChange}
                          className="customSelect"
                          allowClear={true}
                          disabled={true}
                        >
                          {options}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} md={24} xl={4}></Col>
              </Row>
            </Col>

            <Col xs={24} md={24} xl={6}>
              <Collapse ghost>
                <Panel className="custom_panel_header" header="Təyinat" key="1">
                  <Form.Item
                    label="Owner"
                    name="ownerid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      disabled={true}
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
                    label="Department"
                    name="departmentid"
                    style={{ margin: "0" }}
                  >
                    <Select
                      showSearch
                      placeholder=""
                      disabled={true}
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
                    label="Status"
                    className="docComponentStatus"
                    name="status"
                    valuePropName="checked"
                  >
                    <Checkbox disabled={true} name="status"></Checkbox>
                  </Form.Item>
                  <Form.Item label="Mark" name="mark">
                    <StatusSelect defaultValue={null} />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col xs={24} md={24} xl={24}>
            <DocTable headers={columns} datas={positions} />
            <div>
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
            </div>
          </Col>
        </Row>
      </div>

      <StockDrawer />
      <CustomerDrawer />
    </div>
  );
}

export default DemandReturnLinked;
