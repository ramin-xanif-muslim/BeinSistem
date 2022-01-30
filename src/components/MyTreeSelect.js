import React, { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import { sendRequest } from "../api";
import { TreeNode } from "antd/lib/tree-select";

// const treeData = [
// 	{
// 		title: "Node1",
// 		value: "0-0",
// 		children: [
// 			{
// 				title: "Child Node1",
// 				value: "0-0-1",
// 			},
// 			{
// 				title: "Child Node2",
// 				value: "0-0-2",
// 			},
// 		],
// 	},
// 	{
// 		title: "Node2",
// 		value: "0-1",
// 	},
// ];

function MyTreeSelect() {
	const [state, setState] = useState();
	const [treeData, setTreeData] = useState([]);
	const [stocks, setStocks] = useState([]);
	const [parentId, setParentId] = useState([]);

	const onChange = (value) => {
		console.log(value);
		setState(value);
	};

	const fetchStocks = async () => {
		let res = await sendRequest("stocks/get.php", {});
		setStocks(res.List);
	};
	useEffect(() => {
		fetchStocks();
	}, []);
	useEffect(() => {
		if (stocks) {
			stocks.map((s) => {
				if (s.ParentId === "00000000-0000-0000-0000-000000000000") {
					setTreeData([
						...treeData,
						{
							title: s.Name,
							value: s.Id,
						},
					]);
					console.log(treeData);
				}
				if (s.ParentId !== "00000000-0000-0000-0000-000000000000") {
					for (var i = 0; i < parentId.length; i++) {
						if (parentId[i] !== s.ParentId) {
							setParentId([...parentId, s.ParentId]);
							setTreeData([
								...treeData,
								{
									title: s.Name,
									value: s.Id,
								},
							]);
							console.log(treeData);
						}
						if (parentId[i] === s.ParentId) {
							setTreeData([
								...treeData,
								{
									title: s.Name,
									value: s.ParentId,
									children: [
										{
											title: s.Name,
											value: s.Id,
										},
									],
								},
							]);
							console.log(treeData);
						}
					}
				}
			});
		}
		console.log(treeData);
	}, []);
    let pid
    let datas = []
    if (stocks.length > 0) {
        stocks.map((d) => {
        d.ParentId === "00000000-0000-0000-0000-000000000000"
          ? (pid = "")
          : (pid = d.ParentId);
        datas.push({
          id: d.Id,
          name: d.Name,
          parent: pid,
          title: d.Name,
          key: d.Id,
        });
      });
    }
	return (
		<TreeSelect
			// onFocus={fetchStocks}
			style={{ width: "100%" }}
			value={state}
			dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
			treeData={datas}
			placeholder="Please select"
			treeDefaultExpandAll
			onChange={onChange}
		 />
	);
}

export default MyTreeSelect;
