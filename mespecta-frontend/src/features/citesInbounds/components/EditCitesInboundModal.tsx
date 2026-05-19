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
} from "antd";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  id: string | number;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCitesInboundModal({ open, id, data, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [leatherTypes, setLeatherTypes]     = useState<any[]>([]);
  const [colors, setColors]                 = useState<any[]>([]);
  const [uoms, setUoms]                     = useState<any[]>([]);
  const [acquisitionTypes, setAcquisitionTypes] = useState<any[]>([]);
  const [sources, setSources]               = useState<any[]>([]);
  const [documentTypes, setDocumentTypes]   = useState<any[]>([]);

  const extractList = (res: any) => {
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (res.data?.data?.items) return res.data.data.items;
    return [];
  };

  const findId = (list: any[], idKey: string, name: string, nameKey = "name") =>
    list.find((i) => i[nameKey]?.toLowerCase() === name?.toLowerCase())?.[idKey] ?? null;

  useEffect(() => {
    if (open) loadDropdowns();
  }, [open]);

  const loadDropdowns = async () => {
    try {
      setLoadingDropdowns(true);
      const [leather, color, uom, acquisition, source, document] = await Promise.all([
        api.get("/leather-types"),
        api.get("/colors"),
        api.get("/unit-of-measures"),
        api.get("/acquisition-types"),
        api.get("/sources"),
        api.get("/document-types"),
      ]);

      const lt  = extractList(leather);
      const cl  = extractList(color);
      const um  = extractList(uom);
      const at  = extractList(acquisition);
      const sr  = extractList(source);
      const dt  = extractList(document);

      setLeatherTypes(lt);
      setColors(cl);
      setUoms(um);
      setAcquisitionTypes(at);
      setSources(sr);
      setDocumentTypes(dt);

      // Pre-fill form — resolve name → id for dropdowns
      form.setFieldsValue({
        issueDate:        data.issueDate ? dayjs(data.issueDate) : null,
        citesNumber:      data.citesNumber,
        scientificName:   data.scientificName,
        commonName:       data.commonName,
        leatherTypeId:    data.leatherTypeId   ?? findId(lt, "leatherTypeId",   data.leatherTypeName),
        colorId:          data.colorId         ?? findId(cl, "colorId",         data.colorName),
        unitOfMeasureId:  data.unitOfMeasureId  ?? findId(um, "unitOfMeasureId", data.unitOfMeasureName),
        acquisitionTypeId:data.acquisitionTypeId ?? findId(at, "acquisitionTypeId", data.acquisitionTypeName),
        sourceId:         data.sourceId        ?? findId(sr, "sourceId",        data.sourceName),
        documentTypeId:   data.documentTypeId  ?? findId(dt, "documentTypeId",  data.documentTypeName),
        quantityReceived: data.quantityReceived,
        numberOfSkins:    data.numberOfSkins,
        identification:   data.identification,
        citesDetails:     data.citesDetails,
        notes:            data.notes,
      });
    } catch {
      // interceptor handles toast
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await api.put(`/cites-inbounds/${id}`, {
        issueDate:         values.issueDate.toISOString(),
        scientificName:    values.scientificName,
        commonName:        values.commonName,
        leatherTypeId:     values.leatherTypeId,
        colorId:           values.colorId,
        unitOfMeasureId:   values.unitOfMeasureId,
        quantityReceived:  values.quantityReceived,
        numberOfSkins:     values.numberOfSkins,
        acquisitionTypeId: values.acquisitionTypeId,
        sourceId:          values.sourceId,
        documentTypeId:    values.documentTypeId,
        citesNumber:       values.citesNumber,
        identification:    values.identification?.trim() || null,
        citesDetails:      values.citesDetails?.trim()   || null,
        notes:             values.notes?.trim()           || null,
      });

      message.success("CITES Inbound updated successfully");
      onClose();
      onSuccess();
    } catch {
      // validation or API error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit CITES Inbound"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
      confirmLoading={submitting}
      width={800}
      style={{ top: 20 }}
      destroyOnHidden
    >
      {loadingDropdowns ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Spin />
        </div>
      ) : (
        <Form layout="vertical" form={form}>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Issue Date" name="issueDate" rules={[{ required: true, message: "Issue date is required." }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="CITES Number" name="citesNumber" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Scientific Name" name="scientificName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Common Name" name="commonName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Leather Type" name="leatherTypeId" rules={[{ required: true }]}>
                <Select options={leatherTypes.map((l) => ({ value: l.leatherTypeId ?? l.id, label: l.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Color" name="colorId" rules={[{ required: true }]}>
                <Select options={colors.map((c) => ({ value: c.colorId ?? c.id, label: c.name }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Acquisition Type" name="acquisitionTypeId" rules={[{ required: true }]}>
                <Select options={acquisitionTypes.map((a) => ({ value: a.acquisitionTypeId ?? a.id, label: a.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Source" name="sourceId" rules={[{ required: true }]}>
                <Select options={sources.map((s) => ({ value: s.sourceId ?? s.id, label: s.name }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Document Type" name="documentTypeId" rules={[{ required: true }]}>
                <Select options={documentTypes.map((d) => ({ value: d.documentTypeId ?? d.id, label: d.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Identification" name="identification">
                <Input placeholder="Physical tag / marking (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Quantity" name="quantityReceived" rules={[{ required: true, type: "number", min: 0.0001, message: "Quantity must be greater than 0." }]}>
                <InputNumber min={0.0001} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Unit of Measure" name="unitOfMeasureId" rules={[{ required: true }]}>
                <Select options={uoms.map((u) => ({ value: u.unitOfMeasureId ?? u.id, label: u.name }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Number of Skins" name="numberOfSkins" rules={[{ type: "number", min: 1, message: "Must be at least 1." }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="CITES Details" name="citesDetails">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>

        </Form>
      )}
    </Modal>
  );
}
