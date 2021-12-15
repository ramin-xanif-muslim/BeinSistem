import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPage, fecthFastPage, fetchFilterPage } from "../api";
import TableCustom from "../components/TableCustom";
import { Table } from "antd";
import { Redirect } from "react-router-dom";
import { Spin, Row, Col, Menu, Checkbox, Dropdown, Typography, } from "antd";
import { Button, Icon } from "semantic-ui-react";

import ProductGroup from "../components/ProductGroup";
import { useTableCustom } from "../contexts/TableContext";
import Buttons from "../components/Button";
import { fetchAttributes, fetchPriceTypes } from "../api";
import FilterComponent from "../components/FilterComponent";
import FastSearch from "../components/FastSearch";
import { SettingOutlined } from "@ant-design/icons";
import { useRef } from "react";
import "semantic-ui-css/semantic.min.css";
export default function CustomerPage() {

  const {
 
  } = useTableCustom();

 

  return (
    <div>
      <Row>
        <Col xs={24} md={24} xl={24} className="setting_button_wrapper">
          <Dropdown
            trigger={["click"]}
            overlay={menu}
            onVisibleChange={handleVisibleChange}
            visible={visibleMenuSettings}
          >
            <Button className="flex_directon_col_center">
              {" "}
              <SettingOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Table
        rowKey="Id"
        columns={columns.filter((c) => c.show == true)}
        dataSource={productList}
        onChange={onChange}
        locale={{ emptyText: <Spin /> }}
        pagination={{
          current: advancedPage + 1,
          total: data.Body.Count,
          onChange: handlePagination,
          defaultPageSize: data.Body.Limit,
          showSizeChanger: false,
        }}
        size="small"
        onRow={(r) => ({
          onDoubleClick: () => editPage(r.Id),
        })}
      />
    </div>
  );
}
