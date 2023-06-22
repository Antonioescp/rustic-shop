import { OrderSummaryDetailDto } from './OrderSummaryDetailDto';

export interface OrderSummaryDto {
  id: number;
  status: string;
  date: string;
  total?: number;
  productCount?: number;

  // user details
  userName: string;
  userLastName: string;
  userPhoneNumber: string;
  userEmail: string;

  // address details
  shippingAddressName: string;
  shippingAddressDirections: string;
  shippingAddressHouseNumber: string;
  shippingAddressNeighborhood: string;
  shippingAddressNeighborhoodCityName: string;

  // product details
  orderDetails?: OrderSummaryDetailDto[];
}
