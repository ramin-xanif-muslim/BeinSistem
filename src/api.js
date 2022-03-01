import axios from "axios";
// import md5 from "md5";
import moment from "moment";
// import sendRequest from "./config/sentRequest";

export var API_BASE = "";
export var NEW_VERSON = "";

axios.get("/localEnv.json").then((res) => {
    API_BASE = res.data.API_BASE;
    NEW_VERSON = res.data.NEW_VERSION;
    checkVersion(res.data.NEW_VERSION);
});

const clearCacheData = () => {
    //localStorage.clear();
    // if (caches) {
    //     caches.keys().then((names) => {
    //         names.forEach((name) => {
    //             console.log("name", name);
    //             caches.delete(name);
    //         });
    //     });
    // }
};
const checkVersion = (en) => {
    if (
        !localStorage.getItem("VERSION") ||
        localStorage.getItem("VERSON") !== en
    ) {
        clearCacheData();
        localStorage.setItem("VERSION", en);
    }
};

export async function sendRequest(url, obj) {
    obj.token = localStorage.getItem("access-token");
    const res = await axios.post(API_BASE + `/controllers/` + url, obj);
    if (
        obj.token === "" ||
        res.data.Headers.ResponseStatus === "104" ||
        res.data.Headers.ResponseStatus === "103"
    ) {
        localStorage.removeItem("Token");
        alert(res.data.Body);
        return null;
    }
    if (res.data.Headers.ResponseStatus !== "0") {
        alert(res.data.Body);
        return null;
    }
    return res.data.Body;
}

export const api = Object.freeze({
    async fetchDebt(CustomerId) {
        let obj = { id: CustomerId };
        const response = await sendRequest("customers/getdata.php", obj);
        return response.Debt;
    },
});

export const fetchNavbar = async () => {
    var navFilter = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + "/controllers/menu/get.php",
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
        API_BASE + "/controllers/notifications/get.php",
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
        API_BASE + `/controllers/marks/get.php`,
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
        API_BASE + `/controllers/marks/edit.php`,
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
        API_BASE + `/controllers/owners/get.php`,
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
        API_BASE + `/controllers/departments/get.php`,
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
        API_BASE + `/controllers/attributes/get.php`,
        attributes
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        alert(data.Body);
        return null;
    }
};

export const fetchBarcode = async (weight) => {
    var br = {
        token: localStorage.getItem("access-token"),
        w: weight ? 1 : 0,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/barcode/get.php`,
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
        API_BASE + `/controllers/barcode/get.php`,
        br
    );

    return data;
};
export const fetchRefTypes = async () => {
    var attributes = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/attributes/getreftypes.php`,
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
        API_BASE + `/controllers/attributes/getreflist.php`,
        attributes
    );

    return data.Body.List;
};
export const fetchPriceTypes = async () => {
    var prices = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/pricetypes/get.php`,
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
        API_BASE + `/controllers/products/getproductsrate.php`,
        sendfilter
    );

    return data;
};

export const getBcTemplate = async () => {
    const { data } = await axios.get(
        API_BASE +
            `/controllers/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`
    );

    return data;
};
export const getBcTemplateMain = async (bc) => {
    const { data } = await axios.get(
        API_BASE + `/controllers/products/print.php?bc=${bc}`
    );

    return data;
};
export const fetchStocks = async () => {
    var stockFilter = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/stocks/get.php`,
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
        API_BASE + `/controllers/customers/get.php`,
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
        API_BASE + `/controllers/customers/getdata.php`,
        customerFilter
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data.Body;
    }
};
export const fetchPage = async (page, pg, dr, sr, gp, zeros, ar) => {
    var navFilter = {
        dr: dr,
        sr: sr,
        pg: pg ? pg : 0,
        gp: gp,
        lm: 100,
        zeros: zeros,
        ar: ar,
        token: localStorage.getItem("access-token"),
    };

    console.log("fetchPage");
    const { data } = await axios.post(
        API_BASE + `/controllers/${page}/get.php`,
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
        API_BASE + `/controllers/${controllername}/get.php`,
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
        API_BASE + `/controllers/${page}/del.php?id=${id}`,
        deldoc
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data.Body;
    }
};

export const fecthFastPage = async (page, pg, fast, gp) => {
    console.log("fecthFastPage");
    var navFilter = {};
    if(page === 'customers') {
        navFilter = {
            dr: 1,
            pg: pg ? pg : 0,
            lm: 100,
            fast: fast,
            token: localStorage.getItem("access-token"),
        };
    }
    else if (page != "products") {
        navFilter = {
            dr: 1,
            pg: pg ? pg : 0,
            lm: 100,
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
        API_BASE +
            `/controllers/${page}/${
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
    console.log("fetchFilterPage", advanced);
    var navFilter = {
        dr: dr,
        sr: sr,
        pg: pg ? pg : 0,
        gp: gp,
        zeros: zeros,
        ar: ar,
        lm: 100,
        token: localStorage.getItem("access-token"),
    };
    Object.assign(navFilter, advanced);
    console.log("fetchFilterPage", navFilter);
    const { data } = await axios.post(
        API_BASE + `/controllers/${page}/get.php`,
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
        API_BASE + `/controllers/${controller}/newname.php`,
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
        API_BASE + `/controllers/${controller}/get.php`,
        editFilter
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data.Body;
    }
};

export const fetchDebt = async (id) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        id: id,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/customers/getdata.php`,
        editFilter
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data.Body;
    }
};

export const fetchLinkedDoc = async (cus, pg, moment, lm) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        cus: cus,
        pg: pg ? pg : 0,
        moment: moment ? moment : "",
        // lm: lm ? lm : 15,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/documents/get.php`,
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
        API_BASE + `/controllers/${obj.controller}/put.php`,
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
        API_BASE + `/controllers/${obj.controller}/put.php`,
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
        API_BASE + `/controllers/${obj.controller}/put.php`,
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
        API_BASE + `/controllers/${obj.controller}/put.php`,
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
        API_BASE + `/controllers/${controller}/put.php`,
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
        API_BASE + `/controllers/pricetypes/put.php`,
        sendFilter
    );

    return data;
};
export const delPrice = async (id) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/pricetypes/del.php?id=${id}`,
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
        API_BASE + `/controllers/products/get.php`,
        editFilter
    );

    return data;
};

export const fetchSalePoints = async () => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/salepoints/get.php`,
        editFilter
    );

    return data;
};

export const fetchPermissionId = async (id) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        id: id,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/permissions/get.php`,
        editFilter
    );

    return data;
};

export const updatePermission = async (values) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
    };

    let sendFilter = Object.assign(editFilter, values);
    const { data } = await axios.post(
        API_BASE + `/controllers/permissions/put.php`,
        sendFilter
    );

    return data;
};
export const fetchSalePointId = async (id) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        id: id,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/salepoints/get.php`,
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
        API_BASE + `/controllers/customers/get.php`,
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
        API_BASE + `/controllers/productfolders/get.php`,
        editFilter
    );

    return data;
};
export const fetchCustomerGroupId = async (id) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        id: id,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/customergroups/get.php`,
        editFilter
    );

    return data;
};
//#LogIn function starts
export const putLogin = async (values) => {
    const { data } = await axios.post(API_BASE + `/login/send.php`, values);
    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data;
    }
};

export const sendRegisterPhp = async (values, val) => {
    const { data } = await axios.post(
        API_BASE +
            `/login/register.php?login=${values.Login}&phone=${values.mobile}&password=${values.password}&code=${val}`
    );

    if (data.Headers.ResponseStatus === "0") {
        return data;
    } else {
        return data.Body;
    }
};

export const sendRegOne = async (values) => {
    const { data } = await axios.post(
        API_BASE +
            `/login/regone.php?login=${values.Login}&phone=${values.mobile}&password=${values.password}`
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
        API_BASE + `/controllers/company/get.php`,
        progr
    );

    return data;
};
export const fetchTaxes = async () => {
    var progr = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/taxes/get.php`,
        progr
    );

    return data;
};
export const fetchProductFolders = async () => {
    var progr = {
        token: localStorage.getItem("access-token"),
        sr: "Name",
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/productfolders/get.php`,
        progr
    );

    return data;
};

export const fetchCustomerGroups = async () => {
    var progr = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/customergroups/get.php`,
        progr
    );

    return data;
};
export const fetchErrors = async () => {
    var spends = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/errors/get.php`,
        spends
    );

    return data;
};

export const fetchSpendItems = async () => {
    var spends = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/spenditems/get.php`,
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
        API_BASE + `/controllers/stocks/put.php`,
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
        API_BASE + `/controllers/spenditems/put.php`,
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
        API_BASE + `/controllers/taxes/put.php`,
        sendFilter
    );

    return data;
};
export const updateDepartment = async (obj) => {
    var editFilter = {
        token: localStorage.getItem("access-token"),
        id: obj.id,
    };
    var sendFilter = Object.assign(editFilter, obj.filter);
    const { data } = await axios.post(
        API_BASE + `/controllers/departments/put.php`,
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
        API_BASE + `/controllers/owners/put.php`,
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
        API_BASE + `/controllers/attributes/put.php`,
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
        API_BASE + `/controllers/attributes/putcustomref.php`,
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
        API_BASE + `/controllers/attributes/putrefitem.php`,
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
        API_BASE + `/controllers/company/put.php`,
        sendFilter
    );

    return data;
};
export const delDepartment = async (id) => {
    var deldoc = {
        token: localStorage.getItem("access-token"),
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/departments/del.php?id=${id}`,
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
        API_BASE + `/controllers/owners/del.php?id=${id}`,
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
        API_BASE + `/controllers/spenditems/del.php?id=${id}`,
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
        API_BASE + `/controllers/marks/del.php?id=${id}`,
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
        API_BASE + `/controllers/attributes/delrefitem.php?id=${id}`,
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
        API_BASE + `/controllers/attributes/delreference.php?id=${id}`,
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
        API_BASE + `/controllers/attributes/del.php?id=${id}`,
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
        API_BASE + `/controllers/stocks/del.php?id=${id}`,
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
        API_BASE + `/controllers/customers/getfast.php`,
        dataFilter
    );

    return data;
};
export const saveSettings = async (obj) => {
    var dataFilter = {
        token: localStorage.getItem("access-token"),
        tempdesign: obj.tempdesign,
    };
    const { data } = await axios.post(
        API_BASE + `/controllers/settings/put.php`,
        dataFilter
    );

    return data;
};
export const fetchSettings = async (obj) => {
    //   let hashMD5 = md5(obj);
    let newObj = {
        token: localStorage.getItem("access-token"),
        // hash: hashMD5,
    };

    const { data } = await axios.post(
        API_BASE + `/controllers/settings/get.php`,
        newObj
    );
    Object.entries(data.Body).map((item) => {
        localStorage.setItem(item[0], item[1]);
        console.log(localStorage.getItem(item[0]));
    });
};
export const increaseBalance = async (value) => {
    var obj = {
        token: localStorage.getItem("access-token"),
    };
    Object.assign(obj, value);
    const res = await axios.post(`${API_BASE}/controllers/merch/put.php`, obj);
    if (res.data.Body.ResponseStatus === "0") {
        window.open(res.data.Body.ResponseService);
    }
};
