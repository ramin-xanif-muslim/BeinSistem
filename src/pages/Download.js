import { Col, Row, Button } from "antd";
import React from "react";
import { WindowsOutlined } from "@ant-design/icons";
import img_pos from "../images/pos.png";
import s from "./Download.module.css";

function Download() {
	return (
		<div>
			<Row className={s.rowCenter}>
				<Col xs={12} sm={12} md={12} xl={12}>
					<img src={img_pos} alt="POS"></img>
				</Col>
				<Col xs={10} sm={10} md={10} xl={10} className={s.colCenter}>
					<div>
						<h1>Kassa programı</h1>
						<p>
							Pərakəndə satış üçün nəzərdə tutulan{" "}
							<b>“Bein Pos”</b> kassa sisteminin bəzi
							üstünlükləri:
						</p>
						<ul>
							<li>Avadanlıqsız satış üçün xüsusi əl paneli</li>
							<li>
								Paralel olaraq bir neçə müştəriyə satış etmək
								imkanı
							</li>
							<li>
								Bir neçə növ satış qiymətinin təyin olunması
							</li>
							<li>
								İstənilən növ kampaniya və aksiya keçirmək
								imkanı
							</li>
							<li>Bonus və keşbek sistemi</li>
							<li>
								Eyni anda 3 növ satış əməliyyatı (nağd,
								nisyə,nağdsız) icra etmə imkanı
							</li>
							<li>Kassadan nisyə satış</li>
							<li>Müştəri borclarının aktiv siyahısı</li>
							<li>
								Malların müxtəlif növ məyarlara görə
								çeşidlənməsi
							</li>
							<li>
								Bütün növ barkod və printerlərin dəstəkləməsi
							</li>
							<li>Rahat interfeys</li>
							<li>Oflayn rejimində işləmək imkanı</li>
						</ul>
						<Button
							type="primary"
							shape="round"
							icon={<WindowsOutlined />}
							size="large"
							className={s.downloadButton}
						>
							<a href="https://pos.bein.az/possetup.exe">
								Kassa programını yüklə
							</a>
						</Button>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Download;
