import axios from "axios";

export const fetchNavbar = async () => {
  var navFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    "https://dev.bein.az/controllers/menu/get.php",
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchNotification = async () => {
  var navFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    "https://dev.bein.az/controllers/notifications/get.php",
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchMarks = async () => {
  var markFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/marks/get.php`,
    markFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const editMarks = async (values) => {
  var markFilter = {
    token: localStorage.getItem("access-token"),
  };
  var sendFilter = Object.assign(markFilter, values);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/marks/edit.php`,
    sendFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchOwners = async () => {
  var owdepfilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/owners/get.php`,
    owdepfilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchDepartments = async () => {
  var owdepfilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/departments/get.php`,
    owdepfilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchAttributes = async () => {
  var attributes = {
    token: localStorage.getItem("access-token"),
    entitytype: "product",
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/get.php`,
    attributes
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchBarcode = async (weight) => {
  var br = {
    token: localStorage.getItem("access-token"),
    w: weight ? 1 : 0,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/barcode/get.php`,
    br
  );

  return data;
};

export const fetchCard = async () => {
  var br = {
    token: localStorage.getItem("access-token"),
    w: 2,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/barcode/get.php`,
    br
  );

  return data;
};
export const fetchRefTypes = async () => {
  var attributes = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/getreftypes.php`,
    attributes
  );

  return data.Body.List;
};
export const fetchRefList = async (id) => {
  var attributes = {
    token: localStorage.getItem("access-token"),
    refid: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/getreflist.php`,
    attributes
  );

  return data.Body.List;
};
export const fetchPriceTypes = async () => {
  var prices = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/pricetypes/get.php`,
    prices
  );

  return data;
};
export const fetchPriceTypesRate = async (object) => {
  var prices = {
    token: localStorage.getItem("access-token"),
  };

  var sendfilter = Object.assign(prices, object);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/products/getproductsrate.php`,
    sendfilter
  );

  return data;
};

export const getBcTemplate = async () => {
  const { data } = await axios.get(
    `https://dev.bein.az/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`
  );

  return data;
};
export const getBcTemplateMain = async (bc) => {
  const { data } = await axios.get(
    `https://dev.bein.az/controllers/products/print.php?bc=${bc}`
  );

  return data;
};
export const fetchStocks = async () => {
  var stockFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/stocks/get.php`,
    stockFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchCustomers = async () => {
  var customerFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/customers/get.php`,
    customerFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchCustomersData = async (id) => {
  var customerFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/customers/getdata.php`,
    customerFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchPage = async (page, pg, dr, sr, gp, zeros, ar) => {
  console.log("adi isledi");

  var navFilter = {
    dr: dr,
    sr: sr,
    pg: pg ? pg : 0,
    gp: gp,
    lm: 25,
    zeros: zeros,
    ar: ar,
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${page}/get.php`,
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchCheck = async (controllername, id) => {
  var navFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${controllername}/get.php`,
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const delDoc = async (id, page) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${page}/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fecthFastPage = async (page, pg, fast, gp) => {
  var navFilter = {};
  if (page != "products") {
    navFilter = {
      dr: 1,
      pg: pg ? pg : 0,
      lm: 25,
      docNumber: fast,
      token: localStorage.getItem("access-token"),
    };
  } else {
    navFilter = {
      dr: 1,
      pg: pg ? pg : 0,
      gp: gp,
      fast: fast,
      token: localStorage.getItem("access-token"),
    };
  }

  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${page}/${
      page != "products" ? "get" : "getfast"
    }.php`,
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchFilterPage = async (
  page,
  pg,
  advanced,
  dr,
  sr,
  gp,
  zeros,
  ar
) => {
  console.log("filterisledi");
  var navFilter = {
    dr: dr,
    sr: sr,
    pg: pg ? pg : 0,
    gp: gp,
    zeros: zeros,
    ar: ar,
    lm: 25,
    token: localStorage.getItem("access-token"),
  };
  Object.assign(navFilter, advanced);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${page}/get.php`,
    navFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const fetchDocName = async (name, controller) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    n: name ? name : "",
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${controller}/newname.php`,
    editFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data;
  }
};

export const fetchDocId = async (id, controller) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${controller}/get.php`,
    editFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const fetchLinkedDoc = async (cus, pg, moment, lm) => {
  console.log(cus);
  var editFilter = {
    token: localStorage.getItem("access-token"),
    cus: cus,
    pg: pg ? pg : 0,
    moment: moment ? moment : "",
    lm: lm ? lm : 15,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/documents/get.php`,
    editFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const updateDoc = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${obj.controller}/put.php`,
    sendFilter
  );

  return data;
};
export const updateProduct = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${obj.controller}/put.php`,
    sendFilter
  );

  return data;
};

export const updateSalePoint = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${obj.controller}/put.php`,
    sendFilter
  );

  return data;
};

export const updateCustomer = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${obj.controller}/put.php`,
    sendFilter
  );

  return data;
};

export const saveDoc = async (obj, controller) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
  };
  var sendFilter = Object.assign(editFilter, obj);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/${controller}/put.php`,
    sendFilter
  );

  return data;
};

export const savePrice = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
  };
  var sendFilter = Object.assign(editFilter, obj);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/pricetypes/put.php`,
    sendFilter
  );

  return data;
};
export const delPrice = async (id) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/pricetypes/del.php?id=${id}`,
    editFilter
  );

  return data;
};
export const fetchProductId = async (id) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/products/get.php`,
    editFilter
  );

  return data;
};
export const fetchSalePointId = async (id) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/salepoints/get.php`,
    editFilter
  );

  return data;
};

export const fetchCustomerId = async (id) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/customers/get.php`,
    editFilter
  );

  return data;
};
export const fetchProductGroupId = async (id) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: id,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/productfolders/get.php`,
    editFilter
  );

  return data;
};
//#LogIn function starts
export const putLogin = async (values) => {
  const { data } = await axios.post(
    `https://dev.bein.az/login/send.php`,
    values
  );
  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
//#LogIn function ends

export const fetchCompany = async () => {
  var progr = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/company/get.php`,
    progr
  );

  return data;
};
export const fetchTaxes = async () => {
  var progr = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/taxes/get.php`,
    progr
  );

  return data;
};
export const fetchProductFolders = async () => {
  var progr = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/productfolders/get.php`,
    progr
  );

  return data;
};

export const fetchCustomerGroups = async () => {
  var progr = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/customergroups/get.php`,
    progr
  );

  return data;
};
export const fetchErrors = async () => {
  var spends = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/errors/get.php`,
    spends
  );

  return data;
};

export const fetchSpendItems = async () => {
  var spends = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/spenditems/get.php`,
    spends
  );

  return data;
};

export const updateStocks = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/stocks/put.php`,
    sendFilter
  );

  return data;
};
export const updateSpendItem = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/spenditems/put.php`,
    sendFilter
  );

  return data;
};
export const updateTaxes = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/taxes/put.php`,
    sendFilter
  );

  return data;
};
;
export const updateDepartment = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/departments/put.php`,
    sendFilter
  );

  return data;
};

export const updateOwner = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/owners/put.php`,
    sendFilter
  );

  return data;
};

export const updateAttributes = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);

  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/put.php`,
    sendFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const updateRef = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);

  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/putcustomref.php`,
    sendFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const updateRefList = async (obj) => {
  var editFilter = {
    token: localStorage.getItem("access-token"),
    id: obj.id,
    refid: obj.refid,
  };
  var sendFilter = Object.assign(editFilter, obj.filter);

  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/putrefitem.php`,
    sendFilter
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const updateCompany = async (obj) => {
  var progr = {
    token: localStorage.getItem("access-token"),
  };
  var sendFilter = Object.assign(progr, obj.filter);

  const { data } = await axios.post(
    `https://dev.bein.az/controllers/company/put.php`,
    sendFilter
  );

  return data;
};
export const delDepartment = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/departments/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const delOwner = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/owners/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const delSpendItems = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/spenditems/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const delMarks = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/marks/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const delRefsList = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/delrefitem.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const delRefs = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/delreference.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const delAttributes = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/attributes/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};
export const delStocks = async (id) => {
  var deldoc = {
    token: localStorage.getItem("access-token"),
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/stocks/del.php?id=${id}`,
    deldoc
  );

  if (data.Headers.ResponseStatus === "0") {
    return data;
  } else {
    return data.Body;
  }
};

export const getCustomerFastFilter = async (fast) => {
  var dataFilter = {
    token: localStorage.getItem("access-token"),
    fast: fast,
  };
  const { data } = await axios.post(
    `https://dev.bein.az/controllers/customers/getfast.php`,
    dataFilter
  );

  return data;
};
