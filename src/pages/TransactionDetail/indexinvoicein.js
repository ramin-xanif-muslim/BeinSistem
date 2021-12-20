import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName, fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { updateDoc } from "../../api";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockSelect from "../../components/StockSelect";
import StockDrawer from "../../components/StockDrawer";
import ProductModal from "../../components/ProductModal";
import { Tab } from "semantic-ui-react";
import {
  FindAdditionals,
  FindCofficient,
  ConvertFixedTable,
} from "../../config/function/findadditionals";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  SettingOutlined,
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
import {
  saveDoc,
  fetchSpendItems,
  getCustomerFastFilter,
  fetchCustomers,
} from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function PaymentInDetail() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const myRefDescription = useRef(null);
  const myRefConsumption = useRef(null);
  const {
    docPage,
    docCount,
    docSum,
    outerDataSource,
    setOuterDataSource,
    departments,
    owners,
    stocks,
    setStock,
    setStockLocalStorage,
    setCustomersLocalStorage,
    customers,
    setCustomers,
    spenditems,
    setSpendItems,
    setSpendsLocalStorage,
    setDisable,
    disable,
  } = useTableCustom();
  const {
    docstock,
    setDocStock,
    docmark,
    setDocMark,
    setLoadingForm,
    setStockDrawer,
    stockDrawer,
    createdStock,
    setCreatedStock,
    setProductModal,

    isPayment,
    setPaymentModal,
    isReturn,

    saveFromModal,
    setRedirectSaveClose,
  } = useCustomForm();
  const [positions, setPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);
  const [docname, setDocName] = useState(null);
  const [newStocksLoad, setNewStocksLoad] = useState(null);
  const [hasConsumption, setHasConsumption] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const [status, setStatus] = useState(true);
  const [initial, setInitial] = useState(null);
  const [tablecolumns, setTableColumns] = useState([]);
  const [columnChange, setColumnChange] = useState(false);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);
  const [spends, setSpends] = useState(false);
  const [handleMark, setHandleMark] = useState(null);
  const [customerloading, setcustomerloading] = useState(false);
  const { doc_id } = useParams();
  const { isLoading, error, data, isFetching } = useQuery(
    ["invoicein", doc_id],
    () => fetchDocId(doc_id, "invoiceins")
  );
  const handleDelete = (key) => {
      const dataSource = [...outerDataSource];
      setOuterDataSource(dataSource.filter((item) => item.key !== key));
      setPositions(dataSource.filter((item) => item.key !== key));
  };
  useEffect(() => {
      setDisable(true);
      setPositions([]);
      setOuterDataSource([]);

      return () => {
          setDisable(true);
          setPositions([]);
          setOuterDataSource([]);
      };
  }, []);

  useEffect(() => {
      if (JSON.stringify(positions) !== JSON.stringify(outerDataSource)) {
          setDisable(false);
      }
  }, [outerDataSource]);

  const onClose = () => {
    message.destroy();
  };

  useEffect(() => {
    form.setFieldsValue({
      moment: moment(),
    });
    setLoadingForm(false);
    getSpendItems();
    getCustomers();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      setHandleMark(data.Body.List[0] ? data.Body.List[0].Mark : '');
    }
  }, [isFetching]);

  const updateMutation = useMutation(updateDoc, {
    refetchQueris: ["invoicein", doc_id],
  });
  const getSpendItems = async () => {
    setSpends(false);
    const itemResponse = await fetchSpendItems();
    setSpendItems(itemResponse.Body.List);
    setSpendsLocalStorage(itemResponse.Body.List);
    setSpends(true);
  };
  const getCustomers = async () => {
    setcustomerloading(false);
    const customerResponse = await fetchCustomers();
    setCustomers(customerResponse.Body.List);
    setCustomersLocalStorage(customerResponse.Body.List);
    setcustomerloading(true);
  };
  const doSearch = async (value) => {
    const customerResponse = await getCustomerFastFilter(value);
    setCustomers(customerResponse.Body.List);
  };
  const getDocName = async (docname) => {
    const attrResponse = await fetchDocName(docname, "invoiceins");
    return attrResponse;
  };

  var objCustomers;
  customers
    ? (objCustomers = customers)
    : (objCustomers = JSON.parse(localStorage.getItem("customers")));
  const customerOptions = Object.values(objCustomers).map((c) => (
    <Option key={c.Id} value={c.Id}>
      {c.Name}
    </Option>
  ));

  const onChange = (value, option) => {
    if (value === "00000000-0000-0000-0000-000000000000") {
      form.setFieldsValue({
        spenditem: spenditems.find((s) => s.StaticName === "correct").Id,
      });
    } else {
      form.setFieldsValue({
        spenditem: spenditems.find((s) => s.StaticName === "buyproduct").Id,
      });
    }
  };
  const onChangeSpendItem = (value, option) => {
    console.log(value, option);
    if (option.staticname != "correct") {
      form.setFieldsValue({
        customerid: "00000000-0000-0000-0000-000000000000",
      });
    } else {
      if (
        form.getFieldsValue().customerid ===
        "00000000-0000-0000-0000-000000000000"
      ) {
        form.setFieldsValue({
          customerid: "",
        });
      }
    }
  };

  const handleChanged = () => {
    if (disable) {
      setDisable(false);
    }
  };
  const handleFinish = async (values) => {
    setDisable(true);
    values.moment = values.moment._i;
    values.mark = docmark;

    message.loading({ content: "Loading...", key: "doc_update" });

    try {
      const nameres = await getDocName(values.name);
      values.name = nameres.Body.ResponseService;
    } catch (error) {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlanılmadı... {error.message}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "doc_update",
        duration: 0,
      });
    }

    updateMutation.mutate(
      { id: doc_id, controller: "invoiceins", filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("invoicein", doc_id);
            // if (saveFromModal) {
            //     setRedirectSaveClose(true);
            // } else {
            //     if (isReturn) {
            //         setRedirect(true);
            //     }
            //     if (isPayment) {
            //         setPaymentModal(true);
            //     }
            // }
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

  //#region OwDep

  //#endregion OwDep
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  if (!spends) return <div>Loading....</div>;
  if (!customerloading) return <div>Loading....</div>;
  if (spends && customerloading)
    return (
      <div className="doc_wrapper">
        <div className="doc_name_wrapper">
          <h2>Medaxil</h2>
        </div>
        <DocButtons
          additional={"none"}
          editid={null}
          closed={"p=transactions"}
        />
        <div className="formWrapper">
          <Form
            form={form}
            id="myForm"
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
              customerid: data.Body.List[0].CustomerId,
              id: data.Body.List[0].Id,
              amount: data.Body.List[0].Amount,
              mark: data.Body.List[0].Mark,
              linkid: data.Body.List[0].LinkId,
              status: data.Body.List[0].Status == "1" ? true : false,
              spenditem: data.Body.List[0].SpendItem,
            }}
            onFinish={handleFinish}
            onFieldsChange={handleChanged}
            layout="horizontal"
          >
            <Row>
              <Col xs={24} md={24} xl={18}>
                <Row>
                  <Col xs={24} md={24} xl={10}>
                    <Row>
                      <Col xs={24} md={24} xl={24}>
                        <Form.Item
                          label="Medaxil"
                          name="name"
                          className="doc_number_form_item"
                        >
                          <Input allowClear />
                        </Form.Item>
                        <Form.Item
                          name="linkid"
                          hidden={true}
                          className="doc_number_form_item"
                        >
                          <Input allowClear />
                        </Form.Item>
                        <Form.Item
                          name="id"
                          hidden={true}
                          className="doc_number_form_item"
                        >
                          <Input allowClear />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} xl={24}>
                        <Form.Item label="Created Moment" name="moment">
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
                      <Col xs={24} md={24} xl={24}>
                        <Form.Item label="Qarsi teref" name="customerid">
                          <Select
                            showSearch
                            showArrow={false}
                            filterOption={false}
                            className="customSelect"
                            // onFocus={getCustomers}
                            onChange={onChange}
                            onSearch={doSearch}
                            allowClear={true}
                          >
                            {customerOptions}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} xl={24}>
                        <Form.Item label="Xerc maddesi" name="spenditem">
                          <Select
                            showSearch
                            showArrow={false}
                            className="customSelect"
                            notFoundContent={<Spin size="small" />}
                            onChange={onChangeSpendItem}
                            allowClear={true}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {spends
                              ? Object.values(spenditems)
                                  .filter(
                                    (item) =>
                                      item.StaticName === "buyproduct" ||
                                      item.StaticName === "correct"
                                  )
                                  .map((c) => (
                                    <Option
                                      staticname={c.StaticName}
                                      key={c.Id}
                                      value={c.Id}
                                    >
                                      {c.Name}
                                    </Option>
                                  ))
                              : null}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} md={24} xl={6}>
                    <Form.Item
                      label="Mebleg"
                      name="amount"
                      className="doc_number_form_item"
                    >
                      <Input
                        type="number"
                        step="any"
                        allowClear
                        addonAfter="₼"
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Keçirilib"
                      className="docComponentStatus"
                      name="status"
                      valuePropName="checked"
                    >
                      <Checkbox name="status"></Checkbox>
                    </Form.Item>
                    <Form.Item label="Status" name="mark">
                      <StatusSelect defaultvalue={handleMark} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
}

export default PaymentInDetail;
