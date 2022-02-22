import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext()

const FilterProvider = ({ children }) => {
    const [isOpenEnterFilter, setIsOpenEnterFilter] = useState("none")
    const [isOpenLossFilter, setIsOpenLossFilter] = useState("none")
    const [isOpenMoveFilter, setIsOpenMoveFilter] = useState("none")
    const [isOpenStockBalanceFilter, setIsOpenStockBalanceFilter] = useState("none")
    const [isOpenSupplyFilter, setIsOpenSupplyFilter] = useState("none")
    const [isOpenSupplyReturnFilter, setIsOpenSupplyReturnFilter] = useState("none")
    const [isOpenDemandFilter, setIsOpenDemandFilter] = useState("none")
    const [isOpenDemandReturnFilter, setIsOpenDemandReturnFilter] = useState("none")
    const [isOpenCustomerOrderFilter, setIsOpenCustomerOrderFilter] = useState("none")
    const [isOpenCustomerFilter, setIsOpenCustomerFilter] = useState("none")
    const [isOpenTransactionFilter, setIsOpenTransactionFilter] = useState("none")
    const [isOpenSettlementFilter, setIsOpenSettlementFilter] = useState("none")
    const [isOpenHandoverToFilter, setIsOpenHandoverToFilter] = useState("none")
    const [isOpenHandoverFromFilter, setIsOpenHandoverFromFilter] = useState("none")
    const [isOpenMoneytransferFilter, setIsOpenMoneytransferFilter] = useState("none")
    const [isOpenSaleFilter, setIsOpenSaleFilter] = useState("none")
    const [isOpenReturnFilter, setIsOpenReturnFilter] = useState("none")
    const [isOpenCreditTransactionFilter, setIsOpenCreditTransactionFilter] = useState("none")
    const [isOpenCashInFilter, setIsOpenCashInFilter] = useState("none")
    const [isOpenCashOutFilter, setIsOpenCashOutFilter] = useState("none")
    const [isOpenSaleReportFilter, setIsOpenSaleReportFilter] = useState("none")
    const [isOpenProfitFilter, setIsOpenProfitFilter] = useState("none")
    const [isOpenProductTransactionFilter, setIsOpenProductTransactionFilter] = useState("none")
    const [isOpenProductFilter, setIsOpenProductFilter] = useState("none")
    const values = {
        isOpenProductFilter,
        setIsOpenProductFilter,
        isOpenProductTransactionFilter,
        setIsOpenProductTransactionFilter,
        isOpenProfitFilter,
        setIsOpenProfitFilter,
        isOpenSaleReportFilter,
        setIsOpenSaleReportFilter,
        isOpenCashOutFilter,
        setIsOpenCashOutFilter,
        isOpenCashInFilter,
        setIsOpenCashInFilter,
        isOpenCreditTransactionFilter,
        setIsOpenCreditTransactionFilter,
        isOpenReturnFilter,
        setIsOpenReturnFilter,
        isOpenSaleFilter,
        setIsOpenSaleFilter,
        isOpenMoneytransferFilter,
        setIsOpenMoneytransferFilter,
        isOpenHandoverFromFilter,
        setIsOpenHandoverFromFilter,
        isOpenHandoverToFilter,
        setIsOpenHandoverToFilter,
        isOpenSettlementFilter,
        setIsOpenSettlementFilter,
        isOpenTransactionFilter,
        setIsOpenTransactionFilter,
        isOpenCustomerFilter,
        setIsOpenCustomerFilter,
        isOpenCustomerOrderFilter,
        setIsOpenCustomerOrderFilter,
        isOpenDemandReturnFilter,
        setIsOpenDemandReturnFilter,
        isOpenDemandFilter,
        setIsOpenDemandFilter,
        isOpenSupplyReturnFilter,
        setIsOpenSupplyReturnFilter,
        isOpenSupplyFilter,
        setIsOpenSupplyFilter,
        isOpenStockBalanceFilter,
        setIsOpenStockBalanceFilter,
        isOpenMoveFilter,
        setIsOpenMoveFilter,
        isOpenLossFilter,
        setIsOpenLossFilter,
        isOpenEnterFilter,
        setIsOpenEnterFilter,
    }

    return <FilterContext.Provider value={values}>{children}</FilterContext.Provider>
}

const useFilterContext = () => useContext(FilterContext)

export { FilterProvider, useFilterContext}