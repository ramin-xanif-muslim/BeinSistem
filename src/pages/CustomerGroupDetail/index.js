import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchProductGroupId, fetchRefList } from "../../api";
import DocButtons from "../../components/DocButtons";
import {
    Form,
    Input,
    Button,
    InputNumber,
    TreeSelect,
    Checkbox,
    Dropdown,
    message,
    Card,
    Select,
    Spin,
    Space,
    Alert,
    Menu,
    Row,
    Col,
    Collapse,
} from "antd";
import "antd/dist/antd.css";
import {
    SyncOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Tab } from "semantic-ui-react";
import { useTableCustom } from "../../contexts/TableContext";
import { updateProduct } from "../../api";
var mods = {};
let lastObject = {};
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
let array = [];
let count = 0;
let oneRefArray = [];
var guid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function ProductGroupDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const inputEl = useRef(null);
    const { progr_id } = useParams();
    const {
        productGroups,
        departments,
        owners,
        attributes,
        attrLoading,
        setAttrLoading,
        refList,
        setRefList,
        setRefsLocalStorage,
        linkedList,
        setLinkedList,
        prices,
        setPrices,
        setDisable,
        disable,
    } = useTableCustom();
    const [attrs, setAttrs] = useState(
        attributes ? attributes : JSON.parse(localStorage.getItem("attr"))
    );
    const [pricetypes, setPriceTypes] = useState(
        prices ? prices : JSON.parse(localStorage.getItem("prices"))
    );
    const [oneref, setOneRef] = useState([]);
    const [list, setList] = useState([]);
    const [linked, setLinked] = useState(null);
    const [listLength, setListLength] = useState(0);
    const { isLoading, error, data, isFetching } = useQuery(
        ["productgroup", progr_id],
        () => fetchProductGroupId(progr_id)
    );
    const onClose = () => {
        message.destroy();
    };
    var obj;
    productGroups
        ? (obj = productGroups)
        : (obj = JSON.parse(localStorage.getItem("progroups")));

    const handleFinish = async (values) => {
        setDisable(true);
        // if (values.parentid === "Ana Qrup") {
        //   values.parentid = "00000000-0000-0000-0000-000000000000";
        // }
        message.loading({ content: "Loading...", key: "progr_update" });

        updateMutation.mutate(
            { id: progr_id, controller: "productfolders", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Updated",
                            key: "progr_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries(
                            "productfolders",
                            progr_id
                        );
                    } else {
                        message.error({
                            content: (
                                <span className="error_mess_wrap">
                                    Saxlanılmadı... {res.Body}{" "}
                                    {<CloseCircleOutlined onClick={onClose} />}
                                </span>
                            ),
                            key: "progr_update",
                            duration: 0,
                        });
                    }
                },
            }
        );
    };

    const handleChanged = () => {
        if (disable) {
            setDisable(false);
        }
    };
    const updateMutation = useMutation(updateProduct, {
        refetchQueris: ["productgroup", progr_id],
    });

    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;
    const groupOption = Object.values(obj).map((c) => (
        <Option
            disabled={c.Id === data.Body.List[0].Id ? true : false}
            key={c.Id}
        >
            {c.Name}
        </Option>
    ));

    return (
        <div className="doc_wrapper">
            <div className="doc_name_wrapper">
                <h2>Məhsul qrupu</h2>
            </div>

            <DocButtons
                controller={"productfolders"}
                additional={"none"}
                editid={progr_id}
                closed={"p=product"}
            />
            <div className="formWrapper">
                <Form
                    form={form}
                    id="myForm"
                    style={{ padding: "0px 20px" }}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        name: data.Body.List[0].Name,
                        description: data.Body.List[0].Description,
                        parentid:
                            data.Body.List[0].ParentId ===
                            "00000000-0000-0000-0000-000000000000"
                                ? "Ana Qrup"
                                : data.Body.List[0].ParentId,
                    }}
                    className="doc_forms"
                    layout="horizontal"
                    onFinish={handleFinish}
                    onFieldsChange={handleChanged}
                >
                    <Row>
                        <Col
                            xs={24}
                            md={20}
                            xl={8}
                            className="left_form_wrapper"
                        >
                            <Form.Item
                                size="small"
                                label="Tərəf-müqabil qrupu"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                                    },
                                ]}
                            >
                                <Input allowClear />
                            </Form.Item>

                            <Form.Item label="Şərh" name="description">
                                <TextArea size="small" allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default ProductGroupDetail;
