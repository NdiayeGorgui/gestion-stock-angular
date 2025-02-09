import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
    CreateOrderComponent,
    CreatePaymentComponent,
    CreateBillComponent,
    UpdateCustomerComponent,
    UpdateProductComponent,
    CancelOrderComponent,
    CompletedOrderComponent
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
    
  
  ],
  providers: [
   AuthGuard,AuthorizationGuard,[provideHttpClient()]
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
