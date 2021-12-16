import { createContext, useState, useEffect, useContext } from "react";

const FormContext = createContext();

const MyFormProvider = ({ children }) => {
  const [docstock, setDocStock] = useState(null);
  const [isReturn, setIsReturn] = useState(null);
  const [isTemp, setIsTemp] = useState(false);
  const [saveFromModal, setSaveFromModal] = useState(false);
  const [redirectSaveClose, setRedirectSaveClose] = useState(false);
  const [isPayment, setIsPayment] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [docfromstock, setDocFromStock] = useState(null);
  const [docmark, setDocMark] = useState(null);
  const [stockDrawer, setStockDrawer] = useState(false);
  const [customerDrawer, setCustomerDrawer] = useState(false);
  const [customerGroupDrawer, setCustomerGroupDrawer] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [createdStock, setCreatedStock] = useState(null);
  const [createdCustomer, setCreatedCustomer] = useState(null);
  const [createdCustomerGroup, setCreatedCustomerGroup] = useState(null);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [cusid, setcusid] = useState(null);
  const values = {
    isReturn,
    setIsReturn,
    isPayment,
    setIsPayment,
    docstock,
    setDocStock,
    docmark,
    setDocMark,
    loadingForm,
    setLoadingForm,
    docfromstock,
    setDocFromStock,
    setStockDrawer,
    stockDrawer,
    setCustomerDrawer,
    customerDrawer,
    setCustomerGroupDrawer,
    customerGroupDrawer,
    createdStock,
    setCreatedStock,
    createdCustomer,
    setCreatedCustomer,
    createdCustomerGroup,
    setCreatedCustomerGroup,
    paymentModal,
    setPaymentModal,
    setProductModal,
    productModal,
    visibleDrawer,
    setVisibleDrawer,
    cusid,
    setcusid,
    isTemp,
    setIsTemp,

    saveFromModal,
    setSaveFromModal,

    redirectSaveClose,
    setRedirectSaveClose,
  };

  return <FormContext.Provider value={values}>{children}</FormContext.Provider>;
};

const useCustomForm = () => useContext(FormContext);

export { MyFormProvider, useCustomForm };
