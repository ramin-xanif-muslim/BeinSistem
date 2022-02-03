import React, { useState } from "react";
import TreeView from "../components/TreeView";
import { fetchStocks, fetchProductFolders } from "../api";
import { Button } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

function withTreeViewModal(Component, from) {
	return (props) => {
        const [modalVisible, setModalVisible] = useState(false);
        const [stockId, setStockId] = useState([]);
        
        const handleClick = () => {
            setModalVisible(!modalVisible);
        };
        const bntOpenTreeViewModal =  <Button
            className="add-stock-btn"
            onClick={handleClick}
        >
            <CaretDownOutlined />
        </Button>

		return (
			<>
				<Component 
                {...props} 
                stockId={stockId}
                setStockId={setStockId}
                bntOpenTreeViewModal={bntOpenTreeViewModal}
                groupId={stockId}
                setGroupId={setStockId}
                
                 />
				<TreeView
					from={ from ? from : "stocks" }
					modalVisible={modalVisible}
					setGroupId={setStockId}
					onClose={handleClick}
					fetchGroup={ from === "products" ? fetchProductFolders : fetchStocks } 
				/>
			</>
		);
	};
}

export default withTreeViewModal;
