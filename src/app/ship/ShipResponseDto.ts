import { ProductItemResponseDto } from "../payment/ProductItemResponseDto";

export interface ShipResponseDto {
 orderId: string;
  paymentId: string;
  customerName: string;
  customerMail: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;
  shippingStatus: string;
  eventTimeStamp: Date;

  products: ProductItemResponseDto[]; 
}