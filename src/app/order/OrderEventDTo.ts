export interface OrderEventDto {
  orderId: string;
  customerId: string;
  status: string;
  details: string;
  eventTimeStamp: Date;
}
