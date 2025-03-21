import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductComponent } from './product/products/product.component';
import { CustomerComponent } from './customer/customers/customer.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { OrderComponent } from './order/orders/order.component';
import { PaymentComponent } from './payment/payments/payment.component';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { CreateOrderComponent } from './order/create-order/create-order.component';
import { CreatePaymentComponent } from './payment/create-payment/create-payment.component';
import { BillComponent } from './bill/bills/bill.component';
import { CreateBillComponent } from './bill/create-bill/create-bill.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { CancelOrderComponent } from './order/cancel-order/cancel-order.component';
import { CompletedOrderComponent } from './order/completed-order/completed-order.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { PaymentDetailsComponent } from './payment/payment-details/payment-details.component';
import { BillDetailsComponent } from './bill/bill-details/bill-details.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { ChatBotComponent } from './ai/chat-bot/chat-bot.component';
import { ShipOrderComponent } from './ship/ship-order/ship-order.component';
import { ShippedOrdersComponent } from './ship/shipped-orders/shipped-orders.component';
import { DeliverOrderComponent } from './deliver/deliver-order/deliver-order.component';
import { DeliveredOrdersComponent } from './deliver/delivered-orders/delivered-orders.component';
import { OrderEventsComponent } from './order/order-events/order-events.component';



const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"admin",component:AdminComponent, canActivate:[AuthGuard],
    children:[
    {path:"home",component:HomeComponent},
    {path:"profile",component:ProfileComponent},
    {path:"chat-bot",component:ChatBotComponent},
    {path:"product",component:ProductComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}},
    {path:"create-product",component:CreateProductComponent},
    {path:"update-product/:productIdEvent",component:UpdateProductComponent},
    {path:"product-details/:productIdEvent",component:ProductDetailsComponent},
    {path:"customer",component:CustomerComponent},
    {path:"create-customer",component:CreateCustomerComponent},
    {path:"update-customer/:customerIdEvent",component:UpdateCustomerComponent},
    {path:"customer-details/:customerIdEvent",component:CustomerDetailsComponent},
    {path:"order",component:OrderComponent},
    {path:"create-order",component:CreateOrderComponent},
    {path:"cancel-order",component:CancelOrderComponent},
    {path:"completed-order",component:CompletedOrderComponent},
    {path:"order-details/:orderIdEvent",component:OrderDetailsComponent},
    {path:"create-payment/:customerIdEvent",component:CreatePaymentComponent},
    {path:"dashboard",component:DashboardComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}},
    {path:"bill",component:BillComponent},
    {path:"create-bill",component:CreateBillComponent},
    {path:"bill-details/:orderRef",component:BillDetailsComponent},
    {path:"payment",component:PaymentComponent},
    {path:"payment-details/:paymentIdEvent",component:PaymentDetailsComponent},
    {path:"ship-order/:orderId",component:ShipOrderComponent},
    {path:"shipped-orders",component:ShippedOrdersComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}},
    {path:"deliver-order/:orderId",component:DeliverOrderComponent},
    {path:"delivered-orders",component:DeliveredOrdersComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}},
    {path:"order-events",component:OrderEventsComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
