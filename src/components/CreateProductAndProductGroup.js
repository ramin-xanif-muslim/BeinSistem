import React from "react";
import { Modal } from "antd";
import ProductForDoc from "../modal/ProductForDoc";
import Trans from "../usetranslation/Trans";
import "./modal.css";

const CreateProductAndProductGroup = (props) => {
  return (
    <div>
      <Modal
        title={"Product"}
        visible={true}
        closable={true}
        // onCancel={props.closeCtalaogGancel}
        footer={[]}
      >
        <ProductForDoc
        //   onOk={props.closeCtalaog}
        //   onGancel={props.closeCtalaogGancel}
          fetching={props.state.docmodals.fetching}
        />
      </Modal>
    </div>
  );
};

export default CreateProductAndProductGroup
