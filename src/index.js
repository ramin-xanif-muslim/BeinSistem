import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "antd/dist/antd.css";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import "./Navbar.css";
import "./Page.css";
import "./Group.css";
//contexts
import { AuthProvider } from "./contexts/AuthContext";
import { TableProvider } from "./contexts/TableContext";
import { MyFormProvider } from "./contexts/FormContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
        },
    },
});
ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TableProvider>
                    <MyFormProvider>
                        <App />
                    </MyFormProvider>
                </TableProvider>
            </AuthProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
