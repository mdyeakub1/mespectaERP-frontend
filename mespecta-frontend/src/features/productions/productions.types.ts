export interface Production {
  productionId: number;
  outboundSerialNumber: string;
  status: number;
  createdAt: string;
  completedAt: string | null;
  totalWorkingHours: number;
  activeStartTime: string | null;
  productId: number;
  productCode: string;
  craftsmanId: number;
  craftsmanName: string;
  citesInboundId: number;
  citesNumber: string;
  leatherTypeName: string | null;
  colorName: string | null;
}