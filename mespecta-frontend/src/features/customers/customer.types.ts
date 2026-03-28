export interface CustomerAddress {
  customerAddressId: number;
  addressType: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  phone: string;
  createdAt: string;
  addresses: CustomerAddress[];
}