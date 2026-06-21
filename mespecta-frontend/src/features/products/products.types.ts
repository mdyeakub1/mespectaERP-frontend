export interface ProductMaterial {
  productMaterialId: number;
  materialId: number;
  materialName: string;
  quantityRequired: string;
  unitOfMeasureId: number;
  unitOfMeasureName: string;
  note: string;
}

export interface ProductLeather {
  productLeatherId: number;
  leatherTypeId: number;
  leatherTypeName: string;
  quantityRequired: string;
  unitOfMeasureId: number;
  unitOfMeasureName: string;
  note: string;
}

export interface Product {
  productId: number;
  productCode: string;
  description: string;
  priceItaly: number | null;
  priceEU: number | null;
  priceOutsideEU: number | null;
  categoryId: number;
  categoryName: string;
  genderId: number;
  genderName: string;
  materials: ProductMaterial[];
  leathers: ProductLeather[];
}
