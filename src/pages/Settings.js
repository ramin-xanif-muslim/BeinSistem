import { Layout, Menu, Breadcrumb } from "antd";
import React from "react";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { FaWarehouse } from "react-icons/fa";
import { MdSettings, MdInfo, MdImportExport } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { BsListCheck } from "react-icons/bs";
import { MdBrandingWatermark } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { GoSettings } from "react-icons/go";
import { useState } from "react";
import { TemplateExample } from "../components/TempExample";
import { CascaderBcTemplates } from "../components/Cascader";
import { useCustomForm } from "../contexts/FormContext";
import SpendItems from "../components/SpendItems";
import Profile from "../components/Profile";
import FixError from "../components/FixError";
import Stock from "../components/Stock";
import ModComponent from "../components/ModComponent";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function Settings() {
  const [pathHeader, setPathHeader] = useState("Məlumatlar");
  const [path, setPath] = useState("");
  const { isTemp, setIsTemp } = useCustomForm();

  return (
    <Layout>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            onSelect={(item, key) => setPath(item.key)}
          >
            <SubMenu
              key="sub1"
              onTitleClick={() => setPathHeader("Məlumatlar")}
              icon={<MdInfo />}
              title="Məlumatlar"
            >
              <Menu.Item icon={<CgProfile />} name="profile" key="profile">
                Profil
              </Menu.Item>
              <Menu.Item icon={<BiMoney />} name="taxes" key="taxes">
                Tariflər
              </Menu.Item>
              <Menu.Item icon={<BsListCheck />} name="errors" key="errors">
                Yoxlama
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              onTitleClick={() => setPathHeader("Ayarlar")}
              icon={<MdSettings />}
              title="Ayarlar"
            >
              <Menu.Item icon={<FaWarehouse />} name="stocks" key="stocks">
                Anbarlar
              </Menu.Item>
              <Menu.Item disabled={true} icon={<FiUsers />} key="Users">
                Istifadəçilər
              </Menu.Item>
              <Menu.Item icon={<MdBrandingWatermark />} key="departments">
                Şöbələr
              </Menu.Item>
              <Menu.Item icon={<HiTemplate />} key="templates">
                Şablonlar
              </Menu.Item>
              <Menu.Item icon={<GiExpense />} key="spenditems">
                Xərc maddələri
              </Menu.Item>
              <Menu.Item icon={<GoSettings />} key="attributes">
                Modifikasiyalar
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              onTitleClick={() => setPathHeader("Idxal && Ixrac")}
              icon={<MdImportExport />}
              title="İdxal & İxrac"
            ></SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Ayar</Breadcrumb.Item>
            <Breadcrumb.Item>{pathHeader}</Breadcrumb.Item>
            <Breadcrumb.Item>{path}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {path === "templates" ? (
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  justifyContent: "space-between",
                }}
              >
                <TemplateExample />
                <CascaderBcTemplates />
              </div>
            ) : path === "spenditems" ? (
              <SpendItems />
            ) : path === "profile" ? (
              <Profile />
            ) : path === "errors" ? (
              <FixError />
            ) : path === "stocks" ? (
              <Stock />
            ) : path === "attributes" ? (
              <ModComponent />
            ) : null}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}