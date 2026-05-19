export interface CitesOutboundSoldItem {
  finishedProductId: number;
  productionId: number;
  productionType: string;
  qrCodeUrl: string;
  isSold: boolean;
  soldAt: string | null;
  status: string;
  serialNo: string;
  date: string;
  scientificName: string;
  commonName: string;
  acquisitionType: string;
  source: string;
  documentType: string;
  citesNumber: string;
  identification: string;
  quantity: number;
  quantityUnit: string;
  quantityDisplay: string;
  inboundReference: string;
  outboundReason: string;
  outgoingDocumentType: string;
  destination: string;
  customerName: string;
  orderId: string;
  productCode: string;
  craftsmanName: string;
}

export interface CitesOutboundSoldFilter {
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
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
