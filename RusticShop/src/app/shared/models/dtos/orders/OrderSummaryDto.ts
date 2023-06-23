import { OrderSummaryDetailDto } from './OrderSummaryDetailDto';

export interface OrderSummaryDto {
  id: number;
  status: string;
  date: string;
  total?: number;
  productCount?: number;

  // user details
  userFirstName?: string;
  userLastName?: string;
  userPhoneNumber?: string;
  userEmail: string;

  // address details
  shippingAddressName: string;
  shippingAddressDirections: string;
  shippingAddressHouseNumber: string;
  shippingAddressNeighborhoodName: string;
  shippingAddressNeighborhoodCityName: string;

  // product details
  orderDetails?: OrderSummaryDetailDto[];
}
