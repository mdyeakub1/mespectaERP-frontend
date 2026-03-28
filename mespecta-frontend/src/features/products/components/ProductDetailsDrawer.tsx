import { Drawer, Descriptions, Table, Spin } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProductById } from "../products.slice";

interface Props {
  open: boolean;
  productId: number | null;
  onClose: () => void;
}

export default function ProductDetailsDrawer({
  open,
  productId,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();
  const { details, detailsLoading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (open && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [open, productId, dispatch]);

  return (
    <Drawer
      title="Product Details"
      width={600}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      {detailsLoading ? (
        <Spin />
      ) : (
        <>
          <Descriptions
            column={1}
            bordered
            size="small"
          >
            <Descriptions.Item label="Code">
              {details?.productCode}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {details?.description}
            </Descriptions.Item>

            <Descriptions.Item label="Italy Price">
              {details?.priceItaly}
            </Descriptions.Item>

            <Descriptions.Item label="EU Price">
              {details?.priceEU}
            </Descriptions.Item>

            <Descriptions.Item label="Outside EU">
              {details?.priceOutsideEU}
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              {details?.categoryName}
            </Descriptions.Item>

            <Descriptions.Item label="Gender">
              {details?.genderName}
            </Descriptions.Item>
          </Descriptions>

          <h3 style={{ marginTop: 20 }}>Materials</h3>

          <Table
            size="small"
            rowKey="productMaterialId"
            columns={[
              { title: "Material", dataIndex: "materialName" },
              { title: "Qty", dataIndex: "quantityRequired" },
              { title: "Unit", dataIndex: "unitOfMeasureName" },
              { title: "Note", dataIndex: "note" },
            ]}
            dataSource={details?.materials || []}
            pagination={false}
          />
        </>
      )}
    </Drawer>
  );
}