import React, { useState } from "react";
import Catalog from "../components/Catalog";
import { useTableCustom } from "../contexts/TableContext";

function withCatalog(Component) {
	return (props) => {
		const { outerDataSource } = useTableCustom();

		const [catalogVisible, setCatalogVisible] = useState(false);
		const [selectList, setSelectList] = useState([]);

		const handleOpenCatalog = (selectList) => {
			setCatalogVisible(!catalogVisible);
			setSelectList(selectList);
		};
		return (
			<div>
				<Component
					{...props}
                    handleOpenCatalog={handleOpenCatalog}
					selectList={selectList}
					catalogVisible={catalogVisible}
				/>

				<Catalog
					onClose={handleOpenCatalog}
					positions={outerDataSource}
					isCatalogVisible={catalogVisible}
				/>
			</div>
		);
	};
}

export default withCatalog;
