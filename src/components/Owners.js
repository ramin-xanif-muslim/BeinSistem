import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Checkbox, Table } from "antd";
import {
	fetchOwners,
	delOwner,
	updateOwner,
	fetchSalePoints,
	fetchDepartments,
	fetchPermissionId,
	updatePermission,
	fetchStocks,
} from "../api";
import { Redirect } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTableCustom } from "../contexts/TableContext";
import {
	Form,
	Input,
	Button,
	Popconfirm,
	Select,
	Switch,
	Modal,
	message,
	Spin,
} from "antd";
import {
	DeleteOutlined,
	PlusOutlined,
	CloseCircleOutlined,
	EditOutlined,
	SafetyOutlined,
	KeyOutlined,
} from "@ant-design/icons";
const { Option } = Select;
var patName = /^([a-zA-Z]{4,})?$/;
var pat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export default function Owners() {
	const [show, setShow] = useState(false);
	const [showPermission, setShowPermission] = useState(false);
	const [spendid, setSpendId] = useState(null);
	const [documentList, setDocumentList] = useState(null);
	const [edit, setEdit] = useState(null);
	const [editpermission, setEditPermission] = useState(null);
	const [salepoints, setSalePoints] = useState(null);
	const [update, setUpdate] = useState(true);
	const [permission, setPermission] = useState(null);
	const [permissionload, setPermissionLoad] = useState(false);
	const [isUpdatePage, setIsUpdatePage] = useState(false);
	const [companyName, setCompanyName] = useState(false);
	const [saler, setSaler] = useState();
	const [stocks, setStocks] = useState();
	const [activeBtn, setActiveBtn] = useState();
	const queryClient = useQueryClient();
	const { departments, setDepartments, setDepartmentsLocalStorage } =
		useTableCustom();
	const { isLoading, error, data, isFetching } = useQuery(
		departments && [("owner", { departments, update })],
		() => fetchOwners()
	);
	const updatePage = async () => {
		if (isUpdatePage) {
			let res = await fetchOwners();
			setDocumentList(res.Body.List);
			setIsUpdatePage(false);
		}
	};

	useEffect(() => {
		setCompanyName(JSON.parse(localStorage.getItem("user")).Login.slice(6));
		console.log("companyName", companyName);
		getDepartments();
	}, [companyName]);
	useEffect(async () => {
		updatePage();
	}, [isUpdatePage]);

	const getDepartments = async () => {
		const depResponse = await fetchDepartments();
		setDepartments(depResponse.Body.List);
		setDepartmentsLocalStorage(depResponse.Body.List);
	};

	const getPermission = async (id) => {
		const perResponse = await fetchPermissionId(id);
		setPermission(perResponse.Body);
		getSalePoints();
	};

	const getSalePoints = async () => {
		const saleResponse = await fetchSalePoints();
		setSalePoints(saleResponse.Body.List);
		setPermissionLoad(false);
	};
	const deleteMutation = useMutation(delOwner, {
		refetchQueris: ["owner", { departments }],
	});

	const updateMutation = useMutation(updateOwner, {
		refetchQueris: ["owner", { departments }],
	});
	const onClose = () => {
		message.destroy();
	};

	useEffect(() => {
		if (!isFetching) {
			setDocumentList(Object.values(data.Body.List));
		} else {
			setDocumentList([]);
		}
	}, [isFetching]);

	const handleEdit = (row) => {
		setEdit(row);
		setShow(true);
	};

	const handleOpenPermission = (row) => {
		setSaler(row.Saler);
		setActiveBtn(Number(row.Saler));
		setUpdate(false);
		setPermissionLoad(true);
		setEditPermission(row);
		setShowPermission(true);
		getPermission(row.Id);
	};

	const delOwners = (id, e) => {
		e.preventDefault();
		e.stopPropagation();
		message.loading({ content: "Yüklənir...", key: "doc_del" });
		deleteMutation.mutate(id, {
			onSuccess: (res) => {
				if (res.Headers.ResponseStatus === "0") {
					message.success({
						content: "Dəyişildi",
						key: "doc_del",
						duration: 2,
					});
					queryClient.invalidateQueries("owner");
				} else {
					message.error({
						content: (
							<span className="error_mess_wrap">
								Saxlanılmadı... {res.Body}{" "}
								{<CloseCircleOutlined onClick={onClose} />}
							</span>
						),
						key: "doc_del",
						duration: 0,
					});
				}
			},
			onError: (e) => {
				console.log(e);
			},
		});
		//   deleteSpendItems(delAttr, id);
	};

	var objDep;
	departments
		? (objDep = departments)
		: (objDep = JSON.parse(localStorage.getItem("departments")));

	const depOptions = Object.values(objDep).map((c) => (
		<Option key={c.Id}>{c.Name}</Option>
	));

	const slpntOptions = salepoints
		? Object.values(salepoints).map((c) => (
				<Option key={c.Id}>{c.Name}</Option>
		  ))
		: null;

	useEffect(async() => {
		let res = await fetchStocks();
		setStocks(res.Body.List);
	}, []);
    const stockoptions = stocks 
    ? Object.values(stocks).map((c) => (
            <Option key={c.Id}>{c.Name}</Option>
      ))
    : null;

	const columns = useMemo(() => {
		return [
			{
				title: "№",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 100 * 0,
			},
			{
				dataIndex: "Name",
				title: "Ad və ya Soyad",
			},

			{
				dataIndex: "Login",
				title: "İstifadəçi adı",
				render: (value, row, index) => {
					if (value === "kassa") {
						if (companyName) {
							return "kassa@" + companyName;
						}
					} else {
						return "admin@" + value;
					}
				},
			},
			{
				dataIndex: "Description",
				title: "Şərh",
			},
			{
				dataIndex: "DepartmentId",
				title: "Bağlı olduğu şöbənin adı",
				render: (value, row, index) => {
					return objDep.find((m) => m.Id === value)
						? objDep.find((m) => m.Id === value).Name
						: null;
				},
			},
			{
				dataIndex: "PermissionIcon",
				title: "İcazələr",
				render: (value, row, index) => {
                    if(row.Name === 'Administrator') {
                        return null
                    }
					return (
						<SafetyOutlined
							style={{ color: "green" }}
							onClick={() => handleOpenPermission(row)}
						/>
					);
				},
			},
			{
				dataIndex: "Edit",
				title: "Redaktə et",
				render: (value, row, index) => {
					return (
						<EditOutlined
							style={{ color: "var(--dark-blue)" }}
							onClick={() => handleEdit(row)}
						/>
					);
				},
			},
			{
				dataIndex: "Delete",
				title: "Sil",
				render: (value, row, index) => {
					return (
						<Popconfirm
							onConfirm={(e) => delOwners(row.Id, e)}
							title="Əminsiniz？"
							okText="Bəli"
							cancelText="Xeyr"
						>
							<DeleteOutlined />
						</Popconfirm>
					);
				},
			},
		];
	}, []);

	const handleOk = () => {
		// this.setState({ visible: false });
	};

	const handleOkPermission = () => {
		// this.setState({ visible: false });
	};

	const handleCancel = () => {
		setShow(false);
		setEdit(null);
	};
	const handleCancelPermission = () => {
		setShowPermission(false);
		setEditPermission(null);
	};

	const onFinishPermission = async (values) => {
		message.loading({ content: "Yüklənir...", key: "doc_update" });
		values.saler = saler;
		const response = await updatePermission(values);
		if (response.Headers.ResponseStatus === "0") {
			message.success({
				content: "Dəyişildi",
				key: "doc_update",
				duration: 2,
			});
			setShowPermission(false);
			setEditPermission(null);
			setUpdate(true);
		} else {
			message.error({
				content: (
					<span className="error_mess_wrap">
						Saxlanılmadı... {response.Body}{" "}
						{<CloseCircleOutlined onClick={onClose} />}
					</span>
				),
				key: "doc_update",
				duration: 0,
			});
			setUpdate(false);
		}
	};

	const onFinish = async (values) => {
		message.loading({ content: "Yüklənir...", key: "doc_update" });
		updateMutation.mutate(
			{ id: edit ? edit.Id : null, filter: values },
			{
				onSuccess: (res) => {
					if (res.Headers.ResponseStatus === "0") {
						message.success({
							content: "Dəyişildi",
							key: "doc_update",
							duration: 2,
						});
						queryClient.invalidateQueries("owner");
						setShow(false);
						setEdit(null);
						setIsUpdatePage(true);
					} else {
						message.error({
							content: (
								<span className="error_mess_wrap">
									Saxlanılmadı... {res.Body}{" "}
									{<CloseCircleOutlined onClick={onClose} />}
								</span>
							),
							key: "doc_update",
							duration: 0,
						});
					}
				},
				onError: (e) => {
					console.log(e);
				},
			}
		);
	};
	if (isLoading) return "Yüklənir...";

	if (error) return "An error has occurred: " + error.message;

	return (
		<div>
			<Button
				icon={<PlusOutlined />}
				style={{
					marginBottom: "10px",
					alignItems: "center",
					display: "flex",
				}}
				type="primary"
				onClick={() => setShow(true)}
			>
				İstifadəçi
			</Button>
			<Table
				pagination={false}
				rowKey="Id"
				columns={columns}
				dataSource={documentList}
				locale={{ emptyText: <Spin /> }}
				size="small"
				rowClassName={(record, index) =>
					record.Status === 0 ? "unchecked" : ""
				}
			/>

			<Modal
				visible={show}
				title="İstifadəçi"
				onOk={handleOk}
				destroyOnClose={true}
				onCancel={handleCancel}
				footer={[
					<Button danger key="back" onClick={handleCancel}>
						Bağla
					</Button>,
					<Button
						key="submit"
						htmlType="submit"
						form="departmentform"
						className="customsavebtn"
						onClick={handleOk}
					>
						Yadda saxla
					</Button>,
				]}
			>
				<Form
					id="departmentform"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					layout="horizontal"
					initialValues={{
						name: edit ? edit.Name : "",
						login: edit ? edit.Login : "",
						departmentid: edit ? edit.DepartmentId : "",
						description: edit ? edit.Description : "",
						id: edit ? edit.Id : "",
						status: edit
							? edit.Status === 1
								? true
								: false
							: true,
					}}
					onFinish={onFinish}
				>
					<Form.Item
						name="name"
						label="Adı"
						rules={[
							{
								required: true,
								message: "Zəhmət olmasa, ad daxil edin",
							},
						]}
					>
						<Input />
					</Form.Item>
					{/* <Form.Item
						label="İcraçı"
						name="saler"
						rules={[
							{
								required: true,
								message: "Zəhmət olmasa, anbarı seçin",
							},
						]}
					>
						<Select
							showSearch
							showArrow={false}
							filterOption={false}
							className="customSelect detail-select"
							allowClear={true}
						>
							<Option value={1}>kassir</Option>
							<Option value={2}>komissionçu</Option>
						</Select>
					</Form.Item> */}
					<Form.Item
						name="login"
						label="Istifadəçi adı"
						rules={[
							{
								required: true,
								message: "Zəhmət olmasa, login daxil edin",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || patName.test(value)) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											"İstifadəçi adı minimum 4 hərfdən ibarət olmalıdır"
										)
									);
								},
							}),
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="password"
						label="Şifrə"
						rules={[
							{
								required: true,
								message: "Zəhmət olmasa, şifrənizi daxil edin",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || pat.test(value)) {
										return Promise.resolve();
									}

									return Promise.reject(
										new Error(
											"Şifrənizdə 6 və ya daha çox simvol və ən azı bir rəqəm olmalıdır.Xüsusi simvollara (#,@,#,!,$,_,-,+,*) icazə verilmir"
										)
									);
								},
							}),
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="repassword"
						label="Şifrənin təkrarı"
						dependencies={["password"]}
						hasFeedback
						rules={[
							{
								required: true,
								message: "Şifrəni təkrarla",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (
										!value ||
										getFieldValue("password") === value
									) {
										return Promise.resolve();
									}

									return Promise.reject(
										new Error("Şifrələr eyni deyil")
									);
								},
							}),
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="phone" label="Əlaqə nömrəsi">
						<Input />
					</Form.Item>
					<Form.Item
						label="Şöbə"
						name="departmentid"
						style={{ margin: "0" }}
					>
						<Select
							showSearch
							placeholder=""
							notFoundContent={<Spin size="small" />}
							filterOption={(input, option) =>
								option.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
						>
							{depOptions}
						</Select>
					</Form.Item>
					<Form.Item name="description" label="Şərh">
						<Input />
					</Form.Item>
					{/* {edit && edit.Name !== "Administrator" && ( */}
					<Form.Item name="status" valuePropName="checked">
						<Switch
							checkedChildren="Aktiv"
							unCheckedChildren="Deaktiv"
							defaultChecked
						/>
					</Form.Item>
					{/* )} */}
					<Form.Item hidden={true} name="id" label="id">
						<Input />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				visible={showPermission}
				title="Icazələr"
				onOk={handleOkPermission}
				destroyOnClose={true}
				onCancel={handleCancelPermission}
				footer={[
					<Button key="back" onClick={handleCancelPermission}>
						Return
					</Button>,
					<Button
						key="submit"
						htmlType="submit"
						type="primary"
						form="permissionForm"
						onClick={handleOkPermission}
					>
						Submit
					</Button>,
				]}
			>
				{permissionload ? (
					<div>Yüklənir...</div>
				) : (
					<Form
						id="permissionForm"
						labelCol={{
							span: 4,
						}}
						wrapperCol={{
							span: 14,
						}}
						layout="horizontal"
						initialValues={{
							salepointid: editpermission
								? editpermission.SalePointId
								: "",
							ownerid: editpermission ? editpermission.Id : "",
							saler: editpermission ? editpermission.Saler : "",
						}}
						onFinish={onFinishPermission}
					>
                    <Button type="dashed" style={activeBtn === 1 ? {background: 'blue'} : null } onClick={(e) => {
                        e.preventDefault()
                        setSaler(1)
                        setActiveBtn(1)
                    }}>Kassir</Button>
                    <Button type="dashed" style={activeBtn === 2 ? {background: 'blue'} : null} onClick={(e) => {
                        e.preventDefault()
                        setSaler(2)
                        setActiveBtn(2)
                    }}>Komissionçu</Button>
                    <Button type="dashed" style={activeBtn === 0 ? {background: 'blue'} : null} onClick={(e) => {
                        e.preventDefault()
                        setSaler(null)
                        setActiveBtn(0)
                    }}>Istifadəçi</Button>
						<Form.Item
							label="Bağlılıq"
							name="salepointid"
							style={{ margin: "0" }}
						>
							<Select
								showSearch
								placeholder=""
								allowClear={true}
								notFoundContent={<Spin size="small" />}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								{saler == 2 ? stockoptions : slpntOptions}
							</Select>
						</Form.Item>

						<Form.Item hidden={true} name="ownerid" label="ownerid">
							<Input />
						</Form.Item>
						<Form.Item hidden={true} name="saler" label="saler">
							<Input />
						</Form.Item>
					</Form>
				)}
			</Modal>
		</div>
	);
}
