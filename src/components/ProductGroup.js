import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tree, Alert, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { fetchProductFolders } from "../api";
import { Redirect } from "react-router";

import { useTableCustom } from "../contexts/TableContext";
import "../Group.css";
const { DirectoryTree } = Tree;
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

function ProductGroup({ from }) {
  var convertedDatas = [];
  const {
    setProductGroups,
    setProductGroupsLocalStorage,
    customerGroups,
    setCustomerGroups,
    searchGr,
    setSearchGr,
    setAdvancedPage,
  } = useTableCustom();
  var datas = [];
  const [editId, setEditId] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const { isLoading, error, data, isFetching } = useQuery("productgroups", () =>
    fetchProductFolders()
  );

  const handleEdit = (e, id) => {
    e.preventDefault();
    setEditId(id);
    setRedirect(true);
  };

  useEffect(() => {
    if (!isFetching) {
      setProductGroups(data.Body.List);
      setProductGroupsLocalStorage(data.Body.List);
    }
  }, [isFetching]);

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
        icon:
          from === "catalog" ? null : (
            <EditOutlined
              onClick={(e) => handleEdit(e, d.Id)}
              className="editGr"
            />
          ),
      });
    });
    convertedDatas = convert(datas);
  }

  const onSelect = (keys, info) => {
    setSearchGr(keys[0]);
    setAdvancedPage(0);
  };

  convertedDatas.unshift({
    id: "",
    name: "Bütün məhsullar",
    parent: "",
    title: "Bütün məhsullar",
    key: "",
  });
  return (
    <div className="group_wrapper">
      <DirectoryTree
        multiple
        draggable
        showIcon={true}
        icon
        defaultSelectedKeys={[searchGr]}
        treeData={convertedDatas}
        onSelect={onSelect}
      />
    </div>
  );
}

export default ProductGroup;
