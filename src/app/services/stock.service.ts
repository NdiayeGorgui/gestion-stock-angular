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
import { AmountDto } from '../payment/create-payment/amountDto';
import { Deliverd } from '../deliver/Delivered';
import { Ship } from '../ship/Ship';
import { OrderEventSourcing } from '../order/OrderEventSourcing';
import { ProductStatDTO } from '../order/ProductStatDTO';
import { CustomerDto } from '../order/customerDto';
import { CustomerExistsResponse } from '../customer/create-customer/CustomerExistsResponse';


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

  getCustomersList(): Observable<Customers[]> {
    return this.httpClient.get<(Customers[])>(`${environment.backendCustomerHost}`);
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

  getProductsList(): Observable<Products[]> {
    return this.httpClient.get<(Products[])>(`${environment.backendProductHost}`);
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

  getOrderById(orderIdEvent: string): Observable<ProductItem> {

    return this.httpClient.get<ProductItem>(`${environment.backendOrderCancelHost}/${orderIdEvent}`);
  }

  getOrderByLongId(id: number): Observable<ProductItem> {

    return this.httpClient.get<ProductItem>(`${environment.backendOrderHost}/${id}`);
  }

  getCreatedOrders(status: string): Observable<ProductItem[]> {
    return this.httpClient.get<(ProductItem[])>(`${environment.backendOrderStatusHost}/${status}`);
  }
  getCreatedOrdersByCustomer(customerIdEvent: string, status: string): Observable<ProductItem[]> {
    return this.httpClient.get<(ProductItem[])>(`${environment.backendOrderCreatedHost}/${customerIdEvent}/${status}`)
  }

  cancelOrder(orderIdEvent: string): Observable<Object> {

    return this.httpClient.get(`${environment.backendOrderUpdateHost}/${orderIdEvent}`);
  }

  printInvoice(customerIdEvent: string, status: string): Observable<Object> {

    return this.httpClient.get(`${environment.backendBillExportHost}/${customerIdEvent}/${status}`, { responseType: 'blob' });
  }

  getAmount(customerIdEvent: string, status: string): Observable<AmountDto> {

    return this.httpClient.get<AmountDto>(`${environment.backendOrderCustomerHost}/${customerIdEvent}/${status}`);
  }

  getBillsByCustomer(customerIdEvent: string, status: string): Observable<Bill[]> {
    return this.httpClient.get<(Bill[])>(`${environment.backendBillHost}/${customerIdEvent}/${status}`);
  }

  createPayment(payment: Payment): Observable<Object> {

    return this.httpClient.post<(Payment)>(`${environment.backendPaymentHost}`, payment);
  }

  getPaymentList(): Observable<Payment[]> {
    return this.httpClient.get<(Payment[])>(`${environment.backendPaymentHost}`);
  }

  getPaymentById(paymentIdEvent: string): Observable<Payment> {

    return this.httpClient.get<Payment>(`${environment.backendPaymentHost}/${paymentIdEvent}`);
  }

  getBillList(): Observable<Bill[]> {
    return this.httpClient.get<(Bill[])>(`${environment.backendBillHost}`);
  }

  getBillById(orderIdEvent: string): Observable<Bill> {

    return this.httpClient.get<Bill>(`${environment.backendBillHostId}/${orderIdEvent}`);
  }

  getDeliveredQueryList(): Observable<Deliverd[]> {
    return this.httpClient.get<(Deliverd[])>(`${environment.backendDeliveredQuerytHost}`);
  }

  createDeliveredCommand(delivered: Deliverd): Observable<Object> {

    return this.httpClient.post<(Deliverd)>(`${environment.backendDeliveredCommandtHost}`, delivered);
  }

  getDeliveredById(orderId: string): Observable<Deliverd> {

    return this.httpClient.get<Deliverd>(`${environment.backendDeliveredQuerytHost}/${orderId}`);
  }

  getShippingList(): Observable<Ship[]> {
    return this.httpClient.get<(Ship[])>(`${environment.backendShippingtHost}`);
  }

  createShip(ship: Ship): Observable<Object> {

    return this.httpClient.post<(Ship)>(`${environment.backendShippingtHost}`, ship);
  }

  getShipById(orderId: string): Observable<Ship> {

    return this.httpClient.get<Ship>(`${environment.backendShippingtHost}/${orderId}`);
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


}
