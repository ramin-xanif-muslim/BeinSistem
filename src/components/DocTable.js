import React from "react";
import { useTableCustom } from "../contexts/TableContext";
import { Table, Form, Input, InputNumber, Empty } from "antd";
import { useCustomForm } from "../contexts/FormContext";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import bc from "../audio/bc.mp3";
import {
  ConvertFixedPosition,
  ConvertFixedTable,
} from "../config/function/findadditionals";

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
      inputRef.current.select();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: ConvertFixedTable(record[dataIndex]),
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
        <Input
          size="small"
          style={{ width: "70px" }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          border: "5px solid #00000000",
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

function DocTable({ headers, datas, from, selectList, catalogVisible }) {
  const {
    advancedPage,
    setdocPage,
    docPage,
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
    isCatalog,
    setCatalog,
    outerDataSource,
    setOuterDataSource,
    setChangedInnerTable,
    changedInnerTable,
    pricechanged,
    setPriceChanged,
  } = useTableCustom();
  const { loadingForm } = useCustomForm();
  const [dataSource, setdataSource] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  const [showpacket, setShowPacket] = useState(false);

  useEffect(() => {
      console.log('dataSource',dataSource)
  },[dataSource])

  useEffect(() => {
    if (isAdd) {
      let duplicateData = false;
      let index;
      console.log(newPro);
      let newData = {
        Id: newPro.value,
        DefaultId: newPro.value,
        ProductId: newPro.value,
        ArtCode: newPro.artcode,
        Name: newPro.name,
        BarCode: newPro.barcode,
        Quantity: newPro.amount,
        ShowPacket: from ? (from === "demands" ? false : false) : false,
        IsPack: from
          ? from === "demands"
            ? newPro.ispack
            : newPro.ispack
          : newPro.ispack,

        SellPrice: from
          ? from === "demands"
            ? newPro.price
            : newPro.buyprice
          : newPro.buyprice,
        PrintPrice: newPro.price,
        Price: from && from === "demands" ? newPro.price : newPro.buyprice,
        MinPrice:
          from && from === "demands" ? newPro.minprice : newPro.minprice,
        BuyPrice: newPro.buyprice,
        TotalPrice: from
          ? from === "demands"
            ? newPro.price
            : newPro.buyprice
          : newPro.buyprice,
        CostPr: newPro.costprice,
        CostTotalPr: newPro.costpricetotal,
        PackPrice: from
          ? from === "demands"
            ? newPro.ispack === 1
              ? newPro.packprice
              : ""
            : ""
          : "",
        ChangePackQuantity: from
          ? from === "demands"
            ? newPro.ispack === 1
              ? newPro.packquantity
              : ""
            : ""
          : "",
        PackQuantity: from
          ? from === "demands"
            ? newPro.ispack === 1
              ? newPro.packquantity
              : ""
            : ""
          : "",
        StockQuantity: newPro.stockquantity ? newPro.stockquantity : "0.00",
        CostPrice: newPro.costprice,
        CostPriceTotal: newPro.costpricetotal,
      };
      dataSource.find((pd) => pd.BarCode === newData.BarCode)
        ? (duplicateData = true)
        : (duplicateData = false);
      index = dataSource.findIndex((pd) => pd.BarCode === newData.BarCode);
      console.log(dataSource);
      console.log(duplicateData);
      if (duplicateData === false) {
        let datas = [...dataSource];
        datas.unshift(newData);
        console.log("datas", datas);
        setdataSource(datas);
        setOuterDataSource(datas);
        setIsChanged(true);
      } else {
        let datas = [...dataSource];
        IsRepeat(datas, index, newData);
      }
      audio.play();
      setAdd(false);
      setNewPro([]);
    }
  }, [isAdd]);

  useEffect(() => {
    if (isNew) {
      console.log(newPro);
      var duplicateData = false;
      var index;
      var newData = {
        Id: newPro.id,
        DefaultId: newPro.id,
        ProductId: newPro.id,
        ArtCode: newPro.artcode,
        Name: newPro.name,
        BarCode: newPro.barcode,
        Quantity: 1,
        ShowPacket: from ? (from === "demands" ? false : false) : false,
        IsPack: from
          ? from === "demands"
            ? newPro.ispack
            : newPro.ispack
          : newPro.ispack,
        SellPrice: from
          ? from === "demands"
            ? newPro.price
            : newPro.buyprice
          : newPro.buyprice,
        PrintPrice: newPro.price,
        MinPrice: newPro.minprice,
        // Price: from
        // 	? from === "demands"
        // 		? newPro.price
        // 		: newPro.price
        // 	: newPro.price,
        Price: from && from === "demands" ? newPro.price : newPro.buyprice,
        CostPr: newPro.costprice,
        CostTotalPr: newPro.costpricetotal,
        BuyPrice: newPro.buyprice,
        TotalPrice: from
          ? from === "demands"
            ? newPro.price
            : newPro.buyprice
          : newPro.buyprice,

        PackPrice: from
          ? from === "demands"
            ? newPro.ispack === true || newPro.ispack === 1
              ? newPro.packprice
              : ""
            : ""
          : "",
        ChangePackQuantity: from
          ? from === "demands"
            ? newPro.ispack === true || newPro.ispack === 1
              ? newPro.packquantity
              : ""
            : ""
          : "",
        PackQuantity: from
          ? from === "demands"
            ? newPro.ispack === true || newPro.ispack === 1
              ? newPro.packquantity
              : ""
            : ""
          : "",
        StockQuantity: newPro.stockquantity ? newPro.stockquantity : "0.00",
        CostPrice: newPro.costprice,
        CostPriceTotal: newPro.costpricetotal,
      };
      dataSource.find((pd) => String(pd.BarCode) === String(newData.BarCode))
        ? (duplicateData = true)
        : (duplicateData = false);
      index = dataSource.findIndex(
        (pd) => String(pd.BarCode) === String(newData.BarCode)
      );
      if (duplicateData === false) {
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

  useEffect(() => {
    if (isCatalog) {
      let datas = [];
      console.log(selectList);
      selectList.map((s) => {
        if (s !== undefined) {
          datas.push({
            Id: s.Id,
            DefaultId: s.Id,
            ProductId: s.Id,
            ArtCode: s.ArtCode,
            Name: s.Name,
            BarCode: s.BarCode,
            MinPrice: s.MinPrice,
            Quantity: 1,
            ShowPacket: from ? (from === "demands" ? false : false) : false,
            IsPack: from
              ? from === "demands"
                ? s.IsPack
                : s.IsPack
              : s.IsPack,
            SellPrice: from
              ? from === "demands"
                ? s.Price
                : s.BuyPrice
              : s.BuyPrice,
            PrintPrice: s.Price,

            Price: from && from === "demands" ? s.Price : s.BuyPrice,

            CostPr: s.CostPrice,
            CostTotalPr: `${parseFloat(s.CostPrice) * parseFloat(1)}`,

            BuyPrice: s.BuyPrice,
            TotalPrice: from
              ? from === "demands"
                ? s.Price
                : s.BuyPrice
              : s.BuyPrice,

            PackPrice: from
              ? from === "demands"
                ? s.IsPack === true || s.IsPack === 1
                  ? s.PackPrice
                  : ""
                : ""
              : "",
            ChangePackQuantity: from
              ? from === "demands"
                ? s.IsPack === true || s.IsPack === 1
                  ? s.PackQuantity
                  : ""
                : ""
              : "",
            PackQuantity: from
              ? from === "demands"
                ? s.IsPack === true || s.ispack === 1
                  ? s.PackQuantity
                  : ""
                : ""
              : "",
            StockQuantity: s.StockBalance ? s.StockBalance : "0.00",
            CostPrice: s.CostPrice,
            CostPriceTotal: `${parseFloat(s.CostPrice) * parseFloat(1)}`,
          });
        }
      });

      let clearedList = datas.filter(
        (s) => s.Id != dataSource.find((d) => d.Id === s.Id)?.Id
      );

      var list = [...dataSource, ...clearedList];

      //   datas.forEach((d) => (deletedDatas = list.filter((t) => t.Id !== d.Id)));
      const results = list.filter(({ ProductId: id1 }) =>
        datas.some(({ ProductId: id2 }) => id2 === id1)
      );

      console.log(results);
      setdataSource(results.length > 0 ? results : list);
      setOuterDataSource(results.length > 0 ? results : list);
      setIsChanged(true);
      setCatalog(false);
    }
  }, [isCatalog]);
  const IsRepeat = async (ds, i, d) => {
    const datas = await AddRepeatProduct(ds, i, d);
    setdataSource(datas);
    setOuterDataSource(datas);
    setIsChanged(true);
  };
  const AddRepeatProduct = (prevdatasource, i, newdata) => {
    var quantity = parseFloat(prevdatasource[i].Quantity);

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
    setdataSource(outerDataSource);
    setOuterDataSource(outerDataSource);
    setIsChanged(true);
    setPriceChanged(false);
  }, [pricechanged]);
  useEffect(() => {
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
    setChangedInnerTable(false);
  }, [isChanged, changedInnerTable]);

  const handlePagination = (pg) => {
    setdocPage(pg - 1);
  };
  console.log(docPage);

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
            n.CostPriceTotal = parseFloat(n.CostPrice) * parseFloat(n.Quantity);
            n.CostTotalPr = parseFloat(n.CostPr) * parseFloat(n.Quantity);
          }
          n.ChangePackQuantity =
            parseFloat(n.PackQuantity) * parseFloat(n.Quantity);
        })
      : item.Price != newData[index].Price
      ? newData.map(
          (n) =>
            (n.TotalPrice =
              parseFloat(n.Price) *
              parseFloat(n.ShowPacket ? n.ChangePackQuantity : n.Quantity))
        )
      : item.TotalPrice !== newData[index].TotalPrice
      ? newData.map(
          (n) =>
            (n.Price =
              parseFloat(n.TotalPrice) /
              parseFloat(n.ShowPacket ? n.ChangePackQuantity : n.Quantity))
        )
      : newData.map(
          (n) =>
            (n.TotalPrice =
              parseFloat(n.Price) *
              parseFloat(n.ShowPacket ? n.ChangePackQuantity : n.Quantity))
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
      className="doc-table-inner"
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
      // pagination={{
      //     current: advancedPage + 1,
      //     total: 112,
      //     onChange: handlePagination,
      //     defaultPageSize: 100,
      //     showSizeChanger: false,
      // }}
      columns={columns}
      rowClassName={() => "editable-row"}
    />
  );
}

export default DocTable;
