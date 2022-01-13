import React from "react";
import { Modal, Button } from "antd";
import ProductListForMobile from "./ProductListForMobile";
import { ArrowLeftOutlined } from "@ant-design/icons";
// import "./modal.css";
// import "./selectCatalog.css";

const SelectProductCatalog = ({ isSelectProductCatalog, setIsSelectProductCatalog, from }) => {
  return (
    <div>
      <Modal
        title={"Məhsul"}
        visible={isSelectProductCatalog}
        closable={true}
        className="mobile_catalog_modal"
        onCancel={() => setIsSelectProductCatalog(false)}
        footer={[
          <Button
            className="buttons_icon back_doc_mobile"
            icon={<ArrowLeftOutlined />}
            key="back"
            onClick={() => setIsSelectProductCatalog(false)}
          >
            Sənədə əlavə et
          </Button>,
        ]}
      >
        <ProductListForMobile from={from} />
      </Modal>
    </div>
  );
};

export default SelectProductCatalog
