import { useState, createContext, useEffect, useContext } from "react";
import { Redirect, useParams } from "react-router";
import { useLocation } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isControlUrlParams, setIsControlUrlParams] = useState(false);
	const [user, setUser] = useState(null);
	const [firstLogin, setFirstLogin] = useState(false);
	const [token, setParamsToken] = useState("");
	const [handleToken, setToken] = useState(
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
	const loginFromUrlParams = (obj) => {
		if (obj.Token) {
			localStorage.setItem("access-token", obj.Token);
			localStorage.setItem("user", JSON.stringify(obj));
			setUser(obj);
			setLoggedIn(true);
			setToken(obj.Token);
			setFirstLogin(true);
		}
		setIsControlUrlParams(true);
	};

	const logout = (data) => {
		localStorage.clear();
		setUser(null);
		setLoggedIn(false);
		setToken(null);
		setFirstLogin(true);
	};
	const values = {
		loggedIn,
		user,
		login,
		handleToken,
		setToken,
		firstLogin,
		logout,
		loginFromUrlParams,
		isControlUrlParams,
		setParamsToken,
		token,
	};

	return (
		<AuthContext.Provider value={values}>{children}</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
