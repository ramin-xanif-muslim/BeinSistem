import { createContext, useContext, useState, useReducer } from "react";
import axios from "axios";
import reducer from "./reducer";
import { API_BASE } from "../api";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initialState = {
    groups: {},
    prices: {},
    attributes: {},
    loadingPrices: true,
    loadingAttributes: true,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProductGroup = async () => {
    var filter = {
      token: "17196e9b2a5024b4be4d646ef2b59b4e1",
    };
    const { data } = await axios.post(
      `${API_BASE}/controllers/productfolders/get.php`,
      filter
    );

    if (data.Headers.ResponseStatus === "0") {
      dispatch({ type: "GROUPS", payload: data.Body.List });
      return data;
    } else {
      return data.Body;
    }
  };

  const fetchPricesTypes = async () => {
    var filter = {
      token: "17196e9b2a5024b4be4d646ef2b59b4e1",
    };
    const { data } = await axios.post(
      `${API_BASE}/controllers/pricetypes/get.php`,
      filter
    );

    if (data.Headers.ResponseStatus === "0") {
      dispatch({ type: "PRICES", payload: data.Body.List });
      return data;
    } else {
      return data.Body;
    }
  };
  const fetchAttributes = async () => {
    var filter = {
      token: "17196e9b2a5024b4be4d646ef2b59b4e1",
      entitytype: "product",
    };
    const { data } = await axios.post(
      `${API_BASE}/controllers/attributes/get.php`,
      filter
    );

    if (data.Headers.ResponseStatus === "0") {
      dispatch({ type: "ATTRIBUTES", payload: data.Body.List });
      return data;
    } else {
      return data.Body;
    }
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        fetchProductGroup,
        fetchPricesTypes,
        fetchAttributes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
