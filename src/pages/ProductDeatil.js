// import { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router";
// import { fetchProductId } from "../api";
// import {
//   Form,
//   Input,
//   Button,
//   InputNumber,
//   TreeSelect,
//   Checkbox,
//   Dropdown,
//   message,
//   Card,
//   Select,
//   Spin,
//   Space,
//   Alert,
//   Menu,
//   Row,
//   Col,
//   Collapse,
// } from "antd";
// import "antd/dist/antd.css";
// import {
//   SyncOutlined,
//   PlusOutlined,
//   MinusCircleOutlined,
//   EditOutlined,
// } from "@ant-design/icons";
// import { Tab } from "semantic-ui-react";

// const { Option } = Select;
// const { TextArea } = Input;
// const { Panel } = Collapse;
// let panes;

// export default function ProductDetail() {
//   const {
//     groups,
//     prices,
//     loadingPrices,
//     fetchPricesTypes,
//     fetchAttributes,
//     loadingAttributes,
//     attributes,
//   } = useGlobalContext();
//   useEffect(() => {
//     fetchPricesTypes();
//     fetchAttributes();
//   }, []);
//   const { product_id } = useParams();
//   const { isLoading, error, data } = useQuery(["product", product_id], () =>
//     fetchProductId(product_id)
//   );

//   if (isLoading) return "Loading...";

//   if (error) return "An error has occurred: " + error.message;

//   var selectedProduct = data.Body.List[0];
//   let initialValues = Object.assign(
//     ...Object.keys(selectedProduct).map((key) => ({
//       [key.toLowerCase()]: selectedProduct[key],
//     }))
//   );

//   const groupOption = Object.values(groups).map((c) => (
//     <Option key={c.Id}>{c.Name}</Option>
//   ));

//   const modInputs =
//     !loadingAttributes &&
//     attributes
//       .filter((a) => a.ReferenceTypeId === "")
//       .map((a) => (
//         <Form.Item
//           label={a.Title}
//           name={a.Name}
//           key={a.Id}
//           rules={[
//             {
//               required: a.IsRequired == 1 ? true : false,
//               message: `Zəhmət olmasa, ${a.Title} böləməsini doldurun`,
//             },
//           ]}
//         >
//           <Input allowClear={true} />
//         </Form.Item>
//       ));
//   const modSelects =
//     !loadingAttributes &&
//     attributes
//       .filter((a) => a.ReferenceTypeId != "")
//       .map((a) => (
//         <Form.Item
//           label={a.Title}
//           name={a.Name}
//           key={a.Id}
//           rules={[
//             {
//               required: a.IsRequired == 1 ? true : false,
//               message: `Zəhmət olmasa, ${a.Title} böləməsini doldurun`,
//             },
//           ]}
//         >
//           <Select
//             showSearch
//             allowClear={true}
//             style={{ width: 200 }}
//             id={a.ReferenceTypeId}
//             placeholder=""
//             filterOption={(input, option) =>
//               option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
//             }
//             notFoundContent={<Spin size="small" />}
//           ></Select>
//         </Form.Item>
//       ));
//   panes = [
//     {
//       menuItem: "Qiymet",
//       render: () => (
//         <Tab.Pane className="numberinputsholder" attached={false}>
//           <Form.Item label="BuyPrice" name="buyprice">
//             <Input
//               type="number"
//               step="any"
//               className="hiddenarrows"
//               addonAfter="₼"
//               min={0}
//             />
//           </Form.Item>

//           <Form.Item label="Cost Price" name="costprice">
//             <Input
//               type="number"
//               step="any"
//               className="hiddenarrows"
//               disabled={true}
//               addonAfter="₼"
//               min={0}
//             />
//           </Form.Item>
//           <h5>Satış qiymətləri</h5>
//           <Form.Item label="Product Price" name="price">
//             <Input
//               type="number"
//               step="any"
//               className="hiddenarrows"
//               addonAfter="₼"
//               min={0}
//             />
//           </Form.Item>
//           <Form.Item label="MinPrice" name="minprice">
//             <Input
//               type="number"
//               step="any"
//               className="hiddenarrows"
//               addonAfter="₼"
//               min={0}
//             />
//           </Form.Item>

//           {/* dynamic form starts */}
//           <div className="prices_wrapper">
//             <Spin className="price_wrapper_spinner" spinning={loadingPrices}>
//               {console.log("loadingPrices", loadingPrices)}
//               {console.log("pries", prices)}
//               {!loadingPrices &&
//                 prices.map((c) => (
//                   <div className="price_del_icons">
//                     <Form.Item
//                       key={c.Id}
//                       label={c.Name}
//                       name={"PriceType_" + c.Id}
//                     >
//                       <Input
//                         type="number"
//                         step="any"
//                         className="hiddenarrows"
//                         addonAfter="₼"
//                         min={0}
//                       />
//                     </Form.Item>
//                     <div className="icons_wrapper price_delete_button">
//                       <MinusCircleOutlined
//                         className="dynamic-delete-button "
//                         // onClick={(e) => this.deletePriceTypes(c.Id, e)}
//                       />
//                       <EditOutlined
//                         className="dynamic-delete-button"
//                         // onClick={(e) => this.editPriceTypes(c.Id, c.Name, e)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//             </Spin>
//           </div>
//           {/* dynamic form ends */}
//         </Tab.Pane>
//       ),
//     },
//     {
//       menuItem: "Parametrlər",
//       render: () => (
//         <Tab.Pane loading={true} attached={false}>
//           {modInputs}
//           {modSelects}
//         </Tab.Pane>
//       ),
//     },
//   ];

//   return (
//     <div className="custom_display">
//       <Row>
//         <Col xs={24} md={24} xl={24}>
//           <Form
//             id="myForm"
//             style={{ padding: "0px 20px" }}
//             name="basic"
//             className=""
//             initialValues={initialValues}
//             layout="horizontal"
//           >
//             <Row className="main_form_side">
//               <Col
//                 xs={24}
//                 md={9}
//                 xl={8}
//                 className="left_form_wrapper"
//                 style={{ padding: "10px 20px" }}
//               >
//                 <div
//                   className="ant-row ant-form-item"
//                   style={{ marginBottom: "2.5rem" }}
//                 >
//                   <div className="ant-col ant-col-7 ant-form-item-label">
//                     <h2>Ümumi məlumatlar</h2>
//                   </div>
//                   <div className="ant-col ant-col-12 ant-form-item-label">
//                     <h2></h2>
//                   </div>
//                 </div>

//                 <Form.Item
//                   label="Product Name"
//                   name="name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Zəhmət olmasa, məhsulun adını qeyd edin..",
//                     },
//                   ]}
//                 >
//                   <Input allowClear={true} />
//                 </Form.Item>

//                 <Form.Item label="BarCode" name="barcode" allowClear={true}>
//                   <Input
//                     suffix={
//                       <SyncOutlined
//                         className={"suffixed"}
//                         // onClick={this.onGetBarcode}
//                       />
//                     }
//                   />
//                 </Form.Item>

//                 <Form.Item hidden={true} label="id" name="id">
//                   <Input />
//                 </Form.Item>

//                 <div
//                   style={{
//                     position: "relative",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Form.Item
//                     label="Product GroupName"
//                     name="groupid"
//                     className="group_item_wrapper"
//                     style={{ width: "100%" }}
//                     rules={[
//                       {
//                         required: true,
//                         message: "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
//                       },
//                     ]}
//                   >
//                     <Select
//                       showSearch
//                       className="doc_status_formitem_wrapper_col "
//                       placeholder=""
//                       filterOption={false}
//                       notFoundContent={<Spin size="small" />}
//                     >
//                       {groupOption}
//                     </Select>
//                   </Form.Item>
//                   <PlusOutlined className="custom_add_group_icon addGroupFromProducts" />
//                 </div>

//                 <Form.Item label="ArtCode" name="artcode">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                   <TextArea rows={3} />
//                 </Form.Item>
//                 <Form.Item
//                   label="Weight"
//                   name="isweight"
//                   valuePropName="checked"
//                 >
//                   <Checkbox name="wt"></Checkbox>
//                 </Form.Item>

//                 <Collapse ghost>
//                   <Panel header="Əlavə parametr" key="1">
//                     <Collapse>
//                       <Panel header="Paket (qutu)" key="1">
//                         <Form.Item
//                           label={"Paketli məhsul"}
//                           valuePropName="checked"
//                           name={"ispack"}
//                         >
//                           <Checkbox></Checkbox>
//                         </Form.Item>
//                         <Form.Item
//                           label="Satış qiyməti"
//                           name="packprice"
//                           // onBlur={(e) => this.onChangeItem(e, "packprice")}
//                         >
//                           <InputNumber />
//                         </Form.Item>
//                         <Form.Item
//                           label="Ədəd"
//                           name="packquantity"
//                           // onBlur={(e) => this.onChangeItem(e, "packquantity")}
//                         >
//                           <InputNumber />
//                         </Form.Item>
//                       </Panel>
//                     </Collapse>
//                   </Panel>
//                 </Collapse>
//               </Col>
//               <Col xs={24} md={12} xl={8}>
//                 <div className="tab_wrapper">
//                   <Tab
//                     menu={{ attached: false }}
//                     // onTabChange={this.handleTabChange}
//                     panes={panes}
//                   />
//                 </div>
//               </Col>
//               <Col xs={24} md={24} xl={8}>
//                 {/* <Collapse ghost>
//                     <Panel header="Təyinat" key="1">
//                       <Form.Item
//                         label={"Cavabdeh"}
//                         name="ownerid"
//                         style={{ margin: "0" }}
//                       >
//                         <Select
//                           showSearch
//                           onChange={(e) =>
//                             this.onChangeSelectItem(e, "ownerid")
//                           }
//                           placeholder=""
//                           filterOption={false}
//                           notFoundContent={<Spin size="small" />}
//                           filterOption={(input, option) =>
//                             option.label
//                               .toLowerCase()
//                               .indexOf(input.toLowerCase()) >= 0
//                           }
//                           loading={
//                             this.props.state.groups.loading ? (
//                               <Spin size="small" />
//                             ) : (
//                               ""
//                             )
//                           }
//                           options={ownersOptions}
//                         />
//                       </Form.Item>
//                       <Form.Item
//                         label={"Şöbə"}
//                         name="departmentid"
//                         style={{ margin: "0" }}
//                       >
//                         <Select
//                           showSearch
//                           placeholder=""
//                           onChange={(e) =>
//                             this.onChangeSelectItem(e, "departmentid")
//                           }
//                           notFoundContent={<Spin size="small" />}
//                           filterOption={(input, option) =>
//                             option.label
//                               .toLowerCase()
//                               .indexOf(input.toLowerCase()) >= 0
//                           }
//                           loading={
//                             this.props.state.groups.loading ? (
//                               <Spin size="small" />
//                             ) : (
//                               ""
//                             )
//                           }
//                           options={depOptions}
//                         />
//                       </Form.Item>
//                     </Panel>
//                   </Collapse> */}
//               </Col>
//             </Row>
//           </Form>
//         </Col>
//       </Row>
//     </div>
//   );
// }
