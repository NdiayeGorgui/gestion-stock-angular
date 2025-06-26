import { ProductItemResponseDto } from "../payment/ProductItemResponseDto";

export interface DeliveredResponseDto {
 orderId: string;
  paymentIdEvent: string;
  customerName: string;
  customerMail: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;
  deliveryStatus: string;
  timeStamp: Date;

  products: ProductItemResponseDto[]; 
}