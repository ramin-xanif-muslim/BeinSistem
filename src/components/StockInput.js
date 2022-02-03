import { Select } from "antd";
import React, { useState } from "react";
import TreeView from "./TreeView";

const { Option } = Select;

function StockInput({ objStock, onChange, modalVisible, setModalVisible, setStockId, fetchStocks }) {
	const options = objStock.map((m) => (
		<Option key={m.Id} value={m.Id}>
			{m.Name}
		</Option>
	));
	return (
		<>
			<Select
				showSearch
				showArrow={false}
				filterOption={false}
				onChange={onChange}
				className="customSelect detail-select"
				allowClear={true}
				filterOption={(input, option) =>
					option.children
						.toLowerCase()
						.indexOf(input.toLowerCase()) >= 0
				}
			>
				{options}
			</Select>
			<TreeView
				from={"stocks"}
				modalVisible={modalVisible}
				setGroupId={setStockId}
				onClose={() => setModalVisible(!modalVisible)}
				fetchGroup={fetchStocks}
			/>
		</>
	);
}

export default StockInput;
