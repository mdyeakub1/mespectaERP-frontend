export interface CitesInboundResponse {
  citesInboundId: number;
  citesInboundSerialNo: string;
  issueDate: string;
  scientificName: string;
  commonName: string;
  leatherTypeName: string;
  colorName: string;
  quantityReceived: number;
  quantityDisplay: string;
  numberOfSkins: number;
  acquisitionTypeName: string;
  sourceName: string;
  documentTypeName: string;
  citesNumber: string;
  identification: string;
  unitOfMeasureCode: string;
  isLiveAnimal: boolean;
  citesDetails?: string;
  notes?: string;
  createdAt?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CitesInboundFilter {
  search?: string;
  leatherTypeId?: number;
  colorId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}