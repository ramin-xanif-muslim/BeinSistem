import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tree, Alert, Spin, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { fetchProductFolders, fetchStocks } from "../api";
import { Modal } from "antd";
import { Redirect } from "react-router";

import { useTableCustom } from "../contexts/TableContext";
import "../Group.css";
const { DirectoryTree } = Tree;
const { Search } = Input;
let pid;

function convert(array) {
  var map = [{}];
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == "undefined") {
      map[obj.id].title = obj.title;
      map[obj.id].key = obj.key;
      map[obj.id].icon = obj.icon;
    }

    var parent = obj.parent || "-";
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push(map[obj.id]);
  }
  return map["-"].children;
}

function TreeView({ from, modalVisible, setStockId, onClose }) {
  var convertedDatas = [];
  var childrenFilter = [];

  const {
    setProductGroups,
    setProductGroupsLocalStorage,
    customerGroups,
    setCustomerGroups,
    searchGr,
    setSearchGr,
    setAdvancedPage,
    setDisable,
  } = useTableCustom();
  var datas = [];
  const [editId, setEditId] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [search, setSearch] = useState("");
  const [convertedData, setConvertedData] = useState([]);

  const { isLoading, error, data, isFetching } = useQuery(
    ["fetchstocks", modalVisible],
    () => fetchStocks()
  );

  const handleEdit = (e, id) => {
    e.preventDefault();
    setEditId(id);
    setRedirect(true);
  };
  useEffect(() => {
    if (search === "") {
      if (JSON.stringify(convertedDatas) != JSON.stringify(convertedData)) {
        console.log("salam");
        setConvertedData(convertedDatas);
      }
    }
  }, [convertedDatas]);

  if (isLoading)
    return (
      <Spin className="fetchSpinnerTop" tip="Yüklənir...">
        <Alert />
      </Spin>
    );

  if (error) return "An error has occurred: " + error.message;

  if (redirect) return <Redirect to={`/editProductGroup/${editId}`} />;

  if (Object.keys(data.Body.List).length > 0) {
    Object.values(data.Body.List).map((d) => {
      d.ParentId === "00000000-0000-0000-0000-000000000000"
        ? (pid = "")
        : (pid = d.ParentId);
      datas.push({
        id: d.Id,
        name: d.Name,
        parent: pid,
        title: d.Name,
        key: d.Id,
      });
    });
    convertedDatas = convert(datas);
  }

  const onSelect = (keys, info) => {
    console.log(info);
    setStockId([
      {
        name: info.node.name,
        id: info.node.id,
      },
    ]);
    onClose();
    setDisable(false);
  };

  const handleSearchStocks = (e) => {
    childrenFilter = [];
    setSearch(e.target.value);
    const newFilter = convertedDatas.filter(
      (c) =>
        String(c.name)
          .toUpperCase()
          .indexOf(String(e.target.value).toUpperCase()) >= 0
    );

    console.log(newFilter);
    setConvertedData(newFilter);
  };

  return (
    <Modal
      title="Anbar"
      destroyOnClose={true}
      visible={modalVisible}
      onCancel={onClose}
      closable
      footer={[]}
    >
      <Search placeholder="Axtar" onChange={handleSearchStocks} />
      <DirectoryTree
        multiple
        draggable
        showIcon={true}
        icon
        defaultSelectedKeys={[searchGr]}
        treeData={convertedData}
        onSelect={onSelect}
      />
    </Modal>
  );
}

export default TreeView;
