import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Alert, Spin } from "antd";
import { Redirect, useParams } from "react-router";
import { useAuth } from "./contexts/AuthContext";
import { useTableCustom } from "./contexts/TableContext";


const Move = React.lazy(() => import("./pages/Move"));
const Product = React.lazy(() => import("./pages/Product"));
const Enter = React.lazy(() => import("./pages/Enter"));
const Loss = React.lazy(() => import("./pages/Loss"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail/index"));
const CustomerDetail = React.lazy(() => import("./pages/CustomerDetail/index"));
const SalePointDetail = React.lazy(() =>
  import("./pages/SalePointDetail/index")
);
const ProductGroupDetail = React.lazy(() =>
  import("./pages/ProductGroupDetail/index")
);
const CustomerGroupDetail = React.lazy(() =>
  import("./pages/CustomerGroupDetail/index")
);
const EnterDetail = React.lazy(() => import("./pages/EnterDetail"));
const SupplyReturnDetail = React.lazy(() =>
  import("./pages/SupplyReturnDetail")
);
const MoveDetail = React.lazy(() => import("./pages/MoveDetail"));
const CustomerOrderDetail = React.lazy(() =>
  import("./pages/CustomerOrderDetail")
);
const StockBalance = React.lazy(() => import("./pages/StockBalance"));
const NewEnter = React.lazy(() => import("./pages/EnterDetail/new"));
const NewSupply = React.lazy(() => import("./pages/SupplyDetail/new"));
const NewSupplyReturn = React.lazy(() =>
  import("./pages/SupplyReturnDetail/new")
);
const NewMove = React.lazy(() => import("./pages/MoveDetail/new"));
const SignIn = React.lazy(() => import("./pages/Auth/Signin"));
const Registration = React.lazy(() => import("./pages/Auth/Registration"));
const NewProduct = React.lazy(() => import("./pages/ProductDetail/new"));
const NewCustomer = React.lazy(() => import("./pages/CustomerDetail/new"));
const SupplyReturnLinked = React.lazy(() =>
  import("./pages/SupplyReturnDetail/linked")
);
const NewProductGroup = React.lazy(() =>
  import("./pages/ProductGroupDetail/new")
);
const NewCustomerGroup = React.lazy(() =>
  import("./pages/CustomerGroupDetail/new")
);
const LossDetail = React.lazy(() => import("./pages/LossDetail"));
const NewLoss = React.lazy(() => import("./pages/LossDetail/new"));
const Supply = React.lazy(() => import("./pages/Supply"));
const Demand = React.lazy(() => import("./pages/Demand"));
const DemandReturn = React.lazy(() => import("./pages/DemandReturn"));
const SupplyDetail = React.lazy(() => import("./pages/SupplyDetail"));
const SupplyReturn = React.lazy(() => import("./pages/SupplyReturn"));
const Sale = React.lazy(() => import("./pages/Sale"));
const Return = React.lazy(() => import("./pages/Return"));
const CreditTransaction = React.lazy(() => import("./pages/CreditTransaction"));
const SalePoint = React.lazy(() => import("./pages/SalePoint"));
const CashOut = React.lazy(() => import("./pages/CashOut"));
const CashIn = React.lazy(() => import("./pages/CashIn"));
const SaleReport = React.lazy(() => import("./pages/SaleReport"));
const Profit = React.lazy(() => import("./pages/Profit"));
const Cashe = React.lazy(() => import("./pages/Cashe"));
const Settlement = React.lazy(() => import("./pages/Settlement"));
const NewSalePoint = React.lazy(() => import("./pages/SalePointDetail/new"));
const Transaction = React.lazy(() => import("./pages/Transaction"));
const Customer = React.lazy(() => import("./pages/Customer"));
const NewDemand = React.lazy(() => import("./pages/DemandDetail/new"));
const DemandDetail = React.lazy(() => import("./pages/DemandDetail"));
const Bc = React.lazy(() => import("./Check.js/bc"));
const Invoice = React.lazy(() => import("./Check.js/invoice"));
const NewDemandReturn = React.lazy(() =>
  import("./pages/DemandReturnDetail/new")
);
const NewPaymentIn = React.lazy(() =>
  import("./pages/TransactionDetail/newpaymentin")
);
const NewInvoiceIns = React.lazy(() =>
  import("./pages/TransactionDetail/newinvoiceins")
);
const NewInvoiceOuts = React.lazy(() =>
  import("./pages/TransactionDetail/newinvoiceouts")
);
const NewPaymentOut = React.lazy(() =>
  import("./pages/TransactionDetail/newpaymentout")
);
const InvoiceInDetail = React.lazy(() => import("./pages/TransactionDetail/indexinvoicein"));
const InvoiceOutDetail = React.lazy(() =>
  import("./pages/TransactionDetail/indexinvoiceout")
);

const PaymentInDetail = React.lazy(() => import("./pages/TransactionDetail"));
const PaymentOutDetail = React.lazy(() =>
  import("./pages/TransactionDetail/indexout")
);

const DemandReturnDetail = React.lazy(() =>
  import("./pages/DemandReturnDetail")
);
const DemandReturnLinked = React.lazy(() =>
  import("./pages/DemandReturnDetail/linked")
);
const CustomerOrders = React.lazy(() => import("./pages/CustomerOrders"));

const NewCustomerOrder = React.lazy(() =>
  import("./pages/CustomerOrderDetail/new")
);
const SaleDetail = React.lazy(() => import("./pages/SaleDetail"));
const Settings = React.lazy(() => import("./pages/Settings"));
const ReturnDetail = React.lazy(() => import("./pages/ReturnDetail"));
function App() {
  const { loggedIn, token, firstLogin } = useAuth();
  const { nav } = useTableCustom();

  return (
    <>
      <React.Suspense
        fallback={
          <Spin className="fetchSpinner" tip="Yüklənir...">
            <Alert />
          </Spin>
        }
      >
        <Router>
          {loggedIn && nav != "none" ? <Navbar /> : ""}

          <div>
            <Switch>
              <Route exact path="/">
                <Redirect to="/p=product" />
              </Route>
              <Route path="/signin" component={SignIn}></Route>
              <Route path="/registration" component={Registration}></Route>
              <Route path="/p=enter" component={Enter}></Route>
              <Route path="/p=supply" component={Supply}></Route>
              <Route path="/p=supplyreturns" component={SupplyReturn}></Route>
              <Route path="/p=demandreturns" component={DemandReturn}></Route>
              <Route path="/p=demand" component={Demand}></Route>
              <Route
                path="/p=customerorders"
                component={CustomerOrders}
              ></Route>
              <Route path="/p=sales" component={Sale}></Route>
              <Route path="/p=profit" component={Profit}></Route>
              <Route path="/p=settlements" component={Settlement}></Route>
              <Route path="/p=salereports" component={SaleReport}></Route>
              <Route path="/p=salepoints" component={SalePoint}></Route>
              <Route path="/p=customer" component={Customer}></Route>
              <Route path="/p=transactions" component={Transaction}></Route>
              <Route path="/p=cashins" component={CashIn}></Route>
              <Route exact path="/bc" component={Bc} />
              <Route exact path="/invoice" component={Invoice} />
              <Route path="/settings" component={Settings}></Route>
              <Route path="/p=cashes" component={Cashe}></Route>
              <Route path="/p=cashouts" component={CashOut}></Route>
              <Route path="/p=returns" component={Return}></Route>
              <Route
                path="/p=credittransaction"
                component={CreditTransaction}
              ></Route>
              <Route path="/p=loss" component={Loss}></Route>
              <Route path="/editEnter/:doc_id" component={EnterDetail}></Route>
              <Route path="/editSale/:doc_id" component={SaleDetail}></Route>
              <Route
                path="/editReturn/:doc_id"
                component={ReturnDetail}
              ></Route>
              <Route
                path="/editSupply/:doc_id"
                component={SupplyDetail}
              ></Route>
              <Route
                path="/editCustomerOrder/:doc_id"
                component={CustomerOrderDetail}
              ></Route>

              <Route
                path="/editDemand/:doc_id"
                component={DemandDetail}
              ></Route>
              <Route
                path="/editInvoiceIn/:doc_id"
                component={InvoiceInDetail}
              ></Route>
              <Route
                path="/editInvoiceOut/:doc_id"
                component={InvoiceOutDetail}
              ></Route>
              <Route
                path="/editPaymentIn/:doc_id"
                component={PaymentInDetail}
              ></Route>
              <Route
                path="/editPaymentOut/:doc_id"
                component={PaymentOutDetail}
              ></Route>
              <Route
                path="/editSupplyReturn/:doc_id"
                component={SupplyReturnDetail}
              ></Route>
              <Route
                path="/editDemandReturn/:doc_id"
                component={DemandReturnDetail}
              ></Route>
              <Route
                path="/editSupplyReturnLinked"
                render={(props) => <SupplyReturnLinked {...props} />}
              />
              <Route
                path="/editDemandReturnLinked"
                render={(props) => <DemandReturnLinked {...props} />}
              />
              <Route path="/editMove/:doc_id" component={MoveDetail}></Route>
              <Route path="/editLoss/:doc_id" component={LossDetail}></Route>
              <Route
                path="/editProduct/:product_id"
                component={ProductDetail}
              ></Route>
              <Route
                path="/editCustomer/:cus_id"
                component={CustomerDetail}
              ></Route>
              <Route
                path="/editSalePoint/:slpnt_id"
                component={SalePointDetail}
              ></Route>
              <Route
                path="/editProductGroup/:progr_id"
                component={ProductGroupDetail}
              ></Route>
              <Route
                path="/editCustomerGroup/:cusgr_id"
                component={CustomerGroupDetail}
              ></Route>
              <Route path="/newenter" component={NewEnter}></Route>
              <Route
                path="/newsupplyreturn"
                component={NewSupplyReturn}
              ></Route>
              <Route
                path="/newdemandreturn"
                component={NewDemandReturn}
              ></Route>
              <Route path="/newsupply" component={NewSupply}></Route>
              <Route path="/newpaymentin" component={NewPaymentIn}></Route>
              <Route path="/newinvoicein" component={NewInvoiceIns}></Route>
              <Route path="/newinvoiceout" component={NewInvoiceOuts}></Route>
              <Route path="/newsalepoint" component={NewSalePoint}></Route>
              <Route path="/newpaymentout" component={NewPaymentOut}></Route>
              <Route path="/newdemand" component={NewDemand}></Route>
              <Route path="/newmove" component={NewMove}></Route>
              <Route path="/newloss" component={NewLoss}></Route>
              <Route path="/newproduct" component={NewProduct}></Route>
              <Route path="/newcustomer" component={NewCustomer}></Route>
              <Route
                path="/newcustomerorders"
                component={NewCustomerOrder}
              ></Route>
              <Route path="/newprogroup" component={NewProductGroup}></Route>
              <Route path="/newcusgroup" component={NewCustomerGroup}></Route>
              <Route path="/p=loss" component={Loss}></Route>
              <Route path="/p=stockbalance" component={StockBalance}></Route>
              <Route path="/p=product" component={Product}></Route>
              <Route path="/p=move" component={Move}></Route>
            </Switch>
          </div>

          {loggedIn && token && firstLogin ? (
            <Redirect to={"/p=enter"} />
          ) : loggedIn && token && !firstLogin ? (
            ""
          ) : (
            <Redirect to={"/signin"} />
          )}
        </Router>
      </React.Suspense>
    </>
  );
}

export default App;
