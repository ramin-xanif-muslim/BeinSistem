import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, fetchDocId } from "../../api";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockDrawer from "../../components/StockDrawer";
import { Redirect } from "react-router";
import PaymentModal from "../../components/PaymentModal";
import CustomerDrawer from "../../components/CustomerDrawer";
import { Tab } from "semantic-ui-react";
import { PrinterOutlined } from "@ant-design/icons";
import {
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Alert,
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
import {
  useFetchDebt,
  useGetDocItems,
  useSearchSelectInput,
} from "../../hooks";
import ProductModal from "../../components/ProductModal";
import ok from "../../audio/ok.mp3";
import withCatalog from "../../HOC/withCatalog";
import withTreeViewModal from "../../HOC/withTreeViewModal";

const audio = new Audio(ok);

const { Option, OptGroup } = Select;
const { TextArea } = Input;
let customPositions = [];
const { Panel } = Collapse;

function SupplyDetail({
  handleOpenCatalog,
  selectList,
  catalogVisible,
  bntOpenTreeViewModal,
  stockId,
  setStockId,
}) {
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
    // customers,
    setCustomers,
    setOuterDataSource,
    setDisable,
    disable,
  } = useTableCustom();
  const {
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
    setProductModal,
    saveFromModal,
    setSaveFromModal,
    paymentModal,

    redirectSaveClose,
    setRedirectSaveClose,
  } = useCustomForm();
  const [positions, setPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const { doc_id } = useParams();
  const [hasConsumption, setHasConsumption] = useState(false);
  const [status, setStatus] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const [initial, setInitial] = useState(null);
  const [columnChange, setColumnChange] = useState(false);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

  const { allsum, allQuantity } = useGetDocItems();

  const { onSearchSelectInput, customersForSelet } = useSearchSelectInput();
  const onChangeSelectInput = (e) => {
    handleChanged();
    setCustomerId(e);
  };

  const { isLoading, error, data, isFetching } = useQuery(
    ["supply", doc_id],
    () => fetchDocId(doc_id, "supplies")
  );
  const handleDelete = (key) => {
    handleChanged()
    const dataSource = [...outerDataSource];
    setOuterDataSource(dataSource.filter((item) => item.BarCode !== key));
    setPositions(dataSource.filter((item) => item.BarCode !== key));
  };

  // const { debt, setCustomerId, customerId, fetchDebt } = useFetchDebt();
  const [debt, setDebt] = useState(0);
  const [customerId, setCustomerId] = useState();
  const fetchDebt = async (id) => {
    let res = await api.fetchDebt(id ? id : customerId);
    setDebt(ConvertFixedTable(res));
  };
  useEffect(() => {
    if (customerId) {
      fetchDebt(customerId);
    }
  }, [customerId]);
  useEffect(() => {
    if (!paymentModal) {
      fetchDebt(customerId);
    }
  }, [paymentModal]);

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
  useEffect(() => {
    if (!isFetching) {
      setCustomerId(data.Body.List[0].CustomerId);
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
  const handleVisibleChange = (flag) => {
    setVisibleMenuSettings(flag);
  };
  const onChangeConsumption = (e) => {
      console.log('onChangeConsumption')
    setHasConsumption(true);
    setConsumption(e.target.value);
  };
  const columns = useMemo(() => {
    return [
      {
        title: "???",
        dataIndex: "Order",
        className: "orderField",
        editable: false,
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "Order").isVisible
          : true,
        render: (text, record, index) => index + 1 + 100 * docPage,
      },
      {
        title: "Ad??",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "Name").isVisible
          : true,
        // sorter: (a, b) => a.Name.localeCompare(b.Name),
      },
      {
        title: "Barkodu",
        dataIndex: "BarCode",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "BarCode").isVisible
          : true,
        className: "max_width_field_length",
        editable: false,
        sortDirections: ["descend", "ascend"],
        // sorter: (a, b) => a.BarCode - b.BarCode,
      },
      {
        title: "Miqdar",
        dataIndex: "Quantity",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "Quantity").isVisible
          : true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return ConvertFixedTable(value);
        },
      },
      {
        title: "Qiym??ti",
        dataIndex: "Price",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "Price").isVisible
          : true,

        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return ConvertFixedTable(value);
        },
      },
      {
        title: "M??bl????",
        dataIndex: "TotalPrice",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "TotalPrice").isVisible
          : true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return ConvertFixedTable(value);
        },
      },
      {
        title: "Qal??q",
        dataIndex: "StockQuantity",
        className: "max_width_field",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "StockQuantity").isVisible
          : true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return ConvertFixedTable(value);
        },
      },
      {
        title: "Maya",
        dataIndex: "CostPr",
        className: "max_width_field",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "CostPr").isVisible
          : true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          let defaultCostArray = [];
          let consumtionPriceArray = [];
          outerDataSource.forEach((p) => {
            defaultCostArray.push(Number(p.Price));
          });
          if (hasConsumption) {
            consumtionPriceArray = [];
            outerDataSource.forEach((p) => {
                console.log('Maya p',p)
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.Price))
              );
            });
            console.log('Maya', consumtionPriceArray,index)

            return ConvertFixedTable(consumtionPriceArray[index]);
          } else {
            return ConvertFixedTable(value);
          }
        },
      },
      {
        title: "C??m Maya",
        dataIndex: "CostTotalPr",
        className: "max_width_field",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "CostTotalPr").isVisible
          : true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          let defaultCostArray = [];
          let consumtionPriceArray = [];
          outerDataSource.forEach((p) => {
            defaultCostArray.push(Number(p.TotalPrice));
          });
          if (hasConsumption) {
            consumtionPriceArray = [];
            outerDataSource.forEach((p) => {
                console.log('C??m Maya p',p.TotalPrice)
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.TotalPrice))
              );
            });
            console.log('C??m Maya', consumtionPriceArray,index)

            return ConvertFixedTable(consumtionPriceArray[index]);
          } else {
            return ConvertFixedTable(value);
          }
        },
      },
      {
        dataIndex: "PrintBarcode",
        title: "Print",
        className: "activesort",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "PrintBarcode").isVisible
          : true,
        render: (value, row, index) => {
          return (
            <span
              style={{ color: "#1164B1" }}
              onClick={getProductPrint(
                row.ProductId,
                row.BarCode,
                row.IsPack === 1 ? row.PackPrice : row.BasicPrice,
                row.Name
              )}
            >
              <PrinterOutlined />
            </span>
          );
        },
      },
      {
        title: "Sil",
        className: "orderField printField",
        dataIndex: "operation",
        isVisible: JSON.parse(localStorage.getItem("supplyindexcolumns"))
          ? Object.values(
              JSON.parse(localStorage.getItem("supplyindexcolumns"))
            ).find((i) => i.dataIndex === "operation").isVisible
          : true,
        editable: false,
        render: (_, record) => (
          <Typography.Link>
            <Popconfirm
              title="Silm??y?? ??minsinizmi?"
              okText="B??li"
              cancelText="Xeyr"
              onConfirm={() => handleDelete(record.BarCode)}
            >
              <a className="deletePosition">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  }, [consumption, outerDataSource, docSum, columnChange, docPage]);

  const getProductPrint = (id, br, pr, nm) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    let price = Number(pr).toFixed(2);
    if (localStorage.getItem("tempdesign") === "4x2_3.css") {
      window.open(`/bc.php?bc=${br}&pr=${price}&nm=${nm}&r=4`);
    } else {
      window.open(`/bc.php?bc=${br}&pr=${price}&nm=${nm}`);
    }
  };

  useEffect(() => {
    setInitial(columns);
    if (!localStorage.getItem("supplyindexcolumns")) {
      localStorage.setItem("supplyindexcolumns", JSON.stringify(columns));
    }
  }, []);
  useEffect(() => {
    if (isPayment) {
      setPaymentModal(true);
    }
    if (isReturn) {
      setRedirect(true);
    }
  }, []);

  useEffect(() => {
    setColumnChange(false);
  }, [columnChange]);

  const updateMutation = useMutation(updateDoc, {
    refetchQueris: ["supply", doc_id],
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
    setStockId([
      {
        name: createdStock.name,
        id: createdStock.id,
      },
    ]);
    setCreatedStock(null);
  };
  useEffect(() => {
    if (stockId[0]) {
      form.setFieldsValue({
        stockid: stockId[0]?.name,
      });
    }
  }, [stockId]);

  //#region OwDep
  // var objCustomers;
  // customers
  // 	? (objCustomers = customers)
  // 	: (objCustomers = JSON.parse(localStorage.getItem("customers")));
  // const customerOptions = Object.values(objCustomers).map((c) => (
  // 	<Option key={c.Id} value={c.Id}>
  // 		{c.Name}
  // 	</Option>
  // ));

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

  if (isLoading)
    return (
      <Spin className="fetchSpinner" tip="Y??kl??nir...">
        <Alert />
      </Spin>
    );

  if (error) return "An error has occurred: " + error.message;

  if (redirect)
    return (
      <Redirect
        to={{
          pathname: "/editSupplyReturnLinked",
          state: {
            data: data.Body.List[0],
            position: positions,
            linked: doc_id,
          },
        }}
      />
    );

  const handleChanged = () => {
    if (disable) {
      setDisable(false);
    }
  };

  const handleFinish = async (values) => {
    setDisable(true);

    values.positions = outerDataSource;
    values.customerid = customerId;
    values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
    values.modify = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
    values.description = myRefDescription.current.resizableTextArea.props.value;
    values.consumption = myRefConsumption.current.clearableInput.props.value;
    if (stockId[0]?.id) {
      values.stockid = stockId[0]?.id;
    }
    if (!values.status) {
      values.status = status;
    }
    message.loading({ content: "Y??kl??nir...", key: "doc_update" });
    updateMutation.mutate(
      { id: doc_id, controller: "supplies", filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "D??yi??iklikl??r yadda saxlan??ld??",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("supply", doc_id);
            audio.play();
            if (saveFromModal) {
              setRedirectSaveClose(true);
            } else {
              if (isReturn) {
                setRedirect(true);
              }
              if (isPayment) {
                setPaymentModal(true);
              }
            }
            fetchDebt();
          } else {
            message.error({
              content: (
                <span className="error_mess_wrap">
                  Saxlan??lmad??... {res.Body}{" "}
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

  const onChangeMenu = (e) => {
    var initialCols = JSON.parse(localStorage.getItem("supplyindexcolumns"));
    var findelement;
    var findelementindex;
    var replacedElement;
    findelement = initialCols.find((c) => c.dataIndex === e.target.id);
    findelementindex = initialCols.findIndex(
      (c) => c.dataIndex === e.target.id
    );
    findelement.isVisible = e.target.checked;
    replacedElement = findelement;
    initialCols.splice(findelementindex, 1, {
      ...findelement,
      ...replacedElement,
    });
    localStorage.setItem("supplyindexcolumns", JSON.stringify(initialCols));
    setColumnChange(true);
  };

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Sutunlar">
        {Object.values(columns).map((d) => (
          <Menu.Item key={d.dataIndex}>
            <Checkbox
              id={d.dataIndex}
              disabled={
                columns.length === 3 && d.isVisible === true ? true : false
              }
              isVisible={d.isVisible}
              onChange={(e) => onChangeMenu(e)}
              defaultChecked={d.isVisible}
            >
              {d.title}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  const panes = [
    {
      menuItem: "??sas",
      render: () => (
        <Tab.Pane attached={false}>
          <Row style={{ justifyContent: "space-between" }}>
            <Col
              xs={9}
              sm={9}
              md={9}
              xl={9}
              style={{ maxWidth: "none", zIndex: 1, padding: 0 }}
            >
              <div className="addProductInputIcon">
                <AddProductInput className="newProInputWrapper" />
                <PlusOutlined
                  onClick={() => setProductModal(true)}
                  className="addNewProductIcon"
                />
              </div>
            </Col>
            <Col
              xs={3}
              sm={3}
              md={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="new-button"
                onClick={handleOpenCatalog}
                type="primary"
              >
                M??hsullar
              </button>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
              xs={12}
              sm={12}
              md={12}
              xl={12}
            >
              <Dropdown
                trigger={"onclick"}
                overlay={menu}
                onVisibleChange={handleVisibleChange}
                visible={visibleMenuSettings}
              >
                <button className="new-button">
                  {" "}
                  <SettingOutlined />
                </button>
              </Dropdown>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              xl={24}
              style={{ paddingTop: "1rem", zIndex: "0" }}
            >
              <DocTable
                headers={columns.filter((c) => c.isVisible == true)}
                datas={positions}
                selectList={selectList}
                catalogVisible={catalogVisible}
              />
            </Col>
          </Row>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "??laq??li s??n??dl??r",
      render: () => <Tab.Pane attached={false}></Tab.Pane>,
    },
  ];

  const onChange = (stock) => {
    setStockId([
      {
        name: stock,
        id: stock,
      },
    ]);
  };

  return (
    <div className="doc_wrapper">
      <div className="doc_name_wrapper">
        <h2>Al????</h2>
      </div>
      <DocButtons
        editid={doc_id}
        controller={"supplies"}
        closed={"p=supply"}
        from={"supplies"}
      />
      <div className="formWrapper">
        <Form
          id="myForm"
          form={form}
          className="doc_forms"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            name: data.Body.List[0].Name,
            moment: moment(data.Body.List[0].Moment),
            modify: moment(data.Body.List[0].Modify),
            mark: data.Body.List[0].Mark,
            stockid: data.Body.List[0].StockId,
            customerid: data.Body.List[0].CustomerName,
            status: data.Body.List[0].Status === 1 ? true : false,
          }}
          onFinish={handleFinish}
          onFieldsChange={handleChanged}
          layout="horizontal"
        >
          <Row>
            <Col xs={6} sm={6} md={6} xl={6}>
              <Form.Item
                label="Al???? ???"
                name="name"
                className="doc_number_form_item"
                style={{ width: "100%" }}
              >
                <Input
                  className="detail-input"
                  allowClear
                  style={{ width: "100px" }}
                />
              </Form.Item>
            </Col>
            <Col xs={3} sm={3} md={3} xl={3}></Col>
            <Col xs={6} sm={6} md={6} xl={6}>
              <Button className="add-stock-btn">
                <PlusOutlined onClick={() => setCustomerDrawer(true)} />
              </Button>
              <Form.Item
                label="Qar????-t??r??f"
                name="customerid"
                rules={[
                  {
                    required: true,
                    message: "Z??hm??t olmasa, qar???? t??r??fi se??in",
                  },
                ]}
                className="form-item-customer"
              >
                <Select
                  lazyLoad
                  showSearch
                  showArrow={false}
                  filterOption={false}
                  className="customSelect detail-select"
                  allowClear={true}
                  onSearch={(e) => onSearchSelectInput(e)}
                  onChange={(e) => onChangeSelectInput(e)}
                >
                  {customersForSelet[0] &&
                    customersForSelet.map((c) => {
                      return (
                        <Option key={c.Id} value={c.Id}>
                          {c.Name}
                        </Option>
                      );
                    })}
                </Select>
                {/* <Select
									showSearch
									showArrow={false}
									filterOption={false}
									className="customSelect detail-select"
									allowClear={true}
									onChange={(e) => setCustomerId(e)}
									filterOption={(input, option) =>
										option.children
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
								>
									{customerOptions}
								</Select> */}
                {/* <CustomersSelectInput
									handleChanged={handleChanged}
									setCustomerId={setCustomerId}
								/> */}
              </Form.Item>
              <p
                className="customer-debt"
                style={debt < 0 ? { color: "red" } : {}}
              >
                <span style={{ color: "red" }}>Qal??q borc:</span>
                {debt} ???
              </p>
            </Col>
            <Col xs={3} sm={3} md={3} xl={3}></Col>
            <Col xs={6} sm={6} md={6} xl={6}></Col>
          </Row>

          <Row>
            <Col xs={6} sm={6} md={6} xl={6}>
              <Form.Item label="Tarix" name="moment" style={{ width: "100%" }}>
                <DatePicker
                  className="detail-input"
                  showTime={{ format: "HH:mm:ss" }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
            <Col xs={3} sm={3} md={3} xl={3}></Col>
            <Col xs={6} sm={6} md={6} xl={6}>
              <Button className="add-stock-btn">
                <PlusOutlined onClick={() => setStockDrawer(true)} />
              </Button>
              {bntOpenTreeViewModal}
              <Form.Item
                label="Anbar"
                name="stockid"
                rules={[
                  {
                    required: true,
                    message: "Z??hm??t olmasa, anbar?? se??in",
                  },
                ]}
              >
                <Select
                  showSearch
                  showArrow={false}
                  onChange={onChange}
                  className="customSelect detail-select"
                  allowClear={true}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={3} sm={3} md={3} xl={3}></Col>
            <Col xs={6} sm={6} md={6} xl={6}></Col>
          </Row>

          <Row>
            <Collapse ghost style={{ width: "100%" }}>
              <Panel className="custom_panel_header" header="T??yinat" key="1">
                <Row>
                  <Col xs={6} sm={6} md={6} xl={6}>
                    <Form.Item
                      label="Status"
                      name="mark"
                      style={{
                        width: "100%",
                        margin: "0",
                      }}
                    >
                      <StatusSelect />
                    </Form.Item>
                  </Col>
                  <Col xs={3} sm={3} md={3} xl={3}></Col>
                  <Col xs={6} sm={6} md={6} xl={6}>
                    <Form.Item
                      label="Cavabdeh"
                      name="ownerid"
                      style={{ margin: "0", width: "100%" }}
                    >
                      <Select
                        showSearch
                        className="detail-select"
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
                  </Col>
                  <Col xs={3} sm={3} md={3} xl={3}></Col>
                  <Col xs={6} sm={6} md={6} xl={6}>
                    <Form.Item
                      label="Ke??irilib"
                      className="docComponentStatus"
                      onChange={(e) => setStatus(e.target.checked)}
                      name="status"
                      valuePropName="checked"
                      style={{ width: "100%" }}
                    >
                      <Checkbox name="status"></Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={6} md={6} xl={6}>
                    <Form.Item
                      label="????b??"
                      name="departmentid"
                      style={{ margin: "0", width: "100%" }}
                    >
                      <Select
                        showSearch
                        className="detail-select"
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
                  </Col>
                  <Col xs={3} sm={3} md={3} xl={3}></Col>
                  <Col xs={6} sm={6} md={6} xl={6}></Col>
                  <Col xs={3} sm={3} md={3} xl={3}></Col>
                  <Col xs={6} sm={6} md={6} xl={6}></Col>
                </Row>
              </Panel>
            </Collapse>
          </Row>
        </Form>

        <Row>
          {isFetching ? (
            <Spin />
          ) : (
            <Col xs={24} sm={24} md={24} xl={24}>
              <Tab className="custom_table_wrapper_tab" panes={panes} />
            </Col>
          )}
          <Col xs={24} sm={24} md={24} xl={24}>
            <Row className="bottom_tab">
              <Col xs={9} sm={9} md={9} xl={9}>
                <div>
                  <Form
                    initialValues={{
                      description: data.Body.List[0].Description,
                    }}
                    onFieldsChange={handleChanged}
                  >
                    <Form.Item name="description">
                      <TextArea
                        ref={myRefDescription}
                        placeholder={"????rh..."}
                        rows={3}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} xl={12}>
                <div className="static_wrapper">
                  <Statistic
                    groupSeparator=" "
                    className="doc_info_text total"
                    title=""
                    value={allsum}
                    prefix={"Yekun m??bl????: "}
                    suffix={"???"}
                  />
                  <Statistic
                    groupSeparator=" "
                    className="doc_info_text doc_info_secondary quantity"
                    title=""
                    value={allQuantity}
                    prefix={"Miqdar: "}
                    suffix={"??d"}
                  />

                  <Divider style={{ backgroundColor: "grey" }} />
                  <div style={{ marginTop: "20px" }}>
                    <Form
                      initialValues={{
                        consumption: ConvertFixedTable(
                          data.Body.List[0].Consumption
                        ),
                      }}
                      onFieldsChange={handleChanged}
                    >
                      <Form.Item
                        className="comsumption_input_wrapper"
                        label="??lav?? x??rc"
                        onChange={onChangeConsumption}
                        name="consumption"
                      >
                        <Input
                          ref={myRefConsumption}
                          type="number"
                          step="any"
                        />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <StockDrawer />
      <CustomerDrawer />
      <ProductModal />
      <PaymentModal
        datas={data.Body.List[0]}
        title="M??xaric"
        endPoint="paymentouts"
        updateDebt={fetchDebt}
      />
    </div>
  );
}

export default withTreeViewModal(withCatalog(SupplyDetail));
