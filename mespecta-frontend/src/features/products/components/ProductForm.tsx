import { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Typography,
  message,
} from "antd";

const { Text } = Typography;

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ margin: "4px 0 12px" }}>
    <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1677ff" }}>
      {children}
    </Text>
    <div style={{ height: 1, background: "#e8f0fe", marginTop: 3 }} />
  </div>
);
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addProduct, editProduct } from "../products.slice";
import { fetchMaterials } from "../../materials/materials.slice";
import { fetchUnitOfMeasures } from "../../adminSetup/systemValues/unitOfMeasures/unitOfMeasures.slice";
import { fetchProductCategories } from "../../adminSetup/systemValues/productCategories/productCategories.slice";
import api from "../../../services/api";

interface Props {
  open: boolean;
  initialData?: any;
  onClose: () => void;
}

export default function ProductDrawer({ open, initialData, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { data: materials } = useAppSelector((state) => state.materials);
  const { data: units } = useAppSelector((state) => state.unitOfMeasures);
  const { data: categories } = useAppSelector((state) => state.productCategories);

  const [genders, setGenders] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchMaterials({}));
    dispatch(fetchUnitOfMeasures());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await api.get("/product-genders");
        setGenders(response.data.data);
      } catch {
        // interceptor handles toast
      }
    };

    fetchGenders();
  }, []);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        productCode:    initialData.productCode,
        description:    initialData.description,
        categoryId:     initialData.categoryId,
        genderId:       initialData.genderId,
        priceItaly:     initialData.priceItaly,
        priceEU:        initialData.priceEU,
        priceOutsideEU: initialData.priceOutsideEU,
        materials: initialData.materials?.map((m: any) => ({
          materialId:       m.materialId,
          quantityRequired: m.quantityRequired,
          unitOfMeasureId:  m.unitOfMeasureId,
          note:             m.note ?? "",
        })),
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (initialData) {
        await dispatch(
          editProduct({
            id: initialData.productId,
            data: values,
          })
        ).unwrap();
        message.success("Product updated successfully");
        onClose();
      } else {
        await dispatch(addProduct(values)).unwrap();
        message.success("Product created successfully");
        form.resetFields();
        onClose();
      }
    } catch {
      // interceptor handles toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title={initialData ? "Edit Product" : "Add New Product"}
      width={600}
      open={open}
      onClose={onClose}
      destroyOnHidden
      footer={
        <Row justify="end" gutter={12}>
          <Col>
            <Button onClick={onClose}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
              Save
            </Button>
          </Col>
        </Row>
      }
    >
      <Form form={form} layout="vertical">
        <SectionLabel>Product Information</SectionLabel>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Product Code"
              name="productCode"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select placeholder="Select category">
                {categories.map((cat) => (
                  <Select.Option
                    key={cat.productCategoryId}
                    value={cat.productCategoryId}
                  >
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Gender"
              name="genderId"
              rules={[{ required: true, message: "Gender is required" }]}
            >
              <Select placeholder="Select gender">
                {genders
                  .map((g) => (
                    <Select.Option
                      key={g.productGenderId}
                      value={g.productGenderId}
                    >
                      {g.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Price Italy" name="priceItaly">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Price EU" name="priceEU">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Price Outside EU" name="priceOutsideEU">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        

        <SectionLabel>Materials</SectionLabel>

        <Form.List name="materials">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={12} key={key} style={{ marginBottom: 8 }}>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "materialId"]}
                      rules={[{ required: true, message: "Material required" }]}
                    >
                      <Select placeholder="Material">
                        {materials.map((m) => (
                          <Select.Option
                            key={m.materialId}
                            value={m.materialId}
                          >
                            {m.materialName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityRequired"]}
                    >
                      <InputNumber
                        placeholder="Qty"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item
                      {...restField}
                      name={[name, "unitOfMeasureId"]}
                    >
                      <Select placeholder="Unit">
                        {units.map((u) => (
                          <Select.Option
                            key={u.unitOfMeasureId}
                            value={u.unitOfMeasureId}
                          >
                            {u.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item {...restField} name={[name, "note"]}>
                      <Input placeholder="Note" />
                    </Form.Item>
                  </Col>

                  <Col span={2}>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ marginTop: 8, color: "red" }}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
                style={{ marginBottom: 16 }}
              >
                Add Material
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}
