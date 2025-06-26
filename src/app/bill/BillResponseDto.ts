import { ProductItemResponseDto } from "../payment/ProductItemResponseDto";

export interface BillResponseDto {

  orderId: string;
  customerName: string;
  customerPhone: string;
  customerMail: string;
  paymentMode: string;
  amount: number;
  totalTax: number;
  totalDiscount: number;
  billStatus: string;
  billingDate: Date;

  products: ProductItemResponseDto[]; 
}