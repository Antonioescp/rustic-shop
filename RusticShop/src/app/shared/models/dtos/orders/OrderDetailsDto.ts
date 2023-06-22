export interface OrderDetailsDto {
  id: number;
  userFullName: string;
  status: string;
  date: string;
  total?: number;
  productCount?: number;
}
