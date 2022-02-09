import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "semantic-ui-css/semantic.min.css";

function MoneytransferButton() {

	return (
		<div style={{ display: "flex" }}>
			<button className="new-button">
				<Button.Content visible>
					<Link to='/newmoneytransferin'>
						<span>
							<PlusCircleOutlined />
						</span>
						<span style={{ marginLeft: "4px" }}>Mədaxil</span>
					</Link>
				</Button.Content>
			</button>
			<button className="new-button">
				<Button.Content visible>
					<Link to='/newmoneytransferouts'>
						<span>
							<MinusCircleOutlined />
						</span>
						<span style={{ marginLeft: "4px" }}>Məxaric</span>
					</Link>
				</Button.Content>
			</button>
		</div>
	);
}

export default MoneytransferButton;
