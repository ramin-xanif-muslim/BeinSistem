import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchDepartments, fetchNavbar, fetchOwners } from "../api";
import { useTableCustom } from "../contexts/TableContext";
import { Dropdown } from "semantic-ui-react";
import img_brand from "../images/brand.svg";
import { Menu } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Redirect } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button, Modal, Badge } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import {
	fetchStocks,
	fetchMarks,
	fetchCompany,
	fetchNotification,
} from "../api";
import "../Navbar.css";
import { useNotification } from "../hooks/useNotification";
import { IncreaseBalance } from "./modal/IncreaseBalance";

function Navbar(props) {
	const {
		setMark,
		setMarkLocalStorage,
		setMarkLoading,
		setStock,
		setStockLocalStorage,
		setOwners,
		setDepartments,
		setOwnersLocalStorage,
		setDepartmentsLocalStorage,
		setSearchGr,
		setAdvancedPage,
		nav,
		balance,
		setBalance,
	} = useTableCustom();
	const { firstLogin, logout, loginFromUrlParams } = useAuth();

	const { getNotification, notificationsCount, fetchNotificationCount } =
		useNotification();

	const [menu, setMenu] = useState("2");
	const [noBalance, setNoBalance] = useState(true);
	const [showBalance, setShowBalance] = useState(false);
	const [companyname, setCompany] = useState(null);
	const [activeItem, setActiveItem] = useState(firstLogin ? "Məhsullar" : "");
	const [visible, setVisible] = useState(false);

	const onClickNotification = () => {
		getNotification();
	};

	const [activeSubItem, setActiveSubItem] = useState(
		firstLogin ? "Daxilolma" : ""
	);
	const { isLoading, error, data } = useQuery("navbars", () => fetchNavbar());
	const getOwners = async () => {
		const ownerResponse = await fetchOwners();
		setOwners(ownerResponse.Body.List);
		setOwnersLocalStorage(ownerResponse.Body.List);
	};

	const getBalance = async () => {
		const balanceres = await fetchNotification();
		// if (balanceres === "Sessiya bitmişdir") {
		if (balanceres === "Tarifə görə məhdudiyyət, Sessiyanız bitdi") {
			return <Redirect to="/signin" />;
		}
		if (balanceres === "Balans bitib") {
			setNoBalance(true);
			setShowBalance(true);
		} else {
			setNoBalance(false);
			setBalance(balanceres.Body.AccountBalance);
		}
	};
	const getCompany = async () => {
		const compResponse = await fetchCompany();
		setCompany(compResponse.Body.CompanyName);
		localStorage.setItem("companyname", compResponse.Body.CompanyName);
		localStorage.setItem("company", JSON.stringify(compResponse.Body));
	};
	const getDepartments = async () => {
		const depResponse = await fetchDepartments();
		setDepartments(depResponse.Body.List);
		setDepartmentsLocalStorage(depResponse.Body.List);
	};

	const getMarks = async () => {
		const markResponse = await fetchMarks();
		setMark(markResponse.Body.List);
		setMarkLocalStorage(markResponse.Body.List);
		setMarkLoading(false);
	};
	const getStocks = async () => {
		const stockResponse = await fetchStocks();
		setStock(stockResponse.Body.List);
		setStockLocalStorage(stockResponse.Body.List);
	};
	useEffect(() => {
		if (!companyname) {
			getCompany();
		}
	}, [companyname]);

	https: useEffect(() => {
		fetchNotificationCount();
		const interval = setInterval(() => {
			fetchNotificationCount();
		}, 180000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		getBalance();
		if (!noBalance) {
			getCompany();
			getMarks();
			getStocks();
			getOwners();
			getDepartments();
		}
	}, [noBalance]);

	const logOut = () => {
		logout();
		setShowBalance(false);
	};
	const handleClick = (id, name) => {
		setMenu(id);
		setActiveItem(name);
		localStorage.setItem("activemenu", name);
		localStorage.setItem("activemenuid", id);
	};
	const handleClickSubMenu = (id, name) => {
		document.title = name;
		setSearchGr("");
		setActiveSubItem(name);
		setAdvancedPage(0);
		localStorage.setItem("activesubmenu", name);
	};
	const closeBalance = () => {
		setVisible(false);
	};
	const openBalance = () => {
		setVisible(true);
	};
	if (isLoading) return null;

	if (error) return "An error has occurred: " + error.message;

	return (
		<div style={{ display: nav }}>
			<Menu pointing className="main_header">
				<Menu.Menu position="left">
					<Menu.Item>
						<img src={img_brand} />
					</Menu.Item>
				</Menu.Menu>
				{Array.isArray(data.Body)
					? data.Body.filter((d) => d.ParentId === "0").map((m) =>
							m.Name == "Komisyon satış" ? (
								<Badge.Ribbon text="Yeni" color="red">
									<Menu.Item
										className="main_header_items custom_flex_direction"
										key={m.Id}
										name={m.Name}
										active={activeItem === m.Name}
										parent_id={m.Id}
										onClick={() =>
											handleClick(m.Id, m.Name)
										}
									>
										<img
											className="small_logo_pics"
											src={`/images/${m.Icon}.png`}
										/>
										<span>{m.Name}</span>
									</Menu.Item>
								</Badge.Ribbon>
							) : (
								<Menu.Item
									className="main_header_items custom_flex_direction"
									key={m.Id}
									name={m.Name}
									active={activeItem === m.Name}
									parent_id={m.Id}
									onClick={() => handleClick(m.Id, m.Name)}
								>
									<img
										className="small_logo_pics"
										src={`/images/${m.Icon}.png`}
									/>
									<span>{m.Name}</span>
								</Menu.Item>
							)
					  )
					: ""}
				<Menu.Menu position="right">
					{/* <Menu.Item className="main_header_items custom_flex_direction profile_icons_wrapper">
              <Select
                labelInValue
                defaultValue={{ value: this.props.state.langs.lang }}
                style={{ width: "max-content" }}
                onChange={this.handleChange}
              >
                {options}
              </Select>
            </Menu.Item> */}
					<Menu.Item
						id="openSupport"
						style={{ cursor: "pointer" }}
						// onClick={() => window.talk()}
						className="main_header_items custom_flex_direction profile_icons_wrapper"
					>
						<img
							className="small_logo_pics custom_width"
							src={`/images/help.png`}
						/>
					</Menu.Item>
					<Menu.Item
						onClick={onClickNotification}
						className="main_header_items custom_flex_direction profile_icons_wrapper"
					>
						<Badge count={notificationsCount} size="small">
							<img
								className="small_logo_pics custom_width"
								src={`/images/notification.png`}
							/>
						</Badge>
					</Menu.Item>
					<Menu.Item className="main_header_items custom_flex_direction profile_icons_wrapper">
						<Dropdown
							className="flex-direction-column-center admin_menu "
							text={
								<div
									className="admin_dropdown_text"
									style={{ flexDirection: "row" }}
								>
									<p
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "flex-end",
											marginRight: "12px",
											marginBottom: "0",
										}}
									>
										<span>
											{companyname ? companyname : ""}
										</span>
										<span>
											{JSON.parse(
												localStorage.getItem("user")
											)
												? JSON.parse(
														localStorage.getItem(
															"user"
														)
												  ).Login
												: null}
										</span>
									</p>
									<img
										style={{ margin: "0" }}
										className="small_logo_pics custom_width"
										src={`/images/newSetAdmin.png`}
									/>
								</div>
							}
						>
							<Dropdown.Menu>
								<Dropdown.Item
									// onClick={openSettingPage}
									as={Link}
									to={"/settings"}
								>
									<span>Ayarlar</span>
								</Dropdown.Item>
								<Dropdown.Item>
									<span>Xəbərlər</span>
								</Dropdown.Item>
								<Dropdown.Item onClick={openBalance}>
									<span>
										Balans:{" "}
										<span style={{ fontFamily: "Calibri" }}>
											{balance} ₼
										</span>
									</span>
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item
									onClick={logOut}
									text={"Çıxış"}
								/>
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Item>
				</Menu.Menu>
			</Menu>
			<Segment className="custom_li_segment">
				<List className="custom_li_wrapper">
					{Array.isArray(data.Body)
						? data.Body.filter(
								(item) => item.ParentId === menu
						  ).map((d) => (
								<List.Item
									key={d.Id}
									as={Link}
									from={d.Url}
									to={`/${d.Url}`}
									active={activeSubItem === d.Name}
									name={d.Name}
									onClick={() =>
										handleClickSubMenu(d.Id, d.Name)
									}
									className="sub_header_items"
								>
									{d.Name}
								</List.Item>
						  ))
						: ""}
				</List>
			</Segment>

			<Modal
				title={
					<div className="exitModalTitle">
						<WarningOutlined /> Diqqət
					</div>
				}
				closable={false}
				className="close_doc_modal_wrapper"
				visible={showBalance}
				footer={[
					<div className="close_doc_modal_right_side">
						<Button key="link" href="#" onClick={() => logOut()}>
							Ok
						</Button>
					</div>,
				]}
			>
				<p className="exitModalBodyText">Balans bitib</p>
			</Modal>

			<IncreaseBalance closeBalance={closeBalance} visible={visible} />
		</div>
	);
}

export default Navbar;
