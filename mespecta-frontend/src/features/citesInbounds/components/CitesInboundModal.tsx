import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { addCitesInbound } from "../citesInbounds.slice";
import api from "../../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CitesInboundModal({
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [leatherTypes, setLeatherTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [acquisitionTypes, setAcquisitionTypes] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchDropdowns();
    }
  }, [open]);

  const fetchDropdowns = async () => {
    try {
      const [
        lt,
        col,
        uom,
        acq,
        src,
        doc,
      ] = await Promise.all([
        api.get("/leather-types"),
        api.get("/colors"),
        api.get("/unit-of-measures"),
        api.get("/acquisition-types"),
        api.get("/sources"),
        api.get("/document-types"),
      ]);

      setLeatherTypes(lt.data);
      setColors(col.data);
      setUnits(uom.data);
      setAcquisitionTypes(acq.data);
      setSources(src.data);
      setDocumentTypes(doc.data);
    } catch (error) {
      console.error("Dropdown fetch error:", error);
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      issueDate: values.issueDate.toISOString(),
      scientificName: values.scientificName,
      commonName: values.commonName,
      leatherTypeId: values.leatherTypeId,
      colorId: values.colorId,
      unitOfMeasureId: values.unitOfMeasureId,
      quantityReceived: parseFloat(values.quantityReceived),
      numberOfSkins: values.numberOfSkins || 0,
      acquisitionTypeId: values.acquisitionTypeId,
      sourceId: values.sourceId,
      documentTypeId: values.documentTypeId,
      isLiveAnimal: values.isLiveAnimal || false,
      citesNumber: values.citesNumber,
      citesDetails: values.citesDetails,
      notes: values.notes,
    };

    await dispatch(addCitesInbound(payload)).unwrap();

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Create CITES Inbound"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={1000}
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          {/* Issue Date */}
          <Col span={12}>
            <Form.Item
              label="Issue Date"
              name="issueDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Scientific Name */}
          <Col span={12}>
            <Form.Item
              label="Scientific Name"
              name="scientificName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Common Name */}
          <Col span={12}>
            <Form.Item label="Common Name" name="commonName">
              <Input />
            </Form.Item>
          </Col>

          {/* Leather Type */}
          <Col span={12}>
            <Form.Item
              label="Leather Type"
              name="leatherTypeId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Leather Type"
                options={leatherTypes.map((item) => ({
                  value: item.leatherTypeId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Color */}
          <Col span={12}>
            <Form.Item
              label="Color"
              name="colorId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Color"
                options={colors.map((item) => ({
                  value: item.colorId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Unit Of Measure */}
          <Col span={12}>
            <Form.Item
              label="Unit Of Measure"
              name="unitOfMeasureId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Unit"
                options={units.map((item) => ({
                  value: item.unitOfMeasureId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Acquisition Type */}
          <Col span={12}>
            <Form.Item
              label="Acquisition Type"
              name="acquisitionTypeId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Acquisition Type"
                options={acquisitionTypes.map((item) => ({
                  value: item.acquisitionTypeId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Source */}
          <Col span={12}>
            <Form.Item
              label="Source"
              name="sourceId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Source"
                options={sources.map((item) => ({
                  value: item.sourceId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Document Type */}
          <Col span={12}>
            <Form.Item
              label="Document Type"
              name="documentTypeId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Document Type"
                options={documentTypes.map((item) => ({
                  value: item.documentTypeId,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* Quantity */}
          <Col span={12}>
            <Form.Item
              label="Quantity Received"
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

          {/* Number of Skins */}
          <Col span={12}>
            <Form.Item
              label="Number Of Skins"
              name="numberOfSkins"
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* CITES Number */}
          <Col span={12}>
            <Form.Item label="CITES Number" name="citesNumber">
              <Input />
            </Form.Item>
          </Col>

          {/* Live Animal */}
          <Col span={12}>
            <Form.Item
              label="Live Animal"
              name="isLiveAnimal"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          {/* CITES Details */}
          <Col span={24}>
            <Form.Item
              label="CITES Details"
              name="citesDetails"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          {/* Notes */}
          <Col span={24}>
            <Form.Item label="Notes" name="notes">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}