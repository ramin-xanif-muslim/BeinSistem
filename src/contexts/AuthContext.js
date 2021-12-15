import { useState, createContext, useEffect, useContext } from "react";
import { Redirect, useParams } from "react-router";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firstLogin, setFirstLogin] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : null
  );
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("access-token") ? true : false
  );

  const login = (data) => {
    localStorage.setItem("access-token", data.Body.Token);
    localStorage.setItem("user", JSON.stringify(data.Body));
    setUser(data.Body);
    setLoggedIn(true);
    setToken(data.Body.Token);
    setFirstLogin(true);
  };

  const values = {
    loggedIn,
    user,
    login,
    token,
    setToken,
    firstLogin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
