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
import { saveDoc } from "../../api";
import { useCustomForm } from "../../contexts/FormContext";
import { fetchStocks } from "../../api";
import { useRef } from "react";

const { Option, OptGroup } = Select;
let customPositions = [];
const { Panel } = Collapse;
const { TextArea } = Input;
function NewLoss() {
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
  const handleDelete = (key) => {
    const dataSource = [...outerDataSource];
    setOuterDataSource(dataSource.filter((item) => item.key !== key));
    setPositions(dataSource.filter((item) => item.key !== key));
  };
  const onClose = () => {
    message.destroy();
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
        title: "№",
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
        title: "Adı",
        dataIndex: "Name",
        className: "max_width_field_length",
        editable: false,
        isVisible: initial
          ? Object.values(initial).find((i) => i.dataIndex === "Name").isVisible
          : true,

        sorter: (a, b) => a.Name.localeCompare(b.Name),
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
        sorter: (a, b) => a.BarCode - b.BarCode,
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
        render: (value, row, index) => {
          // do something like adding commas to the value or prefix
          return value;
        },
      },
      {
        title: "Qiyməti",
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
          return value;
        },
      },
      {
        title: "Məbləğ",
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
          return value;
        },
      },
      {
        title: "Qalıq",
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
          return value;
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
  }, [consumption, outerDataSource, docSum, columnChange]);

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
      stockid: createdStock.id,
    });
    setCreatedStock(null);
  };
  useEffect(() => {
    form.setFieldsValue({
      moment: moment(),
    });
    setLoadingForm(false);
  }, []);

  const getDocName = async (docname) => {
    const attrResponse = await fetchDocName(docname, "losses");
    return attrResponse;
  };
  const handleFinish = async (values) => {
    values.positions = outerDataSource;
    values.mark = docmark;
    values.moment = values.moment._i;
    values.description = myRefDescription.current.resizableTextArea.props.value;
    values.status = status;
    message.loading({ content: "Loading...", key: "doc_update" });
    const nameres = await getDocName(values.name);
    console.log("nameres", nameres);
    values.name = nameres.Body.ResponseService;

    const res = await saveDoc(values, "losses");
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

  if (redirect) return <Redirect to={`/editLoss/${editId}`} />;
  return (
    <div className="doc_wrapper">
      <div className="doc_name_wrapper">
        <h2>Silinmə</h2>
      </div>

      <DocButtons additional={"none"} editid={null} closed={"p=loss"} />
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
            span: 5,
          }}
          wrapperCol={{
            span: 14,
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
                        label="Dxilolma №"
                        name="name"
                        className="doc_number_form_item"
                      >
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                      <Form.Item label="Tarix" name="moment">
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
                      <Form.Item label="Anbar" name="stockid">
                        <Select
                          showSearch
                          showArrow={false}
                          filterOption={false}
                          onChange={onChange}
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
                  <Form.Item
                    label="Status"
                    className="docComponentStatus"
                    name="status"
                    valuePropName="checked"
                  >
                    <Checkbox name="status"></Checkbox>
                  </Form.Item>
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
                    <Checkbox name="status"></Checkbox>
                  </Form.Item>
                  <Form.Item label="Status" name="mark">
                    <StatusSelect />
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
      <ProductModal />
    </div>
  );
}

export default NewLoss;
