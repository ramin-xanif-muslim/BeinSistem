import { createContext, useState, useContext } from "react";

const TableContext = createContext();

const TableProvider = ({ children }) => {
  const [marks, setMark] = useState(null);
  const [disable, setDisable] = useState(true);
  const [productcols, setproductcols] = useState(null);
  const [productcolsinitials, setproductcolsinitials] = useState(null);
  const [stocks, setStock] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [prices, setPrices] = useState(null);
  const [attrLoading, setAttrLoading] = useState(false);
  const [owners, setOwners] = useState(null);
  const [productGroups, setProductGroups] = useState(null);
  const [markLoading, setMarkLoading] = useState(true);
  const [docPage, setdocPage] = useState(0);
  const [docSum, setDocSum] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [newPro, setNewPro] = useState([]);
  const [isAdd, setAdd] = useState(false);
  const [isCatalog, setCatalog] = useState(false);
  const [isNew, setNew] = useState(false);
  const [outerDataSource, setOuterDataSource] = useState([]);
  const [refList, setRefList] = useState([]);
  const [linkedList, setLinkedList] = useState([]);
  const [search, setFastSearch] = useState(null);
  const [doSearch, setDoSearch] = useState(false);
  const [searchGr, setSearchGr] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [advancedPage, setAdvancedPage] = useState(0);
  const [advanced, setAdvance] = useState({});
  const [concat, setConcat] = useState({});
  const [display, setdisplay] = useState("none");
  const [selectFilter, setSelectFilter] = useState({});
  const [customers, setCustomers] = useState(null);
  const [groupVisible, setGroupVisible] = useState(false);
  const [spenditems, setSpendItems] = useState(null);
  const [orderStatusArr, setOrderStatusArr] = useState(null);
  const [changedInnerTable, setChangedInnerTable] = useState(false);
  const [pricechanged, setPriceChanged] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [stockbalanceSearchTerm, setStockbalanceSearchTerm] = useState("");
  const [salereportsSearchTerm, setSalereportsSearchTerm] = useState("");
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [settingsObj, setSettingsObj] = useState({token: localStorage.getItem("access-token")})

  const [balance, setBalance] = useState(0);
  const [nav, setNav] = useState("block");
  const [customerGroups, setCustomerGroups] = useState(null);
  const [newGroup, setNewGroup] = useState(null);
  const setAttrLocalStorage = (obj) => {
    localStorage.setItem("attr", JSON.stringify(obj));
  };
  const setCustomersLocalStorage = (obj) => {
    localStorage.setItem("customers", JSON.stringify(obj));
  };
  const setPricesLocalStorage = (obj) => {
    localStorage.setItem("prices", JSON.stringify(obj));
  };
  const setRefsLocalStorage = (obj) => {
    localStorage.setItem("refs", JSON.stringify(obj));
  };
  const setMarkLocalStorage = (obj) => {
    localStorage.setItem("marks", JSON.stringify(obj));
  };
  const setOwnersLocalStorage = (obj) => {
    localStorage.setItem("owners", JSON.stringify(obj));
  };
  const setDepartmentsLocalStorage = (obj) => {
    localStorage.setItem("departments", JSON.stringify(obj));
  };
  const setStockLocalStorage = (obj) => {
    localStorage.setItem("stocks", JSON.stringify(obj));
  };

  const setSpendsLocalStorage = (obj) => {
    localStorage.setItem("spenditems", JSON.stringify(obj));
  };
  const setProductGroupsLocalStorage = (obj) => {
    localStorage.setItem("progroups", JSON.stringify(obj));
  };
  const setCustomerGroupsLocalStorage = (obj) => {
    localStorage.setItem("cusgroups", JSON.stringify(obj));
  };
  const values = {
    settingsObj,
    setSettingsObj,
    salereportsSearchTerm,
    setSalereportsSearchTerm,
    stockbalanceSearchTerm,
    setStockbalanceSearchTerm,
    productSearchTerm,
    setProductSearchTerm,
    searchGr,
    setSearchGr,
    productcols,
    setproductcols,
    productcolsinitials,
    setproductcolsinitials,
    setCustomerGroupsLocalStorage,
    setCustomersLocalStorage,
    isNew,
    setNew,
    spenditems,
    setSpendItems,
    setSpendsLocalStorage,
    customerGroups,
    setCustomerGroups,
    customers,
    setCustomers,
    selectFilter,
    setSelectFilter,
    advancedPage,
    setAdvancedPage,
    isFilter,
    setIsFilter,
    advanced,
    setAdvance,
    doSearch,
    setDoSearch,
    search,
    setFastSearch,
    refList,
    setRefList,
    setLinkedList,
    linkedList,
    setRefsLocalStorage,
    marks,
    setMark,
    setMarkLocalStorage,
    markLoading,
    setMarkLoading,
    stocks,
    setStock,
    setStockLocalStorage,
    docPage,
    setdocPage,
    docSum,
    setDocSum,
    docCount,
    setDocCount,
    newPro,
    setNewPro,
    isAdd,
    setAdd,
    outerDataSource,
    setOuterDataSource,
    productGroups,
    setProductGroups,
    setProductGroupsLocalStorage,
    setOwnersLocalStorage,
    setDepartments,
    setDepartmentsLocalStorage,
    setOwners,
    owners,
    departments,
    attributes,
    setAttributes,
    attrLoading,
    setAttrLoading,
    setAttrLocalStorage,
    setPricesLocalStorage,
    prices,
    setPrices,
    display,
    setdisplay,
    groupVisible,
    setGroupVisible,
    setNewGroup,
    newGroup,
    disable,
    setDisable,
    concat,
    setConcat,
    nav,
    setNav,
    balance,
    setBalance,
    orderStatusArr,
    setOrderStatusArr,
    setChangedInnerTable,
    changedInnerTable,
    pricechanged,
    setPriceChanged,
    isCatalog,
    setCatalog,
    selectedDateId,
    setSelectedDateId,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};

const useTableCustom = () => useContext(TableContext);
export { TableProvider, useTableCustom };
