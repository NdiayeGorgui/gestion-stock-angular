import { ProductItemResponseDto } from "./ProductItemResponseDto";

export interface PaymentResponseDto {

  paymentIdEvent: string;
  orderId: string;
  customerName: string;
  customerMail: string;
  paymentMode: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;
  paymentStatus: string;
  timeStamp: Date;

  products: ProductItemResponseDto[]; 
}
