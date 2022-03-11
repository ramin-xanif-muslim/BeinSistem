import { Checkbox, Col, Dropdown, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";
import FilterButton from "../components/FilterButton";
import FilterComponent from "../components/FilterComponent";
import { SettingOutlined } from "@ant-design/icons";

export function useFilter(
	isOpen,
	setIsOpen,
	advanced,
	setAdvance,
	form,
	setForm,
    initialfilter,
    setInitialFilter,
    filterChanged,
    setFilterChanged,
	filters,
) {
	const [visibleMenuSettingsFilter, setVisibleMenuSettingsFilter] =
		useState(false);
        useEffect(() => {
            if (filterChanged) setFilterChanged(false);
        }, [filterChanged]);
    
        useEffect(() => {
            setInitialFilter(filters);
        }, []);

	const onChangeMenuFilter = (e) => {
		var initialCols = initialfilter;
		var findelement;
		var findelementindex;
		var replacedElement;
		findelement = initialCols.find((c) => c.dataIndex === e.target.id);
		findelementindex = initialCols.findIndex(
			(c) => c.dataIndex === e.target.id
		);
		findelement.show = e.target.checked;
		replacedElement = findelement;
		initialCols.splice(findelementindex, 1, {
			...findelement,
			...replacedElement,
		});
		setFilterChanged(true);
	};

	const handleVisibleChangeFilter = (flag) => {
		setVisibleMenuSettingsFilter(flag);
	};
	const filtermenus = (
		<Menu>
			<Menu.ItemGroup title="Sutunlar">
				{initialfilter
					? Object.values(initialfilter).map((d) => (
							<Menu.Item key={d.dataIndex}>
								<Checkbox
									id={d.dataIndex}
									onChange={(e) => onChangeMenuFilter(e)}
									defaultChecked={
										Object.values(filters).find(
											(e) => e.dataIndex === d.dataIndex
										).show
									}
								>
									{d.label}
								</Checkbox>
							</Menu.Item>
					  ))
					: null}
			</Menu.ItemGroup>
		</Menu>
	);

	const filterSetting = (
		<Dropdown
			trigger={["click"]}
			overlay={filtermenus}
			onVisibleChange={handleVisibleChangeFilter}
			visible={visibleMenuSettingsFilter}
		>
			<button className="new-button">
				<SettingOutlined />
			</button>
		</Dropdown>
	);

	const filterButton = (
		<FilterButton
			from="stockbalance"
			display={isOpen}
			setdisplay={setIsOpen}
		/>
	);
	const filterComponent = (
		<Row>
			<Col xs={24} md={24} xl={24}>
				<FilterComponent
					from="stockbalance"
					settings={filterSetting}
					cols={filters}
					display={isOpen}
					advanced={advanced}
					setAdvance={setAdvance}
					initialFilterForm={form}
					setInitialFilterForm={setForm}
				/>
			</Col>
		</Row>
	);
	return { filterComponent, filterButton };
}
