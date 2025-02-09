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



const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"admin",component:AdminComponent, canActivate:[AuthGuard],
    children:[
    {path:"home",component:HomeComponent},
    {path:"profile",component:ProfileComponent},
    {path:"product",component:ProductComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}},
    {path:"create-product",component:CreateProductComponent},
    {path:"update-product/:productIdEvent",component:UpdateProductComponent},
    {path:"customer",component:CustomerComponent},
    {path:"create-customer",component:CreateCustomerComponent},
    {path:"update-customer/:customerIdEvent",component:UpdateCustomerComponent},
    {path:"order",component:OrderComponent},
    {path:"create-order",component:CreateOrderComponent},
    {path:"cancel-order",component:CancelOrderComponent},
    {path:"completed-order",component:CompletedOrderComponent},
    {path:"create-payment/:customerIdEvent",component:CreatePaymentComponent},
    {path:"dashboard",component:DashboardComponent},
    {path:"bill",component:BillComponent},
    {path:"create-bill",component:CreateBillComponent},
    {path:"payment",component:PaymentComponent,canActivate:[AuthorizationGuard],data :{roles:['ADMIN']}}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
