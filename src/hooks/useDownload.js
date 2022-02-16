import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { FileExcelOutlined, FilePdfOutlined, DownloadOutlined } from "@ant-design/icons";
import { downloadFile } from "../config/function";

export function useDownload(advanced, controllers) {
	const downloadMenuMenu = (
		<Menu>
			<Menu.Item
				className="icon-excel"
				key="1"
				icon={<FileExcelOutlined />}
				onClick={() => downloadFile(advanced, "xlsx", controllers)}
			>
				Excel
			</Menu.Item>
			<Menu.Item
				className="icon-pdf"
				key="2"
				icon={<FilePdfOutlined />}
				onClick={() => downloadFile(advanced, "pdf", "settlements")}
			>
				PDF
			</Menu.Item>
		</Menu>
	);
	const downloadButton = (
		<Dropdown overlay={downloadMenuMenu} trigger={"onclick"}>
			<button className="new-button">
				<DownloadOutlined />
				<span style={{ marginLeft: "5px" }}>Yüklə</span>
			</button>
		</Dropdown>
	);

	return [downloadButton];
}
