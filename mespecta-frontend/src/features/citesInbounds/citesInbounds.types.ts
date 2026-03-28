export interface CitesInboundResponse {
  citesInboundId: number;
  citesInboundCode: string;
  issueDate: string;
  scientificName: string;
  commonName: string;
  leatherTypeName: string;
  colorName: string;
  quantityReceived: number;
  numberOfSkins: number;
  acquisitionTypeName: string;
  sourceName: string;
  documentTypeName: string;
  isLiveAnimal: boolean;
  citesNumber: string;
  citesDetails?: string;
  notes?: string;
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