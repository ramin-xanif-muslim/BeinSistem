import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchDepartments, fetchNavbar, fetchOwners } from "../api";
import { useTableCustom } from "../contexts/TableContext";
import { Dropdown } from "semantic-ui-react";
import img_brand from "../images/brand.png";
import { Input, Menu } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { useParams } from "react-router";


import { fetchStocks, fetchMarks,fetchCompany } from "../api";
import "../Navbar.css";
function Navbar() {
  const {
    marks,
    setMark,
    setMarkLocalStorage,
    markLoading,
    setMarkLoading,
    stocks,
    setStock,
    setStockLocalStorage,
    owners,
    setOwners,
    departments,
    setDepartments,
    setOwnersLocalStorage,
    setDepartmentsLocalStorage,
    searchGr,
    setSearchGr,
    setAdvancedPage,
    nav,
    setNav
  } = useTableCustom();

  const [menu, setMenu] = useState("1");
  const [companyname, setCompany] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const { isLoading, error, data } = useQuery("navbars", () => fetchNavbar());
  const getOwners = async () => {
    const ownerResponse = await fetchOwners();
    setOwners(ownerResponse.Body.List);
    setOwnersLocalStorage(ownerResponse.Body.List);
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
    getCompany()
    getMarks();
    getStocks();
    getOwners();
    getDepartments();
  }, []);

  const handleClick = (id, name) => {
    console.log(name);
    setMenu(id);
    setActiveItem(name);
    localStorage.setItem("activemenu", name);
    localStorage.setItem("activemenuid", id);
  };
  const handleClickSubMenu = (id, name) => {
    setSearchGr("");
    setActiveSubItem(name);
    setAdvancedPage(0);
    localStorage.setItem("activesubmenu", name);
  };
  if (isLoading) return "Loading...";

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
          ? data.Body.filter((d) => d.ParentId === "0").map((m) => (
              <Menu.Item
                className="main_header_items custom_flex_direction"
                key={m.Id}
                name={m.Name}
                active={localStorage.getItem("activemenu") === m.Name}
                parent_id={m.Id}
                onClick={() => handleClick(m.Id, m.Name)}
              >
                <img
                  className="small_logo_pics"
                  src={`/images/${m.Icon}.png`}
                />
                <span>{m.Name}</span>
              </Menu.Item>
            ))
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
          <Menu.Item className="main_header_items custom_flex_direction profile_icons_wrapper">
            <img
              className="small_logo_pics custom_width"
              src={`/images/notification.png`}
            />
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
                      {companyname ? companyname : ''}
                    </span>
                    <span>
                      {JSON.parse(localStorage.getItem("user"))
                        ? JSON.parse(localStorage.getItem("user")).Login
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
                {/* <Dropdown.Item onClick={openBalance}>
                  <span>
                    <Trans word="balance" /> {localStorage.getItem("balance")} ₼
                  </span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={logOut}
                  text={<Trans word={"logout"} />}
                /> */}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Segment className="custom_li_segment">
        <List className="custom_li_wrapper">
          {Array.isArray(data.Body)
            ? data.Body.filter(
                (item) => item.ParentId === localStorage.getItem("activemenuid")
              ).map((d) => (
                <List.Item
                  key={d.Id}
                  as={Link}
                  from={d.Url}
                  to={`/${d.Url}`}
                  active={localStorage.getItem("activesubmenu") === d.Name}
                  name={d.Name}
                  onClick={() => handleClickSubMenu(d.Id, d.Name)}
                  className="sub_header_items"
                >
                  {d.Name}
                </List.Item>
              ))
            : ""}
        </List>
      </Segment>
    </div>
    // <nav className="ui pointing main_header menu navbar">
    //   <div className="upper_side">
    //     <div className="left_nav">
    //       <a className="brand_logo">
    //         <img src={img_brand} />
    //       </a>
    //       <ul className="nav_ul">
    //         {data.Body.filter((item) => item.ParentId === "0").map((c) => (
    //           <li onClick={() => setMenu(c.Id)} key={c.Id}>
    //             {c.Name}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //     <div className="right_nav"></div>
    //   </div>
    //   <div className="lower_side">
    //     <ul className="nav_ul">
    //       {data.Body.filter((item) => item.ParentId === menu).map((c) => (
    //         <li key={c.Id}>
    //           <Link to={`/${c.Url}`}>{c.Name}</Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </nav>
  );
}

export default Navbar;
