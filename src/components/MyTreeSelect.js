import React, { useState } from "react";
import { TreeSelect } from "antd";
import { sendRequest } from "../api";

const treeData = [
	{
		title: "Node1",
		value: "0-0",
		children: [
			{
				title: "Child Node1",
				value: "0-0-1",
			},
			{
				title: "Child Node2",
				value: "0-0-2",
			},
		],
	},
	{
		title: "Node2",
		value: "0-1",
	},
];

function MyTreeSelect() {
	const [state, setState] = useState();
	// const [treeData, setTreeData] = useState();
    const [stocks, setStocks] = useState()

	const onChange = (value) => {
		console.log(value);
		setState(value);
	};

    const fetchStocks = async () => {
        let res  = await sendRequest("stocks/get.php",{})
        setStocks(res.List)
    }
    // if(stocks > 0) {
    //     Object.values(stocks).map((d) => {
    //       d.ParentId === "00000000-0000-0000-0000-000000000000"
    //         ? (pid = "")
    //         : (pid = d.ParentId);
    //       datas.push({
    //         id: d.Id,
    //         name: d.Name,
    //         parent: pid,
    //         title: d.Name,
    //         key: d.Id,
    //         icon:
    //           from === "catalog" ? null : (
    //             <EditOutlined
    //               onClick={(e) => handleEdit(e, d.Id)}
    //               className="editGr"
    //             />
    //           ),
    //       });
    //     });
    //     convertedDatas = convert(datas);
    // }
	return (
		<TreeSelect
			onFocus={fetchStocks}
			style={{ width: "100%" }}
			value={state}
			dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
			treeData={treeData}
			placeholder="Please select"
			treeDefaultExpandAll
			onChange={onChange}
		/>
	);
}

export default MyTreeSelect;
