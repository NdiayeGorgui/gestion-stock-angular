import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { OrderEvent } from './orderEvent';
import { Customer } from '../customer';
import { Product } from '../product';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddConfirmDialogComponent } from '../../shared/add-confirm-dialog/add-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/NotificationService';

@Component({
  selector: 'app-order',
  standalone: false,

  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  public isLoading = true;

public createdOrders: any[] = [];
  public dataSource: MatTableDataSource<any>;
  public status = 'CREATED';

  public displayedColumns: string[] = [
    'orderId',
    'customerName',
    'customerEmail',
    'amount',
    'totalDiscount',
    'totalTax',
    'payment',
    'details',
    'cancel'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private stockService: StockService,
    private router: Router,
    private notifService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.notifService.startPolling();
    this.getCreatedOrders();
  }

public getCreatedOrders(): void {
  this.stockService.getCreatedOrders(this.status).subscribe({
    next: (data) => {
      // 💡 Pas de transformation manuelle des montants ici !
      this.createdOrders = data;
console.log('✔️ Received orders:', this.createdOrders);

      this.dataSource = new MatTableDataSource(this.createdOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (order: any, filter: string) => {
        const lowercaseFilter = filter.trim().toLowerCase();
        return (
           order.orderId?.toLowerCase().includes(lowercaseFilter) ||
          order.customerName?.toLowerCase().includes(lowercaseFilter) ||
          order.customerEmail?.toLowerCase().includes(lowercaseFilter) ||
          order.amount?.toString().includes(lowercaseFilter) ||
          order.totalTax?.toString().includes(lowercaseFilter) ||
          order.totalDiscount?.toString().includes(lowercaseFilter)
        );
      };
      this.isLoading = false;

    },
    error: (err) => {
      console.error('Error fetching created orders:', err);
      this.isLoading = false;

    }
  });
}


  filterOrder(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dataSource.filter = input.trim().toLowerCase();
  }

  getOrder(orderId: string): void {
    this.router.navigate(['/admin/order-details', orderId]);
  }

  makePayment(orderId: string): void {
    this.router.navigate(['/admin/create-payment', orderId]);
  }

  cancelOrder(orderId: string): void {
    const dialogRef = this.dialog.open(AddConfirmDialogComponent, {
      data: {
        title: this.translate.instant('order.cancel_title'),
        message: this.translate.instant('order.cancel_message'),
        confirmText: this.translate.instant('order.confirm_delete'),
        cancelText: this.translate.instant('order.cancel')
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stockService.cancelOrder(orderId).subscribe({
          next: () => {
            this.createdOrders = this.createdOrders.filter(order => order.orderId !== orderId);
            this.dataSource.data = this.createdOrders;

            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: this.translate.instant('order.cancel_success'),
                type: 'success'
              },
              duration: 3000
            });

            this.notifService.getNotifications();
          },
          error: (err) => {
            console.error('❌ Error cancelling order', err);
            this.snackBar.openFromComponent(SnakBarComponent, {
              data: {
                message: this.translate.instant('order.cancel_error'),
                type: 'error'
              },
              duration: 3000
            });
          }
        });
      }
    });
  }
}