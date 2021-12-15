import React from "react";
import { useTableCustom } from "../contexts/TableContext";
import { Table, Form, Input, InputNumber, Empty } from "antd";
import { useCustomForm } from "../contexts/FormContext";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import bc from "../audio/bc.mp3";
import { ConvertFixedPosition,ConvertFixedTable } from "../config/function/findadditionals";

const EditableContext = createContext(null);
const audio = new Audio(bc);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {}
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

function DocTable({ headers, datas }) {
  const {
    setdocPage,
    setDocSum,
    docSum,
    setDocCount,
    docCount,
    newPro,
    isAdd,
    setAdd,
    setNewPro,
    isNew,
    setNew,
    outerDataSource,
    setOuterDataSource,
  } = useTableCustom();
  const { loadingForm } = useCustomForm();
  const [dataSource, setdataSource] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (isAdd) {
      console.log(newPro)
      var duplicateData = false;
      var index;
      var newData = {
        key: newPro.value,
        Id: newPro.value,
        DefaultId: newPro.value,
        ProductId: newPro.value,
        ArtCode: newPro.artcode,
        Name: newPro.name,
        BarCode: newPro.barcode,
        Quantity: newPro.amount,
        SellPrice: newPro.buyprice,
        PrintPrice: newPro.price,
        Price: newPro.buyprice,
        CostPr: newPro.buyprice,
        BuyPrice: newPro.buyprice,
        TotalPrice: newPro.buyprice * 1,
        CostTotalPr: newPro.buyprice * 1,
        StockQuantity: newPro.stockquantity ? newPro.stockquantity : "0.00",
        CostPrice: newPro.costprice,
        CostPriceTotal: newPro.costpricetotal,
      };
      console.log(newData)
      dataSource.find(
        (pd) => String(pd.ProductId) === String(newData.ProductId)
      )
        ? (duplicateData = true)
        : (duplicateData = false);
      index = dataSource.findIndex(
        (pd) => String(pd.ProductId) === String(newData.ProductId)
      );
      if (duplicateData === false) {
        console.log("geldi", dataSource);
        var datas = [...dataSource];
        datas.unshift(newData);
        console.log(datas)
        setdataSource(datas);
        setOuterDataSource(datas);
        setIsChanged(true);
      } else {
        var datas = [...dataSource];
        IsRepeat(datas, index, newData);
      }
      audio.play();
      setAdd(false);
      setNewPro([]);
    }
  }, [isAdd]);

  useEffect(() => {
    if (isNew) {
      console.log("newprp", newPro);
      var duplicateData = false;
      var index;
      var newData = {
        key: newPro.id,
        Id: newPro.id,
        DefaultId: newPro.id,
        ProductId: newPro.id,
        ArtCode: newPro.artcode,
        Name: newPro.name,
        BarCode: newPro.barcode,
        Quantity: 1,
        SellPrice: newPro.buyprice,
        PrintPrice: newPro.price,
        Price: newPro.buyprice,
        CostPr: newPro.buyprice,
        BuyPrice: newPro.buyprice,
        TotalPrice: newPro.buyprice * 1,
        CostTotalPr: newPro.buyprice * 1,
        StockQuantity: newPro.stockquantity ? newPro.stockquantity : "0.00",
        CostPrice: newPro.costprice,
        CostPriceTotal: newPro.costpricetotal,
      };
      dataSource.find(
        (pd) => String(pd.ProductId) === String(newData.ProductId)
      )
        ? (duplicateData = true)
        : (duplicateData = false);
      index = dataSource.findIndex(
        (pd) => String(pd.ProductId) === String(newData.ProductId)
      );
      if (duplicateData === false) {
        console.log("geldi", dataSource);
        var datas = [...dataSource];
        datas.unshift(newData);
        setdataSource(datas);
        setOuterDataSource(datas);
        setIsChanged(true);
      } else {
        var datas = [...dataSource];
        IsRepeat(datas, index, newData);
      }
      audio.play();
      setNew(false);
      setNewPro([]);
    }
  }, [isNew]);

  const IsRepeat = async (ds, i, d) => {
    const datas = await AddRepeatProduct(ds, i, d);
    console.log("tekrar", datas);
    setdataSource(datas);
    setOuterDataSource(datas);
    setIsChanged(true);
  };
  const AddRepeatProduct = (prevdatasource, i, newdata) => {
    console.log("tekrara gelirmi");
    var quantity = parseFloat(prevdatasource[i].Quantity);
    console.log("tekrara gelirmi", quantity);

    const item = prevdatasource[i];
    quantity++;
    var totalprice = quantity * parseFloat(prevdatasource[i].SellPrice);
    var totalcostprice = quantity * parseFloat(prevdatasource[i].CostPrice);
    newdata.ShowPacket = false;
    newdata.Quantity = quantity;
    newdata.TotalPrice = totalprice;
    newdata.CostPriceTotal = totalcostprice;
    newdata.Price = prevdatasource[i].SellPrice;
    prevdatasource.splice(i, 1);
    prevdatasource.unshift(newdata);

    return prevdatasource;
  };

  useEffect(() => {
    setdataSource(datas);
    setOuterDataSource(datas);
    setIsChanged(true);
  }, [datas]);
  useEffect(() => {
    console.log("deyisdi");
    var sumtotalprices = 0;
    var sumcount = 0;
    if (Array.isArray(dataSource)) {
      dataSource.map((d) => {
        sumtotalprices += parseFloat(d.TotalPrice);
        sumcount += parseFloat(
          d.ShowPacket ? d.ChangePackQuantity : d.Quantity
        );
      });
    }

    setDocSum(sumtotalprices);
    setDocCount(sumcount);
    setIsChanged(false);
  }, [isChanged]);

  const handlePagination = (pg) => {
    setdocPage(pg - 1);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    item.Quantity != newData[index].Quantity
      ? newData.map((n) => {
          if (n.ShowPacket) {
            n.TotalPrice = parseFloat(n.PackPrice) * parseFloat(n.Quantity);
          } else {
            n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity);
          }
          n.ChangePackQuantity =
            parseFloat(n.PackQuantity) * parseFloat(n.Quantity);
        })
      : item.Price != newData[index].Price
      ? newData.map(
          (n) => (n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity))
        )
      : item.TotalPrice != newData[index].TotalPrice
      ? newData.map(
          (n) => (n.Price = parseFloat(n.TotalPrice) / parseFloat(n.Quantity))
        )
      : newData.map(
          (n) => (n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity))
        );
    setdataSource(newData);
    setOuterDataSource(newData);
    setIsChanged(true);
  };
  const columns = headers.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        className: col.className,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <Table
      components={components}
      dataSource={dataSource}
      loading={loadingForm}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sənəd boşdur..."
          />
        ),
      }}
      pagination={{ defaultPageSize: 100, onChange: handlePagination }}
      columns={columns}
      rowClassName={() => "editable-row"}
      bordered
    />
  );
}

export default DocTable;
