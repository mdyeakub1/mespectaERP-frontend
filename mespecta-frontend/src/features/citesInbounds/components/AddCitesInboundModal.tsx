import {
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Row,
    Col,
    message,
    Spin,
    AutoComplete,
} from "antd";
import { useEffect, useRef, useState } from "react";
import api from "../../../services/api";
import { useAppDispatch } from "../../../app/hooks";
import dayjs from "dayjs";
import { fetchCitesInbounds } from "../citesInbounds.slice";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddCitesInboundModal({
    open,
    onClose,
}: Props) {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const [loadingDropdowns, setLoadingDropdowns] =
        useState(false);

    const [leatherTypes, setLeatherTypes] =
        useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [uoms, setUoms] = useState<any[]>([]);
    const [acquisitionTypes, setAcquisitionTypes] =
        useState<any[]>([]);
    const [sources, setSources] = useState<any[]>([]);
    const [documentTypes, setDocumentTypes] =
        useState<any[]>([]);

    const [citesNumberOptions, setCitesNumberOptions] = useState<{ value: string }[]>([]);
    const citesSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ------------------------------
       Extract list safely
    ------------------------------- */
    const extractList = (res: any) => {
        if (Array.isArray(res.data?.data)) {
            return res.data.data;
        }

        if (res.data?.data?.items) {
            return res.data.data.items;
        }

        return [];
    };

    /* ------------------------------
       Load Dropdowns
    ------------------------------- */
    useEffect(() => {
        if (open) {
            loadDropdowns();
        }
    }, [open]);

    const loadDropdowns = async () => {
        try {
            setLoadingDropdowns(true);

            const [
                leather,
                color,
                uom,
                acquisition,
                source,
                document,
            ] = await Promise.all([
                api.get("/leather-types"),
                api.get("/colors"),
                api.get("/unit-of-measures"),
                api.get("/acquisition-types"),
                api.get("/sources"),
                api.get("/document-types"),
            ]);

            setLeatherTypes(extractList(leather));
            setColors(extractList(color));
            setUoms(extractList(uom));
            setAcquisitionTypes(extractList(acquisition));
            setSources(extractList(source));
            setDocumentTypes(extractList(document));
        } catch (err) {
            console.error("Dropdown load error:", err);
            // interceptor handles toast
        } finally {
            setLoadingDropdowns(false);
        }
    };

    /* ------------------------------
       CITES Number suggestions
    ------------------------------- */
    const handleCitesNumberSearch = (value: string) => {
        if (citesSearchDebounceRef.current) clearTimeout(citesSearchDebounceRef.current);

        if (!value) {
            setCitesNumberOptions([]);
            return;
        }

        citesSearchDebounceRef.current = setTimeout(async () => {
            try {
                const res = await api.get("/cites-inbounds", {
                    params: { search: value, pageNumber: 1, pageSize: 8 },
                });
                const items = res.data?.data?.items ?? [];
                const raw: string[] = items.map((i: any) => i.citesNumber).filter(Boolean);
                const numbers = Array.from(new Set(raw));
                setCitesNumberOptions(numbers.map((n) => ({ value: n })));
            } catch {
                setCitesNumberOptions([]);
            }
        }, 300);
    };

    /* ------------------------------
       Submit
    ------------------------------- */
    const handleSubmit = async () => {
   try {
    const values = await form.validateFields();

    const payload = {
      issueDate: values.issueDate.toISOString(),
      scientificName: values.scientificName,
      commonName: values.commonName,
      leatherTypeId: values.leatherTypeId,
      colorId: values.colorId,
      unitOfMeasureId: values.unitOfMeasureId,
      quantityReceived: values.quantityReceived,
      numberOfSkins: values.numberOfSkins,
      acquisitionTypeId: values.acquisitionTypeId,
      sourceId: values.sourceId,
      documentTypeId: values.documentTypeId,
      citesNumber: values.citesNumber,
      identification: values.identification?.trim() || null,
      citesDetails: values.citesDetails?.trim() || null,
      notes: values.notes?.trim() || null,
    };

    const { data } = await api.post(
      "/cites-inbounds",
      payload
    );

   message.success(
  data?.message || "CITES Inbound Created"
);

    form.resetFields();
    onClose();

    dispatch(
      fetchCitesInbounds({
        pageNumber: 1,
        pageSize: 10,
      })
    );
  } catch {
   
  }
};

    return (
        <Modal
            title="Add New CITES Inbound"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            width={800}
            style={{ top: 20 }}
            destroyOnHidden
        >
            {loadingDropdowns ? (
                <Spin />
            ) : (
                <Form layout="vertical" form={form} initialValues={{ issueDate: dayjs() }}>
                    {/* Date + CITES Number */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Issue Date"
                                name="issueDate"
                                rules={[{ required: true, message: "Issue date is required." }]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="CITES Number"
                                name="citesNumber"
                                rules={[{ required: true }]}
                            >
                                <AutoComplete
                                    options={citesNumberOptions}
                                    onSearch={handleCitesNumberSearch}
                                    placeholder="e.g. 1000_1"
                                >
                                    <Input />
                                </AutoComplete>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Names */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Scientific Name"
                                name="scientificName"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Common Name"
                                name="commonName"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Leather + Color */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Leather Type"
                                name="leatherTypeId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={leatherTypes?.map(
                                        (l: any) => ({
                                            value:
                                                l.leatherTypeId ??
                                                l.id,
                                            label: l.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Color"
                                name="colorId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={colors?.map(
                                        (c: any) => ({
                                            value:
                                                c.colorId ?? c.id,
                                            label: c.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Acquisition + Source */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Acquisition"
                                name="acquisitionTypeId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={acquisitionTypes?.map(
                                        (a: any) => ({
                                            value:
                                                a.acquisitionTypeId ??
                                                a.id,
                                            label: a.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Source"
                                name="sourceId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={sources?.map(
                                        (s: any) => ({
                                            value:
                                                s.sourceId ??
                                                s.id,
                                            label: s.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Acquisition + Source */}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Document Type"
                                name="documentTypeId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={documentTypes?.map(
                                        (d: any) => ({
                                            value:
                                                d.documentTypeId ??
                                                d.id,
                                            label: d.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Identification"
                                name="identification"
                            >
                                <Input placeholder="Physical tag / marking (optional)" />
                            </Form.Item>
                        </Col>


                    </Row>

                    {/* Quantity */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Quantity"
                                name="quantityReceived"
                                rules={[{
                                    required: true,
                                    validator: (_, value) => {
                                        if (!value && value !== 0) return Promise.reject("Quantity is required.");
                                        const num = parseFloat(value);
                                        if (isNaN(num) || num <= 0) return Promise.reject("Quantity must be greater than 0.");
                                        return Promise.resolve();
                                    },
                                }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="e.g. 4.500" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Unit Of Measure"
                                name="unitOfMeasureId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={uoms?.map(
                                        (u: any) => ({
                                            value:
                                                u.unitOfMeasureId ??
                                                u.id,
                                            label: u.name,
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Number of Skins"
                                name="numberOfSkins"
                                rules={[{ type: "number", min: 1, message: "Must be at least 1." }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        
                    </Row>




                    <Form.Item
                        label="CITES Details"
                        name="citesDetails"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
}