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
  categoryId: number;
  categoryName: string;
  genderId: number;
  genderName: string;
  materials: ProductMaterial[];
}