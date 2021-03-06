import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Table } from "antd";
import { updateTaxes } from "../api";
import { ConvertDecimal } from "../config/function/findadditionals";
import moment from "moment";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { Col, Row, Input, Button, Switch, message, Spin, Progress } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { fetchCompany, fetchTaxes, updateCompany } from "../api";
moment.locale("az");

function Taxes() {
	const [loading, setLoading] = useState(false);
	const [sendObject, setSendObject] = useState({});
	const [newObj, setNewObj] = useState(null);
	const [totalStorage, setTotalStorage] = useState(0);
	const [totalPercent, setTotalPercent] = useState(0);
	const [totalAmountCheck, setTotalAmountCheck] = useState(0);
	const [totalAmountNum, setTotalAmountNum] = useState(0);
	const [totalMonthPrice, setTotalMonthPrice] = useState(0);
	const [totalDailyPrice, setTotalDailyPrice] = useState(0);
	const [expired, setExpired] = useState(0);
	const [expireddate, setExpiredDate] = useState("");

	const [services, setServices] = useState([]);
	const [accountservices, setAccountServices] = useState([]);
	const queryClient = useQueryClient();

	const { isLoading, error, data, isFetching } = useQuery(["taxes"], () =>
		fetchTaxes()
	);
	const updateMutation = useMutation(updateTaxes, {
		refetchQueris: ["taxes"],
	});
	useEffect(() => {
		setTotalStorage(0);
	}, []);

	useEffect(() => {
		let total = 0;
		let totalAmount = 0;
		let totalAmountNumber = 0;

		let totaldailyAmount = 0;
		let totaldailyAmountNumber = 0;
		let newObjct = {};

		if (accountservices) {
			Object.entries(accountservices).map(([k, v]) => {
				Object.assign(newObjct, { [`s${k}`]: v });
			});

			Object.values(services)
				.filter((s) => s.Id.slice(0, 2) === "20")
				.map((service) => {
					Object.entries(accountservices).map(([k, v]) => {
						if (k.slice(0, 2) === "20") {
							console.log("=== 20");
							console.log("service", service);
							if (service.Id === k) {
								total += service.Volume;
								totalAmount += service.Price * 30;
								totaldailyAmount += service.Price;
							}
						}
					});
				});
			Object.values(services).map((service) => {
				Object.entries(accountservices).map(([k, v]) => {
					if (k.slice(0, 2) !== "20") {
						if (service.Id === k) {
							let sum = service.Price * 30;
							sum *= v;
							totalAmountNumber += sum;
							totaldailyAmountNumber += service.Price * v;
						}
					}
				});
			});
		}

		setTotalStorage(total);
		setTotalAmountCheck(totalAmount);
		setTotalAmountNum(totalAmountNumber);

		let month = ConvertDecimal(totalAmount + totalAmountNumber);
		let daily = ConvertDecimal(totaldailyAmount + totaldailyAmountNumber);
		setTotalMonthPrice(month);
		setTotalDailyPrice(daily);
		setSendObject(newObjct);
	}, [accountservices]);

	useEffect(() => {
		if (totalStorage != 0) {
			let usePercent = (data.Body.UsedStorage * 100) / totalStorage;
			setTotalPercent(ConvertDecimal(usePercent));
		}
	}, [totalStorage]);

	useEffect(() => {
		if (newObj) {
			console.log(newObj);
			console.log(newObj);
			Object.assign(sendObject, newObj);
			setSendObject(sendObject);
			setNewObj(null);
		}
	}, [newObj]);

	const onChangeFilter = (e, name) => {
		var n = "s" + name;
		var v = e.target.value;
		var newObj = { [n]: v };
		setNewObj(newObj);
	};
	const onChange = (e, name) => {
		var n = "s" + name;
		var v = e;
		var newObj = { [n]: v };
		setNewObj(newObj);
	};
	useEffect(() => {
		if (!isFetching) {
			setServices(Object.values(data.Body.Services));
			setAccountServices(data.Body.AccountServices);

			let expireddays = parseFloat(
				data.Body.AccountBalance / totalDailyPrice
			).toFixed();

			let new_date = moment().add(expireddays, "days").calendar();

			setExpired(expireddays);
			setExpiredDate(new_date);
		} else {
			setServices([]);
			setAccountServices([]);
		}
	}, [isFetching, totalDailyPrice]);

	const columns = useMemo(() => {
		return [
			{
				title: "???",
				dataIndex: "Order",
				show: true,
				render: (text, record, index) => index + 1 + 25 * 0,
			},
			{
				dataIndex: "Name",
				title: "Servis",
			},

			{
				dataIndex: "Price",
				title: "G??nd??lik",
			},
			{
				dataIndex: "PriceMonthly",
				title: "Ayl??q",
				render: (value, row, index) => {
					return ConvertDecimal(row.Price * 30);
				},
			},
			{
				dataIndex: "Configuration",
				title: "Se??im",
				render: (value, row, index) => {
					if (row.ServiceType === "num") {
						return (
							<Input
								size="small"
								className="taxes-input"
								allowClear
								type="number"
								min={row.Minimal}
								name={row.Id}
								onChange={(e) => onChangeFilter(e, row.Id)}
								defaultValue={
									Object.entries(accountservices).find(
										(ac) => ac[0] === row.Id
									)
										? Object.entries(accountservices).find(
												(ac) => ac[0] === row.Id
										  )[1]
										: 0
								}
							/>
						);
					} else if (row.ServiceType === "check") {
						console.log(
							Object.entries(accountservices).find(
								(ac) => ac[0] === row.Id
							)
						);
						return (
							<Switch
                                disabled={row.Id == 10001 || row.Id == 10002 || row.Id == 10003 ? true : false}
								style={{ width: "71px" }}
								checkedChildren="Aktiv"
								unCheckedChildren="Deaktiv"
								onChange={(e) => onChange(e, row.Id)}
								defaultChecked={
									Object.entries(accountservices).find(
										(ac) => ac[0] === row.Id
									)
										? Object.entries(accountservices).find(
												(ac) => ac[0] === row.Id
										  )[1] === "1"
											? true
											: false
										: false
								}
							/>
						);
					}
				},
			},
		];
	}, [services, accountservices, isFetching]);

	const onClose = () => {
		message.destroy();
	};

	const handleSaveTaxes = async () => {
		message.loading({ content: "Y??kl??nir...", key: "doc_update" });
		updateMutation.mutate(
			{ filter: sendObject },
			{
				onSuccess: (res) => {
					if (res.Headers.ResponseStatus === "0") {
						message.success({
							content: "D??yi??ildi",
							key: "doc_update",
							duration: 2,
						});
						queryClient.invalidateQueries("taxes");
					} else {
						message.error({
							content: (
								<span className="error_mess_wrap">
									Saxlan??lmad??... {res.Body}{" "}
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

	if (isLoading) return "Y??kl??nir...";

	if (error) return "An error has occurred: " + error.message;

	return (
		<div>
			<Row style={{ marginBottom: "1rem" }}>
				<Col xs={24} md={24} xl={3}></Col>
				<Col xs={24} md={24} xl={3}>
					<Progress
						className="taxes-progress"
						type="circle"
						percent={totalPercent}
					/>
				</Col>
				<Col xs={24} md={24} xl={15}>
					<div
						style={{
							background: "#ceedff",
							height: "100%",
							fontSize: "1.2em",
						}}
					>
						<p
							style={{
								padding: "1rem",
							}}
						>
							<span style={{ fontWeight: "600" }}>M??lumat :</span>
							<p className="settings-prices-text">
								Balans??n??z{" "}
								<span>
									{data.Body.AccountBalance}
									<sup>???</sup>
								</span>
								. Hal-haz??rki tarifinizin ayl??q abun?? haqq??{" "}
								<span>
									{totalMonthPrice}
									<sup>???</sup>
								</span>{" "}
								. Bitm?? tarixi{" "}
								<span>
									{expireddate} ({expired} g??n)
								</span>
							</p>
						</p>
					</div>
				</Col>
				<Col xs={24} md={24} xl={3}></Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={3}></Col>
				<Col xs={24} md={24} xl={18} style={{ textAlign: "center" }}>
					<h1 style={{ fontWeight: "600", marginBottom: "1rem" }}>
						Tarifl??r
					</h1>
				</Col>
				<Col xs={24} md={24} xl={3}></Col>
			</Row>
			<Row>
				<Col xs={24} md={24} xl={3}></Col>
				<Col xs={24} md={24} xl={18}>
					<Table
						pagination={false}
						id="taxes-table"
						rowKey="Id"
						columns={columns}
						dataSource={services}
						locale={{ emptyText: <Spin /> }}
						size="small"
						rowClassName={(record, index) =>
							index === 0 || index ===  1 || index ===   2 ? "unchecked" : ""
						}
					/>
					<Button
						className="customsavebtn"
						style={{
							float: "right",
							width: "100%",
							height: "40px",
							fontSize: "1.3em",
						}}
						onClick={() => handleSaveTaxes()}
						form="taxesForm"
					>
						Yadda saxla
					</Button>
				</Col>
				<Col xs={24} md={24} xl={3}></Col>
			</Row>
		</div>
	);
}

export default Taxes;
