export interface ProductMaterial {
  productMaterialId: number;
  materialId: number;
  materialName: string;
  quantityRequired: number;
  unitOfMeasureId: number;
  unitOfMeasureName: string;
  note: string;
}

export interface Product {
  productId: number;
  productCode: string;
  description: string;
  priceItaly: number;
  priceEU: number;
  priceOutsideEU: number;
  categoryName: string;
  genderName: string;
  materials: ProductMaterial[];
}