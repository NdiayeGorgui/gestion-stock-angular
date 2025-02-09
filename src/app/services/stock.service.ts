import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { Products } from '../product/products';
import { Customers } from '../customer/customer';
import { Custom } from '../customer/custom';
import { Order } from '../order/order';
import { OrderEvent } from '../order/orders/orderEvent';
import { Payment } from '../payment/payment';
import { Bill } from '../bill/bill';
import { ProductItem } from '../order/productItem';
import { AmountDto } from '../payment/create-payment/amountDto';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient:HttpClient) { }

  getCustomerById(id:string):Observable<Custom>{
    
    return this.httpClient.get<Custom>(`${environment.backendCustomerHost}/${id}`);
  }

  getCustomerOrderById(id:string):Observable<Custom>{
    
    return this.httpClient.get<Custom>(`${environment.backendOrderCustomerHost}/${id}`);
  }

  getCustomersList():Observable<Customers[]>{
    return this.httpClient.get<(Customers[])> (`${environment.backendCustomerHost}`) ;
  }

  getCustomersOrderList():Observable<Customers[]>{
    return this.httpClient.get<(Customers[])> (`${environment.backendOrderCustomerHost}`) ;
  }

  createCustomer(customer:Custom):Observable<Object>{

    return this.httpClient.post(`${environment.backendCustomerHost}`,customer);
  }

  updateCustomer(id:string,customer:Custom):Observable<Object>{
    
    return this.httpClient.put(`${environment.backendCustomerHost}/${id}`,customer);
  }

  deleteCustomer(id:string):Observable<Object>{
    return this.httpClient.delete(`${environment.backendCustomerHost}/${id}`);
  }

  getProductById(id:string):Observable<Products>{
    
    return this.httpClient.get<Products>(`${environment.backendProductHost}/${id}`);
  }

  getProductOrderById(id:string):Observable<Products>{
    
    return this.httpClient.get<Products>(`${environment.backendOrderProductsHost}/${id}`);
  }

  getProductsList():Observable<Products[]>{
    return this.httpClient.get<(Products[])> (`${environment.backendProductHost}`) ;
  }

  getProductsOrderList():Observable<Products[]>{
    return this.httpClient.get<(Products[])> (`${environment.backendOrderProductsHost}`) ;
  }

  createProduct(product:Products):Observable<Object>{

    return this.httpClient.post<(Products)>(`${environment.backendProductHost}`,product);
  }

  updateProduct(id:string,product:Products):Observable<Object>{
    
    return this.httpClient.put(`${environment.backendProductHost}/${id}`,product);
  }

 
  deleteProduct(id:string):Observable<Object>{
    return this.httpClient.delete(`${environment.backendProductHost}/${id}`);
  }

  createOrder(order:OrderEvent):Observable<Object>{

    return this.httpClient.post<(OrderEvent)>(`${environment.backendOrderHost}`,order);
  }

  getOrderById(orderIdEvent:string):Observable<ProductItem>{
    
    return this.httpClient.get<ProductItem>(`${environment.backendOrderCancelHost}/${orderIdEvent}`);
  }

  getOrderByLongId(id:number):Observable<ProductItem>{
    
    return this.httpClient.get<ProductItem>(`${environment.backendOrderHost}/${id}`);
  }

  getCreatedOrders(status:string):Observable<ProductItem[]>{
    return this.httpClient.get<(ProductItem[])> (`${environment.backendOrderStatusHost}/${status}`) ;
  }

  cancelOrder(orderIdEvent:string):Observable<Object>{
    
    return this.httpClient.get(`${environment.backendOrderUpdateHost}/${orderIdEvent}`);
  }

  printInvoice(customerIdEvent:string,status:string):Observable<Object>{
   
    return this.httpClient.get(`${environment.backendBillExportHost}/${customerIdEvent}/${status}`,{ responseType: 'blob'});
  }

  getAmount(customerIdEvent:string,status:string):Observable<AmountDto>{
   
    return this.httpClient.get<AmountDto>(`${environment.backendOrderCustomerHost}/${customerIdEvent}/${status}`);
  }

  getBillsByCustomer(customerIdEvent:string,status:string):Observable<Bill[]>{
    return this.httpClient.get<(Bill[])> (`${environment.backendBillHost}/${customerIdEvent}/${status}`) ;
  }

  createPayment(payment:Payment):Observable<Object>{

    return this.httpClient.post<(Payment)>(`${environment.backendPaymentHost}`,payment);
  }

  getPaymentList():Observable<Payment[]>{
    return this.httpClient.get<(Payment[])> (`${environment.backendPaymentHost}`) ;
  }

  getPaymentById(paymentIdEvent:string):Observable<Payment>{
    
    return this.httpClient.get<Payment>(`${environment.backendPaymentHost}/${paymentIdEvent}`);
  }

  getBillList():Observable<Payment[]>{
    return this.httpClient.get<(Payment[])> (`${environment.backendPaymentBillHost}`) ;
  }

  getBillById(orderIdEvent:string):Observable<Payment>{
    
    return this.httpClient.get<Payment>(`${environment.backendPaymentBillHost}/${orderIdEvent}`);
  }
  
}
