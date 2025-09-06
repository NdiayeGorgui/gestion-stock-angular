import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { Products } from '../product/products';
import { Customers } from '../customer/customer';
import { Custom } from '../customer/custom';
import { OrderEvent } from '../order/orders/orderEvent';
import { Payment } from '../payment/payment';
import { Bill } from '../bill/bill';
import { ProductItem } from '../order/productItem';
import { OrderEventSourcing } from '../order/OrderEventSourcing';
import { ProductStatDTO } from '../order/ProductStatDTO';
import { CustomerDto } from '../order/customerDto';
import { CustomerExistsResponse } from '../customer/create-customer/CustomerExistsResponse';
import { Notification } from '../admin/Notification';
import { OrderResponseDto } from '../payment/OrderResponseDto';
import { PaymentResponseDto } from '../payment/PaymentResponseDto';
import { BillResponseDto } from '../bill/BillResponseDto';
import { ShipResponseDto } from '../ship/ShipResponseDto';
import { DeliveredResponseDto } from '../deliver/DeliveredResponseDto';
import { ProductDto } from '../product/products/ProductDto';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }

  getCustomerById(id: string): Observable<Custom> {

    return this.httpClient.get<Custom>(`${environment.backendCustomerHost}/${id}`);
  }

  getCustomerOrderById(id: string): Observable<Custom> {

    return this.httpClient.get<Custom>(`${environment.backendOrderCustomerHost}/${id}`);
  }

   getCustomerExistByEmail(email: string): Observable<CustomerExistsResponse> {

    return this.httpClient.get<CustomerExistsResponse>(`${environment.backendCustomerExtistHost}/${email}`);
  }

  getCustomersList(): Observable<CustomerDto[]> {
    return this.httpClient.get<(CustomerDto[])>(`${environment.backendCustomerHost}`);
  }

  getCustomersOrderList(): Observable<Customers[]> {
    return this.httpClient.get<(Customers[])>(`${environment.backendOrderCustomerHost}`);
  }

  createCustomer(customer: Custom): Observable<Object> {

    return this.httpClient.post(`${environment.backendCustomerHost}`, customer);
  }

  updateCustomer(id: string, customer: Custom): Observable<Object> {

    return this.httpClient.put(`${environment.backendCustomerHost}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<Object> {
    return this.httpClient.delete(`${environment.backendCustomerHost}/${id}`);
  }

  getProductById(id: string): Observable<Products> {

    return this.httpClient.get<Products>(`${environment.backendProductHost}/${id}`);
  }

  getProductOrderById(id: string): Observable<Products> {

    return this.httpClient.get<Products>(`${environment.backendOrderProductsHost}/${id}`);
  }

  getProductsList(): Observable<ProductDto[]> {
    return this.httpClient.get<(ProductDto[])>(`${environment.backendProductHost}`);
  }

  getProductsOrderList(): Observable<Products[]> {
    return this.httpClient.get<(Products[])>(`${environment.backendOrderProductsHost}`);
  }

  createProduct(product: Products): Observable<Object> {

    return this.httpClient.post<(Products)>(`${environment.backendProductHost}`, product);
  }

  updateProduct(id: string, product: Products): Observable<Object> {

    return this.httpClient.put(`${environment.backendProductHost}/${id}`, product);
  }


  deleteProduct(id: string): Observable<Object> {
    return this.httpClient.delete(`${environment.backendProductHost}/${id}`);
  }

  createOrder(order: OrderEvent): Observable<Object> {

    return this.httpClient.post<(OrderEvent)>(`${environment.backendOrderHost}`, order);
  }

  getOrderById(orderId: string): Observable<OrderResponseDto> {

    return this.httpClient.get<OrderResponseDto>(`${environment.backendOrderHost}/${orderId}`);
  }

  getOrderByLongId(id: number): Observable<ProductItem> {

    return this.httpClient.get<ProductItem>(`${environment.backendOrderHost}/${id}`);
  }

  getCreatedOrders(status: string): Observable<OrderResponseDto[]> {
    return this.httpClient.get<(OrderResponseDto[])>(`${environment.backendOrderStatusHost}/${status}`);
  }

getCreatedOrdersById(status: string, orderId: string): Observable<OrderResponseDto> {
  return this.httpClient.get<OrderResponseDto>(`${environment.backendOrderStatusHost}/${status}/id/${orderId}`);
}
getOneOrderById(orderId: string): Observable<OrderResponseDto> {
  return this.httpClient.get<OrderResponseDto>(`${environment.backendOrderHost}/${orderId}`);
}
  getCreatedOrdersByCustomer(customerIdEvent: string, status: string): Observable<ProductItem[]> {
    return this.httpClient.get<(ProductItem[])>(`${environment.backendOrderCreatedHost}/${customerIdEvent}/${status}`)
  }

    getCreatedOrdersByOderId(orderId: string, status: string): Observable<ProductItem[]> {
    return this.httpClient.get<(ProductItem[])>(`${environment.backendOrderHost}/${orderId}/${status}`)
  }
  cancelOrder(orderIdEvent: string): Observable<Object> {

    return this.httpClient.get(`${environment.backendOrderUpdateHost}/${orderIdEvent}`);
  }

  printInvoice(orderId: string, status: string): Observable<Object> {

    return this.httpClient.get(`${environment.backendBillExportHost}/${orderId}/${status}`, { responseType: 'blob' });
  }

  getAmount(orderId: string): Observable<OrderResponseDto> {

    return this.httpClient.get<OrderResponseDto>(`${environment.backendOrderHost}/${orderId}`);
  }

  getOrderByCreatedOrder(orderId: string): Observable<OrderResponseDto> {

    return this.httpClient.get<OrderResponseDto>(`${environment.backendOrderHost}/${orderId}`);
  }

  getBillsByCustomer(customerIdEvent: string, status: string): Observable<Bill[]> {
    return this.httpClient.get<(Bill[])>(`${environment.backendBillHost}/${customerIdEvent}/${status}`);
  }

  createPayment(payment: Payment): Observable<Object> {

    return this.httpClient.post<(Payment)>(`${environment.backendPaymentHost}`, payment);
  }

  getPaymentList(): Observable<PaymentResponseDto[]> {
    return this.httpClient.get<(PaymentResponseDto[])>(`${environment.backendPaymentHost}`);
  }

  getPaymentById(orderId: string): Observable<PaymentResponseDto> {

    return this.httpClient.get<PaymentResponseDto>(`${environment.backendPaymentHost}/${orderId}`);
  }

  getBillList(): Observable<BillResponseDto[]> {
    return this.httpClient.get<(BillResponseDto[])>(`${environment.backendBillHost}`);
  }

  getBillById(orderId: string): Observable<BillResponseDto> {

    return this.httpClient.get<BillResponseDto>(`${environment.backendBillHost}/${orderId}`);
  }

getBillByIdPdf(orderId: string): Observable<Blob> {
  return this.httpClient.get(`${environment.backendBillHostPdf}/${orderId}`, {
    responseType: 'blob'
  });
}


  getDeliveredQueryList(): Observable<DeliveredResponseDto[]> {
    return this.httpClient.get<(DeliveredResponseDto[])>(`${environment.backendDeliveredQuerytHost}`);
  }

  createDeliveredCommand(delivered: DeliveredResponseDto): Observable<Object> {

    return this.httpClient.post<(DeliveredResponseDto)>(`${environment.backendDeliveredCommandtHost}`, delivered);
  }

  getDeliveredById(orderId: string): Observable<DeliveredResponseDto> {

    return this.httpClient.get<DeliveredResponseDto>(`${environment.backendDeliveredQuerytHost}/${orderId}`);
  }

  getShippingList(): Observable<ShipResponseDto[]> {
    return this.httpClient.get<(ShipResponseDto[])>(`${environment.backendShippingtHost}`);
  }

  createShip(ship: ShipResponseDto): Observable<Object> {

    return this.httpClient.post<(ShipResponseDto)>(`${environment.backendShippingtHost}`, ship);
  }

  getShipById(orderId: string): Observable<ShipResponseDto> {

    return this.httpClient.get<ShipResponseDto>(`${environment.backendShippingtHost}/${orderId}`);
  }

  getOrderEventSourcingList(): Observable<OrderEventSourcing[]> {
    return this.httpClient.get<(OrderEventSourcing[])>(`${environment.backendOrderEventtHost}`);
  }
  getMostOrderedProducts(): Observable<ProductStatDTO[]> {
    return this.httpClient.get<(ProductStatDTO[])>(`${environment.backendProductMostOrderedHost}`);
  }

  getTop10CustomerMostOrdered(): Observable<CustomerDto[]> {
    return this.httpClient.get<(CustomerDto[])>(`${environment.backendTop10CustomersMostOrderedHost}`);
  }

 
   private productCreatedSource = new Subject<void>();
  productCreated$ = this.productCreatedSource.asObservable();

   notifyProductCreated() {
    this.productCreatedSource.next();
  }

   private productUpdatedSource = new Subject<void>();
  productUpdated$ = this.productUpdatedSource.asObservable();

  notifyProductUpdated() {
    this.productUpdatedSource.next();
  }

   private customerCreatedSource = new Subject<void>();
  customerCreated$ = this.customerCreatedSource.asObservable();

   notifyCustomerCreated() {
    this.customerCreatedSource.next();
  }

  private customerUpdatedSource = new Subject<void>();
  customerUpdated$ = this.customerUpdatedSource.asObservable();

  notifyCustomerUpdated() {
    this.customerUpdatedSource.next();
  }

   getNotificationsList(): Observable<Notification[]> {
    return this.httpClient.get<(Notification[])>(`${environment.backendNotificationHost}`);
  }

    markNotificationAsRead(id:number): Observable<Object> {

    return this.httpClient.put(`${environment.backendNotificationHost}/${id}`,null);
  }

  getAgentStreamingResponse(query: string): Observable<any> {
  return this.httpClient.get(`http://localhost:8866/api/v1/chat?query=${encodeURIComponent(query)}`, {
    responseType: 'text',
    observe: 'events',
    reportProgress: true
  });
}

}
