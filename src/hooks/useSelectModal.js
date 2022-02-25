import { Input, Spin, List } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../api";
import "./SelectModal.css";

export function useSelectModal() {
	const [searchItem, setSearchItem] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [todos, setTodos] = useState([]);
	const [selectedItem, setSelectedItem] = useState();
	const [activeId, setActiveId] = useState();
	const [nameInput, setNameInput] = useState("");
	const [controller, setController] = useState();
	const [title, setTitle] = useState();
	const [isInputEnterValue, setIsInputEnterValue] = useState(false);

	const handleSearch = (e) => {
		setSearchItem(e.target.value);
        setIsInputEnterValue(true)
	};

	const showSelectModal = () => {
		setModalVisible(!modalVisible);
	};
	const fetchData = async () => {
        setIsLoading(true)
		let res = await sendRequest(controller + "/get.php", {});
		setTodos(res.List);
        setIsLoading(false)
	};
	const fetchSearchDataFast = async () => {
        setIsLoading(true)
		setTodos([]);
		let res = await sendRequest(controller + "/getfast.php", {
			fast: searchItem,
            lm: 100,
		});
		setTodos(res.List);
        setIsLoading(false)
	};
	const onClickSelectModal = (cols) => {
        if(controller !== cols.controller) {
            setTodos([0])
        }
		showSelectModal();
		setNameInput(cols.name);
		setController(cols.controller);
		setTitle(cols.label);
		console.log(cols);
	};
	useEffect(() => {
		if (searchItem) {
			const timer = setTimeout(() => {
                fetchSearchDataFast();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [searchItem]);
	useEffect(() => {
		if (modalVisible && !todos[0]) {
			fetchData();
		}
	}, [modalVisible]);
	useEffect(() => {
	    if (isInputEnterValue && searchItem === '') {
	        fetchData();
	    }
	}, [searchItem, isInputEnterValue]);

	const selectModal = (
		<Modal
			title={title}
			destroyOnClose={true}
			visible={modalVisible}
			onCancel={showSelectModal}
			closable
			footer={false}
		>
			<Input
				placeholder="Axtar"
				onChange={handleSearch}
				allowClear
				onClear={() => console.log("aaa")}
			/>
            {isLoading && <Spin/>}
			{todos[0] ? (
				<List size="small">
					{todos.map((item) => {
						const { Id, Name } = item;
						const onClick = () => {
							setSelectedItem(item);
							showSelectModal();
							setActiveId(item.Id);
						};
						return (
							<>
								<List.Item
									key={Id}
									onClick={onClick}
									style={
										activeId === Id
											? { backgroundColor: "#d9eefc" }
											: null
									}
								>
									{Name}
								</List.Item>
							</>
						);
					})}
				</List>
			) :
            !isLoading && <List.Item>{title} tapilmadi...</List.Item>
			}
		</Modal>
	);

	return { selectModal, selectedItem, nameInput, onClickSelectModal };
}
