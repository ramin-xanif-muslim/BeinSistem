import React, { useState, useEffect } from "react";
import locale from "antd/es/date-picker/locale/az_AZ";
import { Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { fetchRefList } from "../api";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  TreeSelect,
  Dropdown,
  Menu,
  ConfigProvider,
} from "antd";
import { useTableCustom } from "../contexts/TableContext";
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

moment.locale("az");
function FilterComponent({ from, settings, cols }) {
  const [loading, setLoading] = useState(false);
  const [rangeFilter, setRangeFilter] = useState({});
  const [normalFilter, setNormalFilter] = useState({});
  const [dropdown, setDropdown] = useState([]);
  const [initial, setinitial] = useState({});
  const {
    setIsFilter,
    advanced,
    setAdvance,
    setAdvancedPage,
    selectFilter,
    setSelectFilter,
    display,
    setdisplay,
    concat,
    setConcat,
  } = useTableCustom();
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (from === "stockbalance") {
  //     var obj = {
  //       wg: "",
  //       ar: 0,
  //       zeros: 3,
  //     };
  //     Object.assign(selectFilter, obj);
  //     setSelectFilter(selectFilter);
  //     console.log(selectFilter)
  //   }
  // }, []);

  const getData = (id, ref) => async (e, key) => {
    setDropdown([]);

    setLoading(true);
    if (id === "selectMod") {
      const res = await fetchRefList(ref);
      setDropdown(res);
      setLoading(false);
    } else {
      const res = await getDataFilter(id);
      setDropdown(res.Body.List);
      setLoading(false);
    }
  };

  const rangeConfig = {
    rules: [
      {
        type: "array",
        message: "Please select time!",
      },
    ],
  };

  const defaultZeroOptions = [
    {
      label: "0 olanlar",
      value: 4,
    },
    {
      label: "0 olmayanlar",
      value: 3,
    },
    {
      label: "Mənfilər",
      value: 2,
    },
    {
      label: "Müsbətlər",
      value: 1,
    },
    {
      label: "Hamısı",
      value: "",
    },
  ];
  const getDataFilter = async (id, fast) => {
    var dataFilter = {
      token: localStorage.getItem("access-token"),
    };
    if (fast) {
      dataFilter.fast = fast;
    }
    const { data } = await axios.post(
      `https://dev.bein.az/controllers/${id}/get.php`,
      dataFilter
    );

    return data;
  };
  const getDataFastFilter = async (id, fast) => {
    var dataFilter = {
      token: localStorage.getItem("access-token"),
      fast: fast,
    };
    const { data } = await axios.post(
      `https://dev.bein.az/controllers/${id}/getfast.php`,
      dataFilter
    );

    return data;
  };
  const doSearch = async (val, key) => {
    if (key === "products" || key === "customers") {
      setLoading(true);
      const res = await getDataFastFilter(key, val);
      setDropdown(res.Body.List);
      setLoading(false);
    }
  };

  function allClear() {
    setSelectFilter([]);
    setAdvancedPage(0);
    console.log(initial);
    console.log(form.resetFields());
    console.log(form.getFieldsValue());
    form.setFieldsValue(initial);
  }
  function handleClear(id) {
    Object.assign(selectFilter, {
      [id]: null,
      [`${id}_id`]: null,
    });
    setSelectFilter(selectFilter);
    console.log(selectFilter);
  }
  function handleChange(value, option) {
    console.log(form.getFieldValue());
    if (option) {
      Object.assign(selectFilter, {
        [option.nm]: option.children ? option.children : null,
        [`${option.nm}_id`]: option.key,
      });
      setSelectFilter(selectFilter);
    }
  }

  const onChange = (e) => {
    var n = e.target.name;
    var v = e.target.value;
    Object.assign(rangeFilter, { [n]: v });
    setRangeFilter(rangeFilter);
    Object.assign(selectFilter, { [n]: v });
    setSelectFilter(selectFilter);
  };

  const getFields = () => {
    const children = [];

    cols = cols.filter((c) => c.show == true);

    for (let i = 0; i < cols.length; i++) {
      children.push(
        <Col xs={24} md={12} xl={5} key={i}>
          <Form.Item
            name={cols[i].name}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={cols[i].label}
          >
            {cols[i].type === "text" ? (
              <Input
                onChange={onChange}
                name={cols[i].name}
                placeholder="placeholder"
              />
            ) : cols[i].type === "select" ? (
              <Select
                showSearch
                placeholder={cols[i].label}
                allowClear
                id={cols[i].controller}
                onSearch={(e) => doSearch(e, cols[i].controller)}
                onFocus={getData(cols[i].controller)}
                onChange={handleChange}
                onClear={() => handleClear(cols[i].dataIndex)}
                notFoundContent={<Spin size="small" />}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Object.values(dropdown).map((r) => (
                  <Option key={r.Id} nm={cols[i].name} value={r.Id}>
                    {r.Name}
                  </Option>
                ))}
              </Select>
            ) : cols[i].type === "selectMod" ? (
              <Select
                showSearch
                placeholder={cols[i].label}
                allowClear
                id={cols[i].controller}
                onFocus={getData(cols[i].controller, cols[i].key)}
                onChange={handleChange}
                onClear={() => handleClear(cols[i].dataIndex)}
                notFoundContent={<Spin size="small" />}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Object.values(dropdown).map((r) => (
                  <Option key={r.Id} nm={cols[i].name} value={r.Id}>
                    {r.Name}
                  </Option>
                ))}
              </Select>
            ) : cols[i].type === "selectDefaultYesNo" ? (
              <Select
                showSearch
                placeholder={cols[i].label}
                allowClear
                onChange={handleChange}
                onClear={() => handleClear(cols[i].dataIndex)}
                id={cols[i].controller}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                notFoundContent={<Spin size="small" />}
              >
                <Option nm={cols[i].name} key={1} value={1}>
                  Bəli
                </Option>
                <Option nm={cols[i].name} key={0} value={0}>
                  Xeyr
                </Option>
                <Option nm={cols[i].name} key={""} value={""}>
                  Hamısı
                </Option>
              </Select>
            ) : cols[i].type === "number" ? (
              <Input type="number" allowClear placeholder={cols[i].label} />
            ) : cols[i].type === "range" ? (
              <Input.Group className="custom_range_filter_inputs" compact>
                <Input
                  child={cols[i].start}
                  onChange={onChange}
                  defaultValue={
                    Object.keys(selectFilter).length > 0
                      ? selectFilter[
                          `${Object.keys(selectFilter).find(
                            (c) => c === cols[i].start
                          )}`
                        ]
                      : null
                  }
                  name={cols[i].start}
                  style={{ width: 100, textAlign: "center" }}
                  placeholder="Min"
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  className="site-input-right"
                  child={cols[i].start}
                  name={cols[i].end}
                  onChange={onChange}
                  defaultValue={
                    Object.keys(selectFilter).length > 0
                      ? selectFilter[
                          `${Object.keys(selectFilter).find(
                            (c) => c === cols[i].end
                          )}`
                        ]
                      : null
                  }
                  style={{
                    width: 100,
                    textAlign: "center",
                  }}
                  placeholder="Max"
                />
              </Input.Group>
            ) : cols[i].type === "date" ? (
              <RangePicker
                showTime={{ format: "HH:mm:ss" }}
                locale={locale}
                {...rangeConfig}
                format="DD-MM-YYYY HH:mm:ss"
                ranges={{
                  "Bu gün": [moment().startOf("day"), moment().endOf("day")],
                  Dünən: [
                    moment().subtract(1, "day").startOf("day"),
                    moment().subtract(1, "day").endOf("day"),
                  ],
                  "Bu ay": [moment().startOf("month"), moment().endOf("month")],
                  "Keçən ay": [
                    moment().subtract(1, "month").startOf("month"),
                    moment().subtract(1, "month").endOf("month"),
                  ],
                }}
              />
            ) : cols[i].type === "selectDefaultZeros" ? (
              <Select
                showSearch
                placeholder={cols[i].label}
                allowClear
                id={cols[i].controller}
                onChange={handleChange}
                onClear={() => handleClear(cols[i].dataIndex)}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                notFoundContent={<Spin size="small" />}
              >
                <Option nm={cols[i].name} key={4} value={4}>
                  0 olanlar
                </Option>
                <Option nm={cols[i].name} key={3} value={3}>
                  0 olmayanlar
                </Option>
                <Option nm={cols[i].name} key={2} value={2}>
                  Mənfilər
                </Option>
                <Option nm={cols[i].name} key={1} value={1}>
                  Müsbətlər
                </Option>
                <Option nm={cols[i].name} key={""} value={""}>
                  Hamısı
                </Option>
              </Select>
            ) : cols[i].type === "yesno" ? (
              <Select
                showSearch
                placeholder={cols[i].label}
                allowClear
                onChange={handleChange}
                onClear={() => handleClear(cols[i].dataIndex)}
                id={cols[i].controller}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                notFoundContent={<Spin size="small" />}
              >
                <Option nm={cols[i].name} key={1} value={1}>
                  Bəli
                </Option>
                <Option nm={cols[i].name} key={0} value={0}>
                  Xeyr
                </Option>
                <Option nm={cols[i].name} key={""} value={""}>
                  Hamısı
                </Option>
              </Select>
            ) : null}
          </Form.Item>
        </Col>
      );
    }

    return children;
  };

  const onFinish = (values) => {
    const rangeCreateValue = values["createdDate"];
    const rangeModifyValue = values["modifedDate"];
    const moment = values["moment"];
    const totalvalues = {
      ...values,
      moment: moment ? moment.format("DD-MM-YYYY HH:mm:ss") : "",
      momb: rangeCreateValue
        ? rangeCreateValue[0].format("YYYY-MM-DD HH:mm:ss")
        : "",
      mome: rangeCreateValue
        ? rangeCreateValue[1].format("YYYY-MM-DD HH:mm:ss")
        : "",
      modb: rangeModifyValue
        ? rangeModifyValue[0].format("YYYY-MM-DD HH:mm:ss")
        : "",
      mode: rangeModifyValue
        ? rangeModifyValue[1].format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    console.log(totalvalues, selectFilter);
    Object.assign(totalvalues, selectFilter);
    Object.entries(totalvalues).forEach(([key, value]) => {
      if (key.includes("_id")) {
        var index = key.slice(0, key.indexOf("_id"));
        delete totalvalues[`${key}`];
        totalvalues[`${index}`] = value;
      }
    });

    setIsFilter(true);
    setAdvancedPage(0);
    setAdvance(totalvalues);
  };

  useEffect(() => {
    if (from === "stockbalance") {
      Object.assign(selectFilter, {
        ar: 0,
        zeros: 3,
        wg: "",
      });

      setSelectFilter(selectFilter);
      setinitial(selectFilter);
    } else if (from === "products") {
      Object.assign(selectFilter, {
        ar: 0,
        wg: "",
      });
      Object.assign(initial, {
        ar: 0,
        wg: "",
      });

      setSelectFilter(selectFilter);
      setinitial(initial);
      form.setFieldsValue(selectFilter);
    } else {
      setSelectFilter([]);
    }
  }, []);

  useEffect(() => {
    if (advanced) {
      if (advanced.momb && advanced.mome) {
        form.setFieldsValue({
          createdDate: [moment(advanced.momb), moment(advanced.mome)],
        });
      }
    }
  }, [advanced]);

  console.log(selectFilter);

  // var defaults = {
  //   ar: "Xeyr",
  //   wg: "",
  //   zeros: "0 olmayanlar",
  // };

  // var initialvalues = { ...defaults, ...selectFilter };
  // Object.entries(initialvalues).filter(([key, value]) => {
  //   if (key.includes("_id")) {
  //     delete initialvalues[`${key}`];
  //   }
  // });
  // console.log(initialvalues);

  return (
    <div className="filter_wrapper" style={{ display: display }}>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
        // initialValues={initialvalues}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col
            span={24}
            style={{
              textAlign: "left",
              display: "flex",
              marginBottom: "22px",
              alignItems: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button
              style={{
                margin: "0 2rem",
              }}
              onClick={() => allClear()}
            >
              Clear
            </Button>
            {settings}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default FilterComponent;
