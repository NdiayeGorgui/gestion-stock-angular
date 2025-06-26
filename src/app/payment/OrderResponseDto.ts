import { ProductItemResponseDto } from "./ProductItemResponseDto";

export interface OrderResponseDto {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;

  items: ProductItemResponseDto[]; 
}
