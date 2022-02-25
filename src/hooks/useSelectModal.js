import { Input, Spin, List, Divider } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../api";
import style from "./useSelectModal.css";

export function useSelectModal() {
    const [searchItem, setSearchItem] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [todos, setTodos] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [nameInput, setNameInput] = useState("");
    const [controller, setController] = useState();
    const [title, setTitle] = useState();

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
    };

    const showSelectModal = () => {
        setModalVisible(!modalVisible);
    };
    const fetchData = async () => {
        let res = await sendRequest(controller + "/get.php", {});
        setTodos(res.List);
    };
    const fetchSearchData = async () => {
        setTodos([]);
        let res = await sendRequest(controller + "/get.php", {
            fast: searchItem,
        });
        setTodos(res.List);
    };
    const fetchSearchDataFast = async () => {
        setTodos([]);
        let res = await sendRequest(controller + "/getfast.php", {
            fast: searchItem,
        });
        setTodos(res.List);
    };
    const onClickSelectModal = (cols) => {
        showSelectModal();
        setNameInput(cols.name);
        setController(cols.controller);
        setTitle(cols.label);
        console.log(cols);
    };
    useEffect(() => {
        if (searchItem) {
            const timer = setTimeout(() => {
                if (controller === "products") {
                    fetchSearchDataFast();
                } else {
                    fetchSearchData();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchItem]);
    useEffect(() => {
        if (modalVisible && !todos[0]) {
            fetchData();
        }
    }, [modalVisible]);

    const selectModal = (
        <Modal
            title={title}
            destroyOnClose={true}
            visible={modalVisible}
            onCancel={showSelectModal}
            closable
            footer={false}
        >
            <Input placeholder="Axtar" onChange={handleSearch} />
            {todos[0] ? (
                <List size="small">
                    {todos.map((item) => {
                        const { Id, Name } = item;
                        const onClick = () => {
                            setSelectedItem(item);
                            showSelectModal();
                        };
                        return (
                            <>
                                <List.Item key={Id} onClick={onClick}>
                                    {Name}
                                </List.Item>
                            </>
                        );
                    })}
                </List>
            ) : (
                <Spin />
            )}
        </Modal>
    );

    return { selectModal, selectedItem, nameInput, onClickSelectModal };
}
