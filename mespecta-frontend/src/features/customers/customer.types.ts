export interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  phone: string;
  billingAddress: string | null;
  shippingAddress: string | null;
  isActive: boolean;
  createdAt: string;
}
