import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import {
    fetchProductGroupId,
    fetchCustomerGroupId,
    fetchRefList,
} from "../../api";
import DocButtons from "../../components/DocButtons";
import {
    Form,
    Input,
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
import { updateCustomer } from "../../api";
import ok from "../../audio/ok.mp3";

const audio = new Audio(ok);
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
function CustomerGroupDetail() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const inputEl = useRef(null);
    const { cusgr_id } = useParams();
    const {
        customerGroups,
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
        ["customergroups", cusgr_id],
        () => fetchCustomerGroupId(cusgr_id)
    );
    const onClose = () => {
        message.destroy();
    };
    var obj;
    customerGroups
        ? (obj = customerGroups)
        : (obj = JSON.parse(localStorage.getItem("cusgroups")));

    const handleFinish = async (values) => {
        setDisable(true);
        // if (values.parentid === "Ana Qrup") {
        //   values.parentid = "00000000-0000-0000-0000-000000000000";
        // }
        message.loading({ content: "Yüklənir...", key: "progr_update" });

        updateMutation.mutate(
            { id: cusgr_id, controller: "customergroups", filter: values },
            {
                onSuccess: (res) => {
                    if (res.Headers.ResponseStatus === "0") {
                        message.success({
                            content: "Dəyişikliklər yadda saxlanıldı",
                            key: "progr_update",
                            duration: 2,
                        });
                        queryClient.invalidateQueries(
                            "customergroups",
                            cusgr_id
                        );
                        audio.play();
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
    const updateMutation = useMutation(updateCustomer, {
        refetchQueris: ["customergroups", cusgr_id],
    });

    if (isLoading)
        return (
            <Spin className="fetchSpinner" tip="Yüklənir...">
                <Alert />
            </Spin>
        );

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
                controller={"customergroups"}
                additional={"none"}
                editid={cusgr_id}
                closed={"p=customer"}
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
                            xs={8}
                            sm={8}
                            md={8}
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

export default CustomerGroupDetail;
