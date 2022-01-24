import React, { useEffect, useState } from "react";
import { Checkbox, Menu } from "antd";

function withSettings(Component, columns) {
	return (props) => {
		const [initial, setInitial] = useState(null);
		const [columnChange, setColumnChange] = useState(false);
		const [visibleMenuSettings, setVisibleMenuSettings] = useState(false);

		const handleVisibleChange = (flag) => {
			setVisibleMenuSettings(flag);
		};

		const onChangeMenu = (e) => {
			var initialCols = initial;
			var findelement;
			var findelementindex;
			var replacedElement;
			findelement = initialCols.find((c) => c.dataIndex === e.target.id);
			console.log(findelement);
			findelementindex = initialCols.findIndex(
				(c) => c.dataIndex === e.target.id
			);
			findelement.isVisible = e.target.checked;
			replacedElement = findelement;
			initialCols.splice(findelementindex, 1, {
				...findelement,
				...replacedElement,
			});
			setColumnChange(true);
		};

		const menu = (
			<Menu>
				<Menu.ItemGroup title="Sutunlar">
					{Object.values(columns).map((d) => (
						<Menu.Item key={d.dataIndex}>
							<Checkbox
								id={d.dataIndex}
								disabled={
									columns.length === 3 && d.isVisible === true
										? true
										: false
								}
								isVisible={d.isVisible}
								onChange={(e) => onChangeMenu(e)}
								defaultChecked={d.isVisible}
							>
								{d.title}
							</Checkbox>
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			</Menu>
		);

		useEffect(() => {
			setColumnChange(false);
		}, [columnChange]);

		useEffect(() => {
			setInitial(columns);
		}, []);

		return (
			<div>
				<Component {...props} />
			</div>
		);
	};
}

export default withSettings;
