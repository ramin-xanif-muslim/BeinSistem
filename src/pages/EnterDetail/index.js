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
import ProductModal from "../../components/ProductModal";
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
function EnterDetail() {
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
    customers,
    setCustomers,
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
  const [prevpositions, setPrevPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const { doc_id } = useParams();
  const [hasConsumption, setHasConsumption] = useState(false);
  const [status, setStatus] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const [initial, setInitial] = useState(null);
  const [columnChange, setColumnChange] = useState(false);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

  const { isLoading, error, data, isFetching } = useQuery(
    ["enter", doc_id],
    () => fetchDocId(doc_id, "enters")
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
      form.setFieldsValue({
        mark: data.Body.List[0].Mark,
      });
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
        title: "Maya",
        dataIndex: "CostPr",
        className: "max_width_field",
        isVisible: true,
        editable: false,
        sortDirections: ["descend", "ascend"],
        render: (value, row, index) => {
          let defaultCostArray = [];
          let consumtionPriceArray = [];
          outerDataSource.forEach((p) => {
            defaultCostArray.push(Number(p.Price));
          });
          console.log("defaultCostArray", defaultCostArray);
          if (hasConsumption) {
            console.log(hasConsumption);
            console.log(positions);
            console.log(consumption);
            console.log(docSum);
            console.log(FindAdditionals(consumption, docSum, 12));
            consumtionPriceArray = [];
            outerDataSource.forEach((p) => {
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.Price))
              );
            });
            console.log("consumtionPriceArray", consumtionPriceArray);
            return ConvertFixedTable(consumtionPriceArray[index]);
          } else {
            return ConvertFixedTable(defaultCostArray[index]);
          }
        },
      },
      {
        title: "Cəm Maya",
        dataIndex: "CostTotalPr",
        className: "max_width_field",
        isVisible: true,
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
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.TotalPrice))
              );
            });

            return ConvertFixedTable(consumtionPriceArray[index]);
          } else {
            return ConvertFixedTable(defaultCostArray[index]);
          }
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

  useEffect(() => {
    setInitial(columns);
  }, []);

  useEffect(() => {
    setColumnChange(false);
  }, [columnChange]);

  const updateMutation = useMutation(updateDoc, {
    refetchQueris: ["enter", doc_id],
  });

  useEffect(() => {
    if (createdStock) {
      getStocksAgain();
    }
  }, [createdStock]);

  useEffect(() => {
    form.setFieldsValue({
      mark: Number(docmark),
    });
  }, [docmark]);
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
    values.moment = values.moment._i;
    values.modify = values.modify._i;
    values.description = myRefDescription.current.resizableTextArea.props.value;
    values.consumption = myRefConsumption.current.clearableInput.props.value;
    values.status = status;
    console.log(values);
    message.loading({ content: "Loading...", key: "doc_update" });
    updateMutation.mutate(
      { id: doc_id, controller: "enters", filter: values },
      {
        onSuccess: (res) => {
          if (res.Headers.ResponseStatus === "0") {
            message.success({
              content: "Updated",
              key: "doc_update",
              duration: 2,
            });
            queryClient.invalidateQueries("enter", doc_id);
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
  const onChangeMenu = (e) => {
    var initialCols = initial;
    var findelement;
    var findelementindex;
    var replacedElement;
    findelement = initialCols.find((c) => c.dataIndex === e.target.id);
    console.log(findelement);
    findelementindex = initialCols.findIndex(
      (c) => c.dataIndex === e.target.id
    );
    findelement.isVisible = e.target.checked;
    replacedElement = findelement;
    initialCols.splice(findelementindex, 1, {
      ...findelement,
      ...replacedElement,
    });
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
      menuItem: "Əsas",
      render: () => (
        <Tab.Pane attached={false}>
          <Row>
            <Col xs={24} md={24} xl={9}>
              <div className="addProductInputIcon">
                <AddProductInput className="newProInputWrapper" />
                <PlusOutlined
                  onClick={() => setProductModal(true)}
                  className="addNewProductIcon"
                />
              </div>
            </Col>
            <Col xs={24} md={24} xl={24} style={{ paddingTop: "1rem" }}>
              <Dropdown
                overlay={menu}
                onVisibleChange={handleVisibleChange}
                visible={visibleMenuSettings}
              >
                <Button className="flex_directon_col_center">
                  {" "}
                  <SettingOutlined />
                </Button>
              </Dropdown>
              <DocTable
                headers={columns.filter((c) => c.isVisible == true)}
                datas={positions}
              />
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
        <h2>Daxilolma</h2>
      </div>
      <DocButtons
        additional={"none"}
        editid={doc_id}
        controller={"enters"}
        closed={"p=enter"}
        from={"enters"}
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
            status: data.Body.List[0].Status == 1 ? true : false,
          }}
          onFinish={handleFinish}
          onFieldsChange={handleChanged}
          layout="horizontal"
        >
          <Row style={{ marginTop: "1em", padding: "1em" }}>
            <Col xs={24} md={24} xl={18}>
              <Row>
                <Col xs={24} md={24} xl={10}>
                  <Row>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item
                        label="Dxilolma №"
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

                  <StatusSelect defaultvalue={data.Body.List[0].Mark} />
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
                  <div style={{ marginTop: "20px" }}>
                    <Form.Item
                      className="comsumption_input_wrapper"
                      label="Əlavə xərc"
                      onChange={onChangeConsumption}
                      name="consumption"
                    >
                      <Input
                        ref={myRefConsumption}
                        defaultValue={data.Body.List[0].Consumption}
                        type="number"
                        step="any"
                      />
                    </Form.Item>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <StockDrawer />
      <ProductModal />
    </div>
  );
}

export default EnterDetail;
