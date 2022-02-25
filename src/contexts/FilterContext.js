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
    const [isOpenDocumentFilter, setIsOpenDocumentFilter] = useState("none")

    const [advacedEnter, setAdvaceEnter] = useState({})
    const [formEnter, setFormEnter] = useState({})
    const [advacedLoss, setAdvaceLoss] = useState({})
    const [formLoss, setFormLoss] = useState({})
    const [advacedMove, setAdvaceMove] = useState({})
    const [formMove, setFormMove] = useState({})
    const [advacedStockBalance, setAdvaceStockBalance] = useState({})
    const [formStockBalance, setFormStockBalance] = useState({})
    const [advacedSupply, setAdvaceSupply] = useState({})
    const [formSupply, setFormSupply] = useState({})
    const [advacedSupplyReturn, setAdvaceSupplyReturn] = useState({})
    const [formSupplyReturn, setFormSupplyReturn] = useState({})
    const [advacedDemand, setAdvaceDemand] = useState({})
    const [formDemand, setFormDemand] = useState({})
    const [advacedDemandReturn, setAdvaceDemandReturn] = useState({})
    const [formDemandReturn, setFormDemandReturn] = useState({})
    const [advacedCustomerOrder, setAdvaceCustomerOrder] = useState({})
    const [formCustomerOrder, setFormCustomerOrder] = useState({})
    const [advacedProduct, setAdvaceProduct] = useState({})
    const [formProduct, setFormProduct] = useState({})
    const [advacedDocument, setAdvaceDocument] = useState({})
    const [formDocument, setFormDocument] = useState({})
    const [advacedCustomer, setAdvaceCustomer] = useState({})
    const [formCustomer, setFormCustomer] = useState({})
    const [advacedTransaction, setAdvaceTransaction] = useState({})
    const [formTransaction, setFormTransaction] = useState({})
    const [advacedSettlement, setAdvaceSettlement] = useState({})
    const [formSettlement, setFormSettlement] = useState({})
    const [advacedHandoverTo, setAdvaceHandoverTo] = useState({})
    const [formHandoverTo, setFormHandoverTo] = useState({})
    const [advacedHandoverFrom, setAdvaceHandoverFrom] = useState({})
    const [formHandoverFrom, setFormHandoverFrom] = useState({})
    const [advacedMoneytransfer, setAdvaceMoneytransfer] = useState({})
    const [formMoneytransfer, setFormMoneytransfer] = useState({})
    const [advacedSale, setAdvaceSale] = useState({})
    const [formSale, setFormSale] = useState({})
    const [advacedReturn, setAdvaceReturn] = useState({})
    const [formReturn, setFormReturn] = useState({})
    const [advacedCreditTransaction, setAdvaceCreditTransaction] = useState({})
    const [formCreditTransaction, setFormCreditTransaction] = useState({})
    const [advacedCashIn, setAdvaceCashIn] = useState({})
    const [formCashIn, setFormCashIn] = useState({})
    const [advacedCashOut, setAdvaceCashOut] = useState({})
    const [formCashOut, setFormCashOut] = useState({})
    const [advacedSaleReport, setAdvaceSaleReport] = useState({})
    const [formSaleReport, setFormSaleReport] = useState({})
    const [advacedProfit, setAdvaceProfit] = useState({})
    const [formProfit, setFormProfit] = useState({})
    const [advacedProductTransactions, setAdvaceProductTransactions] = useState({})
    const [formProductTransactions, setFormProductTransactions] = useState({})

    const values = {
        advacedProductTransactions,
        setAdvaceProductTransactions,
        formProductTransactions,
        setFormProductTransactions,
        advacedProfit,
        setAdvaceProfit,
        formProfit,
        setFormProfit,
        advacedSaleReport,
        setAdvaceSaleReport,
        formSaleReport,
        setFormSaleReport,
        advacedCashOut,
        setAdvaceCashOut,
        formCashOut,
        setFormCashOut,
        advacedCashIn,
        setAdvaceCashIn,
        formCashIn,
        setFormCashIn,
        advacedCreditTransaction,
        setAdvaceCreditTransaction,
        formCreditTransaction,
        setFormCreditTransaction,
        advacedReturn,
        setAdvaceReturn,
        formReturn,
        setFormReturn,
        advacedSale,
        setAdvaceSale,
        formSale,
        setFormSale,
        advacedMoneytransfer,
        setAdvaceMoneytransfer,
        formMoneytransfer,
        setFormMoneytransfer,
        advacedHandoverFrom,
        setAdvaceHandoverFrom,
        formHandoverFrom,
        setFormHandoverFrom,
        advacedHandoverTo,
        setAdvaceHandoverTo,
        formHandoverTo,
        setFormHandoverTo,
        advacedSettlement,
        setAdvaceSettlement,
        formSettlement,
        setFormSettlement,
        advacedTransaction,
        setAdvaceTransaction,
        formTransaction,
        setFormTransaction,
        advacedCustomer,
        setAdvaceCustomer,
        formCustomer,
        setFormCustomer,
        advacedDocument,
        setAdvaceDocument,
        formDocument,
        setFormDocument,
        advacedProduct,
        setAdvaceProduct,
        formProduct,
        setFormProduct,
        advacedCustomerOrder,
        setAdvaceCustomerOrder,
        formCustomerOrder,
        setFormCustomerOrder,
        advacedDemandReturn,
        setAdvaceDemandReturn,
        formDemandReturn,
        setFormDemandReturn,
        advacedDemand,
        setAdvaceDemand,
        formDemand,
        setFormDemand,
        advacedSupplyReturn,
        setAdvaceSupplyReturn,
        formSupplyReturn,
        setFormSupplyReturn,
        advacedSupply,
        setAdvaceSupply,
        formSupply,
        setFormSupply,
        advacedStockBalance,
        setAdvaceStockBalance,
        formStockBalance,
        setFormStockBalance,
        advacedMove,
        setAdvaceMove,
        formMove,
        setFormMove,
        advacedLoss,
        setAdvaceLoss,
        formLoss,
        setFormLoss,
        advacedEnter,
        setAdvaceEnter,
        formEnter,
        setFormEnter,

        isOpenDocumentFilter,
        setIsOpenDocumentFilter,
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