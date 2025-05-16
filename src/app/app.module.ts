import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule} from '@angular/material/menu';
import { MatListModule} from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule} from '@angular/material/divider';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/products/product.component';
import { CustomerComponent } from './customer/customers/customer.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { OrderComponent } from './order/orders/order.component';
import { CreateOrderComponent } from './order/create-order/create-order.component';
import { PaymentComponent } from './payment/payments/payment.component';
import { CreatePaymentComponent } from './payment/create-payment/create-payment.component';
import { CreateBillComponent } from './bill/create-bill/create-bill.component';
import { BillComponent } from './bill/bills/bill.component';
import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { CancelOrderComponent } from './order/cancel-order/cancel-order.component';
import { CompletedOrderComponent } from './order/completed-order/completed-order.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { PaymentDetailsComponent } from './payment/payment-details/payment-details.component';
import { BillDetailsComponent } from './bill/bill-details/bill-details.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { RouterModule } from '@angular/router';
import { ChatBotComponent } from './ai/chat-bot/chat-bot.component';
import { DeliverOrderComponent } from './deliver/deliver-order/deliver-order.component';
import { DeliveredOrdersComponent } from './deliver/delivered-orders/delivered-orders.component';
import { OrderEventsComponent } from './order/order-events/order-events.component';
import { ShipOrderComponent } from './ship/ship-order/ship-order.component';
import { ShippedOrdersComponent } from './ship/shipped-orders/shipped-orders.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrderCreatedCompletedDetailsComponent } from './order/order-created-completed-details/order-created-completed-details.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddConfirmDialogComponent } from './shared/add-confirm-dialog/add-confirm-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ProfileComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    ProductComponent,
    CustomerComponent,
    BillComponent,
    PaymentComponent,
    OrderComponent,
    CreateCustomerComponent,
    CreateProductComponent,
    
    CreatePaymentComponent,
    CreateBillComponent,
    UpdateCustomerComponent,
    UpdateProductComponent,
    CancelOrderComponent,
    CompletedOrderComponent,
    ProductDetailsComponent,
    CustomerDetailsComponent,
    PaymentDetailsComponent,
    BillDetailsComponent,
    OrderDetailsComponent,
    ChatBotComponent,
    DeliverOrderComponent,
    DeliveredOrdersComponent,
    OrderEventsComponent,
    ShipOrderComponent,
    ShippedOrdersComponent,
    OrderEventsComponent,
    OrderCreatedCompletedDetailsComponent,
    ConfirmDialogComponent,
    AddConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    BrowserAnimationsModule,
    RouterModule,
    NgxChartsModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    CreateOrderComponent
    
  
  ],
  providers: [
   AuthGuard,AuthorizationGuard,[provideHttpClient()]
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
