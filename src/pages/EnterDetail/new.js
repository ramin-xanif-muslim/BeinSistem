import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchDocName, fetchStocks } from "../../api";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import { useMemo } from "react";
import { useTableCustom } from "../../contexts/TableContext";
import StatusSelect from "../../components/StatusSelect";
import AddProductInput from "../../components/AddProductInput";
import StockDrawer from "../../components/StockDrawer";
import ProductModal from "../../components/ProductModal";
import { PrinterOutlined } from "@ant-design/icons";

import { Tab } from "semantic-ui-react";
import {
  FindAdditionals,
  FindCofficient,
  ConvertFixedTable,
  ConvertFixedPosition,
} from "../../config/function/findadditionals";
import {
  PlusOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  CaretDownOutlined,
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
  Space,
} from "antd";
import DocTable from "../../components/DocTable";
import DocButtons from "../../components/DocButtons";
import { message } from "antd";
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { useRef } from "react";
import { useGetDocItems } from "../../hooks";
import Catalog from "../../components/Catalog";
import ok from "../../audio/ok.mp3";
import withTreeViewModal from "../../HOC/withTreeViewModal";

const audio = new Audio(ok);

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function NewEnter({ bntOpenTreeViewModal, stockId, setStockId }) {
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
    setDisable,
    disable,
    setCatalog,
    isCatalog,
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

    saveFromModal,
    setSaveFromModal,

    redirectSaveClose,
    setRedirectSaveClose,
  } = useCustomForm();
  const [positions, setPositions] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [editId, setEditId] = useState(null);
  const [hasConsumption, setHasConsumption] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const [status, setStatus] = useState(true);
  const [initial, setInitial] = useState(null);
  const [columnChange, setColumnChange] = useState(false);
  const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

  const [selectList, setSelectList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [catalogVisible, setCatalogVisible] = useState(false);
  const { allsum, allQuantity } = useGetDocItems();
  const handleDelete = (key) => {
    handleChanged()
    const dataSource = [...outerDataSource];
    setOuterDataSource(dataSource.filter((item) => item.BarCode !== key));
    setPositions(dataSource.filter((item) => item.BarCode !== key));
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

  const handleOpenCatalog = (selectList) => {
    setCatalogVisible(!catalogVisible);
    setSelectList(selectList);
  };
  const onChangeConsumption = (e) => {
    setHasConsumption(true);
    setConsumption(e.target.value);
  };

  const handleVisibleChange = (flag) => {
    setVisibleMenuSettings(flag);
  };
  const columns = useMemo(() => {
    return [
      {
        title: "???",
        dataIndex: "Order",
        className: "orderField",
        editable: false,
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Order")
              .isVisible
          : true,
        render: (text, record, index) => index + 1 + 100 * docPage,
      },
      {
        title: "Ad??",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Name").isVisible
          : true,

        // sorter: (a, b) => a.Name.localeCompare(b.Name),
      },
      {
        title: "Barkodu",
        dataIndex: "BarCode",
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "BarCode")
              .isVisible
          : true,
        className: "max_width_field_length",
        editable: false,
        sortDirections: ["descend", "ascend"],
        // sorter: (a, b) => a.BarCode - b.BarCode,
      },
      {
        title: "Miqdar",
        dataIndex: "Quantity",
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Quantity")
              .isVisible
          : true,
        className: "max_width_field",
        editable: true,
        sortDirections: ["descend", "ascend"],
        // sorter: (a, b) => a.Quantity - b.Quantity,
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return ConvertFixedTable(value);
        },
      },
      {
        title: "Qiym??ti",
        dataIndex: "Price",
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Price")
              .isVisible
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
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "TotalPrice")
              .isVisible
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
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "StockQuantity")
              .isVisible
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
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "CostPr")
              .isVisible
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
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.Price))
              );
            });

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
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "CostTotalPr")
              .isVisible
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
              consumtionPriceArray.push(
                FindAdditionals(consumption, docSum, Number(p.TotalPrice))
              );
            });

            return ConvertFixedTable(consumtionPriceArray[index]);
          } else {
            return (
              <span>
                {ConvertFixedTable(value)}

                {console.log(row)}
              </span>
            );
          }
        },
      },
      {
        dataIndex: "PrintBarcode",
        title: "Print",
        className: "activesort",
        isVisible: true,
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
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "operation")
              .isVisible
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
              <a className="color-red">Sil</a>
            </Popconfirm>
          </Typography.Link>
        ),
      },
    ];
  }, [consumption, outerDataSource, docSum, columnChange]);

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
  }, []);

  useEffect(() => {
    setColumnChange(false);
  }, [columnChange]);

  const onChangeMenu = (e) => {
    var initialCols = initial;
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
  useEffect(() => {
    if (createdStock) {
      getStocksAgain();
    }
  }, [createdStock]);

  const getStocksAgain = async () => {
    const stockResponse = await fetchStocks();
    setStock(stockResponse.Body.List);
    setStockLocalStorage(stockResponse.Body.List);
    form.setFieldsValue({
      stockid: createdStock.name,
    });
    setCreatedStock(null);
    setStockId([
      {
        name: createdStock.name,
        id: createdStock.id,
      },
    ]);
  };
  useEffect(() => {
    form.setFieldsValue({
      moment: moment(),
    });
    setLoadingForm(false);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      stockid: stockId[0]?.name,
    });
  }, [stockId]);
  const getDocName = async (docname) => {
    const attrResponse = await fetchDocName(docname, "enters");
    return attrResponse;
  };

  const handleChanged = () => {
    if (disable) {
      setDisable(false);
    }
  };

  const handleFinish = async (values) => {
    setDisable(true);

    values.positions = outerDataSource;
    // values.mark = docmark;
    values.moment = moment(values.moment._d).format("YYYY-MM-DD HH:mm:ss");
    values.description = myRefDescription.current.resizableTextArea.props.value;
    values.consumption = myRefConsumption.current.clearableInput.props.value;
    values.stockid = stockId[0]?.id;
    if (!values.status) {
      values.status = status;
    }
    message.loading({ content: "Y??kl??nir...", key: "doc_update" });

    try {
      const nameres = await getDocName(values.name);
      values.name = nameres.Body.ResponseService;
    } catch (error) {
      message.error({
        content: (
          <span className="error_mess_wrap">
            Saxlan??lmad??... {error.message}{" "}
            {<CloseCircleOutlined onClick={onClose} />}
          </span>
        ),
        key: "doc_update",
        duration: 0,
      });
    }

    const res = await saveDoc(values, "enters");
    if (res.Headers.ResponseStatus === "0") {
      message.success({
        content: "Saxlan??ld??",
        key: "doc_update",
        duration: 2,
      });
      setEditId(res.Body.ResponseService);
      audio.play();

      if (saveFromModal) {
        setRedirectSaveClose(true);
      } else {
        setRedirect(true);
      }
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

  const handleClick = () => {
    setModalVisible(!modalVisible);
  };
  //#endregion OwDep

  const onChange = (stock) => {
    setDocStock(stock);
    setStockId([
      {
        name: stock,
        id: stock,
      },
    ]);
  };
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
              <button className="new-button" onClick={handleOpenCatalog}>
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

  if (redirect) return <Redirect to={`/editEnter/${editId}`} />;
  return (
    <div className="doc_wrapper">
      <div className="doc_name_wrapper">
        <h2>Daxilolma</h2>
      </div>

      <DocButtons additional={"none"} editid={null} closed={"p=enter"} />
      <div className="formWrapper">
        <Form
          form={form}
          id="myForm"
          className="doc_forms"
          name="basic"
          initialValues={{
            status: true,
          }}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={handleFinish}
          onFieldsChange={handleChanged}
          layout="horizontal"
        >
          <Row>
            <Col xs={6} sm={6} md={6} xl={6}>
              <Form.Item
                label="Daxilolma ???"
                name="name"
                className="doc_number_form_item"
                style={{ width: "100%" }}
              >
                <Input
                  allowClear
                  style={{
                    width: "100px",
                  }}
                  className="detail-input"
                />
              </Form.Item>
            </Col>
            <Col xs={3} sm={3} md={3} xl={3}></Col>
            <Col xs={6} sm={6} md={6} xl={6}></Col>
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
              <Button
                className="add-stock-btn"
                onClick={() => setStockDrawer(true)}
              >
                <PlusOutlined />
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
                      <StatusSelect className="detail-select" />
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
                        className="detail-select"
                        showSearch
                        placeholder=""
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
                      <Checkbox size="small" name="status"></Checkbox>
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
                        size="small"
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
          <Col xs={24} sm={24} md={24} xl={24}>
            <Tab className="custom_table_wrapper_tab" panes={panes} />
          </Col>
          <Col xs={24} sm={24} md={24} xl={24}>
            <Row className="bottom_tab">
              <Col xs={9} sm={9} md={9} xl={9}>
                <div>
                  <Form onFieldsChange={handleChanged}>
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
                    <Form onFieldsChange={handleChanged}>
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
      <ProductModal />
      <Catalog
        onClose={handleOpenCatalog}
        positions={outerDataSource}
        isCatalogVisible={catalogVisible}
      />
    </div>
  );
}
export default withTreeViewModal(NewEnter);
