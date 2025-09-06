import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import {MatChipsModule} from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
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
import { DialogAlertComponent } from './shared/dialog-alert/dialog-alert.component';
import { AuthInterceptor } from './keycloak/auth.interceptor';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';
import { OrderCartDialogComponent } from './order/order-cart-dialog/order-cart-dialog.component';
import { ForbiddenComponent } from './guards/forbidden/forbidden.component';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { SnakBarComponent } from './shared/snak-bar/snak-bar.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationDialogComponent } from './shared/notification-dialog/notification-dialog.component';
import { OrderCanceledDetailsComponent } from './order/order-canceled-details/order-canceled-details.component'
import { MarkdownModule } from 'ngx-markdown';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://keycloak:8080/',  // Ne mets JAMAIS "keycloak" ici côté frontend
        realm: 'stock-realm',
        clientId: 'app-stock',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      },
      loadUserProfileAtStartUp: true
    });
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    AddConfirmDialogComponent,
    DialogAlertComponent,
    OrderCartDialogComponent,
    ForbiddenComponent,
    SnakBarComponent,
    SettingsComponent,
    NotificationDialogComponent,
    OrderCanceledDetailsComponent
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
    CreateOrderComponent,
    KeycloakAngularModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
     MarkdownModule.forRoot(),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    
  
  ],
  providers: [
     {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
