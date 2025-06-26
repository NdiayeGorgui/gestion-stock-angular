import { ProductItemResponseDto } from "../payment/ProductItemResponseDto";

export interface ShipResponseDto {

  paymentIdEvent: string;
  orderId: string;
  customerName: string;
  customerMail: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;
  shippingStatus: string;
  eventTimeStamp: Date;

  products: ProductItemResponseDto[]; 
}